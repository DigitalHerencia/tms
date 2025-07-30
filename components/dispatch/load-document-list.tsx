'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import type { Document } from '@/types/dispatch';
import { Button } from '@/components/ui/button';
import { deleteLoadDocument } from '@/lib/actions/documentActions';

interface LoadDocumentListProps {
  orgId: string;
  documents: Document[];
  refresh: () => void;
}

export function LoadDocumentList({ orgId, documents, refresh }: LoadDocumentListProps) {
  const [isPending, start] = useTransition();

  const handleDelete = (id: string) => {
    start(async () => {
      await deleteLoadDocument(orgId, id);
      refresh();
    });
  };

  if (documents.length === 0) {
    return <p className="text-sm text-gray-400">No documents uploaded.</p>;
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc) => (
        <li key={doc.id} className="flex items-center justify-between rounded border p-2">
          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline">
            {doc.name}
          </a>
          <Button size="icon" variant="ghost" onClick={() => handleDelete(doc.id)} disabled={isPending}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
