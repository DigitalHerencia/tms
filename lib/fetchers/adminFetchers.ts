"use server";

import prisma from "@/lib/database/db";
import { requireAdminForOrg } from "@/lib/auth/utils";
import { CACHE_TTL, getCachedData, setCachedData } from "@/lib/cache/auth-cache";
import { handleDatabaseError } from "@/lib/database/db";
import type {
  AdminUser,
  AuditLogEntry,
  BillingInfo,
  OrganizationStats,
  SystemHealth,
  UserManagementData,
  OrganizationDetails,
} from "@/types/admin";

interface AuditLogFilters {
  action?: string;
  userId?: string;
  dateRange?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get comprehensive organization statistics
 */
export async function getOrganizationStats(orgId: string): Promise<OrganizationStats> {
  await requireAdminForOrg(orgId);

  const cacheKey: string = `admin:stats:${orgId}`;
  const cached: OrganizationStats | null = getCachedData(cacheKey) as OrganizationStats | null;
  if (cached) return cached;

  try {
    const [userCount, activeUserCount, vehicleCount, driverCount, loadCount]: number[] =
      await Promise.all([
        prisma.user.count({ where: { organizationId: orgId } }),
        prisma.user.count({ where: { organizationId: orgId, isActive: true } }),
        prisma.vehicle.count({ where: { organizationId: orgId } }),
        prisma.user.count({ where: { organizationId: orgId, role: "driver" } }),
        prisma.load.count({ where: { organizationId: orgId } }),
      ]);

    const stats: OrganizationStats = {
      userCount: userCount ?? 0,
      activeUserCount: activeUserCount ?? 0,
      vehicleCount: vehicleCount ?? 0,
      driverCount: driverCount ?? 0,
      loadCount: loadCount ?? 0,
    };

    setCachedData(cacheKey, stats, CACHE_TTL.DATA);
    return stats;
  } catch (error: any) {
    handleDatabaseError(error);
  }
}

/**
 * Get detailed organization information
 */
export async function getOrganizationDetails(orgId: string): Promise<OrganizationDetails> {
  await requireAdminForOrg(orgId);

  try {
    const org: any = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        users: { select: { id: true } },
        vehicles: { select: { id: true } },
        subscription: true,
      },
    });

    if (!org) {
      throw new Error("Organization not found");
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      settings: (org.settings as Record<string, any>) || {},
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      memberCount: org.users.length,
      vehicleCount: org.vehicles.length,
      billingStatus: org.subscription?.status || "inactive",
      subscriptionPlan: org.subscription?.plan || "free",
    };
  } catch (error: any) {
    handleDatabaseError(error);
  }
}

/**
 * Get organization users with detailed information
 */
export async function getOrganizationUsers(orgId: string): Promise<UserManagementData> {
  await requireAdminForOrg(orgId);

  try {
    const users: Array<{
      id: string;
      clerkId: string;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      role: string;
      isActive: boolean;
      createdAt: Date;
      lastLogin: Date | null;
      profileImage: string | null;
    }> = await prisma.user.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
        profileImage: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingInvitations: number = await prisma.invitation.count({
      where: { organizationId: orgId, status: "pending" },
    });

    const adminUsers: AdminUser[] = users.map(
      (user): AdminUser => ({
        id: user.id,
        clerkId: user.clerkId,
        email: user.email || "",
        firstName: user.firstName,
        lastName: user.lastName,
        displayName:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown User",
        role: user.role as any,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        profileImage: user.profileImage,
      }),
    );

    return {
      users: adminUsers,
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive).length,
      pendingInvitations,
    };
  } catch (error: any) {
    handleDatabaseError(error);
  }
}

/**
 * Get audit logs with filtering support
 */
