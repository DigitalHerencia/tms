import { DriversSkeleton } from '@/components/drivers/drivers-skeleton';
import { Suspense } from 'react';
import DriversListHeader from '@/components/drivers/drivers-list-header';
import DriversList from '@/features/drivers/DriversList';
import { PageLayout } from '@/components/shared/PageLayout';

// Next.js 15 async params pattern
interface PageProps {
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DriverListPage({ params, searchParams }: PageProps) {
  const { orgId } = await params;
  const resolvedSearchParams = await searchParams;
  return (
    <PageLayout>
      {/* Drivers List Header */}
      <Suspense fallback={<DriversSkeleton />}>
        <DriversListHeader />
      </Suspense>

      {/* Driver Tabs */}
      <Suspense fallback={<DriversSkeleton />}>
        <DriversList orgId={orgId} searchParams={resolvedSearchParams} />
      </Suspense>
    </PageLayout>
  );
}


