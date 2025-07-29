"use server";

/**
 * User management server actions.
 *
 * TODO remaining: send invitation emails when inviting users.
 */

import db from '@/lib/database/db';
import { handleError } from '@/lib/errors/handleError';

// Invite user: create pending membership and send invite (implementation stub)
export async function inviteUserAction(orgId: string, email: string, role: string) {
  try {
    // Find or create user by email
    let user = await db.user.findFirst({ where: { email } });
    if (!user) {
      user = await db.user.create({ data: { id: crypto.randomUUID(), email, isActive: false } });
    }
    // Create pending membership
    await db.organizationMembership.upsert({
      where: { organizationId_userId: { organizationId: orgId, userId: user.id } },
      update: { role, updatedAt: new Date() },
      create: {
        id: crypto.randomUUID(),
        organizationId: orgId,
        userId: user.id,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    // TODO: Send invite email here
    return { success: true };
  } catch (error) {
    return handleError(error, 'Invite User Action');
  }
}

// Update user role in custom orgs using Prisma
export async function updateUserRoleAction(orgId: string, userId: string, newRole: string) {
  try {
    // Update membership role
    await db.organizationMembership.update({
      where: { organizationId_userId: { organizationId: orgId, userId } },
      data: { role: newRole, updatedAt: new Date() },
    });
    return { success: true };
  } catch (error) {
    return handleError(error, 'Update User Role');
  }
}
