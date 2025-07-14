import { DriversSkeleton } from '@/components/drivers/drivers-skeleton';
import { Suspense } from 'react';
import DriversListHeader from '@/components/drivers/drivers-list-header';
import DriversList from '@/features/drivers/DriversList';

// Next.js 15 async params pattern
interface PageProps {
  params: Promise<{ orgId: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function DriverListPage({ params, searchParams }: PageProps) {
  const { orgId } = await params;
  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 text-white min-h-screen">
      {/* Drivers List Header */}
      <Suspense fallback={<DriversSkeleton />}>
        <DriversListHeader />
      </Suspense>

      {/* Driver Tabs */}
      <Suspense fallback={<DriversSkeleton />}>
        <DriversList orgId={orgId} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}


