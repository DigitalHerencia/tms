


export const usageInfoSchema = z.object({
  users: z.number().min(0),
  maxUsers: z.number().min(1),
  vehicles: z.number().min(0),
  maxVehicles: z.number().min(1),
});

export const billingInfoSchema = z.object({
  plan: z.string().min(1),
  status: z.string().min(1),
  currentPeriodEnds: z.string().min(1),
  usage: usageInfoSchema,
});

export type BillingInfoSchemaData = z.infer<typeof billingInfoSchema>;
import { z } from 'zod';
import { SystemRoles } from '@/types/abac';

// Invitation validation
export const invitationSchema = z.object({
  emailAddress: z.string().email('Valid email required'),
  role: z.enum(Object.values(SystemRoles) as [string, ...string[]]),
  redirectUrl: z.string().url().optional(),
});
export type InvitationSchemaData = z.infer<typeof invitationSchema>;

// Bulk invite validation
export const bulkInviteSchema = z.object({
  emails: z.string().min(1, 'At least one email required'),
  role: z.enum(Object.values(SystemRoles) as [string, ...string[]]),
});
export type BulkInviteSchemaData = z.infer<typeof bulkInviteSchema>;

// User role update validation
export const updateRoleSchema = z.object({
  orgId: z.string().min(1),
  userId: z.string().min(1),
  newRole: z.enum(Object.values(SystemRoles) as [string, ...string[]]),
});
export type UpdateRoleSchemaData = z.infer<typeof updateRoleSchema>;
