'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import db from '@/lib/database/db';
import type { Prisma } from '@prisma/client';
import { verifyOrgAccess, logSettingsChange } from './utils';

const FeatureToggleSchema = z.object({
  orgId: z.string(),
  feature: z.string(),
  enabled: z.boolean(),
});

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
  await logSettingsChange(
    parsed.orgId,
    userId,
    `feature:${parsed.feature}:${parsed.enabled ? 'enabled' : 'disabled'}`,
  );
  revalidatePath(`/[orgId]/settings`);
  return { success: true };
}
