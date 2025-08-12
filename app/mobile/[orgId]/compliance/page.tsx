import { Suspense } from 'react';
import { DocumentManagerFeature } from '@/features/compliance/DocumentManagerFeature';

interface MobileCompliancePageProps {
  params: Promise<{ orgId: string }>;
}

export default async function MobileCompliancePage({ params }: MobileCompliancePageProps) {
  const { orgId } = (await params) ?? {};
  if (!orgId) throw new Error('Missing orgId param');
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Upload Compliance Document</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DocumentManagerFeature orgId={orgId} />
      </Suspense>
    </div>
  );
}
