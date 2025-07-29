'use client';

import { FileText, Download, Eye, MoreHorizontal } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { ComplianceDocument } from '@/types/compliance';
import { DocumentUpload, DocumentListEmpty } from '@/components/shared/DocumentUpload';

// Define the Document type
interface Document {
  id: string;
  name: string;
  type: string;
  lastUpdated: string;
  status: string;
  assignedTo: string;
}

// Export the columns definition
export const columns: ColumnDef<ComplianceDocument>[] = [
  {
    accessorKey: 'name',
    header: 'Document Name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <FileText className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return <Badge variant={type === 'Required' ? 'default' : 'outline'}>{type}</Badge>;
    },
  },
  {
    accessorKey: 'lastUpdated',
    header: 'Last Updated',
    cell: ({ row }) => {
      return <div>{new Date(row.getValue('lastUpdated')).toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          className={
            status === 'Complete'
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>Update Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface ComplianceDocumentsProps {
  orgId: string;
  documents?: ComplianceDocument[]; // Made optional with default
}

// Update the component to accept documents as a prop
export function ComplianceDocuments({ orgId, documents = [] }: ComplianceDocumentsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Compliance Documents</h2>
        <DocumentUpload label="Upload Document" description="Add compliance documents" />
      </div>

      {/* Document list would go here */}
      <div className="grid gap-4">
        {documents.length === 0 ? (
          <div className="space-y-2">
            <DocumentListEmpty />
            <div className="text-sm text-muted-foreground">Organization: {orgId}</div>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-md border p-4">
              <div className="flex items-center gap-2">
                <FileText className="text-muted-foreground h-5 w-5" />
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    doc.status === 'valid'
                      ? 'bg-green-100 text-green-800'
                      : doc.status === 'expiring'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                  }
                >
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </Badge>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
