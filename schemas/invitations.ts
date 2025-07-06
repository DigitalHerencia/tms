/**
 * Invitation Validation Schemas
 *
 * Zod schemas for validating invitation-related data inputs.
 */

import { z } from "zod";
import { SystemRoles } from "@/types/abac";
import { INVITATION_DEFAULTS } from "@/types/invitations";

// Base invitation schema for creating invitations
export const invitationSchema = z.object({
  emailAddress: z
    .string()
    .email("Valid email address required")
    .min(1, "Email address is required")
    .max(254, "Email address too long"),
  role: z.enum(Object.values(SystemRoles) as [string, ...string[]], {
    errorMap: () => ({ message: "Valid role required" }),
  }),
  redirectUrl: z.string().url("Valid URL required").optional(),
});

// Schema for creating single invitations
export const createInvitationSchema = invitationSchema.extend({
  bypassOnboarding: z.boolean().default(false),
  expiresInDays: z
    .number()
    .int()
    .min(1, "Expiration must be at least 1 day")
    .max(365, "Expiration cannot exceed 365 days")
    .default(INVITATION_DEFAULTS.EXPIRES_IN_DAYS),
  metadata: z.record(z.any()).optional(),
});

// Schema for bulk invitations
export const bulkInvitationSchema = z.object({
  emails: z
    .array(z.string().email("Valid email address required"))
    .min(1, "At least one email address required")
    .max(
      INVITATION_DEFAULTS.MAX_BULK_INVITATIONS,
      `Maximum ${INVITATION_DEFAULTS.MAX_BULK_INVITATIONS} invitations allowed`,
    ),
  role: z.enum(Object.values(SystemRoles) as [string, ...string[]], {
    errorMap: () => ({ message: "Valid role required" }),
  }),
  redirectUrl: z.string().url("Valid URL required").optional(),
  bypassOnboarding: z.boolean().default(false),
  expiresInDays: z
    .number()
    .int()
    .min(1, "Expiration must be at least 1 day")
    .max(365, "Expiration cannot exceed 365 days")
    .default(INVITATION_DEFAULTS.EXPIRES_IN_DAYS),
  metadata: z.record(z.any()).optional(),
});

// Schema for accepting invitations
export const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Invitation token required"),
  firstName: z.string().min(1, "First name required").max(50, "First name too long").optional(),
  lastName: z.string().min(1, "Last name required").max(50, "Last name too long").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .optional(),
});

// Schema for updating invitations
export const updateInvitationSchema = z.object({
  role: z.enum(Object.values(SystemRoles) as [string, ...string[]]).optional(),
  bypassOnboarding: z.boolean().optional(),
  expiresInDays: z
    .number()
    .int()
    .min(1, "Expiration must be at least 1 day")
    .max(365, "Expiration cannot exceed 365 days")
    .optional(),
  metadata: z.record(z.any()).optional(),
});

// Schema for invitation filters
export const invitationFiltersSchema = z.object({
  status: z
    .enum(["pending", "accepted", "revoked", "expired"])
    .or(z.array(z.enum(["pending", "accepted", "revoked", "expired"])))
    .optional(),
  role: z
    .enum(Object.values(SystemRoles) as [string, ...string[]])
    .or(z.array(z.enum(Object.values(SystemRoles) as [string, ...string[]])))
    .optional(),
  email: z.string().optional(),
  inviterUserId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
  expiresAfter: z.date().optional(),
  expiresBefore: z.date().optional(),
});

// Schema for invitation pagination
export const invitationPaginationSchema = z.object({
  page: z.number().int().min(1, "Page must be at least 1").default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
  sortBy: z.enum(["createdAt", "expiresAt", "email", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Form schemas for UI components
export const invitationFormSchema = z.object({
  email: z.string().email("Valid email address required").min(1, "Email address is required"),
  role: z.enum(Object.values(SystemRoles) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
  bypassOnboarding: z.boolean().default(false),
  expiresInDays: z
    .number()
    .int()
    .min(1, "Expiration must be at least 1 day")
    .max(365, "Expiration cannot exceed 365 days")
    .default(INVITATION_DEFAULTS.EXPIRES_IN_DAYS),
  redirectUrl: z.string().url("Valid URL required").optional().or(z.literal("")),
  metadata: z.record(z.any()).optional(),
});

export const bulkInvitationFormSchema = z.object({
  emails: z
    .string()
    .min(1, "At least one email address required")
    .transform((val) => {
      const emails = val
        .split(/[,\n\r\t]+/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      // Validate each email
      const emailSchema = z.string().email();
      for (const email of emails) {
        emailSchema.parse(email);
      }

      if (emails.length > INVITATION_DEFAULTS.MAX_BULK_INVITATIONS) {
        throw new Error(`Maximum ${INVITATION_DEFAULTS.MAX_BULK_INVITATIONS} invitations allowed`);
      }

      return emails;
    }),
  role: z.enum(Object.values(SystemRoles) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
  bypassOnboarding: z.boolean().default(false),
  expiresInDays: z
    .number()
    .int()
    .min(1, "Expiration must be at least 1 day")
    .max(365, "Expiration cannot exceed 365 days")
    .default(INVITATION_DEFAULTS.EXPIRES_IN_DAYS),
  redirectUrl: z.string().url("Valid URL required").optional().or(z.literal("")),
  metadata: z.record(z.any()).optional(),
});

// Type exports
export type InvitationSchemaData = z.infer<typeof invitationSchema>;
export type CreateInvitationSchemaData = z.infer<typeof createInvitationSchema>;
export type BulkInvitationSchemaData = z.infer<typeof bulkInvitationSchema>;
export type AcceptInvitationSchemaData = z.infer<typeof acceptInvitationSchema>;
export type UpdateInvitationSchemaData = z.infer<typeof updateInvitationSchema>;
export type InvitationFiltersSchemaData = z.infer<typeof invitationFiltersSchema>;
export type InvitationPaginationSchemaData = z.infer<typeof invitationPaginationSchema>;
export type InvitationFormSchemaData = z.infer<typeof invitationFormSchema>;
export type BulkInvitationFormSchemaData = z.infer<typeof bulkInvitationFormSchema>;
