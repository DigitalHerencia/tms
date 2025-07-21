import { z } from 'zod';

export const auditLogSchema = z.object({
  organizationId: z.string(),
  userId: z.string().optional(),
  entityType: z.string(),
  entityId: z.string(),
  action: z.string(),
  changes: z.any().optional(),
  metadata: z.any().optional(),
});
