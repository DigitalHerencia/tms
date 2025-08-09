'use server';

import db from '@/lib/database/db';

export async function getTenantFeatureFlags(orgId: string): Promise<Record<string, boolean>> {
  const org = await db.organization.findUnique({ where: { id: orgId } });
  const settings = (org?.settings as any) || {};
  return settings.featureFlags || {};
}

export async function isFeatureEnabled(orgId: string, feature: string): Promise<boolean> {
  const flags = await getTenantFeatureFlags(orgId);
  return flags[feature] === true;
}
