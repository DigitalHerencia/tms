'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/database/db';
import { handleError } from '@/lib/errors/handleError';
import { loadInputSchema } from '@/schemas/dispatch';
import type { LoadStatus, LoadActionResult } from '@/types/dispatch';

/**
 * Create a new load (dispatch)
 */
export async function createDispatchLoadAction(
  orgId: string,
  formData: FormData,
): Promise<LoadActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const parsed = loadInputSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid data',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const {
      load_number: loadNumber,
      origin_address: originAddress,
      origin_city: originCity,
      origin_state: originState,
      origin_zip: originZip,
      destination_address: destinationAddress,
      destination_city: destinationCity,
      destination_state: destinationState,
      destination_zip: destinationZip,
      customer_id: customerId,
      driver_id: driverId,
      vehicle_id: vehicleId,
      trailer_id: trailerId,
      scheduled_pickup_date: pickup,
      scheduled_delivery_date: delivery,
      notes,
    } = parsed.data;

    const scheduledPickupDate = pickup ? new Date(pickup) : null;
    const scheduledDeliveryDate = delivery ? new Date(delivery) : null;

    const load = await db.load.create({
      data: {
        organizationId: orgId,
        loadNumber,
        originAddress,
        originCity,
        originState,
        originZip,
        destinationAddress,
        destinationCity,
        destinationState,
        destinationZip,
        customerId: customerId || null,
        driver_id: driverId,
        vehicleId: vehicleId || null,
        trailerId: trailerId || null,
        scheduledPickupDate,
        scheduledDeliveryDate,
        notes,
        status: 'pending',
        createdBy: userId,
      },
    });

    revalidatePath(`/${orgId}/loads`);
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
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const parsed = loadInputSchema.partial().safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid data',
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const {
      customer_id,
      driver_id,
      vehicle_id,
      trailer_id,
      origin_address,
      origin_city,
      origin_state,
      origin_zip,
      destination_address,
      destination_city,
      destination_state,
      destination_zip,
      scheduled_pickup_date,
      scheduled_delivery_date,
      notes,
      status,
    } = parsed.data;

    const data: Record<string, any> = {};

    if (customer_id !== undefined) data.customerId = customer_id;
    if (driver_id !== undefined) data.driver_id = driver_id;
    if (vehicle_id !== undefined) data.vehicleId = vehicle_id;
    if (trailer_id !== undefined) data.trailerId = trailer_id;
    if (origin_address !== undefined) data.originAddress = origin_address;
    if (origin_city !== undefined) data.originCity = origin_city;
    if (origin_state !== undefined) data.originState = origin_state;
    if (origin_zip !== undefined) data.originZip = origin_zip;
    if (destination_address !== undefined) data.destinationAddress = destination_address;
    if (destination_city !== undefined) data.destinationCity = destination_city;
    if (destination_state !== undefined) data.destinationState = destination_state;
    if (destination_zip !== undefined) data.destinationZip = destination_zip;
    if (scheduled_pickup_date !== undefined)
      data.scheduledPickupDate = scheduled_pickup_date ? new Date(scheduled_pickup_date) : null;
    if (scheduled_delivery_date !== undefined)
      data.scheduledDeliveryDate = scheduled_delivery_date ? new Date(scheduled_delivery_date) : null;
    if (notes !== undefined) data.notes = notes;
    if (status !== undefined) data.status = status;

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
