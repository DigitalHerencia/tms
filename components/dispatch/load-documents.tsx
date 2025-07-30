'use client';

import { use, useState } from 'react';
import { LoadDocumentUploadForm } from './load-document-upload-form';
import { LoadDocumentList } from './load-document-list';
import { getLoadDocuments } from '@/lib/actions/documentActions';
import type { Document } from '@/types/dispatch';

interface LoadDocumentsProps {
  orgId: string;
  loadId: string;
}

export function LoadDocuments({ orgId, loadId }: LoadDocumentsProps) {
  const [docs, setDocs] = useState<Document[]>(() => {
    const res = use(getLoadDocuments(orgId, loadId));
    return res.success && 'data' in res ? (res.data as Document[]) : [];
  });

  const refresh = async () => {
    const res = await getLoadDocuments(orgId, loadId);
    if (res.success && 'data' in res) {
      setDocs(res.data as Document[]);
    }
  };

  return (
    <div className="space-y-4">
      <LoadDocumentUploadForm orgId={orgId} loadId={loadId} onUploaded={() => refresh()} />
      <LoadDocumentList orgId={orgId} documents={docs} refresh={refresh} />
    </div>
  );
}
