/**
 * Invitation Actions
 *
 * Server actions for invitation management including creation,
 * revocation, acceptance, and bulk operations.
 */

"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";

import { handleError } from "@/lib/errors/handleError";
import { requireAdminForOrg } from "@/lib/auth/utils";
import { invitationSchema } from "@/schemas/invitations";
import {
  type CreateInvitationData,
  type BulkCreateInvitationData,
  type AcceptInvitationData,
  type InvitationActionResult,
  type BulkInvitationResult,
  type Invitation,
  InvitationStatus,
  INVITATION_DEFAULTS,
} from "@/types/invitations";
import { type SystemRole } from "@/types/abac";

const prisma = new PrismaClient();

/**
 * Create a single invitation
 */
export async function createInvitation(
  organizationId: string,
  data: CreateInvitationData,
): Promise<InvitationActionResult<Invitation>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await requireAdminForOrg(organizationId);

    // Validate input data
    const validated = invitationSchema.parse({
      emailAddress: data.email,
      role: data.role,
      redirectUrl: data.redirectUrl,
    });

    // Check if invitation already exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        organizationId,
        email: {
          equals: validated.emailAddress,
          mode: "insensitive",
        },
        status: InvitationStatus.PENDING,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingInvitation) {
      return {
        success: false,
        error: "An active invitation already exists for this email address",
      };
    }

    // Get user and organization data
    const [user, organization] = await Promise.all([
      prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true, organizationId: true },
      }),
      prisma.organization.findUnique({
        where: { id: organizationId },
        select: { id: true, name: true, clerkId: true },
      }),
    ]);

    if (!user || !organization) {
      return { success: false, error: "User or organization not found" };
    }

    if (user.organizationId !== organizationId) {
      return { success: false, error: "Access denied" };
    }

    // Generate secure token
    const token = randomBytes(32).toString("hex");

    // Calculate expiration date
    const expiresInDays = data.expiresInDays ?? INVITATION_DEFAULTS.EXPIRES_IN_DAYS;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create invitation in Clerk if organization has Clerk ID
    let clerkInvitationId: string | undefined;
    if (organization.clerkId) {
      try {
        const client = await clerkClient();
        const clerkInvitation = await client.organizations.createOrganizationInvitation({
          organizationId: organization.clerkId,
          inviterUserId: userId,
          emailAddress: validated.emailAddress,
          role: validated.role,
          redirectUrl:
            validated.redirectUrl ||
            `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation?token=${token}`,
          publicMetadata: {
            bypassOnboarding: data.bypassOnboarding ?? false,
            organizationId,
            organizationName: organization.name,
            invitedBy: user.id,
            invitedAt: new Date().toISOString(),
            ...data.metadata,
          },
        });
        clerkInvitationId = clerkInvitation.id;
      } catch (clerkError) {
        console.warn("Failed to create Clerk invitation:", clerkError);
        // Continue with database-only invitation
      }
    }

    // Create invitation in database
    const invitation = await prisma.invitation.create({
      data: {
        organizationId,
        inviterUserId: user.id,
        email: validated.emailAddress,
        role: validated.role as any,
        token,
        clerkInvitationId,
        redirectUrl: validated.redirectUrl,
        bypassOnboarding: data.bypassOnboarding ?? false,
        metadata: data.metadata ?? {},
        expiresAt,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        inviter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        organizationId,
        action: "INVITATION_CREATED",
        entityType: "INVITATION",
        entityId: invitation.id,
        metadata: {
          inviteeEmail: validated.emailAddress,
          role: validated.role,
          bypassOnboarding: data.bypassOnboarding ?? false,
        },
      },
    });

    revalidatePath(`/${organizationId}/settings`);
    revalidatePath(`/${organizationId}/admin`);

    return {
      success: true,
      data: invitation as Invitation,
      message: `Invitation sent to ${validated.emailAddress}`,
    };
  } catch (error) {
    console.error("Error creating invitation:", error);
    return handleError(error, "Create Invitation");
  }
}

