'use client';

import React, { useRef, useState } from 'react';
import { put } from '@vercel/blob/client';
import type { ComplianceDocument } from "@/types/compliance";
import {
  saveUploadedDocument,
  getSignedUploadToken,
} from '@/lib/actions/fileUploadActions';

type EntityType = 'driver' | 'vehicle' | 'trailer' | 'company';

interface DocumentUploadFormProps {
  onUpload: (file: File, metadata: any) => void;
  entityType: EntityType;
  entityId: string;
  documentType?: string;
}

export function DocumentUploadForm({
  onUpload,
  entityType,
  entityId,
  documentType = 'other',
}: DocumentUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type/size (example: max 10MB, PDF/JPG/PNG)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return;
    }
    if (!/\.(pdf|jpg|jpeg|png)$/i.test(file.name)) {
      setError('Invalid file type. Only PDF, JPG, PNG allowed.');
      return;
    }
    setUploading(true);
    try {
      const tokenRes = await getSignedUploadToken(file.name);
      if (!tokenRes.success || !('token' in tokenRes) || !tokenRes.token) {
        const errMsg =
          'error' in tokenRes && tokenRes.error
            ? tokenRes.error
            : 'Failed to get upload token';
        setError(errMsg);
        return;
      }
      const { token, pathname } = tokenRes as {
        token: string;
        pathname: string;
        success: true;
      };

      const { url } = await put(pathname, file, { access: 'public', token });

      const result = await saveUploadedDocument({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        url,
        entityType,
        entityId,
        documentType,
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean),
      });
      if (result.success && 'data' in result) {
        onUpload(file, result.data);
      } else if ('error' in result) {
        setError(result.error || 'Upload failed');
      } else {
        setError('Upload failed');
      }
    } catch (err) {
      setError('Upload error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        className="rounded-md border p-2 text-black"
      />
      {uploading && <span>Uploading...</span>}
      {error && <span className="text-red-500">{error}</span>}
    </form>
  );
}
