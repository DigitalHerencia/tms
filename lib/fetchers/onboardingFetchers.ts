"use server";

import db, { handleDatabaseError } from "@/lib/database/db";
import type { OnboardingStatus } from "@/types/onboarding";
import type { SystemRole } from "@/types/abac";

/**
 * Get onboarding status for a user
 */
export async function getOnboardingStatus(
  userId: string,
  orgId?: string,
): Promise<OnboardingStatus | null> {
  try {
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
      include: { organization: true },
    });

    if (!dbUser) return null;

    // Determine current step based on completion status
    let currentStep: OnboardingStatus["currentStep"] = "personal";

    if (dbUser.onboardingComplete) {
      currentStep = "complete";
    } else if (dbUser.firstName && dbUser.lastName && dbUser.email) {
      if (dbUser.role && dbUser.role !== "viewer") {
        if (dbUser.organizationId) {
          currentStep = "review";
        } else {
          currentStep = "setup";
        }
      } else {
        currentStep = "role";
      }
    }

    return {
      isComplete: dbUser.onboardingComplete,
      currentStep,
      user: {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email || "",
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role as SystemRole,
      },
      organization: dbUser.organization
        ? {
            id: dbUser.organization.id,
            name: dbUser.organization.name,
            slug: dbUser.organization.slug,
          }
        : undefined,
    };
  } catch (error) {
    handleDatabaseError(error);
  }
}

/**
 * Check if user has completed onboarding
 */
export async function isOnboardingComplete(clerkId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { onboardingComplete: true },
    });

    return user?.onboardingComplete ?? false;
  } catch (error) {
    handleDatabaseError(error);
    return false;
  }
}
