/**
 * Core type definitions for the FleetFusion TMS application
 *
 * This file contains the base types used throughout the application
 * TODO: Expand types as needed when implementing real backend services
 *
 * NOTE: All ABAC/auth types (UserRole, Permission, ResourceType, etc.)
 * are now defined in types/auth.ts or types/abac.ts. Do not define or export them here.
 *
 * IMPORTANT: If you need UserRole, Permission, ResourceType, etc., import them from '@/types/auth' or '@/types/abac'.
 */

// User and Authentication Types
export interface User {
  id: string;
  organizationId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: import('./auth').UserRole;
  permissions?: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  onboardingComplete: boolean;
  preferences?: Record<string, unknown>;
}

// Removed duplicate UserRole, Permission, ResourceType, etc. Use from types/auth or types/abac

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  maxUsers: number;
  billingEmail?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  dotNumber?: string;
  mcNumber?: string;
  settings: TenantSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  logo?: string;
  primaryColor?: string;
  companyAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
  dotNumber?: string;
  mcNumber?: string;
  timeZone: string;
  features: {
    dispatch: boolean;
    maintenance: boolean;
    ifta: boolean;
    analytics: boolean;
    compliance: boolean;
    accounting: boolean;
  };
}

export type SubscriptionTier = 'starter' | 'growth' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'trial' | 'cancelled';

// Dashboard Types
export interface DashboardMetrics {
  activeLoads: number;
  totalLoads: number;
  activeDrivers: number;
  totalDrivers: number;
  availableVehicles: number;
  totalVehicles: number;
  maintenanceVehicles: number;
  criticalAlerts: number;
  complianceScore: number;
  revenue: number;
  fuelCosts: number;
}

// Common Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type { Metadata, WebhookMetadata, ComplianceMetadata } from './metadata';
export type { GlobalSearchResultItem } from './search';
export type { Notification, NotificationActionResult } from './notifications';
export type { MetadataRecord } from './metadata';
\nexport * from './prisma-models';

