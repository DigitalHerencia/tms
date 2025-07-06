import { z } from "zod";
import { SystemRoles } from "@/types/abac";

// User invitation schema
export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum([
    SystemRoles.ADMIN,
    SystemRoles.DISPATCHER,
    SystemRoles.DRIVER,
    SystemRoles.COMPLIANCE,
    SystemRoles.MEMBER,
  ]),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
});

// Bulk user actions schema
export const bulkUserActionSchema = z.object({
  userIds: z.array(z.string().min(1, "User ID is required")),
  action: z.enum(["activate", "deactivate", "delete"]),
});

// Role update schema
export const updateRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  newRole: z.enum([
    SystemRoles.ADMIN,
    SystemRoles.DISPATCHER,
    SystemRoles.DRIVER,
    SystemRoles.COMPLIANCE,
    SystemRoles.MEMBER,
  ]),
});

// Audit log filter schema
export const auditLogFilterSchema = z.object({
  action: z.string().optional(),
  userId: z.string().optional(),
  dateRange: z.enum(["1d", "7d", "30d", "90d"]).optional(),
  searchTerm: z.string().optional(),
});

// Organization settings schema
export const organizationSettingsSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  description: z.string().optional(),
  maxUsers: z.number().min(1, "Max users must be at least 1").optional(),
  maxVehicles: z.number().min(1, "Max vehicles must be at least 1").optional(),
  settings: z.record(z.any()).optional(),
});

// Export validation functions
export const validateInviteUser = (data: unknown) => inviteUserSchema.safeParse(data);
export const validateBulkUserAction = (data: unknown) => bulkUserActionSchema.safeParse(data);
export const validateUpdateRole = (data: unknown) => updateRoleSchema.safeParse(data);
export const validateAuditLogFilter = (data: unknown) => auditLogFilterSchema.safeParse(data);
export const validateOrganizationSettings = (data: unknown) =>
  organizationSettingsSchema.safeParse(data);

// Type exports
export type InviteUserData = z.infer<typeof inviteUserSchema>;
export type BulkUserActionData = z.infer<typeof bulkUserActionSchema>;
export type UpdateRoleData = z.infer<typeof updateRoleSchema>;
export type AuditLogFilterData = z.infer<typeof auditLogFilterSchema>;
export type OrganizationSettingsData = z.infer<typeof organizationSettingsSchema>;
