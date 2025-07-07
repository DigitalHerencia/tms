'use server';

import { logAuditEvent } from '@/lib/actions/auditActions';

export async function logAdminActivity(action: string, metadata: Record<string, any> = {}) {
  await logAuditEvent(action, 'admin', undefined, metadata);
}
