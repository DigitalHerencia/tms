'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import db from '@/lib/database/db';
import { handleError } from '@/lib/errors/handleError';
import type { DashboardActionResult } from '@/types/dashboard';

const tripLogSchema = z.object({
  date: z.string(),
  vehicleId: z.string(),
  loadId: z.string().optional(),
  jurisdiction: z.string(),
  distance: z.coerce.number().positive(),
});

export async function logTripAction(
  orgId: string,
  formData: FormData,
): Promise<DashboardActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const parsed = tripLogSchema.parse(Object.fromEntries(formData));

    let startLocation: string | null = null;
    let endLocation: string | null = null;

    if (parsed.loadId) {
      const load = await db.load.findFirst({
        where: { id: parsed.loadId, organizationId: orgId },
        select: {
          originCity: true,
          originState: true,
          destinationCity: true,
          destinationState: true,
        },
      });
      if (load) {
        startLocation = `${load.originCity}, ${load.originState}`;
        endLocation = `${load.destinationCity}, ${load.destinationState}`;
      }
    }

    const trip = await db.iftaTrip.create({
      data: {
        organizationId: orgId,
        vehicleId: parsed.vehicleId,
        date: new Date(parsed.date),
        distance: parsed.distance,
        jurisdiction: parsed.jurisdiction,
        startLocation,
        endLocation,
        notes: parsed.loadId ? `Load: ${parsed.loadId}` : undefined,
      },
      select: { id: true },
    });

    revalidatePath(`/${orgId}/ifta`);
    return { success: true, data: { id: trip.id } };
  } catch (error) {
    return handleError(error, 'Log IFTA trip') as DashboardActionResult<{ id: string }>;
  }
}
