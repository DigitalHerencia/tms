'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/database/db';
import { handleError } from '@/lib/errors/handleError';
import type { LoadActionResult, LoadStatus } from '@/types/dispatch';
import type { DashboardActionResult } from '@/types/dashboard';
import { getCurrentUser } from '@/lib/auth/auth';
import { canManageLoadsAndDispatch } from '@/lib/auth/permissions';
import {
  driverHasOverlappingLoad,
  vehicleHasOverlappingLoad,
  trailerHasOverlappingLoad,
} from '@/lib/fetchers/dispatchFetchers';
import { allowedStatusTransitions } from '@/lib/utils/dispatchStatus';
import { createLoadAction, updateLoadAction } from './loadActions';

export {
  createLoadAction as createDispatchLoadAction,
  updateLoadAction as updateDispatchLoadAction,
};


/**
 * Delete a load (dispatch)
 */
export async function deleteDispatchLoadAction(
  orgId: string,
  loadId: string,
): Promise<DashboardActionResult<null>> {
  try {
    const user = await getCurrentUser();
    if (!user || !canManageLoadsAndDispatch(user)) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = user.userId;

    await db.load.delete({
      where: { id: loadId, organizationId: orgId },
    });

    await db.dispatchActivity.create({
      data: {
        organizationId: orgId,
        entityType: 'load',
        action: 'delete',
        entityId: loadId,
        userName: userId,
        timestamp: new Date(),
      },
    });

    // Revalidate the entire dispatch section for this organization
    revalidatePath(`/${orgId}/dispatch`, 'layout');
    return { success: true, data: null };
  } catch (error) {
    return handleError(error, 'Delete Dispatch Load');
  }
}

/**
 * Assign a driver to a load
 */
export async function assignDriverToLoadAction(
  orgId: string,
  loadId: string,
  driverId: string,
  vehicleId?: string | null,
  trailerId?: string | null,
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user || !canManageLoadsAndDispatch(user)) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = user.userId;

    const existing = await db.load.findFirst({
      where: { id: loadId, organizationId: orgId },
      select: {
        scheduledPickupDate: true,
        scheduledDeliveryDate: true,
        vehicleId: true,
        trailerId: true,
      },
    });

    if (!existing || !existing.scheduledPickupDate || !existing.scheduledDeliveryDate) {
      return { success: false, error: 'Load not found or missing schedule' };
    }

    const pickup = existing.scheduledPickupDate;
    const delivery = existing.scheduledDeliveryDate;

    const vehicleToCheck = vehicleId ?? existing.vehicleId ?? undefined;
    const trailerToCheck = trailerId ?? existing.trailerId ?? undefined;

    const [driverConflict, vehicleConflict, trailerConflict] = await Promise.all([
      driverHasOverlappingLoad(orgId, driverId, pickup, delivery, loadId),
      vehicleToCheck
        ? vehicleHasOverlappingLoad(orgId, vehicleToCheck, pickup, delivery, loadId)
        : Promise.resolve(false),
      trailerToCheck
        ? trailerHasOverlappingLoad(orgId, trailerToCheck, pickup, delivery, loadId)
        : Promise.resolve(false),
    ]);

    if (driverConflict)
      return { success: false, error: 'Driver already assigned to another load in this time range' };
    if (vehicleConflict)
      return { success: false, error: 'Vehicle already assigned to another load in this time range' };
    if (trailerConflict)
      return { success: false, error: 'Trailer already assigned to another load in this time range' };

    await db.load.update({
      where: { id: loadId, organizationId: orgId },
      data: {
        driver_id: driverId,
        vehicleId: vehicleToCheck ?? null,
        trailerId: trailerToCheck ?? null,
        status: 'assigned',
        lastModifiedBy: userId,
        updatedAt: new Date(),
      },
    });

    await db.dispatchActivity.create({
      data: {
        organizationId: orgId,
        entityType: 'load',
        action: 'assign_driver',
        entityId: loadId,
        userName: userId,
        timestamp: new Date(),
      },
    });

    // Revalidate dispatch board to reflect new driver assignment
    revalidatePath(`/${orgId}/dispatch`, 'layout');
    return { success: true, data: { id: loadId } };
  } catch (error) {
    return handleError(error, 'Assign Driver to Load');
  }
}

/**
 * Update status for a load
 */
export async function updateLoadStatusAction(
  orgId: string,
  loadId: string,
  newStatus: LoadStatus,
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user || !canManageLoadsAndDispatch(user)) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = user.userId;

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
