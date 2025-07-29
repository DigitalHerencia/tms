'use server';

import { auth } from '@clerk/nextjs/server';
import db from '@/lib/database/db';
import type {
  OrganizationSettings,
  UserPreferences,
  NotificationSettings,
  IntegrationSettings,
  BillingSettings,
  SettingsAuditLog,
  SystemSettings,
  CompanyProfile,
} from '@/types/settings';

export async function getCompanyProfile(orgId: string): Promise<CompanyProfile> {
  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    throw new Error('Organization not found');
  }
  return {
    id: org.id,
    name: org.name,
    logoUrl: org.logoUrl || '',
    primaryColor: '',
    address: org.address || '',
    contactEmail: org.email || '',
  };
}

export async function getOrganizationSettings(orgId: string): Promise<OrganizationSettings | null> {
  const { userId, orgId: sessionOrg } = await auth();
  if (!userId || sessionOrg !== orgId) return null;
  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) return null;
  const settings = (org.settings as any) || {};
  return {
    id: org.id,
    name: org.name,
    timezone: settings.timezone || 'UTC',
    businessRules: settings.businessRules,
    logoUrl: org.logoUrl || undefined,
    address: org.address || undefined,
  };
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const { userId: sessionUser } = await auth();
  if (!sessionUser || sessionUser !== userId) return null;
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  const prefs = {} as any;
  return {
    userId: user.id,
    theme: prefs.theme || 'light',
    language: prefs.language || 'en',
    dashboardLayout: prefs.dashboardLayout,
  };
}

export async function getNotificationSettings(
  userId: string,
): Promise<NotificationSettings | null> {
  const { userId: sessionUser } = await auth();
  if (!sessionUser || sessionUser !== userId) return null;
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  const settings = {} as any;
  return {
    userId: user.id,
    email: settings.email ?? true,
    sms: settings.sms ?? false,
    inApp: settings.inApp ?? true,
    schedules: settings.schedules,
  };
}

export async function getIntegrationSettings(orgId: string): Promise<IntegrationSettings | null> {
  const { userId, orgId: sessionOrg } = await auth();
  if (!userId || sessionOrg !== orgId) return null;
  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) return null;
  const settings = (org.settings as any)?.integrations || {};
  return {
    orgId: org.id,
    services: settings.services || {},
  };
}

export async function getSettingsAuditLog(orgId: string): Promise<SettingsAuditLog[]> {
  const { userId, orgId: sessionOrg } = await auth();
  if (!userId || sessionOrg !== orgId) return [];
  const logs = await db.auditLog.findMany({
    where: { organizationId: orgId, entityType: 'settings' },
    orderBy: { timestamp: 'desc' },
  });
  return logs.map((l) => ({
    id: l.id,
    orgId: l.organizationId,
    userId: l.userId || '',
    action: l.action,
    timestamp: l.timestamp,
    details: JSON.stringify(l.changes),
  }));
}

const DEFAULTS: SystemSettings = {
  featureFlags: {},
  limits: {},
  permissions: {},
};

export async function getSystemDefaults(): Promise<SystemSettings> {
  return DEFAULTS;
}
