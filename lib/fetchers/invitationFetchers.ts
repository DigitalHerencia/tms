/**
 * Invitation Fetchers
 *
 * Server-side data fetching functions for invitation operations.
 * These functions handle database queries and business logic for
 * retrieving invitation data.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

import { requireAdminForOrg } from "@/lib/auth/utils";
import {
  type Invitation,
  type InvitationFilters,
  type InvitationPagination,
  type InvitationStats,
  type InvitationDisplay,
  InvitationStatus,
  ROLE_DISPLAY_NAMES,
  STATUS_DISPLAY_NAMES,
} from "@/types/invitations";
import { type SystemRole } from "@/types/abac";

const prisma = new PrismaClient();

/**
 * Get all invitations for an organization with optional filtering and pagination
 */
export async function getOrganizationInvitations(
  organizationId: string,
  filters?: InvitationFilters,
  pagination?: InvitationPagination,
): Promise<{
  invitations: InvitationDisplay[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  await requireAdminForOrg(organizationId);

  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 10;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    organizationId,
  };

  if (filters?.status) {
    if (Array.isArray(filters.status)) {
      where.status = { in: filters.status };
    } else {
      where.status = filters.status;
    }
  }

  if (filters?.role) {
    if (Array.isArray(filters.role)) {
      where.role = { in: filters.role };
    } else {
      where.role = filters.role;
    }
  }

  if (filters?.email) {
    where.email = {
      contains: filters.email,
      mode: "insensitive",
    };
  }

  if (filters?.inviterUserId) {
    where.inviterUserId = filters.inviterUserId;
  }

  if (filters?.createdAfter || filters?.createdBefore) {
    where.createdAt = {};
    if (filters.createdAfter) {
      where.createdAt.gte = filters.createdAfter;
    }
    if (filters.createdBefore) {
      where.createdAt.lte = filters.createdBefore;
    }
  }

  if (filters?.expiresAfter || filters?.expiresBefore) {
    where.expiresAt = {};
    if (filters.expiresAfter) {
      where.expiresAt.gte = filters.expiresAfter;
    }
    if (filters.expiresBefore) {
      where.expiresAt.lte = filters.expiresBefore;
    }
  }

  // Build orderBy clause
  const orderBy: any = {};
  const sortBy = pagination?.sortBy ?? "createdAt";
  const sortOrder = pagination?.sortOrder ?? "desc";
  orderBy[sortBy] = sortOrder;

  try {
    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
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
          invitee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.invitation.count({ where }),
    ]);

    const invitationDisplays: InvitationDisplay[] = invitations.map(
      (invitation: {
        id: any;
        email: any;
        role: string;
        status: InvitationStatus;
        inviter: { firstName: any; lastName: any };
        organization: { name: any };
        createdAt: { toISOString: () => any };
        expiresAt: { toISOString: () => any };
        acceptedAt: { toISOString: () => any };
        revokedAt: { toISOString: () => any };
        bypassOnboarding: any;
        metadata: Record<string, any>;
      }) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role as SystemRole,
        status: invitation.status as InvitationStatus,
        inviterName: invitation.inviter
          ? `${invitation.inviter.firstName ?? ""} ${invitation.inviter.lastName ?? ""}`.trim()
          : "Unknown",
        organizationName: invitation.organization?.name ?? "Unknown Organization",
        createdAt: invitation.createdAt.toISOString(),
        expiresAt: invitation.expiresAt.toISOString(),
        acceptedAt: invitation.acceptedAt?.toISOString(),
        revokedAt: invitation.revokedAt?.toISOString(),
        bypassOnboarding: invitation.bypassOnboarding,
        metadata: (invitation.metadata as Record<string, any>) ?? {},
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      invitations: invitationDisplays,
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching organization invitations:", error);
    throw new Error("Failed to fetch invitations");
  }
}

/**
 * Get a single invitation by ID
 */
export async function getInvitationById(invitationId: string): Promise<Invitation | null> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
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
        invitee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      return null;
    }

    // Check if user has access to this invitation
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { organizationId: true, role: true },
    });

    if (!user?.organizationId || user.organizationId !== invitation.organizationId) {
      throw new Error("Access denied");
    }

    return invitation as Invitation;
  } catch (error) {
    console.error("Error fetching invitation:", error);
    throw new Error("Failed to fetch invitation");
  }
}

/**
 * Get invitation by token (for acceptance flow)
 */
export async function getInvitationByToken(token: string): Promise<Invitation | null> {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
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

    if (!invitation) {
      return null;
    }

    // Check if invitation is valid (not expired, revoked, or already accepted)
    if (invitation.status !== InvitationStatus.PENDING || invitation.expiresAt < new Date()) {
      return null;
    }

    return invitation as Invitation;
  } catch (error) {
    console.error("Error fetching invitation by token:", error);
    return null;
  }
}

