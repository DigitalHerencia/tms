// Auto-generated enums and interfaces reflecting Prisma schema models
// This file should stay in sync with prisma/schema.prisma

export enum UserRole {
  admin = 'admin',
  manager = 'manager',
  user = 'user',
  dispatcher = 'dispatcher',
  driver = 'driver',
  compliance = 'compliance',
  accountant = 'accountant',
  viewer = 'viewer',
}

export enum SubscriptionTier {
  starter = 'starter',
  growth = 'growth',
  enterprise = 'enterprise',
}

export enum SubscriptionStatus {
  active = 'active',
  inactive = 'inactive',
  trial = 'trial',
  cancelled = 'cancelled',
}

export enum VehicleStatus {
  active = 'active',
  inactive = 'inactive',
  maintenance = 'maintenance',
  decommissioned = 'decommissioned',
}

export enum DriverStatus {
  active = 'active',
  inactive = 'inactive',
  suspended = 'suspended',
  terminated = 'terminated',
}

export enum LoadStatus {
  pending = 'pending',
  assigned = 'assigned',
  in_transit = 'in_transit',
  delivered = 'delivered',
  cancelled = 'cancelled',
  draft = 'draft',
  posted = 'posted',
  booked = 'booked',
  confirmed = 'confirmed',
  dispatched = 'dispatched',
  at_pickup = 'at_pickup',
  picked_up = 'picked_up',
  en_route = 'en_route',
  at_delivery = 'at_delivery',
  pod_required = 'pod_required',
  completed = 'completed',
  invoiced = 'invoiced',
  paid = 'paid',
  problem = 'problem',
}

export enum LoadPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
  urgent = 'urgent',
}

export enum InvitationStatus {
  pending = 'pending',
  accepted = 'accepted',
  revoked = 'revoked',
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  maxUsers: number;
  billingEmail?: string | null;
  dotNumber?: string | null;
  mcNumber?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  organizationId?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImage?: string | null;
  role: UserRole;
  permissions?: unknown;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  token: string;
  expiresAt?: Date | null;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
}
