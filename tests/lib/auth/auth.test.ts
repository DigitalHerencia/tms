import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authModule from '../../../lib/auth/auth';

// Mock dependencies
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));
vi.mock('../../../lib/database/db', () => ({
  DatabaseQueries: {
    getUserById: vi.fn(),
    getOrganizationById: vi.fn(),
  },
}));

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  username: 'testuser',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  imageUrl: 'img.png',
  publicMetadata: {
    organizationId: 'org-123',
    role: 'admin',
    permissions: ['perm1'],
    isActive: true,
    onboardingComplete: true,
  },
};

const mockDbUser = {
  memberships: [{ organizationId: 'org-123', role: 'admin' }],
};

describe('auth.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('returns null if not authenticated', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: null });
      const result = await authModule.getCurrentUser();
      expect(result).toBeNull();
    });
    it('returns null if no Clerk user', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: 'u1' });
      require('@clerk/nextjs/server').currentUser.mockResolvedValue(null);
      const result = await authModule.getCurrentUser();
      expect(result).toBeNull();
    });
    it('returns null if no db user', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: 'u1' });
      require('@clerk/nextjs/server').currentUser.mockResolvedValue(mockUser);
      require('../../../lib/database/db').DatabaseQueries.getUserById.mockResolvedValue(null);
      const result = await authModule.getCurrentUser();
      expect(result).toBeNull();
    });
    it('returns user context if allowNoOrg', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: 'u1' });
      require('@clerk/nextjs/server').currentUser.mockResolvedValue(mockUser);
      require('../../../lib/database/db').DatabaseQueries.getUserById.mockResolvedValue({
        memberships: [],
      });
      const result = await authModule.getCurrentUser(true);
      expect(result).toMatchObject({
        userId: 'u1',
        organizationId: '',
        role: 'admin',
        onboardingComplete: true,
      });
    });
    it('returns user context if membership exists', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: 'u1' });
      require('@clerk/nextjs/server').currentUser.mockResolvedValue(mockUser);
      require('../../../lib/database/db').DatabaseQueries.getUserById.mockResolvedValue(mockDbUser);
      require('../../../lib/database/db').DatabaseQueries.getOrganizationById.mockResolvedValue({
        name: 'Org',
        subscriptionTier: 'starter',
        subscriptionStatus: 'active',
        maxUsers: 5,
        billingEmail: 'b@example.com',
        createdAt: new Date(),
        settings: {},
      });
      const result = await authModule.getCurrentUser();
      expect(result).toMatchObject({
        userId: 'u1',
        organizationId: 'org-123',
        role: 'admin',
        onboardingComplete: true,
      });
    });
  });

  describe('getCurrentCompany', () => {
    it('returns null if not authenticated', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: null });
      const result = await authModule.getCurrentCompany();
      expect(result).toBeNull();
    });
    it('returns null if no org', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: 'u1' });
      require('../../../lib/database/db').DatabaseQueries.getUserById.mockResolvedValue({
        memberships: [],
      });
      const result = await authModule.getCurrentCompany();
      expect(result).toBeNull();
    });
    it('returns org meta if org exists', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: 'u1' });
      require('../../../lib/database/db').DatabaseQueries.getUserById.mockResolvedValue(mockDbUser);
      require('../../../lib/database/db').DatabaseQueries.getOrganizationById.mockResolvedValue({
        name: 'Org',
        subscriptionTier: 'starter',
        subscriptionStatus: 'active',
        maxUsers: 5,
        billingEmail: 'b@example.com',
        createdAt: new Date(),
        settings: {},
      });
      const result = await authModule.getCurrentCompany();
      expect(result).toMatchObject({ name: 'Org' });
    });
  });

  describe('checkUserRole', () => {
    it('returns false if no user', async () => {
      vi.spyOn(authModule, 'getCurrentUser').mockResolvedValue(null);
      const result = await authModule.checkUserRole('admin');
      expect(result).toBe(false);
    });

    it('returns true for matching role', async () => {
      vi.spyOn(authModule, 'getCurrentUser').mockResolvedValue({ role: 'admin' } as any);
      const result = await authModule.checkUserRole('admin');
      expect(result).toBe(true);
    });
  });
});
