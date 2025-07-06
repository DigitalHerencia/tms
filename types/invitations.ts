/**
 * Invitation System Types
 *
 * Consolidated types for the invitation system, including interfaces,
 * enums, and type definitions for all invitation-related functionality.
 */

import { SystemRole } from "./abac";

// Core invitation status enum
export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REVOKED = "revoked",
  EXPIRED = "expired",
}

// Base invitation interface from database
export interface Invitation {
  id: string;
  organizationId: string;
  inviterUserId: string;
  inviteeUserId?: string;
  email: string;
  role: SystemRole;
  status: InvitationStatus;
  token: string;
  clerkInvitationId?: string;
  redirectUrl?: string;
  bypassOnboarding: boolean;
  metadata?: Record<string, any>;
  expiresAt: Date;
  acceptedAt?: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  inviter?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  invitee?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

// Input data for creating invitations
export interface CreateInvitationData {
  email: string;
  role: SystemRole;
  redirectUrl?: string;
  bypassOnboarding?: boolean;
  expiresInDays?: number;
  metadata?: Record<string, any>;
}

// Input data for bulk invitations
export interface BulkCreateInvitationData {
  emails: string[];
  role: SystemRole;
  redirectUrl?: string;
  bypassOnboarding?: boolean;
  expiresInDays?: number;
  metadata?: Record<string, any>;
}

// Input data for updating invitations
export interface UpdateInvitationData {
  role?: SystemRole;
  bypassOnboarding?: boolean;
  metadata?: Record<string, any>;
}

// Invitation acceptance data
export interface AcceptInvitationData {
  token: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

// Invitation metadata for Clerk integration
export interface InvitationMetadata {
  role: SystemRole;
  bypassOnboarding: boolean;
  invitedBy: string;
  invitedAt: string;
  organizationId: string;
  organizationName?: string;
}

// Display formats for UI components
export interface InvitationDisplay {
  id: string;
  email: string;
  role: SystemRole;
  status: InvitationStatus;
  inviterName: string;
  organizationName: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  bypassOnboarding: boolean;
  metadata?: Record<string, any>;
}

// Filter options for invitation queries
export interface InvitationFilters {
  status?: InvitationStatus | InvitationStatus[];
  role?: SystemRole | SystemRole[];
  email?: string;
  inviterUserId?: string;
  organizationId?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  expiresAfter?: Date;
  expiresBefore?: Date;
}

// Pagination for invitation lists
export interface InvitationPagination {
  page: number;
  limit: number;
  sortBy?: "createdAt" | "expiresAt" | "email" | "status";
  sortOrder?: "asc" | "desc";
}

// Invitation statistics for dashboards
export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  revoked: number;
  expired: number;
  expiringSoon: number; // Expiring within 24 hours
  byRole: Record<SystemRole, number>;
  recentActivity: {
    sent: number;
    accepted: number;
    revoked: number;
  };
}

// Action result types
export interface InvitationActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Bulk operation results
export interface BulkInvitationResult {
  success: boolean;
  successful: number;
  failed: number;
  errors: Array<{
    email: string;
    error: string;
  }>;
  invitations?: Invitation[];
}

// Form data types for UI components
export interface InvitationFormData {
  email: string;
  role: SystemRole | "";
  bypassOnboarding: boolean;
  expiresInDays: number;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}

export interface BulkInvitationFormData {
  emails: string;
  role: SystemRole | "";
  bypassOnboarding: boolean;
  expiresInDays: number;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}

// Event types for invitation system
export type InvitationEvent =
  | "invitation.created"
  | "invitation.sent"
  | "invitation.accepted"
  | "invitation.revoked"
  | "invitation.expired"
  | "invitation.reminded";

// Invitation event payload
export interface InvitationEventPayload {
  type: InvitationEvent;
  invitationId: string;
  organizationId: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Constants
export const INVITATION_DEFAULTS = {
  EXPIRES_IN_DAYS: 7,
  REMINDER_THRESHOLD_DAYS: 1,
  MAX_BULK_INVITATIONS: 50,
} as const;

// Role display mappings
export const ROLE_DISPLAY_NAMES: Record<SystemRole, string> = {
  admin: "Administrator",
  dispatcher: "Dispatcher",
  driver: "Driver",
  compliance: "Compliance Officer",
  member: "Member",
} as const;

// Status display mappings
export const STATUS_DISPLAY_NAMES: Record<InvitationStatus, string> = {
  [InvitationStatus.PENDING]: "Pending",
  [InvitationStatus.ACCEPTED]: "Accepted",
  [InvitationStatus.REVOKED]: "Revoked",
  [InvitationStatus.EXPIRED]: "Expired",
} as const;

// Role colors for UI
export const ROLE_COLORS: Record<SystemRole, string> = {
  admin: "bg-red-100 text-red-800",
  dispatcher: "bg-blue-100 text-blue-800",
  driver: "bg-green-100 text-green-800",
  compliance: "bg-purple-100 text-purple-800",
  member: "bg-gray-100 text-gray-800",
} as const;

// Status colors for UI
export const STATUS_COLORS: Record<InvitationStatus, string> = {
  [InvitationStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [InvitationStatus.ACCEPTED]: "bg-green-100 text-green-800",
  [InvitationStatus.REVOKED]: "bg-red-100 text-red-800",
  [InvitationStatus.EXPIRED]: "bg-gray-100 text-gray-800",
} as const;
