'use server';

/**
 * Auth utilities used throughout the application.
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { DatabaseQueries } from '@/lib/database/db';
import {
  ClerkUserMetadata,
  ClerkOrganizationMetadata,
  UserContext,
} from '@/types/auth';

// Default/fallback ClerkOrganizationMetadata for type safety
const defaultClerkOrganizationMetadata: ClerkOrganizationMetadata = {
  name: '',
  subscriptionTier: 'free',
  subscriptionStatus: 'trial',
  maxUsers: 5,
  features: [],
  billingEmail: '',
  createdAt: '',
  settings: {
    timezone: '',
    dateFormat: '',
    distanceUnit: 'miles',
    fuelUnit: 'gallons',
  },
};


// Get the current authenticated user with ABAC/Clerk context
export async function getCurrentUser(allowNoOrg = false): Promise<UserContext | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  if (!user) return null;
  const dbUser = await DatabaseQueries.getUserById(userId);
  if (!dbUser) return null;
  const memberships = dbUser.memberships || [];
  const membership = memberships[0];
  const orgId = membership?.organizationId || '';
  // If allowNoOrg is true, skip org checks for onboarding
  if (allowNoOrg || orgId) {
    // Defensive: parse ClerkUserMetadata from publicMetadata
    const userMeta = user.publicMetadata as unknown as ClerkUserMetadata;
    return {
      name: user.firstName
        ? `${user.firstName} ${user.lastName ?? ''}`.trim()
        : (user.username ?? user.emailAddresses[0]?.emailAddress ?? undefined),
      userId,
      organizationId: orgId,
      role: userMeta.role,
      permissions: userMeta.permissions,
      email: user.emailAddresses[0]?.emailAddress ?? '',
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      profileImage: user.imageUrl,
      isActive: userMeta.isActive,
      onboardingComplete: userMeta.onboardingComplete,
      organizationMetadata: await getCurrentCompany() ?? defaultClerkOrganizationMetadata,
    };
  }
  // If no org and not allowed, user is not fully onboarded
  return null;
}

// Get the current company (organization) context by orgId (UUID)
/**
 * Retrieve metadata for the organization associated with the current user.
 *
 * Returns `null` when the user is unauthenticated or not linked to an
 * organization. Throws if any database query fails.
 */
export async function getCurrentCompany(): Promise<ClerkOrganizationMetadata | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const dbUser = await DatabaseQueries.getUserById(userId);
  const orgId = dbUser?.memberships?.[0]?.organizationId;
  if (!orgId) return null;

  const org = await DatabaseQueries.getOrganizationById(orgId);
  if (!org) return null;

  const settings = (org.settings as any) || {};

  const tierMap: Record<string, 'free' | 'pro' | 'enterprise'> = {
    starter: 'free',
    growth: 'pro',
    enterprise: 'enterprise',
  };

  const metadata: ClerkOrganizationMetadata = {
    name: org.name,
    subscriptionTier: tierMap[org.subscriptionTier] || 'free',
    subscriptionStatus: org.subscriptionStatus as any,
    maxUsers: org.maxUsers ?? 5,
    features: [],
    billingEmail: org.billingEmail || '',
    createdAt: org.createdAt.toISOString(),
    dotNumber: org.dotNumber || undefined,
    mcNumber: org.mcNumber || undefined,
    address: org.address || undefined,
    city: org.city || undefined,
    state: org.state || undefined,
    zip: org.zip || undefined,
    phone: org.phone || undefined,
    settings: {
      timezone: settings.timezone || 'UTC',
      dateFormat: settings.dateFormat || 'MM/dd/yyyy',
      distanceUnit: settings.distanceUnit || 'miles',
      fuelUnit: settings.fuelUnit || 'gallons',
    },
  };

  return metadata;
}

// Check if the user has the required role
export async function checkUserRole(requiredRole: string): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user && user.role === requiredRole;
}

// Require authentication and redirect to login if not authenticated
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
}
