/**
 * Database Connection Configuration (Neon + Prisma)
 *
 * - Uses Neon serverless driver for serverless/edge environments
 * - Uses Prisma client singleton pattern to avoid connection exhaustion
 * - Handles error logging and type-safe queries
 * - Implements secure connection management with retry logic
 *
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';

import ws from 'ws';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import crypto from 'crypto';

neonConfig.webSocketConstructor = ws;

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Secure connection string validation
const connectionString = process.env.DATABASE_URL!;
const maxConnections = parseInt(process.env.DATABASE_MAX_CONNECTIONS || '10');
const connectionTimeout = parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '10000');
if (!connectionString.includes('sslmode=require')) {
  console.warn('Database connection should use SSL in production');
}

// Enhanced adapter configuration with timeout and retry settings
const adapter = new PrismaNeon({
  connectionString,
  max: maxConnections,
  connectionTimeoutMillis: connectionTimeout,
});

declare global {
  var prisma: PrismaClient | undefined;
}

// Enhanced Prisma client configuration with logging and timeouts
const createPrismaClient = () => {
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    // Note: Do not specify datasources when using driver adapters
    // The connection string is already provided to the adapter
  });
};

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = createPrismaClient();
  }
  prisma = globalThis.prisma;
}

// Health check function for database connectivity
export const checkDatabaseHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  latency?: number;
  error?: string;
}> => {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return {
      status: 'healthy',
      latency,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Utility function to handle database errors
export function handleDatabaseError(error: unknown): never {
  console.error('Database error:', error);
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as any).code === 'string'
  ) {
    // Prisma known request error
    if (error instanceof PrismaClientKnownRequestError) {
      switch ((error as PrismaClientKnownRequestError).code) {
        case 'P2002':
        case 'P2003':
        case 'P2025':
        default:
          throw new Error(
            `Database error (Prisma): ${(error as PrismaClientKnownRequestError).message} (Code: ${
              (error as PrismaClientKnownRequestError).code
            })`,
          );
      }
    } else {
      // Fallback for generic SQL errors
      const sqlError = error as { code: string; message: string };
      switch (sqlError.code) {
        case '23505':
        case '23503':
        case '23502':
        case '42P01':
        default:
          throw new Error(`Database error: ${sqlError.message} (SQL Code: ${sqlError.code})`);
      }
    }
  }
  throw new Error('Unknown database error occurred');
}

/**
 * Utility to generate a unique slug for organizations (DB-level)
 */
async function generateUniqueOrgSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;
  const maxAttempts = 50; // Prevent infinite loops

  while (suffix <= maxAttempts) {
    const existing = await db.organization.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }
  throw new Error(
    `Could not generate unique slug after ${maxAttempts} attempts for base slug: ${baseSlug}`,
  );
}

