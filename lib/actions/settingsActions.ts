'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/database/db';
import type { Prisma } from '@prisma/client';
import {
  CompanyProfileSchema,
  OrganizationSettingsSchema,
  UserPreferencesSchema,
  NotificationSettingsSchema,
  IntegrationSettingsSchema,
  BillingSettingsSchema,
} from '@/schemas/settings';

async function verifyOrgAccess(orgId: string) {
  const { userId, orgId: sessionOrg } = await auth();
  if (!userId || sessionOrg !== orgId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

async function logChange(orgId: string, userId: string, action: string, changes: Prisma.JsonObject) {
  await db.auditLog.create({
    data: {
      organizationId: orgId,
      userId,
      entityType: 'settings',
      entityId: orgId,
      action,
      changes,
      timestamp: new Date(),
    },
  });
}

export async function updateCompanyProfileAction(orgId: string, data: unknown) {
  const userId = await verifyOrgAccess(orgId);
  const parsed = CompanyProfileSchema.parse(data);
  await logChange(orgId, userId, 'updateCompanyProfile', parsed);
  return { success: true };
}

export async function updateOrganizationSettings(orgId: string, data: unknown) {
  const userId = await verifyOrgAccess(orgId);
  const parsed = OrganizationSettingsSchema.parse(data);
  const result = await db.organization.update({
    where: { id: orgId },
    data: {
      name: parsed.name,
      address: parsed.address,
      logoUrl: parsed.logoUrl,
      settings: {
        ...(parsed.businessRules && { businessRules: parsed.businessRules }),
        timezone: parsed.timezone,
      },
    },
  });
  await logChange(orgId, userId, 'updateOrganization', parsed);
  revalidatePath(`/[orgId]/settings`);
  return result;
}

export async function updateUserPreferences(data: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const parsed = UserPreferencesSchema.parse(data);
  if (parsed.userId !== userId) throw new Error('Invalid user');
  await logChange(parsed.userId, parsed.userId, 'updateUserPrefs', parsed);
  return { success: true };
}

export async function updateNotificationSettings(data: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const parsed = NotificationSettingsSchema.parse(data);
  if (parsed.userId !== userId) throw new Error('Invalid user');
  await logChange(parsed.userId, parsed.userId, 'updateNotifications', parsed);
  return { success: true };
}

export async function updateIntegrationSettings(orgId: string, data: unknown) {
  const userId = await verifyOrgAccess(orgId);
  const parsed = IntegrationSettingsSchema.parse(data);
  await logChange(orgId, userId, 'updateIntegrations', parsed);
  return { success: true };
}

export async function updateBillingSettings(orgId: string, data: unknown) {
  const userId = await verifyOrgAccess(orgId);
  const parsed = BillingSettingsSchema.parse(data);
  await logChange(orgId, userId, 'updateBilling', parsed);
  return { success: true };
}

export async function resetSettingsToDefault(orgId: string) {
  const userId = await verifyOrgAccess(orgId);
  await logChange(orgId, userId, 'resetSettings', {});
  return { success: true };
}

export async function exportSettings(orgId: string) {
  await verifyOrgAccess(orgId);
  const org = await db.organization.findUnique({ where: { id: orgId } });
  return org?.settings || {};
}

export async function importSettings(orgId: string, settings: Prisma.JsonObject) {
  const userId = await verifyOrgAccess(orgId);
  await db.organization.update({ where: { id: orgId }, data: { settings } });
  await logChange(orgId, userId, 'importSettings', settings);
  return { success: true };
}
