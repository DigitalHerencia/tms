'use client';

import { useEffect, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DocumentUploadForm } from '@/components/compliance/DocumentUploadForm';
import { getDocuments } from '@/lib/actions/compliance/documentActions';
import type { ComplianceDocument } from '@/types/compliance';

interface DocumentManagerFeatureProps {
  orgId: string;
}

/**
 * Client component allowing users to upload compliance documents
 * with metadata tagging and view their status/expiration reminders.
 */
export function DocumentManagerFeature({ orgId }: DocumentManagerFeatureProps) {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);

  useEffect(() => {
    async function loadDocs() {
      const res = await getDocuments();
      if (res.success && 'data' in res) {
        setDocuments(res.data as ComplianceDocument[]);
      }
    }
    loadDocs();
  }, []);

  function handleUpload(_file: File, doc: ComplianceDocument) {
    setDocuments((prev) => [doc, ...prev]);
  }

  function statusBadge(doc: ComplianceDocument) {
    if (doc.expirationDate) {
      const days = differenceInCalendarDays(new Date(doc.expirationDate), new Date());
      if (days < 0) return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      if (days <= 30) return <Badge className="bg-amber-100 text-amber-800">Expiring</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
  }

  function expirationText(doc: ComplianceDocument) {
    if (!doc.expirationDate) return null;
    const days = differenceInCalendarDays(new Date(doc.expirationDate), new Date());
    if (days < 0) return <span className="text-red-600">Expired {-days} days ago</span>;
    return <span>Expires in {days} days</span>;
  }

  return (
    <div className="space-y-6">
      <DocumentUploadForm
        entityType="company"
        entityId={orgId}
        onUpload={handleUpload}
      />
      <ul className="space-y-4">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex flex-col gap-2 rounded-md border p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-medium">{doc.title || doc.name}</p>
              <div className="text-sm text-muted-foreground">{expirationText(doc)}</div>
              {doc.tags && doc.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {doc.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {statusBadge(doc)}
          </li>
        ))}
        {documents.length === 0 && (
          <li className="text-sm text-muted-foreground">No documents uploaded.</li>
        )}
      </ul>
    </div>
  );
}

