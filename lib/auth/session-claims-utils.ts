/**
 * Session Claims Validation and Testing Utilities
 * Provides utilities for validating and testing Clerk session claims
 */

import type { UserSessionAttributes, SystemRole, Permission } from '@/types/abac';
import { getPermissionsForRole } from '@/types/abac';



/**
 * Validate session claims structure
 */
export function validateSessionClaims(claims: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!claims['user.id']) {
    errors.push('Missing required field: user.id');
  }

  // Check ABAC structure
  if (!claims.abac) {
    warnings.push('Missing ABAC claims structure');
  } else {
    const abac = claims.abac as UserSessionAttributes;

    if (!abac.role) {
      errors.push('Missing ABAC role');
    }

    if (!abac.organizationId) {
      warnings.push('Missing ABAC organizationId');
    }

    if (!Array.isArray(abac.permissions)) {
      errors.push('ABAC permissions must be an array');
    }
  }

  // Check organization context
  if (!claims['org.id'] && !claims.abac?.organizationId) {
    warnings.push('No organization context found');
  }

  // Check role consistency
  if (claims['org.role'] && claims.abac?.role && claims['org.role'] !== claims.abac.role) {
    warnings.push('Inconsistent role between org.role and abac.role');
  }

  // Check onboarding status
  if (!claims.publicMetadata?.onboardingComplete && !claims.metadata?.onboardingComplete) {
    warnings.push('Onboarding completion status unclear');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Extract user context from session claims (server-side)
 */
export function extractUserContextFromClaims(claims: any): {
  userId: string;
  organizationId: string;
  role: SystemRole;
  permissions: Permission[];
  onboardingComplete: boolean;
  isActive: boolean;
} {
  // Primary source: ABAC claims
  const abac = claims.abac as UserSessionAttributes | undefined;

  return {
    userId: claims['user.id'] || '',
    organizationId:
      abac?.organizationId || claims['org.id'] || claims.metadata?.organizationId || '',
    role: abac?.role || claims['org.role'] || claims.metadata?.role || 'member',
    permissions:
      abac?.permissions ||
      claims['org_membership.permissions'] ||
      claims.metadata?.permissions ||
      [],
    onboardingComplete:
      claims.publicMetadata?.onboardingComplete || claims.metadata?.onboardingComplete || false,
    isActive: claims.metadata?.isActive ?? true,
  };
}

/**
 * Create test session claims for development/testing
 */
export function createTestSessionClaims(options: {
  userId: string;
  organizationId?: string;
  role?: SystemRole;
  onboardingComplete?: boolean;
  includePermissions?: boolean;
}): CustomJwtSessionClaims {
  const {
    userId,
    organizationId = 'test-org',
    role = 'member',
    onboardingComplete = true,
    includePermissions = true,
  } = options;

  const permissions = includePermissions ? getPermissionsForRole(role) : [];

  return {
    'user.id': userId,
    'org.id': organizationId,
    'org.name': 'Test Organization',
    'org.role': role,

    abac: {
      role,
      organizationId,
      permissions,
    },

    firstName: 'Test',
    lastName: 'User',
    primaryEmail: 'test@example.com',
    fullName: 'Test User',

    publicMetadata: {
      onboardingComplete,
      organizationId,
      role,
    },
    'org_membership.permissions': permissions,
    'user.organizations': [organizationId],
    metadata: {
      organizationId,
      role: role as string,
      permissions: permissions,
      isActive: true,
      lastLogin: new Date().toISOString(),
      onboardingComplete,
    },
  };
}

/**
 * Session claims health checker
 */
export function checkSessionClaimsHealth(claims: any): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  score: number; // 0-100
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    field?: string;
  }>;
} {
  const issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    field?: string;
  }> = [];

  let score = 100;

  // Critical checks (errors)
  if (!claims['user.id']) {
    issues.push({ type: 'error', message: 'Missing user.id', field: 'user.id' });
    score -= 30;
  }

  if (!claims.abac) {
    issues.push({ type: 'error', message: 'Missing ABAC structure', field: 'abac' });
    score -= 25;
  } else if (!claims.abac.role) {
    issues.push({ type: 'error', message: 'Missing ABAC role', field: 'abac.role' });
    score -= 20;
  }

  // Important checks (warnings)
  if (!claims['org.id'] && !claims.abac?.organizationId) {
    issues.push({ type: 'warning', message: 'No organization context', field: 'org.id' });
    score -= 15;
  }

  if (!claims.publicMetadata?.onboardingComplete) {
    issues.push({
      type: 'warning',
      message: 'Onboarding may not be complete',
      field: 'publicMetadata.onboardingComplete',
    });
    score -= 10;
  }

  if (!Array.isArray(claims.abac?.permissions) || claims.abac.permissions.length === 0) {
    issues.push({
      type: 'warning',
      message: 'No permissions array or empty permissions',
      field: 'abac.permissions',
    });
    score -= 10;
  }

  // Consistency checks (info)
  if (claims['org.role'] && claims.abac?.role && claims['org.role'] !== claims.abac.role) {
    issues.push({ type: 'info', message: 'Role inconsistency between org.role and abac.role' });
    score -= 5;
  }

  if (
    claims['org.id'] &&
    claims.abac?.organizationId &&
    claims['org.id'] !== claims.abac.organizationId
  ) {
    issues.push({ type: 'info', message: 'Organization ID inconsistency' });
    score -= 5;
  }

  // Determine overall status
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (score < 60) {
    status = 'unhealthy';
  } else if (score < 85) {
    status = 'degraded';
  }

  return {
    status,
    score: Math.max(0, score),
    issues,
  };
}

