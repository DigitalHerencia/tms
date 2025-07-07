import { Suspense } from 'react';
import { DocumentUploadForm } from '@/components/compliance/DocumentUploadForm';

interface MobileCompliancePageProps {
  params: Promise<{ orgId: string }>;
}

export default async function MobileCompliancePage({ params }: MobileCompliancePageProps) {
  const { orgId } = await params;
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Upload Compliance Document</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DocumentUploadForm onUpload={() => {}} entityType="company" entityId={orgId} />
      </Suspense>
    </div>
  );
}
