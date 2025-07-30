'use client';

import { useRef, useState } from 'react';
import { put } from '@vercel/blob/client';
import { Button } from '@/components/ui/button';
import { getSignedUploadToken } from '@/lib/actions/fileUploadActions';
import { saveLoadDocument } from '@/lib/actions/documentActions';
import type { Document } from '@/types/dispatch';

interface LoadDocumentUploadFormProps {
  orgId: string;
  loadId: string;
  onUploaded: (doc: Document) => void;
}

export function LoadDocumentUploadForm({ orgId, loadId, onUploaded }: LoadDocumentUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return;
    }

    setUploading(true);
    try {
      const tokenRes = await getSignedUploadToken(file.name);
      if (!tokenRes.success || !('token' in tokenRes) || !tokenRes.token) {
        const msg = 'error' in tokenRes && tokenRes.error ? tokenRes.error : 'Failed to get upload token';
        setError(msg);
        return;
      }
      const { token, pathname } = tokenRes as { token: string; pathname: string; success: true };
      const { url } = await put(pathname, file, { access: 'public', token });
      const res = await saveLoadDocument({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        url,
        loadId,
      });
      if (res.success && 'data' in res) {
        onUploaded(res.data as Document);
        if (inputRef.current) inputRef.current.value = '';
      } else {
        setError('error' in res && res.error ? res.error : 'Upload failed');
      }
    } catch (err) {
      setError('Upload error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input ref={inputRef} type="file" onChange={handleChange} disabled={uploading} />
      {uploading && <span>Uploading...</span>}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
