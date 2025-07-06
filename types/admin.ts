import { SystemRole } from "@/types/abac";

// Core admin data interfaces
export interface AdminDashboardData {
  organizationStats: OrganizationStats;
  userData: UserManagementData;
  billing: BillingInfo;
  systemHealth: SystemHealth;
  recentActivity: AuditLogEntry[];
}

export interface OrganizationStats {
  userCount: number;
  activeUserCount: number;
  vehicleCount: number;
  driverCount: number;
  loadCount: number;
  // Growth metrics
  userGrowth?: number;
  activeUserGrowth?: number;
  vehicleGrowth?: number;
  driverGrowth?: number;
  loadGrowth?: number;
}

export interface UserManagementData {
  users: AdminUser[];
  totalUsers: number;
  activeUsers: number;
  pendingInvitations: number;
}

export interface AdminUser {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  role: SystemRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
  profileImage: string | null;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  target: string;
  targetType: string;
  metadata: Record<string, any>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface BillingInfo {
  plan: string;
  status: string;
  currentPeriodEnds: string;
  usage: {
    users: number;
    maxUsers: number;
    vehicles: number;
    maxVehicles: number;
  };
  billingHistory: BillingHistoryEntry[];
}

export interface BillingHistoryEntry {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  description: string;
}

export interface SystemHealth {
  uptime: number;
  databaseStatus: "healthy" | "degraded" | "down";
  queueStatus: "healthy" | "degraded" | "down";
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  activeConnections: number;
  lastUpdated: Date;
}

// Admin operation result types
export interface AdminOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

// Bulk operation types
export interface BulkOperationResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  failures: Array<{
    id: string;
    error: string;
  }>;
}

// Admin dashboard metrics
export interface AdminMetrics {
  totalOrganizations: number;
  totalUsers: number;
  activeUsers: number;
  systemUptime: number;
  avgResponseTime: number;
  errorRate: number;
}

// Organization management types
export interface OrganizationDetails {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  vehicleCount: number;
  billingStatus: string;
  subscriptionPlan: string;
}

// Admin notification types
export interface AdminNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
}
