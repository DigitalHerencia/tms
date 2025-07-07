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
    getUserByClerkId: vi.fn(),
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
  memberships: [
    { organizationId: 'org-123', role: 'admin' },
  ],
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
      require('../../../lib/database/db').DatabaseQueries.getUserByClerkId.mockResolvedValue(null);
      const result = await authModule.getCurrentUser();
      expect(result).toBeNull();
    });
    it('returns user context if allowNoOrg', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: 'u1' });
      require('@clerk/nextjs/server').currentUser.mockResolvedValue(mockUser);
      require('../../../lib/database/db').DatabaseQueries.getUserByClerkId.mockResolvedValue({ memberships: [] });
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
      require('../../../lib/database/db').DatabaseQueries.getUserByClerkId.mockResolvedValue(mockDbUser);
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
      require('../../../lib/database/db').DatabaseQueries.getUserByClerkId.mockResolvedValue({ memberships: [] });
      const result = await authModule.getCurrentCompany();
      expect(result).toBeNull();
    });
    it('returns default org meta if org exists', async () => {
      require('@clerk/nextjs/server').auth.mockResolvedValue({ userId: 'u1' });
      require('../../../lib/database/db').DatabaseQueries.getUserByClerkId.mockResolvedValue(mockDbUser);
      const result = await authModule.getCurrentCompany();
      expect(result).toHaveProperty('name');
    });
  });

  describe('checkUserRole', async () => {
    it('returns false if no user', async () => {
      vi.spyOn(authModule, 'getCurrentUser').mockResolvedValue(null);
      const result = await authModule.checkUserRole('admin');
      expect(result).toBe(false);
    });
  
      const result = await authModule.checkUserRole('admin');
      expect(result).toBe(true);
    });
    
  });


