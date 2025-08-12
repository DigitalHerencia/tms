'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/database/db';
import type { Prisma, Organization } from '@prisma/client';
import {
  CompanyProfileSchema,
  OrganizationSettingsSchema,
  UserPreferencesSchema,
  NotificationSettingsSchema,
} from '@/schemas/settings';
import { handleError } from '@/lib/errors/handleError';
import type { ActionResult } from '@/types/actions';
import { verifyOrgAccess, logSettingsChange } from './settings/utils';

export async function updateCompanyProfileAction(
  orgId: string,
  data: unknown,
): Promise<ActionResult<void>> {
  try {
    const userId = await verifyOrgAccess(orgId);
    const _parsed = CompanyProfileSchema.parse(data);
    await logSettingsChange(orgId, userId, 'updateCompanyProfile');
    return { success: true };
  } catch (error) {
    return handleError(error, 'Update Company Profile');
  }
}

export async function updateOrganizationSettings(
  orgId: string,
  data: unknown,
): Promise<ActionResult<Organization>> {
  try {
    const userId = await verifyOrgAccess(orgId);
    const parsed = OrganizationSettingsSchema.parse(data);
    const result = await db.organization.update({
      where: { id: orgId },
      data: {
        name: parsed.name,
        address: parsed.address,
        logoUrl: parsed.logoUrl,
        settings: {
          timezone: parsed.timezone,
        },
      },
    });
    await logSettingsChange(orgId, userId, 'updateOrganization');
    revalidatePath(`/[orgId]/settings`);
    return { success: true, data: result };
  } catch (error) {
    return handleError(error, 'Update Organization Settings');
  }
}

export async function updateUserPreferences(
  data: unknown,
): Promise<ActionResult<void>> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');
    const parsed = UserPreferencesSchema.parse(data);
    if (parsed.userId !== userId) throw new Error('Invalid user');
    await logSettingsChange(parsed.userId, parsed.userId, 'updateUserPrefs');
    return { success: true };
  } catch (error) {
    return handleError(error, 'Update User Preferences');
  }
}

export async function updateNotificationSettings(
  data: unknown,
): Promise<ActionResult<void>> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');
    const parsed = NotificationSettingsSchema.parse(data);
    if (parsed.userId !== userId) throw new Error('Invalid user');
    await logSettingsChange(parsed.userId, parsed.userId, 'updateNotifications');
    return { success: true };
  } catch (error) {
    return handleError(error, 'Update Notification Settings');
  }
}

export async function updateIntegrationSettings(
  orgId: string,
  data: unknown,
): Promise<ActionResult<void>> {
  try {
    const userId = await verifyOrgAccess(orgId);
    await logSettingsChange(orgId, userId, 'updateIntegrations');
    return { success: true };
  } catch (error) {
    return handleError(error, 'Update Integration Settings');
  }
}

export async function resetSettingsToDefault(
  orgId: string,
): Promise<ActionResult<void>> {
  try {
    const userId = await verifyOrgAccess(orgId);
    await logSettingsChange(orgId, userId, 'resetSettings');
    return { success: true };
  } catch (error) {
    return handleError(error, 'Reset Settings To Default');
  }
}

export async function exportSettings(
  orgId: string,
): Promise<ActionResult<Prisma.JsonValue>> {
  try {
    await verifyOrgAccess(orgId);
    const org = await db.organization.findUnique({ where: { id: orgId } });
    return { success: true, data: (org?.settings as Prisma.JsonValue) || {} };
  } catch (error) {
    return handleError(error, 'Export Settings');
  }
}
