/**
 * Debug script to investigate and fix auth/role issues
 * Run this to diagnose why admin/settings links don't show up
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/database/db';
import { SystemRoles } from '@/types/abac';
import { getPermissionsForRole } from '@/lib/auth/permissions';

/**
 * Debug function to check current user's auth state
 */
export async function debugCurrentUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      console.log('❌ No authenticated user found');
      return;
    }

    console.log('🔍 Current User Debug Info:');
    console.log('User ID:', userId);
    console.log('Email:', user.emailAddresses[0]?.emailAddress);
    console.log('Public Metadata:', user.publicMetadata);
    console.log('Private Metadata:', user.privateMetadata);
    
    // Check database user
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });
    
    if (dbUser) {
      console.log('📊 Database User Info:');
      console.log('Role:', dbUser.role);
      console.log('Organization ID:', dbUser.organizationId);
      console.log('Onboarding Complete:', dbUser.onboardingComplete);
      console.log('Organization:', dbUser.organization?.name);
    } else {
      console.log('❌ User not found in database');
    }
    
    return {
      clerkUser: user,
      dbUser,
      hasRole: !!user.publicMetadata?.role,
      role: user.publicMetadata?.role,
      isAdmin: user.publicMetadata?.role === SystemRoles.ADMIN
    };
    
  } catch (error) {
    console.error('Error debugging user:', error);
    throw error;
  }
}

/**
 * Fix function to manually set a user as admin
 * Use this if the user's role is not set correctly
 */
export async function setUserAsAdmin(userId?: string) {
  try {
    const { userId: currentUserId } = await auth();
    const targetUserId = userId || currentUserId;
    
    if (!targetUserId) {
      throw new Error('No user ID provided and no authenticated user');
    }

    console.log(`🔧 Setting user ${targetUserId} as admin...`);
    
    // Get user's organization from database
    const dbUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { organization: true }
    });
    
    if (!dbUser) {
      throw new Error('User not found in database');
    }
    
    if (!dbUser.organizationId) {
      throw new Error('User has no organization assigned');
    }
    
    // Update database
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        role: SystemRoles.ADMIN,
        onboardingComplete: true
      }
    });
    
    // Update Clerk metadata
    const client = await clerkClient();
    const permissions = getPermissionsForRole(SystemRoles.ADMIN);
    
    await client.users.updateUserMetadata(targetUserId, {
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
    
    console.log('✅ User successfully set as admin');
    console.log('Organization ID:', dbUser.organizationId);
    console.log('Role:', SystemRoles.ADMIN);
    console.log('Permissions:', permissions.length);
    
    return { success: true, organizationId: dbUser.organizationId };
    
  } catch (error) {
    console.error('Error setting user as admin:', error);
    throw error;
  }
}

/**
 * Function to verify middleware route matching
 */
export function testRouteMatching() {
  console.log('🧪 Testing route patterns...');
  
  // Import the route matchers from middleware
  const testRoutes = [
    '/abc123/admin',
    '/abc123/admin/users',
    '/abc123/settings',
    '/abc123/settings/company',
    '/admin',
    '/settings',
    '/some-org/admin',
    '/another-org/settings'
  ];
  
  // These should match the patterns used in middleware
  const adminPatterns = ["/admin(.*)", "/*/admin(.*)", "/**/admin/**"];
  const settingsPatterns = ["/*/settings(.*)", "/**/settings/**"];
  
  console.log('Admin route patterns:', adminPatterns);
  console.log('Settings route patterns:', settingsPatterns);
  console.log('Test routes:', testRoutes);
  
  // Note: Actual testing would require importing createRouteMatcher
  // This is just for reference
}

export { debugCurrentUser as default };
