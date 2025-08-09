import { Suspense } from 'react';

import { PageLayout } from '@/components/shared/PageLayout';
import { AnalyticsOverviewFeature } from '@/features/analytics/AnalyticsOverviewFeature';

interface AnalyticsPageProps {
  params: Promise<{ orgId: string }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { orgId } = await params;

  return (
    <PageLayout>
      <Suspense fallback={<p>Loading analytics...</p>}>
        <AnalyticsOverviewFeature orgId={orgId} />
      </Suspense>
    </PageLayout>
  );
}

