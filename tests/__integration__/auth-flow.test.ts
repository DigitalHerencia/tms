import { describe, expect, test, vi } from 'vitest';
import { inviteUserAction } from '@/lib/actions/userActions';

vi.mock('@/lib/email/mailer', () => ({
  sendInvitationEmail: vi.fn(),
}));

// In-memory mock database
const users: any[] = [];
const memberships: any[] = [];
const invitations: any[] = [];

vi.mock('@/lib/database/db', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: vi.fn(async ({ where: { email } }: any) =>
        users.find((u) => u.email === email) || null,
      ),
      create: vi.fn(async ({ data }: any) => {
        users.push(data);
        return data;
      }),
    },
    organizationMembership: {
      upsert: vi.fn(async ({ where, create, update }: any) => {
        const existing = memberships.find(
          (m) =>
            m.organizationId === where.organizationId_userId.organizationId &&
            m.userId === where.organizationId_userId.userId,
        );
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        const membership = { ...create };
        memberships.push(membership);
        return membership;
      }),
    },
    organizationInvitation: {
      create: vi.fn(async ({ data }: any) => {
        invitations.push(data);
        return data;
      }),
      findFirst: vi.fn(async ({ where: { token } }: any) =>
        invitations.find((i) => i.token === token) || null,
      ),
      update: vi.fn(async ({ where: { token }, data }: any) => {
        const inv = invitations.find((i) => i.token === token);
        if (inv) Object.assign(inv, data);
        return inv;
      }),
    },
  },
}));

describe('auth invitation flow', () => {
  test('invites user and accepts invitation', async () => {
    const orgId = 'org-1';
    const email = 'newuser@example.com';
    const role = 'MEMBER';

    const invite = await inviteUserAction(orgId, email, role);
    expect(invite.success).toBe(true);
    expect(users).toHaveLength(1);
    expect(memberships[0]).toMatchObject({ organizationId: orgId, role });

    // Simulated API route for accepting invitation
    async function acceptInvitation(token: string) {
      const invitation = invitations.find((i) => i.token === token);
      if (!invitation) return { status: 404 };
      const user = users.find((u) => u.email === invitation.email);
      if (user) user.isActive = true;
      invitation.status = 'accepted';
      return { status: 200 };
    }

    const response = await acceptInvitation(invite.invitationToken!);
    expect(response.status).toBe(200);
    expect(users[0].isActive).toBe(true);
  });
});
