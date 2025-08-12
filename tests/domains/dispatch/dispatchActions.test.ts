import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

const authMock = vi.hoisted(() => vi.fn());
vi.mock('@clerk/nextjs/server', () => ({ auth: authMock }));

const dbMock = vi.hoisted(() => ({
  load: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  loadStatusEvent: { create: vi.fn() },
  dispatchActivity: { create: vi.fn() },
}));

vi.mock('../../../lib/database/db', () => ({ __esModule: true, default: dbMock }));
vi.mock('../../../lib/errors/handleError', () => ({ handleError: vi.fn() }));

describe('dispatch actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a load when authorized', async () => {
    authMock.mockResolvedValue({ userId: 'u1' });
    dbMock.load.create.mockResolvedValue({ id: 'l1' });
    const formData = new FormData();
    formData.append('load_number', 'L-1001');
    formData.append('origin_address', '123 Main');
    formData.append('origin_city', 'City');
    formData.append('origin_state', 'CA');
    formData.append('origin_zip', '90001');
    formData.append('destination_address', '456 Oak');
    formData.append('destination_city', 'Town');
    formData.append('destination_state', 'CA');
    formData.append('destination_zip', '90002');

    const { createDispatchLoadAction } = await import('../../../lib/actions/dispatchActions');
    const res = await createDispatchLoadAction('org1', formData);
    expect(res).toEqual({ success: true, data: { id: 'l1' } });
    expect(dbMock.load.create).toHaveBeenCalled();
  });

  it('prevents load creation when unauthorized', async () => {
    authMock.mockResolvedValue({ userId: null });
    const formData = new FormData();
    formData.append('load_number', 'L-1001');
    formData.append('origin_address', '123 Main');
    formData.append('origin_city', 'City');
    formData.append('origin_state', 'CA');
    formData.append('origin_zip', '90001');
    formData.append('destination_address', '456 Oak');
    formData.append('destination_city', 'Town');
    formData.append('destination_state', 'CA');
    formData.append('destination_zip', '90002');

    const { createDispatchLoadAction } = await import('../../../lib/actions/dispatchActions');
    const res = await createDispatchLoadAction('org1', formData);
    expect(res).toEqual({ success: false, error: 'Unauthorized' });
    expect(dbMock.load.create).not.toHaveBeenCalled();
  });

  it('updates status when transition is allowed', async () => {
    authMock.mockResolvedValue({ userId: 'u1' });
    dbMock.load.findUnique.mockResolvedValue({ status: 'assigned' });
    (global as any).allowedStatusTransitions = { assigned: ['in_transit', 'cancelled'] };
    const { updateLoadStatusAction } = await import('../../../lib/actions/dispatchActions');
    const res = await updateLoadStatusAction('org1', 'l1', 'in_transit');
    expect(res.success).toBe(true);
    expect(dbMock.load.update).toHaveBeenCalled();
    expect(dbMock.loadStatusEvent.create).toHaveBeenCalled();
  });

  it('returns error for invalid status transition', async () => {
    authMock.mockResolvedValue({ userId: 'u1' });
    dbMock.load.findUnique.mockResolvedValue({ status: 'assigned' });
    (global as any).allowedStatusTransitions = { assigned: ['in_transit', 'cancelled'] };
    const { updateLoadStatusAction } = await import('../../../lib/actions/dispatchActions');
    const res = await updateLoadStatusAction('org1', 'l1', 'delivered');
    expect(res).toEqual({ success: false, error: 'Invalid status change' });
    expect(dbMock.load.update).not.toHaveBeenCalled();
  });

  it('returns unauthorized when updating status without auth', async () => {
    authMock.mockResolvedValue({ userId: null });
    (global as any).allowedStatusTransitions = { assigned: ['in_transit', 'cancelled'] };
    const { updateLoadStatusAction } = await import('../../../lib/actions/dispatchActions');
    const res = await updateLoadStatusAction('org1', 'l1', 'in_transit');
    expect(res).toEqual({ success: false, error: 'Unauthorized' });
    expect(dbMock.load.findUnique).not.toHaveBeenCalled();
  });
});
