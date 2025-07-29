'use server';

import prisma from '@/lib/database/db';
import { type UserRole } from '@/types/auth';

export type UserWithRole = {
  id: string;
  name: string;
  role: UserRole;
};

/**
 * Retrieve all users for an organization along with their assigned roles.
 */
export async function listOrganizationUsers(orgId: string): Promise<UserWithRole[]> {
  const memberships = await prisma.organizationMembership.findMany({
    where: { organizationId: orgId },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return memberships.map((m) => ({
    id: m.user.id,
    name: `${m.user.firstName ?? ''} ${m.user.lastName ?? ''}`.trim(),
    role: m.role as UserRole,
  }));
}

/**
 * Retrieve a single user by userId, including their role in the organization.
 */
export async function getUserById(orgId: string, userId: string): Promise<UserWithRole | null> {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      organizationId: orgId,
      userId: userId,
    },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  if (!membership) return null;

  return {
    id: membership.user.id,
    name: `${membership.user.firstName ?? ''} ${membership.user.lastName ?? ''}`.trim(),
    role: membership.role as UserRole,
  };
}
