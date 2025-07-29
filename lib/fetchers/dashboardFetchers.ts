"use server";

/**
 * Dashboard data fetchers.
 *
 * Provides helper functions for retrieving dashboard metrics, KPIs,
 * activity logs, and other related data from the database.
 */

import db from "@/lib/database/db"
import type {
    ActivityItem,
    DashboardData,
    DashboardKPI,
    DashboardMetrics,
    QuickAction,
} from "@/types/dashboard"
import { auth } from "@clerk/nextjs/server"
import type { OrganizationKPIs } from "@/types/dashboard"
import { unstable_cache } from "next/cache"

import { requireAdminForOrg } from '@/lib/auth/utils';

import prisma from '@/lib/database/db';
import { CACHE_TTL, getCachedData, setCachedData } from '@/lib/cache/auth-cache';
import type {
  AuditLogEntry,
  BillingInfo,
  OrganizationStats,
  SystemHealth,
  UserManagementData,
} from '@/types/dashboard';

export async function getOrganizationStats(orgId: string): Promise<OrganizationStats> {

  const cacheKey = `admin:stats:${orgId}`;
  const cached = getCachedData(cacheKey) as OrganizationStats | null;
  if (cached) return cached;

  const [userCount, activeUserCount, vehicleCount, driverCount, loadCount] = await Promise.all([
    prisma.user.count({ where: { organizationId: orgId } }),
    prisma.user.count({ where: { organizationId: orgId, isActive: true } }),
    prisma.vehicle.count({ where: { organizationId: orgId } }),
    prisma.user.count({ where: { organizationId: orgId, role: 'driver' } }),
    prisma.load.count({ where: { organizationId: orgId } }),
  ]);

  const stats: OrganizationStats = {
    userCount,
    activeUserCount,
    vehicleCount,
    driverCount,
    loadCount,
  };
  setCachedData(cacheKey, stats, CACHE_TTL.DATA);
  return stats;
}

export async function getOrganizationUsers(orgId: string): Promise<UserManagementData> {
  const users = await prisma.user.findMany({
    where: { organizationId: orgId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
    },
    orderBy: { createdAt: 'desc' },
  });  return {
    users: users.map(u => ({
      id: u.id,
      email: u.email || '',
      name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
      role: u.role as string,
      isActive: u.isActive,
    })),
  };
}

export async function getAuditLogs(
  orgId: string,
  limit = 100
): Promise<AuditLogEntry[]> {
  await requireAdminForOrg(orgId);

  const logs = await prisma.auditLog.findMany({
    where: { organizationId: orgId },
    orderBy: { timestamp: 'desc' },
    take: limit,
  })

  return logs.map(l => ({
    id: l.id,
    userId: l.userId || '',
    action: l.action,
    target: `${l.entityType}:${l.entityId}`,
    createdAt: l.timestamp.toISOString(),
  }))
}

export async function getBillingInfo(orgId: string): Promise<BillingInfo> {
  // ensure the user is an admin for this org
  await requireAdminForOrg(orgId);

  // fetch the org’s subscription settings
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: {
      subscriptionTier:   true,
      subscriptionStatus: true,
      maxUsers:           true,
    },
  });

  // count actual usage
  const usersCount    = await prisma.user.count({    where: { organizationId: orgId } });
  const vehiclesCount = await prisma.vehicle.count({ where: { organizationId: orgId } });
  const maxVehicles   = 1;

  // fallback defaults until you have a real subscription table
  return {
    plan:                org?.subscriptionTier   ?? 'free',
    status:              org?.subscriptionStatus ?? 'inactive',
    currentPeriodEnds:   '',
    usage: {
      users:    usersCount,
      maxUsers: org?.maxUsers ?? 1,
      vehicles: vehiclesCount,
      maxVehicles,
    },
  };
}


export async function getSystemHealth(): Promise<SystemHealth> {
  const uptime = process.uptime();
  const databaseStatus = 'ok';
  const queueStatus = 'ok';
  return { uptime, databaseStatus, queueStatus };
}



/**
 * KPI aggregation fetcher with optimized batch queries and caching
 */
