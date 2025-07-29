'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/database/db';
import { handleError } from '@/lib/errors/handleError';
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

    // Required fields (schema-accurate)
    const loadNumber = formData.get('load_number') as string;
    const originAddress = formData.get('origin_address') as string;
    const originCity = formData.get('origin_city') as string;
    const originState = formData.get('origin_state') as string;
    const originZip = formData.get('origin_zip') as string;
    const destinationAddress = formData.get('destination_address') as string;
    const destinationCity = formData.get('destination_city') as string;
    const destinationState = formData.get('destination_state') as string;
    const destinationZip = formData.get('destination_zip') as string;

    // Optionals/nullable
    const customerId = formData.get('customer_id') as string | null;
    const driverId = formData.get('driver_id') as string;
    const vehicleId = formData.get('vehicle_id') as string | null;
    const trailerId = formData.get('trailer_id') as string | null;
    const scheduledPickupDate = formData.get('scheduled_pickup_date')
      ? new Date(formData.get('scheduled_pickup_date') as string)
      : null;
    const scheduledDeliveryDate = formData.get('scheduled_delivery_date')
      ? new Date(formData.get('scheduled_delivery_date') as string)
      : null;
    const notes = formData.get('notes') as string | null;

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

    // Only update fields present in the schema
    const data: Record<string, any> = {};

    [
      'customer_id',
      'driver_id',
      'vehicle_id',
      'trailer_id',
      'origin_address',
      'origin_city',
      'origin_state',
      'origin_zip',
      'destination_address',
      'destination_city',
      'destination_state',
      'destination_zip',
      'scheduled_pickup_date',
      'scheduled_delivery_date',
      'notes',
      'status',
    ].forEach((key) => {
      const val = formData.get(key);
      if (val !== null && val !== undefined) {
        // Handle dates
        if (['scheduled_pickup_date', 'scheduled_delivery_date'].includes(key)) {
          const schemaKey =
            key === 'scheduled_pickup_date' ? 'scheduledPickupDate' : 'scheduledDeliveryDate';
          data[schemaKey] = val ? new Date(val as string) : null;
        } else if (key.endsWith('_id')) {
          // Map field to schema field
          const schemaKey =
            key === 'customer_id'
              ? 'customerId'
              : key === 'driver_id'
                ? 'driver_id'
                : key === 'vehicle_id'
                  ? 'vehicleId'
                  : key === 'trailer_id'
                    ? 'trailerId'
                    : key;
          data[schemaKey] = val;
        } else if (
          [
            'origin_address',
            'origin_city',
            'origin_state',
            'origin_zip',
            'destination_address',
            'destination_city',
            'destination_state',
            'destination_zip',
          ].includes(key)
        ) {
          // Map form keys to schema fields
          const schemaKey =
            key === 'origin_address'
              ? 'originAddress'
              : key === 'origin_city'
                ? 'originCity'
                : key === 'origin_state'
                  ? 'originState'
                  : key === 'origin_zip'
                    ? 'originZip'
                    : key === 'destination_address'
                      ? 'destinationAddress'
                      : key === 'destination_city'
                        ? 'destinationCity'
                        : key === 'destination_state'
                          ? 'destinationState'
                          : key === 'destination_zip'
                            ? 'destinationZip'
                            : key;
          data[schemaKey] = val;
        } else {
          data[key] = val;
        }
      }
    });

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