/**
 * Create bulk invitations
 */
export async function createBulkInvitations(
  organizationId: string,
  data: BulkCreateInvitationData,
): Promise<BulkInvitationResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        successful: 0,
        failed: 0,
        errors: [{ email: "", error: "Unauthorized" }],
      };
    }

    await requireAdminForOrg(organizationId);

    // Validate and clean email list
    const emails = data.emails
      .filter((email) => email.trim())
      .map((email) => email.trim().toLowerCase());

    if (emails.length === 0) {
      return {
        success: false,
        successful: 0,
        failed: 0,
        errors: [{ email: "", error: "No valid emails provided" }],
      };
    }

    if (emails.length > INVITATION_DEFAULTS.MAX_BULK_INVITATIONS) {
      return {
        success: false,
        successful: 0,
        failed: 0,
        errors: [
          {
            email: "",
            error: `Maximum ${INVITATION_DEFAULTS.MAX_BULK_INVITATIONS} invitations allowed per batch`,
          },
        ],
      };
    }

    const results: Array<{
      email: string;
      success: boolean;
      error?: string;
      invitation?: Invitation;
    }> = [];

    // Process each email individually
    for (const email of emails) {
      try {
        const result = await createInvitation(organizationId, {
          ...data,
          email,
        });

        if (result.success && result.data) {
          results.push({
            email,
            success: true,
            invitation: result.data,
          });
        } else {
          results.push({
            email,
            success: false,
            error: result.error || "Unknown error",
          });
        }
      } catch (error) {
        results.push({
          email,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const errors = results
      .filter((r) => !r.success)
      .map((r) => ({ email: r.email, error: r.error || "Unknown error" }));
    const invitations = results.filter((r) => r.success && r.invitation).map((r) => r.invitation!);

    return {
      success: successful > 0,
      successful,
      failed,
      errors,
      invitations,
    };
  } catch (error) {
    console.error("Error creating bulk invitations:", error);
    return {
      success: false,
      successful: 0,
      failed: 0,
      errors: [{ email: "", error: "Failed to process bulk invitations" }],
    };
  }
}

/**
 * Revoke an invitation
 */
export async function revokeInvitation(invitationId: string): Promise<InvitationActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get invitation and verify access
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        organization: true,
      },
    });

    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    await requireAdminForOrg(invitation.organizationId);

    // Check if invitation can be revoked
    if (invitation.status !== InvitationStatus.PENDING) {
      return {
        success: false,
        error: "Only pending invitations can be revoked",
      };
    }

    // Revoke in Clerk if applicable
    if (invitation.clerkInvitationId && invitation.organization.clerkId) {
      try {
        const client = await clerkClient();
        await client.organizations.revokeOrganizationInvitation({
          organizationId: invitation.organization.clerkId,
          invitationId: invitation.clerkInvitationId,
          requestingUserId: userId,
        });
      } catch (clerkError) {
        console.warn("Failed to revoke Clerk invitation:", clerkError);
        // Continue with database revocation
      }
    }

    // Update invitation status in database
    await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        status: InvitationStatus.REVOKED,
        revokedAt: new Date(),
      },
    });

    // Create audit log
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          organizationId: invitation.organizationId,
          action: "INVITATION_REVOKED",
          entityType: "INVITATION",
          entityId: invitationId,
          metadata: {
            inviteeEmail: invitation.email,
            role: invitation.role,
          },
        },
      });
    }

    revalidatePath(`/${invitation.organizationId}/settings`);
    revalidatePath(`/${invitation.organizationId}/admin`);

    return {
      success: true,
      message: "Invitation revoked successfully",
    };
  } catch (error) {
    console.error("Error revoking invitation:", error);
    return handleError(error, "Revoke Invitation");
  }
}

/**
 * Accept an invitation
 */
