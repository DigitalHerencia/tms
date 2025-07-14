import { auth } from '@clerk/nextjs/server';
import db from '@/lib/database/db';

export async function GET(
{
    params,
}: {
    params: Promise<{ orgId: string }>
}) {
    const { orgId } = await params
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  try {
    const events = await db.loadStatusEvent.findMany({
      where: {
        load: { organizationId: orgId },
      },
      orderBy: { timestamp: 'asc' },
      take: 20,
    });

    const updates = events.map(e => ({
      type: 'status_change',
      data: {
        loadId: e.loadId,
        newStatus: e.status,
        timestamp: e.timestamp,
      },
    }));

    return { updates };
  } catch (error) {
    return { error: 'Failed to fetch updates' };
  }
}