/**
 * Get invitation statistics for an organization
 */
export async function getInvitationStats(organizationId: string): Promise<InvitationStats> {
  await requireAdminForOrg(organizationId);

  try {
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const [total, pending, accepted, revoked, expired, expiringSoon, byRoleRaw, recentActivity] =
      await Promise.all([
        // Total invitations
        prisma.invitation.count({
          where: { organizationId },
        }),

        // Pending invitations
        prisma.invitation.count({
          where: {
            organizationId,
            status: InvitationStatus.PENDING,
          },
        }),

        // Accepted invitations
        prisma.invitation.count({
          where: {
            organizationId,
            status: InvitationStatus.ACCEPTED,
          },
        }),

        // Revoked invitations
        prisma.invitation.count({
          where: {
            organizationId,
            status: InvitationStatus.REVOKED,
          },
        }),

        // Expired invitations
        prisma.invitation.count({
          where: {
            organizationId,
            status: InvitationStatus.EXPIRED,
          },
        }),

        // Expiring soon
        prisma.invitation.count({
          where: {
            organizationId,
            status: InvitationStatus.PENDING,
            expiresAt: {
              lte: twentyFourHoursFromNow,
              gte: now,
            },
          },
        }),

        // By role
        prisma.invitation.groupBy({
          by: ["role"],
          where: { organizationId },
          _count: true,
        }),

        // Recent activity (last 7 days)
        prisma.invitation.groupBy({
          by: ["status"],
          where: {
            organizationId,
            createdAt: {
              gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          _count: true,
        }),
      ]);

    // Transform by role data
    const byRole: Record<SystemRole, number> = {
      admin: 0,
      dispatcher: 0,
      driver: 0,
      compliance: 0,
      member: 0,
    };

    byRoleRaw.forEach((item: { role: string; _count: number }) => {
      if (item.role in byRole) {
        byRole[item.role as SystemRole] = item._count;
      }
    });

    // Transform recent activity data
    const recentActivityMap = recentActivity.reduce(
      (acc: { [x: string]: any }, item: { status: string | number; _count: any }) => {
        acc[item.status] = item._count;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      pending,
      accepted,
      revoked,
      expired,
      expiringSoon,
      byRole,
      recentActivity: {
        sent: recentActivityMap[InvitationStatus.PENDING] ?? 0,
        accepted: recentActivityMap[InvitationStatus.ACCEPTED] ?? 0,
        revoked: recentActivityMap[InvitationStatus.REVOKED] ?? 0,
      },
    };
  } catch (error) {
    console.error("Error fetching invitation stats:", error);
    throw new Error("Failed to fetch invitation statistics");
  }
}

/**
 * Get pending invitations for a user by email
 */
export async function getPendingInvitationsForEmail(email: string): Promise<InvitationDisplay[]> {
  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
        status: InvitationStatus.PENDING,
        expiresAt: {
          gt: new Date(),
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return invitations.map(
      (invitation: {
        id: any;
        email: any;
        role: string;
        status: InvitationStatus;
        inviter: { firstName: any; lastName: any };
        organization: { name: any };
        createdAt: { toISOString: () => any };
        expiresAt: { toISOString: () => any };
        bypassOnboarding: any;
        metadata: Record<string, any>;
      }) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role as SystemRole,
        status: invitation.status as InvitationStatus,
        inviterName: invitation.inviter
          ? `${invitation.inviter.firstName ?? ""} ${invitation.inviter.lastName ?? ""}`.trim()
          : "Unknown",
        organizationName: invitation.organization?.name ?? "Unknown Organization",
        createdAt: invitation.createdAt.toISOString(),
        expiresAt: invitation.expiresAt.toISOString(),
        bypassOnboarding: invitation.bypassOnboarding,
        metadata: (invitation.metadata as Record<string, any>) ?? {},
      }),
    );
  } catch (error) {
    console.error("Error fetching pending invitations for email:", error);
    throw new Error("Failed to fetch pending invitations");
  }
}

/**
 * Check if an email already has a pending invitation for an organization
 */
export async function hasExistingInvitation(
  organizationId: string,
  email: string,
): Promise<boolean> {
  try {
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        organizationId,
        email: {
          equals: email,
          mode: "insensitive",
        },
        status: InvitationStatus.PENDING,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return !!existingInvitation;
  } catch (error) {
    console.error("Error checking existing invitation:", error);
    return false;
  }
}

/**
 * Get expired invitations that need cleanup
 */
export async function getExpiredInvitations(): Promise<Invitation[]> {
  try {
    const expiredInvitations = await prisma.invitation.findMany({
      where: {
        status: InvitationStatus.PENDING,
        expiresAt: {
          lt: new Date(),
        },
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

    return expiredInvitations as Invitation[];
  } catch (error) {
    console.error("Error fetching expired invitations:", error);
    throw new Error("Failed to fetch expired invitations");
  }
}
