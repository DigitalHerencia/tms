'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/database/db';
import { handleError } from '@/lib/errors/handleError';
import type { LoadActionResult, LoadStatus } from '@/types/dispatch';
import { loadInputSchema } from '@/schemas/dispatch';
import type { DashboardActionResult } from '@/types/dashboard';
import { getCurrentUser } from '@/lib/auth/auth';
import { canManageLoadsAndDispatch } from '@/lib/auth/permissions';
import {
  driverHasOverlappingLoad,
  vehicleHasOverlappingLoad,
  trailerHasOverlappingLoad,
} from '@/lib/fetchers/dispatchFetchers';
import { allowedStatusTransitions } from '@/lib/utils/dispatchStatus';

/**
 * Create a new load (dispatch)
 */
export async function createDispatchLoadAction(
  orgId: string,
  formData: FormData,
): Promise<LoadActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user || !canManageLoadsAndDispatch(user)) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = user.userId;
    const parsed = loadInputSchema.parse(Object.fromEntries(formData));
    const load = await db.load.create({
      data: {
        organizationId: orgId,
        loadNumber: parsed.load_number,
        originAddress: parsed.origin_address,
        originCity: parsed.origin_city,
        originState: parsed.origin_state,
        originZip: parsed.origin_zip,
        destinationAddress: parsed.destination_address,
        destinationCity: parsed.destination_city,
        destinationState: parsed.destination_state,
        destinationZip: parsed.destination_zip,
        customerId: parsed.customer_id ?? null,
        driver_id: parsed.driver_id ?? null,
        vehicleId: parsed.vehicle_id ?? null,
        trailerId: parsed.trailer_id ?? null,
        scheduledPickupDate: parsed.scheduled_pickup_date
          ? new Date(parsed.scheduled_pickup_date)
          : null,
        scheduledDeliveryDate: parsed.scheduled_delivery_date
          ? new Date(parsed.scheduled_delivery_date)
          : null,
        notes: parsed.notes ?? null,
        status: parsed.status ?? 'pending',
        createdBy: userId,
      },
    });
    revalidatePath(`/${orgId}/dispatch`);
    return { success: true, data: { id: load.id } };
  } catch (error) {
    return handleError(error, 'Create Load') as LoadActionResult<{ id: string }>;
  }
}

/**
 * Update a load (dispatch)
 */
export async function updateDispatchLoadAction(
  orgId: string,
  loadId: string,
  formData: FormData,
): Promise<LoadActionResult<{ id: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user || !canManageLoadsAndDispatch(user)) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = user.userId;
    const parsed = loadInputSchema.partial().parse(Object.fromEntries(formData));
    const data: Record<string, any> = {};
    if (parsed.customer_id !== undefined) data.customerId = parsed.customer_id;
    if (parsed.driver_id !== undefined) data.driver_id = parsed.driver_id;
    if (parsed.vehicle_id !== undefined) data.vehicleId = parsed.vehicle_id;
    if (parsed.trailer_id !== undefined) data.trailerId = parsed.trailer_id;
    if (parsed.origin_address !== undefined) data.originAddress = parsed.origin_address;
    if (parsed.origin_city !== undefined) data.originCity = parsed.origin_city;
    if (parsed.origin_state !== undefined) data.originState = parsed.origin_state;
    if (parsed.origin_zip !== undefined) data.originZip = parsed.origin_zip;
    if (parsed.destination_address !== undefined) data.destinationAddress = parsed.destination_address;
    if (parsed.destination_city !== undefined) data.destinationCity = parsed.destination_city;
    if (parsed.destination_state !== undefined) data.destinationState = parsed.destination_state;
    if (parsed.destination_zip !== undefined) data.destinationZip = parsed.destination_zip;
    if (parsed.scheduled_pickup_date !== undefined)
      data.scheduledPickupDate = parsed.scheduled_pickup_date ? new Date(parsed.scheduled_pickup_date) : null;
    if (parsed.scheduled_delivery_date !== undefined)
      data.scheduledDeliveryDate = parsed.scheduled_delivery_date ? new Date(parsed.scheduled_delivery_date) : null;
    if (parsed.notes !== undefined) data.notes = parsed.notes;
    if (parsed.status !== undefined) data.status = parsed.status;
    data['lastModifiedBy'] = userId;
    data['updatedAt'] = new Date();

    const load = await db.load.update({
      where: { id: loadId, organizationId: orgId },
      data,
    });

    await db.dispatchActivity.create({
      data: {
        organizationId: orgId,
        entityType: 'load',
        action: 'update',
        entityId: loadId,
        userName: userId,
        timestamp: new Date(),
      },
    });

    // Ensure all dispatch board pages show the latest data
    revalidatePath(`/${orgId}/dispatch`, 'layout');
    return { success: true, data: { id: loadId } };
  } catch (error) {
    return handleError(error, 'Update Dispatch Load') as LoadActionResult<{ id: string }>;
  }
}

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
