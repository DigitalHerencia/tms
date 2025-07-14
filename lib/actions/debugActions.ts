'use server';

/**
 * Debug actions for authentication and role issues
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/database/db';
import { SystemRoles } from '@/types/abac';
import { getPermissionsForRole } from '@/lib/auth/permissions';

/**
 * Debug current user's authentication state
 */
export async function debugAuthAction() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return { error: 'No authenticated user found' };
    }

    // Check database user
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });
    
    return {
      success: true,
      data: {
        userId,
        email: user.emailAddresses[0]?.emailAddress,
        clerkPublicMetadata: user.publicMetadata,
        clerkPrivateMetadata: user.privateMetadata,
        dbUser: dbUser ? {
          role: dbUser.role,
          organizationId: dbUser.organizationId,
          onboardingComplete: dbUser.onboardingComplete,
          organizationName: dbUser.organization?.name
        } : null,
        hasRole: !!user.publicMetadata?.role,
        currentRole: user.publicMetadata?.role,
        isAdmin: user.publicMetadata?.role === SystemRoles.ADMIN
      }
    };
    
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Manually set current user as admin (for testing/debugging)
 */
export async function setCurrentUserAsAdminAction() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: 'No authenticated user found' };
    }

    // Get user's organization from database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });
    
    if (!dbUser) {
      return { error: 'User not found in database' };
    }
    
    if (!dbUser.organizationId) {
      return { error: 'User has no organization assigned' };
    }
    
    // Update database
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: SystemRoles.ADMIN,
        onboardingComplete: true
      }
    });
    
    // Update Clerk metadata
    const client = await clerkClient();
    const permissions = getPermissionsForRole(SystemRoles.ADMIN);
    
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        organizationId: dbUser.organizationId,
        role: SystemRoles.ADMIN,
        permissions,
        isActive: true,
        onboardingComplete: true,
      },
      privateMetadata: {
        organizationId: dbUser.organizationId,
        onboardingComplete: true,
      }
    });
    
    // Revalidate relevant paths
    revalidatePath('/');
    revalidatePath(`/${dbUser.organizationId}`);
    
    return { 
      success: true, 
      message: 'User successfully set as admin',
      organizationId: dbUser.organizationId,
      role: SystemRoles.ADMIN
    };
    
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Refresh current user's Clerk session claims
 */
export async function refreshUserSessionAction() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: 'No authenticated user found' };
    }

    // Get current user data
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });
    
    if (!dbUser || !dbUser.organizationId) {
      return { error: 'User or organization not found' };
    }
    
    // Update Clerk metadata to refresh session
    const client = await clerkClient();
    const permissions = getPermissionsForRole(dbUser.role as any);
    
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        organizationId: dbUser.organizationId,
        role: dbUser.role,
        permissions,
        isActive: true,
        onboardingComplete: dbUser.onboardingComplete,
      }
    });
    
    // Revalidate paths
    revalidatePath('/');
    revalidatePath(`/${dbUser.organizationId}`);
    
    return { 
      success: true, 
      message: 'Session refreshed successfully',
      role: dbUser.role
    };
    
  } catch (error: any) {
    return { error: error.message };
  }
}
