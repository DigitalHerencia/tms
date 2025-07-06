"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { SystemRoles } from "@/types/abac";
import { handleError } from "@/lib/errors/handleError";

const updateRoleSchema = z.object({
  orgId: z.string().min(1),
  userId: z.string().min(1),
  newRole: z.enum(Object.values(SystemRoles) as [string, ...string[]]),
});

export async function updateUserRoleAction(orgId: string, userId: string, newRole: string) {
  try {
    const { userId: sessionUserId, orgId: sessionOrgId } = await auth();
    if (!sessionUserId || sessionOrgId !== orgId) {
      throw new Error("Unauthorized");
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
    return handleError(error, "Update User Role");
  }
}
