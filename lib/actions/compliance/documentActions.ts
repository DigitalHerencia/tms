'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/auth';
import { handleError } from '@/lib/errors/handleError';
import db from '@/lib/database/db';

const baseDocumentSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  expirationDate: z.string().or(z.date()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'archived']).optional(),
});

export async function createDocument(data: z.infer<typeof baseDocumentSchema>) {
  try {
    const user = await getCurrentUser();
    const orgId = user?.organizationId;
    const userId = user?.userId;
    if (!orgId || !userId) throw new Error('Unauthorized');

    const validated = baseDocumentSchema.parse(data);
    const doc = await db.complianceDocument.create({
      data: {
        organizationId: orgId,
        title: validated.title,
        type: validated.type,
        fileUrl: validated.fileUrl,
        fileName: validated.fileName,
        fileSize: validated.fileSize,
        mimeType: validated.mimeType,
        expirationDate: validated.expirationDate
          ? new Date(validated.expirationDate)
          : undefined,
        tags: validated.tags,
        status: validated.status ?? 'active',
        uploadedBy: userId,
      },
    });
    return { success: true, data: doc };
  } catch (error) {
    return handleError(error, 'Create Compliance Document');
  }
}

export async function getDocuments() {
  try {
    const user = await getCurrentUser();
    const orgId = user?.organizationId;
    if (!orgId) throw new Error('Unauthorized');

    const docs = await db.complianceDocument.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: docs };
  } catch (error) {
    return handleError(error, 'Get Compliance Documents');
  }
}

const updateSchema = baseDocumentSchema.partial();
export async function updateDocument(id: string, data: z.infer<typeof updateSchema>) {
  try {
    const user = await getCurrentUser();
    const orgId = user?.organizationId;
    if (!orgId) throw new Error('Unauthorized');

    const validated = updateSchema.parse(data);
    const doc = await db.complianceDocument.update({
      where: { id, organizationId: orgId },
      data: {
        ...validated,
        expirationDate: validated.expirationDate
          ? new Date(validated.expirationDate)
          : undefined,
      },
    });
    return { success: true, data: doc };
  } catch (error) {
    return handleError(error, 'Update Compliance Document');
  }
}

export async function deleteDocument(id: string) {
  try {
    const user = await getCurrentUser();
    const orgId = user?.organizationId;
    if (!orgId) throw new Error('Unauthorized');

    await db.complianceDocument.delete({ where: { id, organizationId: orgId } });
    return { success: true, data: null };
  } catch (error) {
    return handleError(error, 'Delete Compliance Document');
  }
}

