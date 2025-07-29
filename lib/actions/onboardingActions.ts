"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { currentUser } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import type { PreferencesData } from "@/types/onboarding"
import type { OnboardingStepData } from "@/types/onboarding"
import type { CompleteOnboardingData } from "@/schemas/onboarding"
import { SystemRole, getPermissionsForRole } from "@/types/abac"
import db from "@/lib/database/db"
import { generateSlug, ensureUniqueSlug } from "../utils/slugUtils"
import { getOrganizationInvitationById } from "./invitationActions"

// Infer the resolved client type
type ResolvedClerkClient = Awaited<ReturnType<typeof clerkClient>>

type SetClerkMetadataResult = {
  success: boolean
  error?: string
}

function handleError(error: any, context?: string) {
    console.error(context ? `[${context}]` : '', error)
    return { success: false, error: error?.message || "An error occurred" }
}

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
            where: { id: user.id },
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
            case 'profile': {
                // Validate required fields
                const firstName = (data as any).firstName?.trim();
                const lastName = (data as any).lastName?.trim();
                if (!firstName || !lastName) {
                    throw new Error('First name and last name are required.');
                }
                await db.user.update({
                    where: { id: dbUser.id },
                    data: {
                        firstName,
                        lastName,
                        onboardingSteps: updatedSteps,
                    },
                });
                break;
            }
            
            case 'company':
                // Company update logic - use organization relationship
                if (dbUser.organizationId) {
                    await db.organization.update({
                        where: { id: dbUser.organizationId },
                        data: {
                            dotNumber: (data as any).dotNumber,
                            mcNumber: (data as any).mcNumber,
                            address: (data as any).address,
                            city: (data as any).city,
                            state: (data as any).state,
                            zip: (data as any).zip,
                            phone: (data as any).phone,
                            settings: {
                                timezone: (data as any).timezone || "America/Denver",
                                dateFormat: (data as any).dateFormat || "MM/dd/yyyy",
                                distanceUnit: (data as any).distanceUnit || "miles",
                                fuelUnit: (data as any).fuelUnit || "gallons",
                            },
                        },
                    })
                }
                
                await db.user.update({
                    where: { id: dbUser.id },
                    data: { onboardingSteps: updatedSteps },
                })
                break

            case 'preferences': {
                // Preferences update logic: persist to DB and Clerk
                const preferences = data as PreferencesData;
                await db.user.update({
                    where: { id: dbUser.id },
                    data: {
                        onboardingSteps: updatedSteps,
                        // Persist preferences to DB (as JSON)
                        preferences: JSON.parse(JSON.stringify(preferences)),
                    },
                });
                // Persist preferences to Clerk metadata (publicMetadata)
                const actualClient: ResolvedClerkClient = await clerkClient();
                await actualClient.users.updateUserMetadata(user.id, {
                    publicMetadata: {
                        preferences,
                    },
                });
                break;
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
            where: { id: user.id },
            include: { organization: true },
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
        
        // Redirect to dashboard using organizationId (not slug)
        if (dbUser.organizationId) {
            redirect(`/app/${dbUser.organizationId}/dashboard`)
        } else {
            redirect("/app/dashboard")
        }
    } catch (error) {
        return handleError(error, "Complete Onboarding")
    }
}

/**
 * Server action to set Clerk metadata after custom organization creation
 * Updates user metadata only (no Clerk organization creation since orgs are disabled)
 */
export async function setClerkUserMetadata(
    userId: string,
    organizationId: string,
    role: SystemRole
): Promise<SetClerkMetadataResult> {
    const actualClient: ResolvedClerkClient = await clerkClient()

    try {
        // Get permissions for the role
        const userPermissions = getPermissionsForRole(role)

        // Update Clerk user metadata with organization info and onboardingComplete
        await actualClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                organizationId,
                onboardingComplete: true,
            },
            publicMetadata: {
                organizationId,
                role,
                permissions: userPermissions,
                isActive: true,
                onboardingComplete: true,
            },
        });

        // Verify the metadata was set correctly
        const updatedUser = await actualClient.users.getUser(userId)
        const metadata = updatedUser.publicMetadata as any
        
        if (metadata.role !== role || metadata.organizationId !== organizationId) {
            console.error("❌ Clerk metadata verification failed:", {
                expected: { role, organizationId },
                actual: { role: metadata.role, organizationId: metadata.organizationId }
            })
            return { success: false, error: "Metadata verification failed" }
        }

        console.log("✅ Clerk metadata successfully set and verified:", { userId, role, organizationId })
        return { success: true };
    } catch (error: any) {
        console.error("Error setting Clerk metadata:", error)
        return { 
            success: false, 
            error: error.message || "Failed to update user metadata"
        }
    }
}

