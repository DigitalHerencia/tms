'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/auth';
import { handleError } from '@/lib/errors/handleError';
import db from '@/lib/database/db';
import { complianceReportSchema } from '@/schemas/compliance';

export async function generateComplianceReport(input: z.infer<typeof complianceReportSchema>) {
  try {
    const user = await getCurrentUser();
    const orgId = user?.organizationId;
    if (!orgId) throw new Error('Unauthorized');
    const data = complianceReportSchema.parse(input);

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    const documents = await db.complianceDocument.count({
      where: {
        organizationId: orgId,
        createdAt: { gte: start, lte: end },
      },
    });
    const violations = await db.complianceAlert.count({
      where: {
        organizationId: orgId,
        type: 'hos_violation',
        createdAt: { gte: start, lte: end },
      },
    });

    return {
      success: true,
      data: {
        documents,
        violations,
        startDate: start,
        endDate: end,
      },
    };
  } catch (error) {
    return handleError(error, 'Generate Compliance Report');
  }
}
