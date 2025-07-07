'use server';

import { z } from 'zod';

import db from '../database/db';

export const auditLogSchema = z.object({
  organizationId: z.string(),
  userId: z.string().optional(),
  entityType: z.string(),
  entityId: z.string(),
  action: z.string(),
  changes: z.any().optional(),
  metadata: z.any().optional(),
});

export async function createAuditLog(data: z.infer<typeof auditLogSchema>) {
  const validated = auditLogSchema.parse(data);
  return db.auditLog.create({
    data: {
      organizationId: validated.organizationId,
      userId: validated.userId,
      entityType: validated.entityType,
      entityId: validated.entityId,
      action: validated.action,
      changes: validated.changes,
      metadata: validated.metadata,
      timestamp: new Date(),
    },
  });
}

export async function getAuditLogs(
  organizationId: string,
  entityType?: string,
  entityId?: string
) {
  return db.auditLog.findMany({
    where: {
      organizationId,
      ...(entityType ? { entityType } : {}),
      ...(entityId ? { entityId } : {}),
    },
    orderBy: { timestamp: 'desc' },
    take: 100,
  });
}