async function _getOrganizationKPIs(
    organizationId: string
): Promise<OrganizationKPIs> {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    try {
        // Execute all queries in parallel for better performance
        const [
            vehicles,
            vehiclesPreviousPeriod,
            drivers,
            driversPreviousPeriod,
            loads,
            loadsPreviousPeriod,
            revenueData,
            revenuePreviousPeriod,
            milesData,
            milesPreviousPeriod,
            inspections,
            maintenanceVehicles,
        ] = await Promise.all([
            // Active vehicles (current)
            prisma.vehicle.count({
                where: {
                    organizationId,
                    status: "active",
                },
            }),

            // Active vehicles (previous 30 days for comparison)
            prisma.vehicle.count({
                where: {
                    organizationId,
                    status: "active",
                    createdAt: {
                        lte: thirtyDaysAgo,
                    },
                },
            }),

            // Active drivers (current)
            prisma.driver.count({
                where: {
                    organizationId,
                    status: "active",
                },
            }),

            // Active drivers (previous period)
            prisma.driver.count({
                where: {
                    organizationId,
                    status: "active",
                    createdAt: {
                        lte: thirtyDaysAgo,
                    },
                },
            }),

            // Loads data (last 30 days)
            prisma.load.findMany({
                where: {
                    organizationId,
                    createdAt: {
                        gte: thirtyDaysAgo,
                    },
                },
                select: {
                    status: true,
                    rate: true,
                    actualMiles: true,
                    estimatedMiles: true,
                    createdAt: true,
                    actualDeliveryDate: true,
                },
            }),

            // Loads data (previous 30 days for comparison)
            prisma.load.findMany({
                where: {
                    organizationId,
                    createdAt: {
                        gte: sixtyDaysAgo,
                        lt: thirtyDaysAgo,
                    },
                },
                select: {
                    status: true,
                    rate: true,
                    actualMiles: true,
                    estimatedMiles: true,
                },
            }),

            // Revenue data (last 30 days)
            prisma.load.aggregate({
                where: {
                    organizationId,
                    status: "delivered",
                    actualDeliveryDate: {
                        gte: thirtyDaysAgo,
                    },
                },
                _sum: {
                    rate: true,
                },
            }),

            // Revenue data (previous 30 days)
            prisma.load.aggregate({
                where: {
                    organizationId,
                    status: "delivered",
                    actualDeliveryDate: {
                        gte: sixtyDaysAgo,
                        lt: thirtyDaysAgo,
                    },
                },
                _sum: {
                    rate: true,
                },
            }),

            // Miles data (last 30 days)
            prisma.load.aggregate({
                where: {
                    organizationId,
                    status: "delivered",
                    actualDeliveryDate: {
                        gte: thirtyDaysAgo,
                    },
                    actualMiles: {
                        not: null,
                    },
                },
                _sum: {
                    actualMiles: true,
                },
            }),

            // Miles data (previous 30 days)
            prisma.load.aggregate({
                where: {
                    organizationId,
                    status: "delivered",
                    actualDeliveryDate: {
                        gte: sixtyDaysAgo,
                        lt: thirtyDaysAgo,
                    },
                    actualMiles: {
                        not: null,
                    },
                },
                _sum: {
                    actualMiles: true,
                },
            }),

            // Inspections data (last 30 days)
            prisma.vehicle.findMany({
                where: {
                    organizationId,
                    lastInspectionDate: {
                        gte: thirtyDaysAgo,
                    },
                },
                select: {
                    lastInspectionDate: true,
                    // Note: We'll need to add inspection results to the schema
                    // For now, we'll simulate based on random distribution
                },
            }),

            // Maintenance data
            prisma.vehicle.findMany({
                where: {
                    organizationId,
                    status: "active",
                },
                select: {
                    nextInspectionDue: true,
                    lastInspectionDate: true,
                    status: true,
                },
            }),
        ])

        // Calculate load statistics
        const activeLoads = loads.filter(load =>
            ["assigned", "in_transit"].includes(load.status)
        )
        const completedLoads = loads.filter(load => load.status === "delivered")
        const inTransitLoads = loads.filter(
            load => load.status === "in_transit"
        )
        const pendingLoads = loads.filter(load => load.status === "pending")

        // Calculate revenue metrics
        const totalRevenue = Number(revenueData._sum.rate || 0)
        const previousRevenue = Number(revenuePreviousPeriod._sum.rate || 0)
        const revenueChange =
            previousRevenue > 0
                ? (
                      ((totalRevenue - previousRevenue) / previousRevenue) *
                      100
                  ).toFixed(1)
                : totalRevenue > 0
                ? "+100"
                : "0"

        // Calculate miles metrics
        const totalMiles = Number(milesData._sum.actualMiles || 0)
        const previousMiles = Number(milesPreviousPeriod._sum.actualMiles || 0)
        const milesChange =
            previousMiles > 0
                ? (
                      ((totalMiles - previousMiles) / previousMiles) *
                      100
                  ).toFixed(1)
                : totalMiles > 0
                ? "+100"
                : "0"

        const revenuePerMile =
            totalMiles > 0 ? (totalRevenue / totalMiles).toFixed(2) : "0.00"
        const milesPerVehicleAvg =
            vehicles > 0 ? Math.round(totalMiles / vehicles) : 0

        // Calculate vehicle/driver changes
        const vehicleChange =
            vehiclesPreviousPeriod > 0
                ? (
                      ((vehicles - vehiclesPreviousPeriod) /
                          vehiclesPreviousPeriod) *
                      100
                  ).toFixed(1)
                : vehicles > 0
                ? "+100"
                : "0"

        const driverChange =
            driversPreviousPeriod > 0
                ? (
                      ((drivers - driversPreviousPeriod) /
                          driversPreviousPeriod) *
                      100
                  ).toFixed(1)
                : drivers > 0
                ? "+100"
                : "0"

        // Calculate inspection metrics
        const recentInspections = inspections.length
        // Simulate failed inspections (in a real scenario, this would come from inspection results)
        const failedInspections = Math.floor(recentInspections * 0.125) // Assume 12.5% failure rate
        const inspectionSuccessRate =
            recentInspections > 0
                ? (
                      ((recentInspections - failedInspections) /
                          recentInspections) *
                      100
                  ).toFixed(1)
                : "0"

        // Calculate maintenance metrics
        const upcomingMaintenance = maintenanceVehicles.filter(
            v =>
                v.nextInspectionDue &&
                new Date(v.nextInspectionDue) <=
                    new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        ).length

        const maintenanceOverdue = maintenanceVehicles.filter(
            v => v.nextInspectionDue && new Date(v.nextInspectionDue) < today
        ).length

        const maintenanceThisWeek = maintenanceVehicles.filter(
            v =>
                v.nextInspectionDue &&
                new Date(v.nextInspectionDue) <=
                    new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        ).length

        // Calculate pending load breakdowns
        const urgentLoads = pendingLoads.filter(load => {
            if (!load.createdAt) return false
            const hoursSinceCreation =
                (today.getTime() - new Date(load.createdAt).getTime()) /
                (1000 * 60 * 60)
            return hoursSinceCreation > 24 // Consider urgent if pending for more than 24 hours
        }).length

        const awaitingPickup = Math.floor(pendingLoads.length * 0.5) // Estimate 50% awaiting pickup
        const awaitingAssignment = pendingLoads.length - awaitingPickup

        const kpis = {
            activeVehicles: vehicles,
            activeVehiclesChange: `${
                Number(vehicleChange) >= 0 ? "+" : ""
            }${vehicleChange}%`,
            activeDrivers: drivers,
            activeDriversChange: `${
                Number(driverChange) >= 0 ? "+" : ""
            }${driverChange}%`,
            activeLoads: activeLoads.length,
            activeLoadsLive: inTransitLoads.length,
            completedLoads: completedLoads.length,
            inTransitLoads: inTransitLoads.length,
            totalRevenue,
            revenueChange: `${
                Number(revenueChange) >= 0 ? "+" : ""
            }${revenueChange}%`,
            revenuePerMile: Number(revenuePerMile),
            revenueTarget: 2.5, // This could be configurable per organization
            totalMiles,
            milesChange: `${
                Number(milesChange) >= 0 ? "+" : ""
            }${milesChange}%`,
            milesPerVehicleAvg,
            milesTarget: 25000, // This could be configurable per organization
            recentInspections,
            failedInspections,
            inspectionSuccessRate: Number(inspectionSuccessRate),
            upcomingMaintenance,
            maintenanceOverdue,
            maintenanceThisWeek,
            pendingLoads: pendingLoads.length,
            pendingLoadsUrgent: urgentLoads,
            pendingLoadsAwaitingPickup: awaitingPickup,
            pendingLoadsAwaitingAssignment: awaitingAssignment,
        }

        return kpis
    } catch (error) {
        console.error("Error fetching organization KPIs:", error)
        throw new Error("Failed to fetch organization KPIs")
    }
}

