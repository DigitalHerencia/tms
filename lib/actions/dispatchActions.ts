'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/database/db';
import { handleError } from '@/lib/errors/handleError';
import { loadInputSchema } from '@/schemas/dispatch';
import type { DashboardActionResult } from '@/types/dashboard';
import type { LoadStatus } from '@/types/dispatch';

/**
 * Create a new load (dispatch)
 */
export async function createDispatchLoadAction(
  orgId: string,
  formData: FormData,
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };
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
    return handleError(error, 'Create Load');
  }
}

/**
 * Update a load (dispatch)
 */
export async function updateDispatchLoadAction(
  orgId: string,
  loadId: string,
  formData: FormData,
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };
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

    revalidatePath(`/${orgId}/dispatch`);
    return { success: true, data: { id: loadId } };
  } catch (error) {
    return handleError(error, 'Update Dispatch Load');
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
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

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

    revalidatePath(`/${orgId}/dispatch`);
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
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const load = await db.load.update({
      where: { id: loadId, organizationId: orgId },
      data: {
        driver_id: driverId,
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

    revalidatePath(`/${orgId}/dispatch`);
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
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

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

    revalidatePath(`/${orgId}/dispatch`);
    return { success: true, data: { id: loadId } };
  } catch (error) {
    return handleError(error, 'Update Load Status');
  }
}
