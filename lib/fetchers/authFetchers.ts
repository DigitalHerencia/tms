'use server';

/**
 * Auth domain data retrieval helpers.
 *
 * These fetchers query user, session and organization information from
 * Clerk and the database as described in docs/PRD.md §1 (Auth).
 */

import { clerkClient } from '@clerk/nextjs/server';
import { DatabaseQueries } from '@/lib/database/db';
import type { DatabaseUser, DatabaseOrganization } from '@/types/auth';
import type { User, Session } from '@clerk/nextjs/server';

export interface FetchedUser {
  clerk: User;
  db: DatabaseUser | null;
}

/**
 * Get a single user record.
 *
 * @param userId - Clerk user id
 * @returns Promise resolving with user data
 */

export async function fetchUser(userId: string): Promise<FetchedUser | null> {
  try {
    const client = await clerkClient();
    const [clerkUser, dbUser] = await Promise.all([
      client.users.getUser(userId),
      DatabaseQueries.getUserById(userId),
    ]);

    return { clerk: clerkUser, db: dbUser };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Retrieve the active session for a user.
 *
 * @param userId - Clerk user id
 * @returns Promise resolving with session details
 */

export async function fetchSession(userId: string): Promise<Session | null> {
  try {
    const client = await clerkClient();
    const sessions = await client.users.getUserSessions(userId);
    return sessions[0] || null;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

/**
 * Lookup organization information by id.
 *
 * @param orgId - Organization id
 * @returns Promise resolving with organization metadata
 */

export async function fetchOrganization(orgId: string): Promise<DatabaseOrganization | null> {
  try {
    const organization = await DatabaseQueries.getOrganizationById(orgId);
    return organization;
  } catch (error) {
    console.error('Error fetching organization:', error);
    return null;
  }
}
