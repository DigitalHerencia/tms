'use server';

import db, { handleDatabaseError } from '@/lib/database/db';
import type { OnboardingStatus } from '@/types/onboarding';

import type { SystemRole } from './../../types/abac';

export async function getOnboardingStatus(
  userId: string,
  orgId?: string,
): Promise<OnboardingStatus | null> {
  try {
    const dbUser = await db.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!dbUser) return null;

    if (!dbUser.organization) return null; // Ensure organization is not null

    const steps = (dbUser.onboardingSteps as Record<string, boolean>) || {};

    return {
      isComplete: dbUser.onboardingComplete,
      steps: {
        profile: steps.profile || false,
        company: steps.company || false,
        preferences: steps.preferences || false,
      },
      currentStep: !steps.profile
        ? 'profile'
        : !steps.company
          ? 'company'
          : !steps.preferences
            ? 'preferences'
            : 'complete',
      user: {
        id: dbUser.id,
        email: dbUser.email ? dbUser.email : '',
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role as SystemRole,
      },
      organization: {
        id: dbUser.organization.id,
        name: dbUser.organization.name,
        slug: dbUser.organization.slug,
      },
    };
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function getUserOnboardingProgress(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        onboardingComplete: true,
        onboardingSteps: true,
        firstName: true,
        lastName: true,
        organization: {
          select: {
            name: true,
            dotNumber: true,
            mcNumber: true,
            settings: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    handleDatabaseError(error);
  }
}

/**
 * Verify that an organization exists for the provided identifier.
 * Accepts either the organization UUID or slug.
 * Used during onboarding to validate the organization ID.
 */
export async function verifyOrganizationExists(orgId: string): Promise<boolean> {
  try {
    const organization = await db.organization.findFirst({
      where: {
        OR: [{ id: orgId }, { slug: orgId }],
      },
      select: { id: true },
    });
    return !!organization;
  } catch (error) {
    handleDatabaseError(error);
  }
}
