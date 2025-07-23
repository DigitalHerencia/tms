"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/database/db";
import { handleError } from "@/lib/errors/handleError";
// import { loadInputSchema } from '@/schemas/dispatch' // (stub for Zod validation)
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

    // Required fields
    const loadNumber        = formData.get("load_number") as string;
    const originAddress     = formData.get("origin_address") as string;
    const originCity        = formData.get("origin_city") as string;
    const originState       = formData.get("origin_state") as string;
    const originZip         = formData.get("origin_zip") as string;
    const destinationAddress= formData.get("destination_address") as string;
    const destinationCity   = formData.get("destination_city") as string;
    const destinationState  = formData.get("destination_state") as string;
    const destinationZip    = formData.get("destination_zip") as string;

    // Optional/nullable fields
    const customerId           = formData.get("customer_id") as string;
    const driverId             = formData.get("driver_id") as string;
    const vehicleId            = formData.get("vehicle_id") as string;
    const trailerId            = formData.get("trailer_id") as string; 
    const scheduledPickupDate  = formData.get("scheduled_pickup_date") ? new Date(formData.get("scheduled_pickup_date") as string) : null;
    const scheduledDeliveryDate= formData.get("scheduled_delivery_date") ? new Date(formData.get("scheduled_delivery_date") as string) : null;
    const notes                = formData.get("notes") as string | null;

    // If you need to default/validate, do it here.

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

    const data: Record<string, any> = {};
    [
      "customer_id",
      "driver_id",
      "vehicle_id",
      "trailer_id",
      "origin_address",
      "destination_address",
      "scheduled_pickup_date",
      "scheduled_delivery_date",
      "notes",
      "status",
    ].forEach((key) => {
      const val = formData.get(key);
      if (val !== null && val !== undefined) {
        if (
          ["scheduled_pickup_date", "scheduled_delivery_date"].includes(key)
        ) {
          data[key] = val ? new Date(val as string) : null;
        } else {
          data[key] = val;
        }
      }
    });

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
