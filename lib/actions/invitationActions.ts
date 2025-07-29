"use server";

import { handleError } from "@/lib/errors/handleError";
import { invitationSchema } from "@/schemas/dashboard";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/database/db";
import { sendInvitationEmail } from "@/lib/email/mailer";
import crypto from "crypto";

// See CONTRIBUTING.md#L596-L618 for validation and permission checks

export interface InvitationData {
  emailAddress: string;
  role: string;
  redirectUrl?: string;
}

export async function createOrganizationInvitation(data: InvitationData) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = invitationSchema.parse(data);
    const token = crypto.randomUUID();

    await db.organizationInvitation.create({
      data: {
        id: crypto.randomUUID(),
        organizationId: orgId,
        email: validated.emailAddress,
        role: validated.role,
        token,
        status: "pending",
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const link = `${baseUrl}/accept-invitation?token=${token}`;
    await sendInvitationEmail(validated.emailAddress, link);

    return { success: true };
  } catch (error) {
    return handleError(error, "Create Organization Invitation");
  }
}

export async function getOrganizationInvitations(organizationId?: string) {
  try {
    const { orgId } = await auth();
    const targetOrgId = organizationId || orgId;

    if (!targetOrgId) {
      return { success: false, error: "Unauthorized" };
    }

    const invitations = await db.organizationInvitation.findMany({
      where: { organizationId: targetOrgId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: invitations };
  } catch (error) {
    return handleError(error, "Get Organization Invitations");
  }
}

export async function revokeOrganizationInvitation(id: string) {
  try {
    await db.organizationInvitation.update({
      where: { id },
      data: { status: "revoked", updatedAt: new Date() },
    });
    return { success: true };
  } catch (error) {
    return handleError(error, "Revoke Organization Invitation");
  }
}
