'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { DatabaseQueries } from '@/lib/database/db';
import {
  ClerkUserMetadata,
  ClerkOrganizationMetadata,
  UserContext,
} from '@/types/auth';

// NOTE: UserContext, ClerkUserMetadata, ClerkOrganizationMetadata, etc. should be imported from '@/types/auth'

// Get the current authenticated user with ABAC/Clerk context
export async function getCurrentUser(
  allowNoOrg = false
): Promise<UserContext | null> {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  // Get Clerk user and org metadata
  const user = await currentUser();
  if (!user) return null;

  // If allowNoOrg is true, skip org checks for onboarding
  if (allowNoOrg) {
    const userMeta = user.publicMetadata as unknown as ClerkUserMetadata;
    return {
      name: user.firstName
        ? `${user.firstName} ${user.lastName ?? ''}`.trim()
        : (user.username ?? user.emailAddresses[0]?.emailAddress ?? undefined),
      userId,
      organizationId: orgId || '',
      role: userMeta.role,
      permissions: userMeta.permissions,
      email: user.emailAddresses[0]?.emailAddress ?? '',
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      profileImage: user.imageUrl,
      isActive: userMeta.isActive,
      onboardingComplete: userMeta.onboardingComplete,
      organizationMetadata: {} as ClerkOrganizationMetadata,
    };
  }

  // Get DB user/org for additional info
  const dbUser = await DatabaseQueries.getUserByClerkId(userId);
  const dbOrg = orgId
    ? await DatabaseQueries.getOrganizationByClerkId({ clerkId: orgId })
    : null;
  if (!dbUser || !dbOrg) return null;

  // Compose ABAC context
  const userMeta = user.publicMetadata as unknown as ClerkUserMetadata;
  const orgMeta = dbOrg as unknown as ClerkOrganizationMetadata;

  return {
    name: user.firstName
      ? `${user.firstName} ${user.lastName ?? ''}`.trim()
      : (user.username ?? user.emailAddresses[0]?.emailAddress ?? undefined),
    userId,
    organizationId: orgId || '',
    role: userMeta.role,
    permissions: userMeta.permissions,
    email: user.emailAddresses[0]?.emailAddress ?? '',
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    profileImage: user.imageUrl,
    isActive: userMeta.isActive,
    onboardingComplete: userMeta.onboardingComplete,
    organizationMetadata: orgMeta,
  };
}

// Get the current company (organization) context
export async function getCurrentCompany(): Promise<ClerkOrganizationMetadata | null> {
  const { orgId } = await auth();
  if (!orgId) return null;
  const dbOrg = await DatabaseQueries.getOrganizationByClerkId({ clerkId: orgId });
  if (!dbOrg) return null;
  return dbOrg as unknown as ClerkOrganizationMetadata;
}

// Check if the user has the required role
export async function checkUserRole(requiredRole: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.role === requiredRole;
}

// Require authentication and redirect to login if not authenticated
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
}
