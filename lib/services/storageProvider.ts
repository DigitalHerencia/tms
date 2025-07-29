import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import pdfConfig from '../../config/pdf';

export interface StorageProvider {
  upload(fileName: string, data: Uint8Array, mimeType: string): Promise<string>;
}

export class LocalStorageProvider implements StorageProvider {
  constructor(private basePath: string = pdfConfig.storage.basePath) {}

  private async ensureDir() {
    if (!existsSync(this.basePath)) {
      await mkdir(this.basePath, { recursive: true });
    }
  }

  async upload(fileName: string, data: Uint8Array, _mimeType: string): Promise<string> {
    await this.ensureDir();
    const filePath = path.join(this.basePath, fileName);
    await writeFile(filePath, data);
    return filePath;
  }
}

export class S3StorageProvider implements StorageProvider {
  private client: S3Client;
  constructor(
    private bucket: string,
    private publicUrl: string,
    region: string,
  ) {
    this.client = new S3Client({ region });
  }

  async upload(fileName: string, data: Uint8Array, mimeType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: data,
        ContentType: mimeType,
        ACL: 'public-read',
      }),
    );
    return `${this.publicUrl}/${fileName}`;
  }
}

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || pdfConfig.storage.provider;
  if (provider === 's3') {
    const bucket = process.env.S3_BUCKET as string;
    const region = process.env.S3_REGION as string;
    const publicUrl = process.env.S3_PUBLIC_URL || `https://${bucket}.s3.${region}.amazonaws.com`;
    return new S3StorageProvider(bucket, publicUrl, region);
  }
  return new LocalStorageProvider();
}
