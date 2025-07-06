import { z } from "zod";
import { SystemRoles } from "@/types/abac";

/**
 * Onboarding Schemas - Comprehensive validation for the multi-step onboarding process
 */

// Personal Information Step
export const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Valid email is required"),
});

// Role Selection Step
export const RoleSelectionSchema = z.object({
  role: z.enum(
    [
      SystemRoles.ADMIN,
      SystemRoles.DISPATCHER,
      SystemRoles.DRIVER,
      SystemRoles.COMPLIANCE,
      SystemRoles.MEMBER,
    ] as const,
    {
      required_error: "Role selection is required",
    },
  ),
});

// Company Setup Step (for admins)
export const CompanySetupSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name too long"),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
  state: z.string().min(2, "State must be at least 2 characters").optional(),
  zip: z.string().min(5, "ZIP code must be at least 5 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 characters").optional(),
});

// Employee Join Step (for non-admins)
export const EmployeeJoinSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  inviteCode: z.string().optional(),
});

// Complete Onboarding Schema - combines all steps
export const CompleteOnboardingSchema = PersonalInfoSchema.merge(RoleSelectionSchema)
  .merge(
    z.object({
      // Company setup fields (required for admin)
      companyName: z.string().optional(),
      dotNumber: z.string().optional(),
      mcNumber: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      phone: z.string().optional(),
      // Employee join fields (required for non-admin)
      organizationId: z.string().optional(),
      inviteCode: z.string().optional(),
    }),
  )
  .refine(
    (data) => {
      // Admin must provide company name
      if (data.role === SystemRoles.ADMIN) {
        return data.companyName && (data.companyName as string).length >= 2;
      }
      // Non-admin must provide organization ID
      return data.organizationId && (data.organizationId as string).length >= 1;
    },
    {
      message: "Admin must provide company name, non-admin must provide organization ID",
      path: ["companyName"],
    },
  );

// Validation for organization joining
export const JoinOrganizationSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  inviteCode: z.string().optional(),
});

// Export types
export type PersonalInfoData = z.infer<typeof PersonalInfoSchema>;
export type RoleSelectionData = z.infer<typeof RoleSelectionSchema>;
export type CompanySetupData = z.infer<typeof CompanySetupSchema>;
export type EmployeeJoinData = z.infer<typeof EmployeeJoinSchema>;
export type CompleteOnboardingData = z.infer<typeof CompleteOnboardingSchema>;
export type JoinOrganizationData = z.infer<typeof JoinOrganizationSchema>;
