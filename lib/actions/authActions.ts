/**
 * Auth domain server mutations.
 *
 * These actions handle login, user registration, session refresh and
 * role updates. Integration with Clerk for secure authentication is
 * pending (see docs/PRD.md §1 "Auth").
 *
 * TODO: connect Clerk helpers and database persistence.
 */

/**
 * Authenticate a user and create a session.
 *
 * @param email - User email
 * @param password - User password
 * @returns Promise resolving with session data
 */
export async function loginUser(email: string, password: string): Promise<any> {
  // TODO: Implement login mutation
  throw new Error('Not implemented');
}

/**
 * Register a new user and their organization.
 *
 * @param data - Registration payload
 * @returns Promise resolving with the created user record
 */
export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  companyName: string;
}) {
  // TODO: Implement registration mutation
  throw new Error('Not implemented');
}

/**
 * Refresh session details for a user.
 *
 * @param userId - Clerk user id
 * @returns Promise when session update completes
 */
export async function updateSession(userId: string): Promise<void> {
  // TODO: Implement session update logic
  throw new Error('Not implemented');
}

/**
 * Change a user's role in the current organization.
 *
 * @param userId - Target user id
 * @param role - New role value
 * @returns Promise when the role update is saved
 */
export async function updateRBAC(
  userId: string,
  role: string,
): Promise<void> {
  // TODO: Implement RBAC update logic
  throw new Error('Not implemented');
=======
'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { signInSchema, signUpSchema, systemRoleSchema } from '@/schemas/auth'
import db from '@/lib/database/db'
import { sessionCache, buildSecureUserContext } from '@/lib/auth/secure-session-management'
import { getPermissionsForRole, SystemRole } from '@/types/abac'
import { handleError } from '@/lib/errors/handleError'
import { z } from 'zod'

/**
 * Authenticate a user using Clerk and update the local session cache.
 *
 * @param email - User email address
 * @param password - User password
 * @returns Result object with session information or error
 */
export async function loginUser(email: string, password: string) {
  try {
    const { email: validatedEmail, password: validatedPassword } = signInSchema.parse({ email, password })
    const client = await clerkClient()
    const signIn = await client.authenticateUser({ identifier: validatedEmail, password: validatedPassword })
    if (!signIn.sessionId || !signIn.userId) {
      return { success: false, error: 'Invalid credentials' }
    }
    const session = await client.sessions.getSession(signIn.sessionId)
    const user = await client.users.getUser(signIn.userId)

    await db.user.upsert({
      where: { id: user.id },
      update: { lastLogin: new Date() },
      create: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? validatedEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.imageUrl,
        onboardingComplete: true,
      },
    })

    const userContext = buildSecureUserContext(user.id, session, (user.privateMetadata as any)?.organizationId || '')
    sessionCache.set(`${user.id}-${userContext.organizationId}`, userContext)

    return { success: true, data: { sessionId: signIn.sessionId } }
  } catch (error) {
    return handleError(error, 'Login User')
  }
}

/**
 * Register a new user and associated organization using Clerk and Prisma.
 *
 * @param data - Registration form values
 * @returns Result object indicating success or failure
 */
export async function registerUser(data: { email: string; password: string; name: string; companyName: string }) {
  try {
    const validated = signUpSchema.omit({ confirmPassword: true, agreeToTerms: true }).parse({
      email: data.email,
      password: data.password,
      name: data.name,
      companyName: data.companyName,
    })

    const client = await clerkClient()
    const user = await client.users.createUser({
      emailAddress: [validated.email],
      password: validated.password,
      firstName: validated.name,
    })

    const organization = await db.organization.create({ data: { name: validated.companyName, slug: validated.companyName.replace(/\s+/g, '-').toLowerCase() } })

    await db.user.create({
      data: {
        id: user.id,
        email: validated.email,
        firstName: validated.name,
        organizationId: organization.id,
        role: 'admin',
        onboardingComplete: true,
      },
    })

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: { organizationId: organization.id, onboardingComplete: true },
      publicMetadata: { organizationId: organization.id, role: 'admin', permissions: getPermissionsForRole('admin' as SystemRole) },
    })

    await updateSession(user.id)

    return { success: true }
  } catch (error) {
    return handleError(error, 'Register User')
  }
}

/**
 * Refresh the user's session cache from Clerk metadata.
 *
 * @param userId - Clerk user identifier
 * @returns Result object indicating success or failure
 */
export async function updateSession(userId: string) {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const sessions = await client.users.getUserSessions(userId)
    const session = sessions[0]
    if (!session) {
      return { success: false, error: 'No active session' }
    }
    const context = buildSecureUserContext(user.id, session, (user.privateMetadata as any)?.organizationId || '')
    sessionCache.set(`${user.id}-${context.organizationId}`, context)
    return { success: true }
  } catch (error) {
    return handleError(error, 'Update Session')
  }
}

/**
 * Update a user's role and permissions across tenants.
 *
 * @param userId - Clerk user identifier
 * @param role - New system role
 * @returns Result object indicating success or failure
 */
export async function updateRBAC(userId: string, role: string) {
  try {
    const parsed = systemRoleSchema.parse(role) as SystemRole
    const client = await clerkClient()
    const permissions = getPermissionsForRole(parsed)
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: parsed, permissions },
    })
    await db.user.update({ where: { id: userId }, data: { role: parsed } })
    sessionCache.invalidateUser(userId)
    await updateSession(userId)
    return { success: true }
  } catch (error) {
    return handleError(error, 'Update RBAC')
  }
}
