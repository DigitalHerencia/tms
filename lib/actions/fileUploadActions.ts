'use server';

import { z } from 'zod';
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

import { getCurrentUser } from '@/lib/auth/auth';
import { handleError } from '@/lib/errors/handleError';

import db from '../database/db';

export const fileUploadSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().min(1),
  mimeType: z.string().min(1),
  url: z.string().url(),
  entityType: z.enum(['driver', 'vehicle', 'trailer', 'company']),
  entityId: z.string().min(1),
  documentType: z.string().min(1),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function saveUploadedDocument(data: z.infer<typeof fileUploadSchema>) {
  try {
    const user = await getCurrentUser();
    const userId = user?.userId;
    const orgId = user?.organizationId;
    if (!userId || !orgId) throw new Error('Unauthorized');
    const validated = fileUploadSchema.parse(data);
    // Archive any existing active document of the same type
    await db.complianceDocument.updateMany({
      where: {
        organizationId: orgId,
        driver_id: validated.entityType === 'driver' ? validated.entityId : undefined,
        vehicleId: validated.entityType === 'vehicle' ? validated.entityId : undefined,
        type: validated.documentType,
        status: 'active',
      },
      data: { status: 'archived' },
    });

    const doc = await db.complianceDocument.create({
      data: {
        organizationId: orgId,
        driver_id: validated.entityType === 'driver' ? validated.entityId : undefined,
        vehicleId: validated.entityType === 'vehicle' ? validated.entityId : undefined,
        type: validated.documentType,
        title: validated.fileName,
        fileUrl: validated.url,
        fileName: validated.fileName,
        fileSize: validated.fileSize,
        mimeType: validated.mimeType,
        notes: validated.notes,
        tags: validated.tags,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return { success: true, data: doc };
  } catch (error) {
    return handleError(error, 'File Upload Action');
  }
}

export async function getSignedUploadToken(filename: string) {
  try {
    const readWriteToken = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;
    if (!readWriteToken) {
      throw new Error('Blob read-write token not configured');
    }

    const user = await getCurrentUser();
    const userId = user?.userId;
    const orgId = user?.organizationId;
    if (!userId || !orgId) throw new Error('Unauthorized');

    const pathname = `${orgId}/${userId}/${Date.now()}-${filename}`;
    const token = await generateClientTokenFromReadWriteToken({
      pathname,
      token: readWriteToken,
    });

    return { success: true, token, pathname };
  } catch (error) {
    return handleError(error, 'Get Signed Upload Token');
  }
}