// Type-safe database queries helper (rewritten for Prisma)
export class DatabaseQueries {
  /**
   * Upsert (create or update) an organization membership from Clerk webhook
   * Looks up internal org/user IDs by Clerk IDs, upserts membership, sets role and timestamps
   */
  static async upsertOrganizationMembership({
    organizationId,
    userClerkId,
    role,
    createdAt,
    updatedAt,
  }: {
    organizationId: string; // This is the org UUID, not a Clerk orgId
    userClerkId: string; // This is the Clerk userId
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    try {
      // Look up internal IDs
      const organization = await db.organization.findUnique({
        where: { id: organizationId },
      });
      if (!organization) throw new Error(`Organization not found for orgId: ${organizationId}`);
      const user = await db.user.findFirst({
        where: { id: userClerkId },
      });
      if (!user) throw new Error(`User not found for userId: ${userClerkId}`);
      // Upsert membership (unique on orgId+userId)
      const membership = await db.organizationMembership.upsert({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: user.id,
          },
        },
        update: {
          role,
          updatedAt: updatedAt || new Date(),
        },
        create: {
          id: crypto.randomUUID(), // <-- Add this line
          organizationId: organization.id,
          userId: user.id,
          role,
          createdAt: createdAt || new Date(),
          updatedAt: updatedAt || new Date(),
        },
      });
      return membership;
    } catch (error) {
      console.error('Error in upsertOrganizationMembership:', error);
      handleDatabaseError(error);
    }
  }

  /**
   * Delete an organization membership (by orgClerkId and userClerkId)
   */
  static async deleteOrganizationMembership({
    organizationId,
    userClerkId,
  }: {
    organizationId: string; // This is the org UUID, not a Clerk orgId
    userClerkId: string; // This is the Clerk userId
  }) {
    try {
      const organization = await db.organization.findUnique({
        where: { id: organizationId },
      });
      if (!organization) {
        console.warn(
          `[DB] Organization not found for orgId: ${organizationId}, skipping membership delete.`,
        );
        return {
          success: true,
          message: 'Organization not found, skipping membership delete.',
        };
      }
      const user = await db.user.findFirst({
        where: { id: userClerkId },
      });
      if (!user) {
        console.warn(`[DB] User not found for userId: ${userClerkId}, skipping membership delete.`);
        return {
          success: true,
          message: 'User not found, skipping membership delete.',
        };
      }
      await db.organizationMembership.delete({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: user.id,
          },
        },
      });
      return { success: true };
    } catch (error) {
      // If not found, treat as idempotent
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return { success: true };
      }
      console.error('Error in deleteOrganizationMembership:', error);
      handleDatabaseError(error);
    }
  }

  static async getUserById(userId: string) {
    try {
      if (!userId) {
        console.warn('getUserById called with undefined/empty userId');
        return null;
      }
      // Include memberships (organizationId, role) for ABAC context
      const user = await db.user.findFirst({
        where: { id: userId },
        include: {
          memberships: {
            select: {
              organizationId: true,
              role: true,
            },
          },
        },
      });
      return user || null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  static async getOrganizationById(orgId: string) {
    try {
      if (!orgId) {
        console.warn('getOrganizationById called with undefined/empty orgId');
        return null;
      }
      const organization = await db.organization.findUnique({
        where: { id: orgId },
      });
      return organization || null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Create or update organization from Clerk webhook
   */
  static async upsertOrganization(data: {
    id: string;
    name: string;
    slug: string;
    dotNumber?: string | null;
    mcNumber?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    phone?: string | null;
    email?: string | null;
    logoUrl?: string | null;
    maxUsers?: number;
    billingEmail?: string | null;
    isActive?: boolean;
  }) {
    try {
      if (!data.id) throw new Error('id is required for organization upsert');
      if (!data.name) throw new Error('name is required for organization upsert');
      if (!data.slug) throw new Error('slug is required for organization upsert');
      const { id } = data;
      const existingOrg = await db.organization.findFirst({
        where: { id },
      });
      if (existingOrg) {
        const updateData = {
          name: data.name,
          dotNumber: data.dotNumber,
          mcNumber: data.mcNumber,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          phone: data.phone,
          email: data.email,
          logoUrl: data.logoUrl,
          maxUsers: data.maxUsers === undefined ? 5 : data.maxUsers,
          billingEmail: data.billingEmail,
          isActive: data.isActive === undefined ? true : data.isActive,
        };
        const organization = await db.organization.update({
          where: { id: existingOrg.id },
          data: updateData,
        });
        return organization;
      } else {
        let uniqueSlug = await generateUniqueOrgSlug(data.slug);
        let attempt = 0;
        const maxAttempts = 5;
        let lastError;
        while (attempt < maxAttempts) {
          try {
            const orgDataForCreate = {
              id,
              name: data.name,
              slug: uniqueSlug,
              dotNumber: data.dotNumber,
              mcNumber: data.mcNumber,
              address: data.address,
              city: data.city,
              state: data.state,
              zip: data.zip,
              phone: data.phone,
              email: data.email,
              logoUrl: data.logoUrl,
              maxUsers: data.maxUsers === undefined ? 5 : data.maxUsers,
              billingEmail: data.billingEmail,
              isActive: data.isActive === undefined ? true : data.isActive,
            };
            const organization = await db.organization.create({
              data: orgDataForCreate,
            });
            return organization;
          } catch (error: unknown) {
            lastError = error;
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
              const target = error.meta?.target;
              if (
                (typeof target === 'string' && target === 'slug') ||
                (Array.isArray(target) && target.includes('slug'))
              ) {
                uniqueSlug = await generateUniqueOrgSlug(data.slug);
                attempt++;
                continue;
              } else if (
                (typeof target === 'string' && target === 'id') ||
                (Array.isArray(target) && target.includes('id'))
              ) {
                const existingOrg = await db.organization.findFirst({
                  where: { id },
                });
                if (existingOrg) {
                  return existingOrg;
                }
              }
            }
            throw error;
          }
        }
        throw (
          lastError ||
          new Error('Failed to create organization due to conflicts after multiple attempts')
        );
      }
    } catch (error) {
      console.error(`Error in upsertOrganization for id: ${data.id}`, error);
      handleDatabaseError(error);
    }
  }

  /**
   * Create or update user from Clerk webhook (no organization connection)
   */
  static async upsertUser(data: {
    userId: string; // This is the Clerk userId, stored as id
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    profileImage?: string | null;
    isActive?: boolean;
    onboardingComplete: boolean;
    lastLogin?: Date | null;
    organizationId?: string | null; // Optional, can be null
  }) {
    try {
      const { userId, ...updateData } = data;
      if (!userId) throw new Error('userId is required for user upsert');
      if (!data.email) throw new Error('email is required for user upsert');

      // Validate organizationId if provided
      let validOrganizationId: string | null = null;
      if (data.organizationId) {
        const org = await db.organization.findUnique({
          where: { id: data.organizationId },
        });
        if (org) {
          validOrganizationId = data.organizationId;
        } else {
          validOrganizationId = null;
        }
      }

      const userDataForUpdate = {
        ...updateData,
        organizationId: validOrganizationId,
      };
      const userDataForCreate = {
        id: userId, // Use userId as the primary key (Clerk userId)
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage,
        isActive: data.isActive === undefined ? true : data.isActive,
        onboardingComplete: data.onboardingComplete === undefined ? false : data.onboardingComplete,
        lastLogin: data.lastLogin,
        organizationId: validOrganizationId,
      };

      const user = await db.user.upsert({
        where: { id: userId },
        update: userDataForUpdate,
        create: userDataForCreate,
      });
      return user;
    } catch (error) {
      console.error(`Error in upsertUser for userId: ${data.userId}`, error);
      handleDatabaseError(error);
    }
  }

  private static async safeDelete(
    model: any,
    id: string,
    entity: 'organization' | 'user',
  ) {
    try {
      const record = await model.findFirst({ where: { id } });
      if (!record) {
        return {
          success: true,
          message: `${entity.charAt(0).toUpperCase() + entity.slice(1)} already deleted or does not exist`,
        };
      }
      await model.delete({ where: { id: record.id } });
      return {
        success: true,
        message: `${entity.charAt(0).toUpperCase() + entity.slice(1)} deleted successfully`,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return {
          success: true,
          message: `${entity.charAt(0).toUpperCase() + entity.slice(1)} already deleted or does not exist`,
        };
      }
      console.error(`[DB] Error deleting ${entity} ${id}:`, error);
      return {
        success: false,
        message: `Failed to delete ${entity}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  }

  /**
   * Delete organization
   */
  static deleteOrganization(id: string) {
    return this.safeDelete(db.organization, id, 'organization');
  }

  /**
   * Delete user
   */
  static deleteUser(id: string) {
    return this.safeDelete(db.user, id, 'user');
  }
}

// Create db alias for consistent exports
const db = prisma;

export default db;
