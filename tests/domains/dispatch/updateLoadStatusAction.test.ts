import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@clerk/nextjs/server', () => ({ auth: () => Promise.resolve({ userId: 'u1' }) }));

const dbMock = {
  load: {
    findUnique: vi.fn(),
    update: vi.fn().mockResolvedValue({ id: 'l1' }),
  },
  loadStatusEvent: { create: vi.fn() },
  dispatchActivity: { create: vi.fn() },
};

vi.mock('../../../lib/database/db', () => ({ __esModule: true, default: dbMock }));
vi.mock('../../../lib/errors/handleError', () => ({ handleError: vi.fn() }));

describe('updateLoadStatusAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates status when transition is allowed', async () => {
    dbMock.load.findUnique.mockResolvedValue({ status: 'assigned' });
    const { updateLoadStatusAction } = await import('../../../lib/actions/dispatchActions');
    const res = await updateLoadStatusAction('org1', 'l1', 'in_transit');
    expect(res.success).toBe(true);
    expect(dbMock.load.update).toHaveBeenCalled();
    expect(dbMock.loadStatusEvent.create).toHaveBeenCalled();
  });

  it('returns error for invalid transition', async () => {
    dbMock.load.findUnique.mockResolvedValue({ status: 'assigned' });
    const { updateLoadStatusAction } = await import('../../../lib/actions/dispatchActions');
    const res = await updateLoadStatusAction('org1', 'l1', 'delivered');
    expect(res).toEqual({ success: false, error: 'Invalid status change' });
    expect(dbMock.load.update).not.toHaveBeenCalled();
  });
});