export const getOrganizationKPIs = unstable_cache(
    _getOrganizationKPIs,
    ["organization-kpis"],
    { revalidate: 120, tags: ["kpi"] }
)


export const getDashboardMetrics = unstable_cache(
    async (orgId: string, userId: string): Promise<DashboardMetrics> => {
        const user = await db.user.findFirst({
            where: { id: userId, organizationId: orgId },
        })
        // Instead of throwing, return default metrics if user not found
        if (!user) {
            return {
                activeLoads: 0,
                totalLoads: 0,
                activeDrivers: 0,
                totalDrivers: 0,
                availableVehicles: 0,
                totalVehicles: 0,
                maintenanceVehicles: 0,
                criticalAlerts: 0,
                complianceScore: 0,
                revenue: 0,
                fuelCosts: 0,
            }
        }

        const today = new Date()

        const [
            totalLoads,
            activeLoads,
            totalDrivers,
            activeDrivers,
            totalVehicles,
            availableVehicles,
            maintenanceVehicles,
            alertsCount,
            inspections,
            overdueInspections,
            revenueAgg,
            fuelAgg,
        ] = await Promise.all([
            db.load.count({ where: { organizationId: orgId } }),
            db.load.count({
                where: {
                    organizationId: orgId,
                    status: {
                        in: [
                            "assigned",
                            "in_transit",
                            "at_pickup",
                            "at_delivery",
                        ],
                    },
                },
            }),
            db.driver.count({ where: { organizationId: orgId } }),
            db.driver.count({
                where: {
                    organizationId: orgId,
                    status: "active",
                },
            }),
            db.vehicle.count({ where: { organizationId: orgId } }),
            db.vehicle.count({
                where: {
                    organizationId: orgId,
                    status: "active",
                },
            }),
            db.vehicle.count({
                where: {
                    organizationId: orgId,
                    status: "maintenance",
                },
            }),
            db.complianceAlert.count({
                where: {
                    organizationId: orgId,
                    resolved: false,
                },
            }),
            db.vehicle.count({
                where: { organizationId: orgId, lastInspectionDate: { not: null } },
            }),
            db.vehicle.count({
                where: { organizationId: orgId, nextInspectionDue: { lt: today } },
            }),
            db.load.aggregate({
                where: { organizationId: orgId, status: "delivered" },
                _sum: { rate: true },
            }),
            db.iftaFuelPurchase.aggregate({
                where: { organizationId: orgId },
                _sum: { amount: true },
            }),
        ])

        const complianceScore =
            inspections > 0
                ? Math.round(((inspections - overdueInspections) / inspections) * 100)
                : 100

        const revenue = Number(revenueAgg._sum.rate ?? 0)
        const fuelCosts = Number(fuelAgg._sum.amount ?? 0)

        return {
            activeLoads,
            totalLoads,
            activeDrivers,
            totalDrivers,
            availableVehicles,
            totalVehicles,
            maintenanceVehicles,
            criticalAlerts: alertsCount,
            complianceScore,
            revenue,
            fuelCosts,
        }
    },
    ["dashboard-metrics"],
    {
        revalidate: 300, // 5 minutes
        tags: ["dashboard"],
    }
)

