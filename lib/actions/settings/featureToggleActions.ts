'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/database/db';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';

const FeatureToggleSchema = z.object({
  orgId: z.string(),
  feature: z.string(),
  enabled: z.boolean(),
});

async function verifyOrgAccess(orgId: string) {
  const { userId, orgId: sessionOrg } = await auth();
  if (!userId || sessionOrg !== orgId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

async function logChange(orgId: string, userId: string, feature: string, enabled: boolean) {
  await db.auditLog.create({
    data: {
      organizationId: orgId,
      userId,
      entityType: 'settings',
      entityId: orgId,
      action: `feature:${feature}:${enabled ? 'enabled' : 'disabled'}`,
      timestamp: new Date(),
    },
  });
}

export async function updateFeatureToggle(data: unknown) {
  const parsed = FeatureToggleSchema.parse(data);
  const userId = await verifyOrgAccess(parsed.orgId);
  const org = await db.organization.findUnique({ where: { id: parsed.orgId } });
  const settings = (org?.settings as any) || {};
  const featureFlags = settings.featureFlags || {};
  featureFlags[parsed.feature] = parsed.enabled;
  await db.organization.update({
    where: { id: parsed.orgId },
    data: {
      settings: {
        ...settings,
        featureFlags,
      } as Prisma.JsonObject,
    },
  });
  await logChange(parsed.orgId, userId, parsed.feature, parsed.enabled);
  revalidatePath(`/[orgId]/settings`);
  return { success: true };
}