export async function acceptInvitation(
  data: AcceptInvitationData,
): Promise<InvitationActionResult> {
  try {
    // Get invitation by token
    const invitation = await prisma.invitation.findUnique({
      where: { token: data.token },
      include: {
        organization: true,
      },
    });

    if (!invitation) {
      return { success: false, error: "Invalid invitation token" };
    }

    // Check if invitation is valid
    if (invitation.status !== InvitationStatus.PENDING) {
      return { success: false, error: "Invitation is no longer valid" };
    }

    if (invitation.expiresAt < new Date()) {
      // Mark as expired
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.EXPIRED,
        },
      });
      return { success: false, error: "Invitation has expired" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: invitation.email,
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      // User exists, just add to organization
      if (existingUser.organizationId === invitation.organizationId) {
        return { success: false, error: "User is already a member of this organization" };
      }

      // Update user's organization
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          organizationId: invitation.organizationId,
          role: invitation.role as any,
        },
      });

      // Create organization membership
      await prisma.organizationMembership.upsert({
        where: {
          organizationId_userId: {
            organizationId: invitation.organizationId,
            userId: existingUser.id,
          },
        },
        update: {
          role: invitation.role as any,
        },
        create: {
          organizationId: invitation.organizationId,
          userId: existingUser.id,
          role: invitation.role as any,
        },
      });

      // Update invitation status
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          acceptedAt: new Date(),
          inviteeUserId: existingUser.id,
        },
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: existingUser?.id || "",
        organizationId: invitation.organizationId,
        action: "INVITATION_ACCEPTED",
        entityType: "INVITATION",
        entityId: invitation.id,
        metadata: {
          inviteeEmail: invitation.email,
          role: invitation.role,
          bypassOnboarding: invitation.bypassOnboarding,
        },
      },
    });

    return {
      success: true,
      message: "Invitation accepted successfully",
    };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return handleError(error, "Accept Invitation");
  }
}

/**
 * Clean up expired invitations
 */
export async function cleanupExpiredInvitations(): Promise<InvitationActionResult<number>> {
  try {
    const result = await prisma.invitation.updateMany({
      where: {
        status: InvitationStatus.PENDING,
        expiresAt: {
          lt: new Date(),
        },
      },
      data: {
        status: InvitationStatus.EXPIRED,
      },
    });

    return {
      success: true,
      data: result.count,
      message: `Marked ${result.count} invitations as expired`,
    };
  } catch (error) {
    console.error("Error cleaning up expired invitations:", error);
    return handleError(error, "Cleanup Expired Invitations");
  }
}

/**
 * Resend an invitation
 */
export async function resendInvitation(invitationId: string): Promise<InvitationActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        organization: true,
      },
    });

    if (!invitation) {
      return { success: false, error: "Invitation not found" };
    }

    await requireAdminForOrg(invitation.organizationId);

    // Check if invitation can be resent
    if (invitation.status !== InvitationStatus.PENDING) {
      return {
        success: false,
        error: "Only pending invitations can be resent",
      };
    }

    // Extend expiration if expired
    let updateData: any = {};
    if (invitation.expiresAt < new Date()) {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + INVITATION_DEFAULTS.EXPIRES_IN_DAYS);
      updateData.expiresAt = newExpiresAt;
    }

    // Update invitation if needed
    if (Object.keys(updateData).length > 0) {
      await prisma.invitation.update({
        where: { id: invitationId },
        data: updateData,
      });
    }

    // TODO: Send email notification here
    // This would involve your email service integration

    // Create audit log
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          organizationId: invitation.organizationId,
          action: "INVITATION_RESENT",
          entityType: "INVITATION",
          entityId: invitationId,
          metadata: {
            inviteeEmail: invitation.email,
            role: invitation.role,
          },
        },
      });
    }

    return {
      success: true,
      message: "Invitation resent successfully",
    };
  } catch (error) {
    console.error("Error resending invitation:", error);
    return handleError(error, "Resend Invitation");
  }
}
