import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportOrganizationDataAction } from '../../../lib/actions/dashboardActions';

vi.mock('@clerk/nextjs/server', () => ({ auth: () => Promise.resolve({ userId: 'u1' }) }));
vi.mock('../../../lib/database/db', () => ({
  __esModule: true,
  default: {
    user: { findMany: vi.fn().mockResolvedValue([{ id: 'u1', email: 'a@test.com' }]) },
    vehicle: { findMany: vi.fn().mockResolvedValue([{ id: 'v1', unitNumber: '1' }]) },
  },
}));
vi.mock('@vercel/blob', () => ({
  put: vi.fn(async () => ({ downloadUrl: 'https://blob/exports/test.csv?download=1' })),
}));
vi.mock('../../../lib/errors/handleError', () => ({ handleError: vi.fn() }));

import db from '../../../lib/database/db';
import { put } from '@vercel/blob';

describe('exportOrganizationDataAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads csv export and returns url', async () => {
    const formData = new FormData();
    formData.append('exportType', 'users');
    formData.append('format', 'csv');
    const res = await exportOrganizationDataAction('org1', formData);
    expect(res.success).toBe(true);
    expect(res.data?.downloadUrl).toContain('https://blob');
    expect(put).toHaveBeenCalled();
    expect((db.user.findMany as any).mock.calls[0][0]).toEqual({
      where: { organizationId: 'org1' },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
  });
});
