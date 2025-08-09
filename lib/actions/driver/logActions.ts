'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import db from '@/lib/database/db';
import { handleError } from '@/lib/errors/handleError';

const logSchema = z.object({
  driverId: z.string().min(1),
  note: z.string().min(1),
  receiptUrl: z.string().url(),
});

export async function createDriverLog(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Authentication required' };
    }

    const data = logSchema.parse({
      driverId: formData.get('driverId'),
      note: formData.get('note'),
      receiptUrl: formData.get('receiptUrl'),
    });

    await db.driverLog.create({
      data: {
        driverId: data.driverId,
        note: data.note,
        receiptUrl: data.receiptUrl,
      },
    });

    revalidatePath(`/drivers/${data.driverId}/logs`, 'page');

    return { success: true };
  } catch (error) {
    return handleError(error, 'Create Driver Log');
  }
}
