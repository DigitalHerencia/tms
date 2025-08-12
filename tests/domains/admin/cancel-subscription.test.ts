import { describe, it, expect, beforeEach, vi } from 'vitest';

import { cancelSubscriptionAction } from '../../../lib/actions/dashboardActions';

vi.mock('@clerk/nextjs/server', () => ({ auth: () => Promise.resolve({ userId: 'u1' }) }));

const dbMock = vi.hoisted(() => ({
  user: { findUnique: vi.fn().mockResolvedValue({ organizationId: 'org1', role: 'admin' }) },
  organization: { update: vi.fn().mockResolvedValue({ id: 'org1' }) },
}));
vi.mock('../../../lib/database/db', () => ({ __esModule: true, default: dbMock }));
vi.mock('../../../lib/errors/handleError', () => ({
  handleError: (e: any) => ({ success: false, error: String(e) }),
}));

const fetchMock = vi.fn(async () => ({ ok: true, text: async () => '' }));

describe('cancelSubscriptionAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = fetchMock as any;
    process.env.BILLING_PROVIDER_API_URL = 'https://billing.test';
    process.env.BILLING_PROVIDER_API_KEY = 'token';
  });

  it('calls billing provider and updates status', async () => {
    const result = await cancelSubscriptionAction('org1');
    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalled();
    expect(dbMock.organization.update).toHaveBeenCalledWith({
      where: { id: 'org1' },
      data: { subscriptionStatus: 'cancelled' },
    });
  });
});
