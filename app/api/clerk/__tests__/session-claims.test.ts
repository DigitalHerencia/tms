import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
const route = () => import('../session-claims/route');

describe('session claims endpoint', () => {
  it('returns claims for user', async () => {
    const user = {
      id: 'user1',
      first_name: 'Test',
      last_name: 'User',
      email_addresses: [{ email_address: 'test@example.com' }],
      public_metadata: {
        role: 'admin',
        permissions: ['perm'],
        onboardingComplete: true,
        organizationId: 'org1',
      },
      private_metadata: { organizationId: 'org1', isActive: true },
      last_sign_in_at: '2024-01-01T00:00:00Z',
    };
    const req = new NextRequest('http://localhost/api/clerk/session-claims', {
      method: 'POST',
      body: JSON.stringify({ user, session: { last_active_at: '2024-01-01T00:00:00Z' } }),
    });
    const { POST } = await route();
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json['user.id']).toBe('user1');
    expect(json.abac.organizationId).toBe('org1');
    expect(json.abac.role).toBe('admin');
    expect(json.firstName).toBe('Test');
  });
});
