"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/database/db";
import { handleError } from "@/lib/errors/handleError";
import { loadInputSchema } from "@/schemas/dispatch";
import type { DashboardActionResult } from "@/types/dashboard";

/**
 * Create a load
 */
export async function createLoadAction(
  orgId: string,
  formData: FormData
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Validate input data
    const parsed = loadInputSchema.parse(Object.fromEntries(formData));

    const loadNumber = parsed.load_number;
    const originAddress = parsed.origin_address;
    const originCity = parsed.origin_city;
    const originState = parsed.origin_state;
    const originZip = parsed.origin_zip;
    const destinationAddress = parsed.destination_address;
    const destinationCity = parsed.destination_city;
    const destinationState = parsed.destination_state;
    const destinationZip = parsed.destination_zip;

    const customerId = parsed.customer_id ?? undefined;
    const driverId = parsed.driver_id ?? undefined;
    const vehicleId = parsed.vehicle_id ?? undefined;
    const trailerId = parsed.trailer_id ?? undefined;
    const scheduledPickupDate = parsed.scheduled_pickup_date
      ? new Date(parsed.scheduled_pickup_date)
      : null;
    const scheduledDeliveryDate = parsed.scheduled_delivery_date
      ? new Date(parsed.scheduled_delivery_date)
      : null;
    const notes = parsed.notes ?? null;

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
        customerId: customerId,
        driver_id: driverId,
        vehicleId: vehicleId,
        trailerId: trailerId,
        scheduledPickupDate,
        scheduledDeliveryDate,
        notes,
        status: "pending",
        createdBy: userId,
      },
    });

    revalidatePath(`/${orgId}/loads`);
    return { success: true, data: { id: load.id } };
  } catch (error) {
    return handleError(error, "Create Load");
  }
}

/**
 * Update a load
 */
export async function updateLoadAction(
  orgId: string,
  loadId: string,
  formData: FormData
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const parsed = loadInputSchema
      .partial()
      .parse(Object.fromEntries(formData));

    const data: Record<string, any> = {};

    if (parsed.customer_id !== undefined) data.customer_id = parsed.customer_id;
    if (parsed.driver_id !== undefined) data.driver_id = parsed.driver_id;
    if (parsed.vehicle_id !== undefined) data.vehicle_id = parsed.vehicle_id;
    if (parsed.trailer_id !== undefined) data.trailer_id = parsed.trailer_id;
    if (parsed.origin_address !== undefined)
      data.origin_address = parsed.origin_address;
    if (parsed.destination_address !== undefined)
      data.destination_address = parsed.destination_address;
    if (parsed.scheduled_pickup_date !== undefined)
      data.scheduled_pickup_date = parsed.scheduled_pickup_date
        ? new Date(parsed.scheduled_pickup_date)
        : null;
    if (parsed.scheduled_delivery_date !== undefined)
      data.scheduled_delivery_date = parsed.scheduled_delivery_date
        ? new Date(parsed.scheduled_delivery_date)
        : null;
    if (parsed.notes !== undefined) data.notes = parsed.notes;
    if (parsed.status !== undefined) data.status = parsed.status;

    data["lastModifiedBy"] = userId;
    data["updatedAt"] = new Date();

    const load = await db.load.update({
      where: { id: loadId, organizationId: orgId },
      data,
    });

    revalidatePath(`/${orgId}/loads`);
    return { success: true, data: { id: loadId } };
  } catch (error) {
    return handleError(error, "Update Load");
  }
}

/**
 * Delete a load
 */
export async function deleteLoadAction(
  orgId: string,
  loadId: string
): Promise<DashboardActionResult<null>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    await db.load.delete({
      where: { id: loadId, organizationId: orgId },
    });

    revalidatePath(`/${orgId}/loads`);
    return { success: true, data: null };
  } catch (error) {
    return handleError(error, "Delete Load");
  }
}

/**
 * Assign vehicle to load
 */
export async function assignVehicleToLoadAction(
  orgId: string,
  loadId: string,
  vehicleId: string
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const load = await db.load.update({
      where: { id: loadId, organizationId: orgId },
      data: {
        vehicleId,
        lastModifiedBy: userId,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/${orgId}/loads`);
    return { success: true, data: { id: loadId } };
  } catch (error) {
    return handleError(error, "Assign Vehicle to Load");
  }
}

/**
 * Assign trailer to load
 */
export async function assignTrailerToLoadAction(
  orgId: string,
  loadId: string,
  trailerId: string
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const load = await db.load.update({
      where: { id: loadId, organizationId: orgId },
      data: {
        trailerId,
        lastModifiedBy: userId,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/${orgId}/loads`);
    return { success: true, data: { id: loadId } };
  } catch (error) {
    return handleError(error, "Assign Trailer to Load");
  }
}
