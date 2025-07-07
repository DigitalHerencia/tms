// Global TypeScript declarations for Clerk custom session claims aligned with ABAC specifications

import type { SystemRole, Permission, UserSessionAttributes } from './abac';

export {};

declare global {
  interface CustomJwtSessionClaims {
    // Core Clerk fields
    'org.id'?: string;
    'user.id'?: string;
    'org.name'?: string;
    'org.role'?: SystemRole;

    // ABAC Session Attributes (aligned with documented specifications)
    abac?: UserSessionAttributes;

    // User information
    firstName?: string;
    lastName?: string;
    primaryEmail?: string;
    fullName?: string;

    // Public metadata
    publicMetadata?: {
      onboardingComplete?: boolean;
      organizationId?: string;
      role?: SystemRole;
    };

    // Organization membership permissions (structured as ABAC permissions)
    'org_membership.permissions'?: Permission[];
    'user.organizations'?: string[] | object[];

    // Legacy fields for backward compatibility (deprecated - use abac field instead)
    metadata?: {
      organizationId?: string;
      role?: string;
      permissions?: string[];
      isActive?: boolean;
      lastLogin?: string;
      onboardingComplete?: boolean;
    };
  }
}
