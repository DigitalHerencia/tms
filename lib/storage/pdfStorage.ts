import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

/**
 * Upload PDF bytes to the configured storage provider.
 * Returns a public download URL.
 */
export async function uploadPDF(
  bytes: Uint8Array,
  fileName: string,
  orgId?: string
): Promise<string> {
  const provider = process.env.PDF_STORAGE_PROVIDER || 'local'

  if (provider === 's3') {
    const bucket = process.env.S3_BUCKET as string
    const region = process.env.S3_REGION as string
    const client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
      endpoint: process.env.S3_ENDPOINT,
    })
    const key = orgId ? `${orgId}/${fileName}` : fileName
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: bytes,
        ContentType: 'application/pdf',
      })
    )
    const baseUrl =
      process.env.S3_PUBLIC_URL ?? `https://${bucket}.s3.${region}.amazonaws.com`
    return `${baseUrl}/${key}`
  }

  // Local storage fallback for development
  const dir = path.join(process.cwd(), 'uploads', 'ifta-pdfs', orgId ?? '')
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
  const filePath = path.join(dir, fileName)
  await writeFile(filePath, bytes)
  return filePath
}
