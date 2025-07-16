"use client";


/**
 * Enhanced Auth Context with ABAC Support and Performance Optimizations
 *
 * Provides comprehensive authentication state management with
 * Attribute-Based Access Control for FleetFusion with optimized
 * caching and memoization strategies
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { useUser, useOrganization } from '@clerk/nextjs';

import type {
  ClerkUserMetadata,
  ClerkOrganizationMetadata,
} from '@/types/auth';
import {
  AuthState,
  UserContext,
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
} from '@/types/auth';
import { SystemRoles } from '@/types/abac';
import { authCache } from '@/lib/cache/auth-cache';

// Create the auth context
const AuthContext = createContext<AuthState | null>(null);

// Cache for computed auth state to prevent unnecessary re-renders
const authStateCache = new Map<
  string,
  {
    state: AuthState;
    timestamp: number;
  }
>();

const AUTH_STATE_CACHE_TTL = 60 * 1000; // 1 minute cache for auth state

// Remove expired cache entries
function cleanupAuthStateCache() {
  const now = Date.now();
  for (const [key, value] of authStateCache) {
    if (now - value.timestamp >= AUTH_STATE_CACHE_TTL) {
      authStateCache.delete(key);
    }
  }
}

/**
 * AuthProvider
 * Wraps the app and provides auth state/context with ABAC data.
 * Uses Clerk hooks for user/org, memoizes context, and caches state for performance.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: userLoaded, isSignedIn } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoaded: false,
    isSignedIn: false,
    isLoading: true,
    organization: null,
    company: null,
  });

  // Periodic cleanup of stale cache entries
  useEffect(() => {
    const interval = setInterval(
      cleanupAuthStateCache,
      AUTH_STATE_CACHE_TTL
    );
    return () => clearInterval(interval);
  }, []);

  // Memoized user context builder
  /**
   * Builds a UserContext from Clerk and ABAC metadata
   */
  const buildUserContext = useCallback(
    (
      clerkUser: any,
      organization: any,
      userMetadata: ClerkUserMetadata,
      orgMetadata: ClerkOrganizationMetadata
    ): UserContext => {
      const role: UserRole = userMetadata?.role || SystemRoles.MEMBER;
      const permissions: Permission[] =
        userMetadata?.permissions || ROLE_PERMISSIONS[role] || [];

      return {
        userId: clerkUser.id,
        organizationId: organization?.id || '',
        role,
        permissions,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        name:
          `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
          clerkUser.emailAddresses[0]?.emailAddress ||
          'Unknown User',
        profileImage: clerkUser.imageUrl || undefined,
        isActive: userMetadata?.isActive ?? true,
        onboardingComplete: userMetadata?.onboardingComplete ?? false,
        organizationMetadata: orgMetadata || {
          subscriptionTier: 'free',
          subscriptionStatus: 'trial',
          maxUsers: 5,
          features: [],
          billingEmail: clerkUser.emailAddresses[0]?.emailAddress || '',
          createdAt: new Date().toISOString(),
          settings: {
            timezone: 'America/Denver',
            dateFormat: 'MM/dd/yyyy',
            distanceUnit: 'miles',
            fuelUnit: 'gallons',
          },
        },
      };
    },
    []
  );

  // Memoized cache key generation
  /**
   * Generates a cache key for the current user/org
   */
  const cacheKey = useMemo(() => {
    if (!clerkUser?.id) return null;
    return `${clerkUser.id}-${organization?.id || 'no-org'}-${clerkUser.updatedAt || Date.now()}`;
  }, [clerkUser?.id, organization?.id, clerkUser?.updatedAt]);

  useEffect(() => {
    // Main effect: sync Clerk user/org to auth state
    // Wait for both user and organization data to load
    if (!userLoaded || !orgLoaded) {
      setAuthState(prev => ({ ...prev, isLoaded: false, isLoading: true }));
      return;
    }

    if (!isSignedIn || !clerkUser) {
      setAuthState({
        user: null,
        isLoaded: true,
        isSignedIn: false,
        isLoading: false,
        organization: null,
        company: null,
      });
      return;
    }

    try {
      // Try to get cached state first
      cleanupAuthStateCache();
      if (cacheKey) {
        const cached = authStateCache.get(cacheKey);
        if (cached) {
          if (Date.now() - cached.timestamp < AUTH_STATE_CACHE_TTL) {
            setAuthState(cached.state);
            return;
          }
          authStateCache.delete(cacheKey);
        }
      }

      // Extract user metadata from Clerk
      const userMetadata =
        clerkUser.publicMetadata as unknown as ClerkUserMetadata;
      const orgMetadata =
        organization?.publicMetadata as unknown as ClerkOrganizationMetadata;

      // Debug logging for user metadata
      if (process.env.NODE_ENV === 'development') {
        // Debug: log Clerk/ABAC metadata for development
        console.log('AuthContext Debug:', {
          clerkUserId: clerkUser.id,
          userMetadata,
          extractedRole: userMetadata?.role,
          orgMetadata,
          organizationId: organization?.id
        });
      }

      // Build the user context with memoized function
      const userContext = buildUserContext(
        clerkUser,
        organization,
        userMetadata,
        orgMetadata
      );

      // Build organization context
      const orgContext = organization
        ? {
            id: organization.id,
            name: organization.name,
            slug: organization.slug || '',
            metadata: orgMetadata || userContext.organizationMetadata,
          }
        : null;

      const newState: AuthState = {
        user: userContext,
        isLoaded: true,
        isSignedIn: true,
        isLoading: false,
        organization: orgContext,
        company: orgContext
          ? {
              id: orgContext.id,
              name: orgContext.name,
              dotNumber: orgContext.metadata?.dotNumber,
              mcNumber: orgContext.metadata?.mcNumber,
            }
          : null,
      };

      setAuthState(newState);

      // Cache the computed state
      if (cacheKey) {
        authStateCache.set(cacheKey, {
          state: newState,
          timestamp: Date.now(),
        });

        // Also cache in auth cache for consistency
        authCache.setUser(clerkUser.id, userContext);
        if (orgMetadata) {
          authCache.setOrganization(organization?.id || '', orgMetadata);
        }
      }
    } catch (error) {
      console.error('Error building auth context:', error);
      setAuthState({
        user: null,
        isLoaded: true,
        isSignedIn: false,
        isLoading: false,
        organization: null,
        company: null,
      });
    }
  }, [
    clerkUser,
    organization,
    userLoaded,
    orgLoaded,
    isSignedIn,
    cacheKey,
    buildUserContext,
  ]);

  // Memoize the context value to prevent unnecessary re-renders
  /**
   * Memoized context value for provider
   */
  const contextValue = useMemo(() => authState, [authState]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * Hook: useAuth
 * Returns current auth state from context
 */
export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook: useUserContext
 * Returns current user context
 */
export function useUserContext(): UserContext | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook: useIsAuthenticated
 * Returns true if user is signed in and loaded
 */
export function useIsAuthenticated(): boolean {
  const { isSignedIn, isLoaded } = useAuth();
  return isLoaded && isSignedIn;
}

/**
 * Hook: useAuthLoaded
 * Returns true if auth state is loaded
 */
export function useAuthLoaded(): boolean {
  const { isLoaded } = useAuth();
  return isLoaded;
}

/**
 * Hook: useOrganizationContext
 * Returns current organization context
 */
export function useOrganizationContext() {
  const { organization } = useAuth();
  return organization;
}

/**
 * Hook: useOnboardingStatus
 * Returns true if user has completed onboarding
 */
export function useOnboardingStatus(): boolean {
  const user = useUserContext();
  return user?.onboardingComplete ?? false;
}

/**
 * Hook: usePermission
 * Returns true if user has specified permission
 */
export function usePermission(permission: Permission): boolean {
  const user = useUserContext();
  return user?.permissions?.includes(permission) ?? false;
}

/**
 * Hook: useRole
 * Returns true if user has specified role
 */
export function useRole(role: UserRole): boolean {
  const user = useUserContext();
  return user?.role === role;
}

/**
 * Hook: useAnyPermission
 * Returns true if user has any of the specified permissions
 */
export function useAnyPermission(permissions: Permission[]): boolean {
  const user = useUserContext();
  if (!user?.permissions) return false;
  return permissions.some(permission => user.permissions.includes(permission));
}

/**
 * Hook: useAllPermissions
 * Returns true if user has all of the specified permissions
 */
export function useAllPermissions(permissions: Permission[]): boolean {
  const user = useUserContext();
  if (!user?.permissions) return false;
  return permissions.every(permission => user.permissions.includes(permission));
}

/**
 * Hook: useIsAdmin
 * Returns true if user is admin
 */
export function useIsAdmin(): boolean {
  return useRole(SystemRoles.ADMIN);
}

/**
 * Hook: useSubscriptionStatus
 * Returns subscription tier/status for current organization
 */
export function useSubscriptionStatus() {
  const { organization } = useAuth();
  return {
    tier: organization?.metadata?.subscriptionTier || 'free',
    status: organization?.metadata?.subscriptionStatus || 'trial',
    maxUsers: organization?.metadata?.maxUsers || 5,
    features: organization?.metadata?.features || [],
  };
}
