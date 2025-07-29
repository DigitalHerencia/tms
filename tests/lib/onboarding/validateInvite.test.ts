import { describe, it, expect, vi, beforeEach } from 'vitest';

import { validateInvite } from '../../../lib/actions/onboardingActions';

let membershipMock: { findUnique: ReturnType<typeof vi.fn> };
let invitationMock: { findUnique: ReturnType<typeof vi.fn> };

vi.mock('../../../lib/database/db', () => {
  membershipMock = { findUnique: vi.fn() };
  invitationMock = { findUnique: vi.fn() };
  return {
    __esModule: true,
    default: {
      organizationMembership: membershipMock,
      organizationInvitation: invitationMock,
    },
  };
});

describe('validateInvite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns invitation when code is valid', async () => {
    membershipMock.findUnique.mockResolvedValue(null);
    invitationMock.findUnique.mockResolvedValue({
      token: 'valid',
      organizationId: 'org1',
      role: 'driver',
      status: 'pending',
      expiresAt: new Date(Date.now() + 1000).toISOString(),
    });

    const res = await validateInvite('org1', 'valid', 'u1', 'driver');
    expect(res.success).toBe(true);
    expect(res.data.token).toBe('valid');
  });

  it('fails when code does not exist', async () => {
    membershipMock.findUnique.mockResolvedValue(null);
    invitationMock.findUnique.mockResolvedValue(null);

    const res = await validateInvite('org1', 'bad', 'u1', 'driver');
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/invalid/i);
  });

  it('fails when invitation is expired', async () => {
    membershipMock.findUnique.mockResolvedValue(null);
    invitationMock.findUnique.mockResolvedValue({
      token: 'expired',
      organizationId: 'org1',
      role: 'driver',
      status: 'pending',
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });

    const res = await validateInvite('org1', 'expired', 'u1', 'driver');
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/expired/i);
  });
});
