/** @format */

"use server"

import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import db from "@/lib/database/db"
import { handleError } from "@/lib/errors/handleError"
import { generateSlug } from "@/lib/utils/slug"
import {
    CompleteOnboardingSchema,
    type CompleteOnboardingData,
} from "@/schemas/onboarding"
import type { SystemRole } from "@/types/abac"
import { SystemRoles, getPermissionsForRole } from "@/types/abac"
import type { SetClerkMetadataResult, UserRole } from "@/types/auth"
import type {
    CompanySetupData,
    OnboardingStepData,
    ProfileSetupData,
    JoinOrganizationResult,
} from "@/types/onboarding"

// Infer the resolved client type
type ResolvedClerkClient = Awaited<ReturnType<typeof clerkClient>>

export async function submitOnboardingStepAction(
    step: string,
    data: OnboardingStepData
) {
    try {
        const user = await currentUser()
        if (!user) {
            throw new Error("User not authenticated")
        }

        // Get current user from database
        const dbUser = await db.user.findUnique({
            where: { clerkId: user.id },
            include: { organization: true },
        })

        if (!dbUser) {
            throw new Error("User not found in database")
        }

        // Update onboarding steps
        const currentSteps =
            (dbUser.onboardingSteps as Record<string, boolean>) || {}
        const updatedSteps = { ...currentSteps, [step]: true }

        // Handle specific step data
        switch (step) {
            case "profile": {
                const profileData = data as ProfileSetupData
                await db.user.update({
                    where: { id: dbUser.id },
                    data: {
                        firstName: profileData.firstName,
                        lastName: profileData.lastName,
                        onboardingSteps: updatedSteps,
                    },
                })
                break
            }

            case "company": {
                const companyData = data as CompanySetupData
                if (dbUser.role === SystemRoles.ADMIN) {
                    if (dbUser.organizationId) {
                        // Ensure organizationId is not null
                        await db.organization.update({
                            where: { id: dbUser.organizationId },
                            data: {
                                dotNumber: companyData.dotNumber,
                                mcNumber: companyData.mcNumber,
                                address: companyData.address,
                                city: companyData.city,
                                state: companyData.state,
                                zip: companyData.zip,
                                phone: companyData.phone,
                                settings: {
                                    ...((dbUser.organization
                                        ?.settings as object) || {}),
                                    timezone: companyData.timezone,
                                    dateFormat: companyData.dateFormat,
                                    distanceUnit: companyData.distanceUnit,
                                    fuelUnit: companyData.fuelUnit,
                                },
                            },
                        })
                    }
                }
                await db.user.update({
                    where: { id: dbUser.id },
                    data: { onboardingSteps: updatedSteps },
                })
                break
            }

            default:
                await db.user.update({
                    where: { id: dbUser.id },
                    data: { onboardingSteps: updatedSteps },
                })
        }

        revalidatePath("/onboarding")
        return { success: true }
    } catch (error) {
        return handleError(error, "Submit Onboarding Step")
    }
}

export async function completeOnboardingAction() {
    try {
        const user = await currentUser()
        if (!user) {
            throw new Error("User not authenticated")
        }

        const dbUser = await db.user.findUnique({
            where: { clerkId: user.id },
        })

        if (!dbUser) {
            throw new Error("User not found in database")
        }

        await db.user.update({
            where: { id: dbUser.id },
            data: {
                onboardingComplete: true,
                onboardingSteps: {
                    profile: true,
                    company: true,
                    preferences: true,
                },
            },
        })

        revalidatePath("/onboarding")
        redirect(`/app/${dbUser.organizationId}/dashboard`)
    } catch (error) {
        return handleError(error, "Complete Onboarding")
    }
}

export async function validateJoinOrganizationAction(
    _prev: JoinOrganizationResult | null,
    formData: FormData
): Promise<JoinOrganizationResult> {
    try {
        const orgInput = (formData.get("organizationId") as string | null) || ""
        const invite = (formData.get("inviteCode") as string | null) || ""

        if (!orgInput) {
            return { success: false, error: "Organization ID is required" }
        }

        const organization = await db.organization.findFirst({
            where: {
                OR: [{ slug: orgInput }, { id: orgInput }],
            },
        })

        if (!organization) {
            return { success: false, error: "Organization not found" }
        }

        if (invite) {
            const found = await (db as any).invitation.findFirst({
                where: {
                    code: invite,
                    organizationId: organization.id,
                    expiresAt: { gt: new Date() },
                    acceptedAt: null,
                },
            })
            if (!found) {
                return { success: false, error: "Invalid or expired invite code" }
            }
        }

        return { success: true }
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to validate organization",
        }
    }
}

/**
 * Server action to set Clerk metadata after custom organization creation
 * Updates user metadata only (no Clerk organization creation since orgs are disabled)
 */
export async function setClerkUserMetadata(
    userId: string,
    organizationSlug: string,
    role: SystemRole
): Promise<SetClerkMetadataResult> {
    const actualClient: ResolvedClerkClient = await clerkClient()

    try {
        if (process.env.NODE_ENV === "development") {
            console.log(
                "Setting user metadata for custom organization approach",
                {
                    userId,
                    organizationSlug,
                    role,
                }
            )
        }

        // Get permissions for the role
        const userPermissions = getPermissionsForRole(role)

        // Update Clerk user metadata with custom organization info
        await actualClient.users.updateUser(userId, {
            publicMetadata: {
                onboardingComplete: true,
                organizationSlug: organizationSlug, // Use slug for URL routing
            },
            privateMetadata: {
                organizationId: organizationSlug, // Use slug as the organization identifier
                role: role,
                permissions: userPermissions, // Add permissions array
                onboardingComplete: true,
                lastLogin: new Date().toISOString(),
            },
        })

        if (process.env.NODE_ENV === "development") {
            console.log("Updated user metadata in Clerk", {
                userId,
                organizationSlug,
                role,
            })
        }

        return { success: true, organizationId: organizationSlug, userId }
    } catch (error: any) {
        console.error("Error setting Clerk user metadata:", error)
        return handleError(error, "Set User Metadata")
    }
}

