'use server';

import { z } from 'zod';

import db from '../database/db';
import { auditLogSchema } from '@/schemas/auditLogSchema';

// Removed auditLogSchema export and imported from auditLogSchema.ts
// ...existing code...

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
