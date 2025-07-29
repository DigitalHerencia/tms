
import { DriverFormFeature } from '@/features/drivers/DriverFormFeature';
import { DriversSkeleton } from '@/components/drivers/drivers-skeleton';
import { Suspense } from 'react';
import DriversListHeader from '@/components/drivers/drivers-list-header';
import { getDriverById } from '@/lib/fetchers/driverFetchers';
import { PageLayout } from '@/components/shared/PageLayout';

interface PageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

export default async function EditDriversPage({ params }: PageProps) {
  const { orgId, userId } = await params;
  const driver = await getDriverById(userId, orgId);

  // Optionally, you could show a not found or error UI if driver is null

  return (
    <PageLayout>
      {/* Drivers List Header */}
      <Suspense fallback={<DriversSkeleton />}>
        <DriversListHeader />
      </Suspense>

      {/* Driver Form Container */}
      <div className="max-w-4xl mx-auto w-full">
        <Suspense fallback={<DriversSkeleton />}>
          <DriverFormFeature orgId={orgId} userId={userId} mode="edit" />
        </Suspense>
      </div>
    </PageLayout>
  );
}



