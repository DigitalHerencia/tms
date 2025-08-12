'use server';

import { auth } from '@clerk/nextjs/server';
import db from '@/lib/database/db';

/**
 * Verify the current user has access to the given organization.
 * Throws an error if unauthorized and returns the userId otherwise.
 */
export async function verifyOrgAccess(orgId: string) {
  const { userId, orgId: sessionOrg } = await auth();
  if (!userId || sessionOrg !== orgId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

/**
 * Create a settings audit log entry.
 */
export async function logSettingsChange(orgId: string, userId: string, action: string) {
  await db.auditLog.create({
    data: {
      organizationId: orgId,
      userId,
      entityType: 'settings',
      entityId: orgId,
      action,
      timestamp: new Date(),
    },
  });
}
