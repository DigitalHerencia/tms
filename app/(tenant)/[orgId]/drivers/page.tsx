import { DriverListSkeleton } from '@/components/drivers/driver-list-skeleton';
import { Suspense } from 'react';
import DriversListHeader from '@/components/drivers/drivers-list-header';
import DriversList from '@/features/drivers/DriversList';

// Next.js 15 async params pattern
interface PageProps {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DriverListPage({ params, searchParams }: PageProps) {
  const { orgId } = await params;
  const resolvedSearchParams = await searchParams;
  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
      {/* Drivers List Header */}
      <Suspense fallback={<DriverListSkeleton />}>
        <DriversListHeader />
      </Suspense>

      {/* Driver Tabs */}
      <Suspense fallback={<DriverListSkeleton />}>
        <DriversList orgId={orgId} searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}