/**
 * Complete onboarding process with new stepper flow
 */
export async function completeOnboarding(data: CompleteOnboardingData) {
    try {
        const user = await currentUser()
        if (!user) {
            throw new Error("User not authenticated")
        }

        const { role, companyName, inviteCode, organizationId: invitedOrgId, ...rest } = data
        
        // Check if user exists in database
        let dbUser = await db.user.findUnique({
            where: { id: user.id },
        });
        // Validate required fields
        const firstName = data.firstName?.trim();
        const lastName = data.lastName?.trim();
        if (!firstName || !lastName) {
            throw new Error('First name and last name are required to complete onboarding.');
        }
        if (!dbUser) {
            // Create user if not exists
            dbUser = await db.user.create({
                data: {
                    id: user.id,
                    email: data.email,
                    firstName,
                    lastName,
                    role: role as any,
                    onboardingComplete: false,
                }
            });
        } else {
            // Always update names if present
            await db.user.update({
                where: { id: dbUser.id },
                data: {
                    firstName,
                    lastName,
                },
            });
        }

        // Handle different paths based on role
        if (role === "admin") {
            // Admin creates a new organization
            const baseSlug = generateSlug(companyName)
            
            // Check if slug exists to ensure uniqueness
            const uniqueSlug = await ensureUniqueSlug(baseSlug, async (slug) => {
                const exists = await db.organization.findUnique({ where: { slug } })
                return !!exists
            })
            
            // Create new organization with proper UUID
            const organization = await db.organization.create({
                data: {
                    name: companyName,
                    slug: uniqueSlug,
                    dotNumber: data.dotNumber,
                    mcNumber: data.mcNumber,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zip: data.zip,
                    phone: data.phone,
                    // Create membership for the creator with admin role
                    memberships: {
                        create: {
                            id: crypto.randomUUID(), // <-- Add this line
                            userId: dbUser.id,
                            role: "admin",
                        }
                    }
                }
            })
            
            // Update user with organization
            await db.user.update({
                where: { id: dbUser.id },
                data: {
                    organizationId: organization.id,
                    role: "admin",
                    onboardingComplete: true,
                    onboardingSteps: {
                        profile: true,
                        company: true,
                        preferences: true,
                    },
                }
            })
            
            // Set Clerk metadata for organization association
            await setClerkUserMetadata(user.id, organization.id, "admin")
            
            // Redirect to dashboard with organization ID (not slug)
            redirect(`/${organization.id}/dashboard`)
        } else {
            // For non-admin: Handle joining existing organization
            if (!invitedOrgId) {
                throw new Error("Organization ID is required for non-admin users")
            }
            
            // Verify organization exists
            const organization = await db.organization.findUnique({
                where: { id: invitedOrgId }
            })
            
            if (!organization) {
                throw new Error("Organization not found")
            }
            
            let invitation
            if (inviteCode) {
                const inviteResult = await getOrganizationInvitationById(
                    organization.id,
                    inviteCode
                )

                if (!inviteResult.success) {
                    throw new Error(inviteResult.error || "Invalid invite code")
                }

                invitation = inviteResult.data as any

                if (
                    invitation.organizationId !== organization.id ||
                    invitation.role !== role
                ) {
                    throw new Error("Invitation does not match organization or role")
                }

                if (invitation.status !== "pending") {
                    throw new Error("Invitation has already been used or revoked")
                }

                if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
                    throw new Error("Invitation has expired")
                }
            }

            // Create membership for user
            await db.organizationMembership.create({
                data: {
                    id: crypto.randomUUID(),
                    userId: dbUser.id,
                    organizationId: organization.id,
                    role: role as any,
                },
            })
            
            // Update user with organization
            await db.user.update({
                where: { id: dbUser.id },
                data: {
                    organizationId: organization.id,
                    role: role as any,
                    onboardingComplete: true,
                }
            })
            
            // Set Clerk metadata
            await setClerkUserMetadata(user.id, organization.id, role as SystemRole)
            
            // Redirect to dashboard with organization ID (not slug)
            redirect(`/${organization.id}/dashboard`)
        }
    } catch (error) {
        return handleError(error, "Complete Onboarding")
    }
}