export async function getAuditLogs(
  orgId: string,
  filters?: AuditLogFilters,
): Promise<AuditLogEntry[]> {
  await requireAdminForOrg(orgId);

  try {
    const where: Record<string, any> = { organizationId: orgId };

    if (filters?.action) {
      where.action = { contains: filters.action, mode: "insensitive" };
    }

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.dateRange) {
      const now: Date = new Date();
      const daysAgo: number = parseInt(filters.dateRange.replace("d", ""));
      const startDate: Date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      where.timestamp = { gte: startDate };
    }

    if (filters?.searchTerm) {
      where.OR = [
        { action: { contains: filters.searchTerm, mode: "insensitive" } },
        { entityType: { contains: filters.searchTerm, mode: "insensitive" } },
        { entityId: { contains: filters.searchTerm, mode: "insensitive" } },
      ];
    }

    const logs: Array<any> = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
      },
      orderBy: { timestamp: "desc" },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    return logs.map(
      (log: any): AuditLogEntry => ({
        id: log.id,
        userId: log.userId,
        userEmail: log.user.email || "Unknown",
        action: log.action,
        target: log.entityId,
        targetType: log.entityType,
        metadata: (log.metadata as Record<string, any>) || {},
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.timestamp.toISOString(),
      }),
    );
  } catch (error: any) {
    handleDatabaseError(error);
  }
}

/**
 * Get billing information
 */
export async function getBillingInfo(orgId: string): Promise<BillingInfo> {
  await requireAdminForOrg(orgId);

  try {
    const org: any = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        subscription: true,
        users: { select: { id: true, isActive: true } },
        vehicles: { select: { id: true, isActive: true } },
      },
    });

    if (!org) {
      throw new Error("Organization not found");
    }

    const subscription: any = org.subscription;
    const activeUsers: number = org.users.filter((u: any) => u.isActive).length;
    const activeVehicles: number = org.vehicles.filter((v: any) => v.isActive).length;

    return {
      plan: subscription?.plan || "free",
      status: subscription?.status || "inactive",
      currentPeriodEnds: subscription?.currentPeriodEnd?.toISOString() || "",
      usage: {
        users: activeUsers,
        maxUsers: subscription?.maxUsers || org.maxUsers,
        vehicles: activeVehicles,
        maxVehicles: subscription?.maxVehicles || 10,
      },
      billingHistory: [], // TODO: Implement billing history
    };
  } catch (error: any) {
    handleDatabaseError(error);
  }
}

/**
 * Get system health metrics
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  try {
    const startTime: number = Date.now();

    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime: number = Date.now() - startTime;

    // Get basic metrics
    const activeConnections: any[] = (await prisma.$queryRaw`
      SELECT count(*) as count FROM pg_stat_activity WHERE state = 'active'
    `) as any[];

    return {
      uptime: process.uptime(),
      databaseStatus: dbResponseTime < 1000 ? "healthy" : "degraded",
      queueStatus: "healthy", // TODO: Implement queue monitoring
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      cpuUsage: 0, // TODO: Implement CPU monitoring
      diskUsage: 0, // TODO: Implement disk monitoring
      activeConnections: activeConnections[0]?.count || 0,
      lastUpdated: new Date(),
    };
  } catch (error: any) {
    return {
      uptime: 0,
      databaseStatus: "down",
      queueStatus: "down",
      memoryUsage: 0,
      cpuUsage: 0,
      diskUsage: 0,
      activeConnections: 0,
      lastUpdated: new Date(),
    };
  }
}

/**
 * Get user by ID with admin context
 */
export async function getAdminUser(orgId: string, userId: string): Promise<AdminUser | null> {
  await requireAdminForOrg(orgId);

  try {
    const user: {
      id: string;
      clerkId: string;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      role: string;
      isActive: boolean;
      createdAt: Date;
      lastLogin: Date | null;
      profileImage: string | null;
    } | null = await prisma.user.findFirst({
      where: { id: userId, organizationId: orgId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
        profileImage: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email || "",
      firstName: user.firstName,
      lastName: user.lastName,
      displayName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown User",
      role: user.role as any,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      profileImage: user.profileImage,
    };
  } catch (error: any) {
    handleDatabaseError(error);
  }
}
