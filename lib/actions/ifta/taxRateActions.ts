'use server';

import { auth } from '@clerk/nextjs/server';
import { updateJurisdictionTaxRate } from '@/lib/fetchers/iftaFetchers';

export async function updateTaxRatesAction(
  orgId: string,
  rates: Record<string, number>,
) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await Promise.all(
      Object.entries(rates).map(([jurisdiction, rate]) =>
        updateJurisdictionTaxRate(orgId, jurisdiction, rate, new Date(), userId),
      ),
    );
    return { success: true };
  } catch (error) {
    console.error('Failed to update tax rates', error);
    return { success: false, error: 'Failed to update tax rates' };
  }
}
