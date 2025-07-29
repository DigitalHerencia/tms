import { DriverFormFeature } from '@/features/drivers/DriverFormFeature';
import { DriversSkeleton } from '@/components/drivers/drivers-skeleton';
import { Suspense } from 'react';
import DriversListHeader from '@/components/drivers/drivers-list-header';
import type { DriverFormData } from '@/schemas/drivers';
import { PageLayout } from '@/components/shared/PageLayout';

// Next.js 15 async params pattern
interface PageProps {
  params: Promise<{ orgId: string }>;
  initialValues: DriverFormData;
}

export default async function NewDriversPage({ params }: PageProps) {
  const { orgId } = await params;

  return (
    <PageLayout>
      {/* Driver Form Container */}
      <div className="max-w-4xl mx-auto w-full">
        <Suspense fallback={<DriversSkeleton />}>
          <DriverFormFeature orgId={orgId} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