/**
 * Compare session claims with expected values (for testing)
 */
export function compareSessionClaims(
  actual: any,
  expected: Partial<CustomJwtSessionClaims>,
): {
  matches: boolean;
  differences: Array<{
    field: string;
    expected: any;
    actual: any;
  }>;
} {
  const differences: Array<{
    field: string;
    expected: any;
    actual: any;
  }> = [];

  function compareValues(actualVal: any, expectedVal: any, path: string) {
    if (expectedVal === undefined) return; // Skip undefined expected values

    if (JSON.stringify(actualVal) !== JSON.stringify(expectedVal)) {
      differences.push({
        field: path,
        expected: expectedVal,
        actual: actualVal,
      });
    }
  }

  // Compare key fields
  compareValues(actual['user.id'], expected['user.id'], 'user.id');
  compareValues(actual['org.id'], expected['org.id'], 'org.id');
  compareValues(actual['org.role'], expected['org.role'], 'org.role');
  compareValues(actual.abac?.role, expected.abac?.role, 'abac.role');
  compareValues(actual.abac?.organizationId, expected.abac?.organizationId, 'abac.organizationId');
  compareValues(
    actual.publicMetadata?.onboardingComplete,
    expected.publicMetadata?.onboardingComplete,
    'publicMetadata.onboardingComplete',
  );

  return {
    matches: differences.length === 0,
    differences,
  };
}

/**
 * Format session claims for debugging
 */
export function formatSessionClaimsForDebug(claims: any): string {
  const formatted = {
    'Core Identity': {
      'user.id': claims['user.id'],
      'org.id': claims['org.id'],
      'org.role': claims['org.role'],
    },
    'ABAC Structure': claims.abac || 'Missing',
    'User Info': {
      firstName: claims.firstName,
      lastName: claims.lastName,
      primaryEmail: claims.primaryEmail,
    },
    Metadata: {
      onboardingComplete: claims.publicMetadata?.onboardingComplete,
      isActive: claims.metadata?.isActive,
      lastLogin: claims.metadata?.lastLogin,
    },
    Permissions: {
      count: Array.isArray(claims.abac?.permissions) ? claims.abac.permissions.length : 'N/A',
      fromOrgMembership: Array.isArray(claims['org_membership.permissions'])
        ? claims['org_membership.permissions'].length
        : 'N/A',
    },
  };

  return JSON.stringify(formatted, null, 2);
}
