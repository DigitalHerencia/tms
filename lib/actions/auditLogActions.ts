'use server';

import type { z } from 'zod';
import type { AuditLog } from '@prisma/client';

import db from '../database/db';
import { auditLogSchema } from '@/schemas/auditLogSchema';
import { handleError } from '@/lib/errors/handleError';
import type { ActionResult } from '@/types/actions';

// Removed auditLogSchema export and imported from auditLogSchema.ts
// ...existing code...

export async function createAuditLog(
  data: z.infer<typeof auditLogSchema>,
): Promise<ActionResult<AuditLog>> {
  try {
    const validated = auditLogSchema.parse(data);
    const log = await db.auditLog.create({
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
    return { success: true, data: log };
  } catch (error) {
    return handleError(error, 'Create Audit Log');
  }
}

export async function getAuditLogs(
  organizationId: string,
  entityType?: string,
  entityId?: string,
): Promise<ActionResult<AuditLog[]>> {
  try {
    const logs = await db.auditLog.findMany({
      where: {
        organizationId,
        ...(entityType ? { entityType } : {}),
        ...(entityId ? { entityId } : {}),
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    return { success: true, data: logs };
  } catch (error) {
    return handleError(error, 'Get Audit Logs');
  }
}