/**
 * Complete onboarding process with new stepper flow
 */
export async function completeOnboarding(data: CompleteOnboardingData) {
    try {
        const user = await currentUser()
        if (!user) {
            console.error("[Onboarding] User not authenticated")
            throw new Error("User not authenticated")
        }
        const parsed = CompleteOnboardingSchema.parse(data)
        const isAdmin = parsed.role === SystemRoles.ADMIN
        let organizationId: string
        let organizationSlug: string
        let organizationClerkId: string | null = null

        // Validate required fields
        if (!parsed.email || !parsed.firstName || !parsed.lastName || !parsed.role) {
            throw new Error("All required fields must be provided by onboarding form.")
        }
        if (!isAdmin && (!parsed.organizationId || parsed.organizationId.trim() === "")) {
            throw new Error("Organization ID is required for non-admin onboarding.")
        }
        const email = parsed.email
        const firstName = parsed.firstName
        const lastName = parsed.lastName
        const role = parsed.role
        const inviteCode = parsed.inviteCode || null
        const userPrefs = parsed.preferences || {}

        // Map SystemRoles to Prisma UserRole enum values
        const prismaRoleMap: Record<string, string> = {
            admin: 'admin',
            dispatcher: 'dispatcher',
            driver: 'driver',
            compliance: 'compliance',
            member: 'user', // Map 'member' to 'user' for Prisma
            accountant: 'accountant',
            viewer: 'viewer',
            manager: 'manager',
        }
        const safeRole = prismaRoleMap[role] ?? 'viewer'

        // --- Organization creation or lookup ---
        let organization
        if (isAdmin) {
            // Admin: create new organization
            const slug = generateSlug(parsed.companyName)
            organization = await db.organization.create({
                data: {
                    clerkId: null,
                    name: parsed.companyName,
                    slug: slug,
                    dotNumber: parsed.dotNumber || null,
                    mcNumber: parsed.mcNumber || null,
                    address: parsed.address,
                    city: parsed.city,
                    state: parsed.state,
                    zip: parsed.zip,
                    phone: parsed.phone || null,
                },
            })
            organizationId = organization.id
            organizationSlug = organization.slug
            // Update org with Clerk org ID if available, else fallback to user Clerk ID
            await db.organization.update({
                where: { id: organizationId },
                data: { clerkId: organizationClerkId || user.id },
            })
        } else {
            // Employee: join existing organization
            organization = await db.organization.findFirst({
                where: {
                    OR: [
                        { slug: parsed.organizationId },
                        { id: parsed.organizationId },
                    ],
                },
            })
            if (!organization) {
                console.error("[Onboarding] Organization not found for join", parsed.organizationId)
                throw new Error("Organization not found")
            }
            organizationId = organization.id
            organizationSlug = organization.slug

            if (parsed.inviteCode) {
                const invite = await (db as any).invitation.findFirst({
                    where: {
                        code: parsed.inviteCode,
                        organizationId: organizationId,
                        expiresAt: { gt: new Date() },
                        acceptedAt: null,
                    },
                })
                if (!invite) {
                    throw new Error("Invalid or expired invite code")
                }
            }
        }

        // --- Upsert user with org and role ---
        const dbUser = await db.user.upsert({
            where: { clerkId: user.id },
            update: {
                organizationId: organizationId,
                firstName,
                lastName,
                email,
                role: safeRole as any,
                onboardingComplete: true,
            },
            create: {
                clerkId: user.id,
                organizationId: organizationId,
                email,
                firstName,
                lastName,
                role: safeRole as any,
                onboardingComplete: true,
            },
        })

        // --- Upsert organization membership (always) ---
        const existingMembership = await db.organizationMembership.findFirst({
            where: { userId: dbUser.id, organizationId: organizationId },
        })
        if (!existingMembership) {
            await db.organizationMembership.create({
                data: {
                    userId: dbUser.id,
                    organizationId: organizationId,
                    role: isAdmin ? 'admin' : parsed.role,
                },
            })
        } else if (existingMembership.role !== (isAdmin ? 'admin' : parsed.role)) {
            // Update role if changed
            await db.organizationMembership.update({
                where: { id: existingMembership.id },
                data: { role: isAdmin ? 'admin' : parsed.role },
            })
        }

        // --- Store onboarding preferences and invite code ---
        await db.userPreferences.upsert({
            where: { userId: dbUser.id },
            update: { preferences: userPrefs, inviteCode },
            create: { userId: dbUser.id, preferences: userPrefs, inviteCode },
        })

        // --- Double-check user is linked to org ---
        const refreshedUser = await db.user.findUnique({ where: { clerkId: user.id } })
        if (!refreshedUser || !refreshedUser.organizationId) {
            console.error("[Onboarding] User not linked to organization after onboarding", { userId: user.id })
            throw new Error("User not linked to organization after onboarding")
        }

        // --- Update Clerk user metadata ---
        await setClerkUserMetadata(user.id, organizationSlug, parsed.role as SystemRole)

        // --- Mark onboarding complete in DB (redundant but safe) ---
        await db.user.update({
            where: { id: dbUser.id },
            data: { onboardingComplete: true },
        })

        return { success: true, organizationId, organizationSlug, userId: dbUser.id }
    } catch (error) {
        console.error("[Onboarding] Complete onboarding error:", error)
        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to complete onboarding"
        )
    }
}
