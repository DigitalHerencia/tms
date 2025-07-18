// When creating a new OrganizationMembership, use:
// const orgMemId = generateDomainId('orgmem');
'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';

import { SystemRoles } from '@/types/abac';
import { handleError } from '@/lib/errors/handleError';
import { generateDomainId } from '@/lib/utils/idUtils';

const roleEnum = z.enum(
  Object.values(SystemRoles) as [string, ...string[]]
);

const inviteUserSchema = z.object({
  orgId: z.string().min(1),
  email: z.string().email(),
  role: roleEnum,
});

const updateRoleSchema = z.object({
  orgId: z.string().min(1),
  userId: z.string().min(1),
  newRole: roleEnum,
});

export async function inviteUserAction(
  orgId: string,
  email: string,
  role: string
) {
  try {
    const { userId, orgId: sessionOrgId } = await auth();
    if (!userId || sessionOrgId !== orgId) {
      throw new Error('Unauthorized');
    }

    const validated = inviteUserSchema.parse({ orgId, email, role });

    // Generate a new user ID in {prefix}_{32char_alphanum} format
    const newUserId = generateDomainId('user');

    const client = await clerkClient();
    await client.organizations.createOrganizationInvitation({
      organizationId: validated.orgId,
      inviterUserId: userId,
      emailAddress: validated.email,
      role: validated.role,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite`,
      // Pass the generated user ID as metadata if Clerk supports it
      publicMetadata: { id: newUserId },
    });

    return { success: true, userId: newUserId };
  } catch (error) {
    return handleError(error, 'Invite User Action');
  }
}

export async function updateUserRoleAction(
  orgId: string,
  userId: string,
  newRole: string
) {
  try {
    const { userId: sessionUserId, orgId: sessionOrgId } = await auth();
    if (!sessionUserId || sessionOrgId !== orgId) {
      throw new Error('Unauthorized');
    }

    const validated = updateRoleSchema.parse({ orgId, userId, newRole });

    const client = await clerkClient();
    await client.organizations.updateOrganizationMembership({
      organizationId: validated.orgId,
      userId: validated.userId,
      role: validated.newRole,
    });

    await client.users.updateUser(validated.userId, {
      publicMetadata: { role: validated.newRole },
    });

    return { success: true };
  } catch (error) {
    return handleError(error, 'Update User Role');
  }
}
