import { describe, it, expect, beforeEach, vi } from 'vitest';

import { exportOrganizationDataAction } from '../../../lib/actions/dashboardActions';

vi.mock('@clerk/nextjs/server', () => ({ auth: () => Promise.resolve({ userId: 'u1' }) }));

const putMock = vi.fn(async () => ({ downloadUrl: 'https://blob/test.csv' }));
vi.mock('@vercel/blob', () => ({ put: putMock }));

const dbMock = {
  user: {
    findMany: vi
      .fn()
      .mockResolvedValue([
        { id: 'u1', email: 'a@test.com', firstName: 'A', lastName: 'B', role: 'admin' },
      ]),
  },
  vehicle: { findMany: vi.fn().mockResolvedValue([]) },
};
vi.mock('../../../lib/database/db', () => ({ __esModule: true, default: dbMock }));
vi.mock('../../../lib/errors/handleError', () => ({
  handleError: (e: any) => ({ success: false, error: String(e) }),
}));

describe('exportOrganizationDataAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN = 'token';
  });

  it('uploads CSV to blob storage and returns download url', async () => {
    const formData = new FormData();
    formData.append('exportType', 'users');
    formData.append('format', 'csv');
    const result = await exportOrganizationDataAction('org1', formData);
    expect(result.success).toBe(true);
    expect(result.data?.downloadUrl).toBe('https://blob/test.csv');
    expect(putMock).toHaveBeenCalled();
  });
});
