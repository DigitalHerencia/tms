'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';

interface ImageUploaderProps {
  onUpload?: (url: string) => void;
  className?: string;
}

export default function ImageUploader({ onUpload, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { url } = await upload(`${Date.now()}-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/files/upload',
      });
      onUpload?.(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      {preview && (
        <img
          src={preview}
          alt="Receipt preview"
          className="mb-2 h-40 w-full rounded object-cover"
        />
      )}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="text-sm"
        />
        {uploading && <span className="text-xs text-muted-foreground">Uploading...</span>}
      </div>
    </div>
  );
}

