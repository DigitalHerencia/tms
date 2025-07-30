import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveLoadDocument, deleteLoadDocument } from '../../../lib/actions/documentActions';
import { getCurrentUser } from '../../../lib/auth/auth';

vi.mock('../../../lib/auth/auth', () => ({ getCurrentUser: vi.fn() }));
vi.mock('../../../lib/database/db', () => ({
  __esModule: true,
  default: {
    document: {
      create: vi.fn().mockResolvedValue({ id: 'doc1' }),
      delete: vi.fn().mockResolvedValue({}),
    },
  },
}));
vi.mock('../../../lib/errors/handleError', () => ({ handleError: vi.fn((e: any) => ({ success: false, error: String(e) })) }));

import db from '../../../lib/database/db';

describe('dispatch document actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getCurrentUser as any).mockResolvedValue({ userId: 'u1', organizationId: 'org1' });
  });

  it('saves a load document', async () => {
    const res = await saveLoadDocument({
      fileName: 'test.pdf',
      fileSize: 10,
      mimeType: 'application/pdf',
      url: 'http://example.com',
      loadId: 'load1',
    });
    expect(res.success).toBe(true);
    expect(db.document.create).toHaveBeenCalled();
  });

  it('deletes a load document', async () => {
    const res = await deleteLoadDocument('org1', 'doc1');
    expect(res.success).toBe(true);
    expect(db.document.delete).toHaveBeenCalled();
  });
});