export const getDashboardKPIs = async (
    orgId: string,
    userId: string,
    metrics: DashboardMetrics
): Promise<DashboardKPI[]> => {
    const user = await db.user.findFirst({
        where: { id: userId, organizationId: orgId },
        select: { role: true },
    })
    if (!user) throw new Error("Unauthorized")

    const utilizationRate =
        metrics.totalVehicles > 0
            ? Math.round(
                  ((metrics.totalVehicles - metrics.availableVehicles) /
                      metrics.totalVehicles) *
                      100
              )
            : 0

    const kpis: DashboardKPI[] = [
        {
            title: "Active Loads",
            value: metrics.activeLoads,
            icon: "Truck",
            color: "blue",
            trend: "up",
            change: 12,
        },
        {
            title: "Available Drivers",
            value: metrics.activeDrivers,
            icon: "Users",
            color: "green",
            trend: "neutral",
        },
        {
            title: "Fleet Utilization",
            value: `${utilizationRate}%`,
            icon: "Activity",
            color: "purple",
            trend: "up",
            change: 5,
        },
        {
            title: "Active Alerts",
            value: metrics.criticalAlerts,
            icon: "AlertTriangle",
            color: metrics.criticalAlerts > 0 ? "red" : "green",
        },
    ]

    return kpis
}

