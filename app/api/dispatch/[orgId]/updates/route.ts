import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import db from '@/lib/database/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
) {
  const { orgId } = await params;
  const { userId } = await auth();
  const headers = { 'Cache-Control': 'no-store' } as const;
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers },
    );
  }

  try {
    const since = request.nextUrl.searchParams.get('since');
    const events = await db.loadStatusEvent.findMany({
      where: {
        load: { organizationId: orgId },
        ...(since ? { timestamp: { gt: new Date(since) } } : {}),
      },
      orderBy: { timestamp: 'asc' },
      take: 20,
    });

    interface StatusChangeUpdate {
      type: 'status_change';
      data: {
        loadId: string;
        newStatus: string;
        timestamp: Date;
      };
    }

    interface LoadStatusEvent {
      loadId: string;
      status: string;
      timestamp: Date;
    }

    const updates: StatusChangeUpdate[] = events.map((e: LoadStatusEvent) => ({
      type: 'status_change',
      data: {
        loadId: e.loadId,
        newStatus: e.status,
        timestamp: e.timestamp,
      },
    }));

    return NextResponse.json({ updates }, { headers });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch updates' },
      { status: 500, headers },
    );
  }
}
