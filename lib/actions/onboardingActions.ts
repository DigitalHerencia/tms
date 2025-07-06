/**  */

"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import db from "@/lib/database/db";
import { handleError } from "@/lib/errors/handleError";
import { generateSlug } from "@/lib/utils/slug";
import {
  CompleteOnboardingSchema,
  type CompleteOnboardingData,
  JoinOrganizationSchema,
} from "@/schemas/onboarding";
import type { SystemRole } from "@/types/abac";
import { SystemRoles, getPermissionsForRole } from "@/types/abac";
import type { SetClerkMetadataResult } from "@/types/auth";
import type { JoinOrganizationResult, CompleteOnboardingResult } from "@/types/onboarding";

// Infer the resolved client type
type ResolvedClerkClient = Awaited<ReturnType<typeof clerkClient>>;

/**
 * Validate organization join request
 */
export async function validateJoinOrganizationAction(
  _prev: JoinOrganizationResult | null,
  formData: FormData,
): Promise<JoinOrganizationResult> {
  try {
    const orgInput = (formData.get("organizationId") as string | null) || "";
    const invite = (formData.get("inviteCode") as string | null) || "";

    if (!orgInput) {
      return { success: false, error: "Organization ID is required" };
    }

    const organization = await db.organization.findFirst({
      where: {
        OR: [{ slug: orgInput }, { id: orgInput }],
      },
    });

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    if (invite) {
      const found = await db.invitation.findFirst({
        where: {
          token: invite,
          organizationId: organization.id,
          expiresAt: { gt: new Date() },
          acceptedAt: null,
        },
      });
      if (!found) {
        return { success: false, error: "Invalid or expired invite code" };
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to validate organization",
    };
  }
}

/**
 * Server action to set Clerk metadata after custom organization creation
 * Updates user metadata only (no Clerk organization creation since orgs are disabled)
 */
export async function setClerkUserMetadata(
  userId: string,
  organizationSlug: string,
  role: SystemRole,
): Promise<SetClerkMetadataResult> {
  const actualClient: ResolvedClerkClient = await clerkClient();

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Setting user metadata for custom organization approach", {
        userId,
        organizationSlug,
        role,
      });
    }

    // Get permissions for the role
    const userPermissions = getPermissionsForRole(role);

    // Update Clerk user metadata with custom organization info
    await actualClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        organizationSlug: organizationSlug, // Use slug for URL routing
      },
      privateMetadata: {
        organizationId: organizationSlug, // Use slug as the organization identifier
        role: role,
        permissions: userPermissions, // Add permissions array
        onboardingComplete: true,
        lastLogin: new Date().toISOString(),
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Updated user metadata in Clerk", {
        userId,
        organizationSlug,
        role,
      });
    }

    return { success: true, organizationId: organizationSlug, userId };
  } catch (error: any) {
    console.error("Error setting Clerk user metadata:", error);
    return handleError(error, "Set User Metadata");
  }
}

/**
 * Complete onboarding process
 */
export async function completeOnboarding(
  data: CompleteOnboardingData,
): Promise<CompleteOnboardingResult> {
  try {
    const user = await currentUser();
    if (!user) {
      console.error("[Onboarding] User not authenticated");
      throw new Error("User not authenticated");
    }

    const parsed = CompleteOnboardingSchema.parse(data);
    const isAdmin = parsed.role === SystemRoles.ADMIN;
    let organizationId: string;
    let organizationSlug: string;

    // Validate required fields based on role
    if (isAdmin && !parsed.companyName) {
      throw new Error("Company name is required for admin onboarding.");
    }
    if (!isAdmin && !parsed.organizationId) {
      throw new Error("Organization ID is required for non-admin onboarding.");
    }

    // Map SystemRoles to Prisma UserRole enum values
    const prismaRoleMap: Record<string, string> = {
      admin: "admin",
      dispatcher: "dispatcher",
      driver: "driver",
      compliance: "compliance",
      member: "user", // Map 'member' to 'user' for Prisma
    };
    const safeRole = prismaRoleMap[parsed.role] ?? "user";

    // --- Organization creation or lookup ---
    let organization;
    if (isAdmin) {
      // Admin: create new organization
      const slug = generateSlug(parsed.companyName!); // Safe to use ! since we validated above
      organization = await db.organization.create({
        data: {
          clerkId: user.id,
          name: parsed.companyName!,
          slug: slug,
          dotNumber: parsed.dotNumber || null,
          mcNumber: parsed.mcNumber || null,
          address: parsed.address || null,
          city: parsed.city || null,
          state: parsed.state || null,
          zip: parsed.zip || null,
          phone: parsed.phone || null,
        },
      });
      organizationId = organization.id;
      organizationSlug = organization.slug;
    } else {
      // Employee: join existing organization
      organization = await db.organization.findFirst({
        where: {
          OR: [{ slug: parsed.organizationId! }, { id: parsed.organizationId! }],
        },
      });
      if (!organization) {
        console.error("[Onboarding] Organization not found for join", parsed.organizationId);
        throw new Error("Organization not found");
      }
      organizationId = organization.id;
      organizationSlug = organization.slug;

      // Validate invite code if provided
      if (parsed.inviteCode) {
        const invite = await db.invitation.findFirst({
          where: {
            token: parsed.inviteCode,
            organizationId: organizationId,
            expiresAt: { gt: new Date() },
            acceptedAt: null,
          },
        });
        if (!invite) {
          throw new Error("Invalid or expired invite code");
        }
      }
    }

    // --- Upsert user with organization and role ---
    const dbUser = await db.user.upsert({
      where: { clerkId: user.id },
      update: {
        organizationId: organizationId,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        role: safeRole as any,
        onboardingComplete: true,
        profileImage: user.imageUrl || null,
        permissions: getPermissionsForRole(parsed.role as SystemRole),
        isActive: true,
        lastLogin: new Date(),
        updatedAt: new Date(),
      },
      create: {
        clerkId: user.id,
        organizationId: organizationId,
        email: parsed.email,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        role: safeRole as any,
        onboardingComplete: true,
        profileImage: user.imageUrl || null,
        permissions: getPermissionsForRole(parsed.role as SystemRole),
        isActive: true,
        lastLogin: new Date(),
        updatedAt: new Date(),
      },
    });

    // --- Update Clerk user metadata ---
    await setClerkUserMetadata(user.id, organizationSlug, parsed.role as SystemRole);

    // Revalidate onboarding paths
    revalidatePath("/onboarding");
    revalidatePath(`/${organizationSlug}`);

    return {
      success: true,
      organizationId,
      organizationSlug,
      userId: dbUser.id,
    };
  } catch (error) {
    console.error("[Onboarding] Complete onboarding error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to complete onboarding");
  }
}