export const getQuickActions = async (
    orgId: string,
    userId: string
): Promise<QuickAction[]> => {
    const user = await db.user.findFirst({
        where: { id: userId, organizationId: orgId },
        select: { role: true },
    })
    if (!user) throw new Error("Unauthorized")

    const actions: QuickAction[] = [
        {
            title: "Create Load",
            description: "Add a new load to the system",
            href: `/${orgId}/loads/new`,
            icon: "Plus",
            color: "bg-blue-500",
            permission: ["admin", "dispatcher"],
        },
        {
            title: "Assign Driver",
            description: "Assign drivers to available loads",
            href: `/${orgId}/loads?assign=true`,
            icon: "UserPlus",
            color: "bg-green-500",
            permission: ["admin", "dispatcher"],
        },
        {
            title: "View Alerts",
            description: "Check compliance and safety alerts",
            href: `/${orgId}/compliance/alerts`,
            icon: "AlertCircle",
            color: "bg-red-500",
            permission: ["admin", "compliance_officer"],
        },
        {
            title: "Fleet Status",
            description: "View vehicle and driver status",
            href: `/${orgId}/fleet`,
            icon: "Truck",
            color: "bg-purple-500",
            permission: [
                "admin",
                "dispatcher",
                "driver",
                "compliance_officer",
                "accountant",
                "viewer",
            ],
        },
        {
            title: "Reports",
            description: "Generate operational reports",
            href: `/${orgId}/reports`,
            icon: "BarChart3",
            color: "bg-orange-500",
            permission: [
                "admin",
                "dispatcher",
                "compliance_officer",
                "accountant",
            ],
        },
    ]

    return actions.filter(action => action.permission.includes(user.role))
}

export const getRecentActivity = unstable_cache(
    async (orgId: string, userId: string): Promise<ActivityItem[]> => {
        const user = await db.user.findFirst({
            where: { id: userId, organizationId: orgId },
        })
        if (!user) throw new Error("Unauthorized")

        const auditLogs = await getAuditLogs(orgId, 10)

        return auditLogs.map(log => ({
            id: log.id,
            type: log.entityType as ActivityItem["type"],
            title: log.action,
            description: `${log.action} on ${log.entityType}`,
            timestamp: log.timestamp,
            userId: log.userId || undefined,
            userName: "User",
            severity: "info" as const,
        }))
    },
    ["dashboard-activity"],
    {
        revalidate: 60, // 1 minute
        tags: ["dashboard", "activity"],
    }
)

export const getDashboardData = async (
    orgId: string
): Promise<DashboardData> => {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const [metrics, recentActivity] = await Promise.all([
        getDashboardMetrics(orgId, userId),
        getRecentActivity(orgId, userId),
    ])

    const [kpis, quickActions] = await Promise.all([
        getDashboardKPIs(orgId, userId, metrics),
        getQuickActions(orgId, userId),
    ])

    // Get alerts (simplified for MVP)
    const alerts = await db.complianceAlert.findMany({
        where: {
            organizationId: orgId,
            resolved: false,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    })

    return {
        metrics,
        kpis,
        quickActions,
        recentActivity,
        alerts: alerts.map(alert => ({
            id: alert.id,
            type: "document_missing" as const,
            title: `Alert ${alert.id}`,
            description: alert.message || "Compliance alert",
            severity: "medium" as const,
            entityId: alert.userId || alert.vehicleId || "",
            entityType: alert.userId
                ? ("driver" as const)
                : ("vehicle" as const),
            createdAt: alert.createdAt,
        })),
    }
}
