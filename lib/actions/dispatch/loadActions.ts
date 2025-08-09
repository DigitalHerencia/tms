'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/database/db';
import { handleError } from '@/lib/errors/handleError';
import type { DashboardActionResult } from '@/types/dashboard';
import type { LoadStatus } from '@/types/dispatch';
import { allowedStatusTransitions } from '@/lib/utils/dispatchStatus';

/**
 * Update load status and record status event.
 */
export async function updateLoadStatusAction(
  orgId: string,
  loadId: string,
  newStatus: LoadStatus,
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const current = await db.load.findUnique({
      where: { id: loadId, organizationId: orgId },
      select: { status: true },
    });

    if (!current) return { success: false, error: 'Load not found' };

    const allowed = allowedStatusTransitions[current.status] || [];
    if (!allowed.includes(newStatus)) {
      return { success: false, error: 'Invalid status change' };
    }

    await db.load.update({
      where: { id: loadId, organizationId: orgId },
      data: {
        status: newStatus,
        lastModifiedBy: userId,
        updatedAt: new Date(),
      },
    });

    await db.loadStatusEvent.create({
      data: {
        loadId,
        status: newStatus,
        timestamp: new Date(),
        automaticUpdate: false,
        source: 'dispatcher',
        createdBy: userId,
      },
    });

    await db.dispatchActivity.create({
      data: {
        organizationId: orgId,
        entityType: 'load',
        action: 'status_change',
        entityId: loadId,
        userName: userId,
        timestamp: new Date(),
      },
    });

    // Revalidate dispatch views so the updated status is visible
    revalidatePath(`/${orgId}/dispatch`, 'layout');
    return { success: true, data: { id: loadId } };
  } catch (error) {
    return handleError(error, 'Update Load Status');
  }
}
