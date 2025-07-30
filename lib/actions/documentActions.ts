'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/auth';
import { handleError } from '@/lib/errors/handleError';
import db from '@/lib/database/db';

export const loadDocumentSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().min(1),
  mimeType: z.string().min(1),
  url: z.string().url(),
  loadId: z.string().min(1),
});

export async function saveLoadDocument(data: z.infer<typeof loadDocumentSchema>) {
  try {
    const user = await getCurrentUser();
    const userId = user?.userId;
    const orgId = user?.organizationId;
    if (!userId || !orgId) throw new Error('Unauthorized');

    const validated = loadDocumentSchema.parse(data);

    const doc = await db.document.create({
      data: {
        organizationId: orgId,
        loadId: validated.loadId,
        name: validated.fileName,
        fileUrl: validated.url,
        fileSize: validated.fileSize,
        mimeType: validated.mimeType,
        uploadedBy: userId,
        uploadedAt: new Date(),
      },
    });
    return { success: true, data: doc };
  } catch (error) {
    return handleError(error, 'Save Load Document');
  }
}

export async function deleteLoadDocument(orgId: string, documentId: string) {
  try {
    await db.document.delete({
      where: { id: documentId, organizationId: orgId },
    });
    return { success: true, data: null };
  } catch (error) {
    return handleError(error, 'Delete Load Document');
  }
}

export async function getLoadDocuments(orgId: string, loadId: string) {
  try {
    const docs = await db.document.findMany({
      where: { organizationId: orgId, loadId },
      orderBy: { uploadedAt: 'desc' },
    });
    return { success: true, data: docs };
  } catch (error) {
    return handleError(error, 'Get Load Documents');
  }
}
