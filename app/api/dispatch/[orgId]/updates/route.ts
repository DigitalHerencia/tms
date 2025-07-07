import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/database/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const { userId } = await auth();
  const { orgId } = params;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const since = request.nextUrl.searchParams.get('since');
  try {
    const events = await db.loadStatusEvent.findMany({
      where: {
        load: { organizationId: orgId },
        ...(since ? { timestamp: { gt: new Date(since) } } : {}),
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

    return NextResponse.json({ updates });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}
