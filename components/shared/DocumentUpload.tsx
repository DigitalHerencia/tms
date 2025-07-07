// Shared DocumentUpload component for document upload UI/logic reuse
import { FileText } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface DocumentUploadProps {
  label?: string;
  description?: string;
  onUpload?: () => void;
  buttonText?: string;
}

export function DocumentUpload({
  label = 'Upload Document',
  description = 'Add documents to keep track of important paperwork',
  onUpload,
  buttonText = 'Upload',
}: DocumentUploadProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h4 className="font-medium">{label}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Button variant="outline" onClick={onUpload} type="button">
        <FileText className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
}

// Shared DocumentList placeholder for empty state
export function DocumentListEmpty({
  message = 'No documents uploaded yet',
  subtext = 'Upload documents to keep track of important paperwork',
}) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-muted-foreground text-center">
        <FileText className="mx-auto mb-2 h-12 w-12 opacity-50" />
        <p>{message}</p>
        <p className="text-sm">{subtext}</p>
      </div>
    </div>
  );
}
