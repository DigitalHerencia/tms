'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/database/db';
import type { GlobalSearchResultItem } from '@/types/search';

export async function globalSearch(
  orgId: string,
  query: string
): Promise<GlobalSearchResultItem[]> {
  const { userId } = await auth();
  if (!userId || !orgId || !query.trim()) return [];

  const term = query.trim();
  const [vehicles, drivers] = await Promise.all([
    prisma.vehicle.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { unitNumber: { contains: term, mode: 'insensitive' } },
          { vin: { contains: term, mode: 'insensitive' } },
          { make: { contains: term, mode: 'insensitive' } },
          { model: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: 5,
      orderBy: { unitNumber: 'asc' },
    }),
    prisma.driver.findMany({
      where: {
        organizationId: orgId,
        OR: [
          { firstName: { contains: term, mode: 'insensitive' } },
          { lastName: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
          { phone: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: 5,
      orderBy: { lastName: 'asc' },
    }),
  ]);

  const results: GlobalSearchResultItem[] = [
    ...vehicles.map(v => ({
      id: v.id,
      type: 'vehicle' as const,
      label: v.unitNumber || v.vin || 'Vehicle',
      url: `/${orgId}/vehicles/${v.id}`,
    })),
    ...drivers.map(d => ({
      id: d.id,
      type: 'driver' as const,
      label: `${d.firstName} ${d.lastName}`.trim(),
      url: `/${orgId}/drivers/${d.id}`,
    })),
  ];

  return results;
}
