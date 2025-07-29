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
    const signIn = await (client as any).authenticateUser({
      identifier: validatedEmail,
      password: validatedPassword,
    })
    if (!signIn.sessionId || !signIn.userId) {
      return { success: false, error: 'Invalid credentials' }
    }
    const session = await (client as any).sessions.getSession(signIn.sessionId)
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

    const userContext = buildSecureUserContext(
      user.id,
      session as unknown as Record<string, unknown>,
      (user.privateMetadata as any)?.organizationId || ''
    )
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
    const validated = signUpSchema.parse({
      email: data.email,
      password: data.password,
      confirmPassword: data.password,
      name: data.name,
      companyName: data.companyName,
      agreeToTerms: true,
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
    const user = await (client as any).users.getUser(userId)
    const sessions = await (client as any).users.getUserSessions(userId)
    const session = sessions[0]
    if (!session) {
      return { success: false, error: 'No active session' }
    }
    const context = buildSecureUserContext(
      user.id,
      session as unknown as Record<string, unknown>,
      (user.privateMetadata as any)?.organizationId || ''
    )
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
    await db.user.update({ where: { id: userId }, data: { role: parsed as any } })
    sessionCache.invalidateUser(userId)
    await updateSession(userId)
    return { success: true }
  } catch (error) {
    return handleError(error, 'Update RBAC')
  }
}
