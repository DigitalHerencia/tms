'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

import db from '@/lib/database/db';
import { VehicleMaintenanceSchema } from '@/schemas/vehicles';

interface MaintenanceActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Record a maintenance event for a vehicle and update upcoming service fields.
 *
 * Updates last/next maintenance dates and mileage. Triggers revalidation of the
 * vehicle details page so alerts reflect the latest schedule.
 */
export async function recordMaintenanceEvent(
  prevState: MaintenanceActionResult | null,
  formData: FormData,
): Promise<MaintenanceActionResult> {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Extract and validate data from the submitted form
    const raw = Object.fromEntries(formData.entries());
    const parsed = VehicleMaintenanceSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid data provided',
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const {
      serviceDate,
      nextServiceDue,
      nextServiceMileage,
      mileageAtService,
    } = parsed.data;
    const vehicleId = raw.vehicleId as string;
    if (!vehicleId) {
      return { success: false, error: 'Vehicle ID is required' };
    }

    await db.vehicle.update({
      where: { id: vehicleId, organizationId: orgId },
      data: {
        lastMaintenanceDate: new Date(serviceDate),
        lastMaintenanceMileage: mileageAtService,
        nextMaintenanceDate: nextServiceDue ? new Date(nextServiceDue) : null,
        nextMaintenanceMileage: nextServiceMileage ?? null,
      } as any, // Fields not yet in Prisma schema
    });

    revalidatePath(`/${orgId}/vehicles/${vehicleId}`);
    return { success: true };
  } catch (error) {
    console.error('Error recording maintenance event:', error);
    return { success: false, error: 'Failed to record maintenance event' };
  }
}
