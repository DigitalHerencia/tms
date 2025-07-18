/**
 * Webhook-specific types for Clerk integration
 * Separated from core auth types for better organization
 */

import type {
  ClerkUserMetadata,
  ClerkOrganizationMetadata,
  UserRole,
} from './auth';
import type { WebhookMetadata } from './metadata';

// Webhook event types
export type WebhookEventType =
  | 'email.created'
  | 'organization.created'
  | 'organization.deleted'
  | 'organization.updated'
  | 'organizationDomain.created'
  | 'organizationDomain.deleted'
  | 'organizationDomain.updated'
  | 'organizationInvitation.accepted'
  | 'organizationInvitation.created'
  | 'organizationInvitation.revoked'
  | 'organizationMembership.created'
  | 'organizationMembership.deleted'
  | 'organizationMembership.updated'
  | 'permission.created'
  | 'permission.deleted'
  | 'permission.updated'
  | 'role.created'
  | 'role.deleted'
  | 'role.updated'
  | 'session.created'
  | 'session.ended'
  | 'session.pending'
  | 'session.removed'
  | 'session.revoked'
  | 'user.created'
  | 'user.deleted'
  | 'user.updated';

// Generic webhook payload structure
export interface WebhookPayload<T = unknown> {
  [x: string]: unknown;
  data: T;
  type: WebhookEventType;
  object: string;
}

// User webhook event data structure
export interface UserWebhookData {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
    verification?: {
      status: string;
    };
  }>;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  public_metadata: Partial<ClerkUserMetadata>;
  private_metadata?: WebhookMetadata;
  organization_memberships?: Array<{
    id: string;
    organization: {
      id: string;
      name: string;
      slug: string;
      public_metadata: Partial<ClerkOrganizationMetadata>;
    };
    role: string;
    public_metadata: Partial<ClerkUserMetadata>;
  }>;
  created_at: number;
  updated_at: number;
}

// Organization webhook event data structure
export interface OrganizationWebhookData {
  id: string;
  name: string;
  slug: string;
  public_metadata: Partial<ClerkOrganizationMetadata>;
  private_metadata?: WebhookMetadata;
  members_count?: number;
  created_at: number;
  updated_at: number;
}

// Organization membership webhook event data structure
// All organization membership IDs must be in {prefix}_{32char_alphanum} format (see ID Format Spec)
export interface OrganizationMembershipWebhookData {
  id: string; // {prefix}_{32char_alphanum} format, not UUID
  organization: {
    id: string;
    name: string;
    slug: string;
    public_metadata: Partial<ClerkOrganizationMetadata>;
  };
  user_id?: string;
  public_user_data?: {
    user_id: string;
    first_name?: string;
    last_name?: string;
    profile_image_url?: string;
  };
  role: string;
  public_metadata: Partial<ClerkUserMetadata>;
  private_metadata?: WebhookMetadata;
  created_at: number;
  updated_at: number;
}

// Typed webhook payloads
export type UserWebhookPayload = WebhookPayload<UserWebhookData>;
export type OrganizationWebhookPayload =
  WebhookPayload<OrganizationWebhookData>;
export type OrganizationMembershipWebhookPayload =
  WebhookPayload<OrganizationMembershipWebhookData>;

// Webhook verification result
export interface WebhookVerificationResult {
  eventType: WebhookEventType;
  payload:
    | UserWebhookData
    | OrganizationWebhookData
    | OrganizationMembershipWebhookData;
}

// Database operation result types
export interface WebhookProcessingResult {
  success: boolean;
  operation: 'create' | 'update' | 'delete' | 'validate';
  entityId: string;
  entityType: 'user' | 'organization' | 'membership';
  message?: string;
  error?: string;
}
