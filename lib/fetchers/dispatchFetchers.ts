

"use server"

import { auth } from "@clerk/nextjs/server"
import { unstable_cache } from "next/cache"

import db from "@/lib/database/db"
import { loadFilterSchema, type LoadFilterInput } from "@/schemas/dispatch"
import type { Load } from "@/types/dispatch"

// Helper function to check user permissions
async function checkUserAccess(orgId: string) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("Unauthorized")
    }

    if (!userId) {
        throw new Error("User not found or not member of organization")
    }

    return userId
}

// Get load by ID

// List loads by organization with filtering and pagination
export async function listLoadsByOrg(
    orgId: string,
    filters: LoadFilterInput = {}
) {
    try {
        await checkUserAccess(orgId)

        const validatedFilters = loadFilterSchema.parse(filters)

        // Build where clause
        const where: any = {
            organizationId: orgId, // FIX: use organizationId, not tenantId
        }

        // Status filter
        if (
            validatedFilters.status &&
            validatedFilters.status.length > 0 &&
            !validatedFilters.status.includes("all")
        ) {
            where.status = { in: validatedFilters.status }
        }

        // Priority filter
        if (validatedFilters.priority && validatedFilters.priority.length > 0) {
            where.priority = { in: validatedFilters.priority }
        }

        // Driver filter
        if (validatedFilters.driverId) {
            where.driverId = validatedFilters.driverId
        }

        // Vehicle filter
        if (validatedFilters.vehicleId) {
            where.vehicleId = validatedFilters.vehicleId
        }

        // Customer filter
        if (validatedFilters.customerId) {
            where.customer = {
                path: ["id"],
                equals: validatedFilters.customerId,
            }
        }

        // Date range filters
        if (validatedFilters.startDate || validatedFilters.endDate) {
            where.createdAt = {}
            if (validatedFilters.startDate) {
                where.createdAt.gte = new Date(validatedFilters.startDate)
            }
            if (validatedFilters.endDate) {
                where.createdAt.lte = new Date(validatedFilters.endDate)
            }
        }

        // Pickup date range
        if (validatedFilters.pickupDateFrom || validatedFilters.pickupDateTo) {
            where.pickupDate = {}
            if (validatedFilters.pickupDateFrom) {
                where.pickupDate.gte = new Date(validatedFilters.pickupDateFrom)
            }
            if (validatedFilters.pickupDateTo) {
                where.pickupDate.lte = new Date(validatedFilters.pickupDateTo)
            }
        }

        // Delivery date range
        if (
            validatedFilters.deliveryDateFrom ||
            validatedFilters.deliveryDateTo
        ) {
            where.deliveryDate = {}
            if (validatedFilters.deliveryDateFrom) {
                where.deliveryDate.gte = new Date(
                    validatedFilters.deliveryDateFrom
                )
            }
            if (validatedFilters.deliveryDateTo) {
                where.deliveryDate.lte = new Date(
                    validatedFilters.deliveryDateTo
                )
            }
        }

        // Origin state filter
        if (validatedFilters.originState) {
            where.origin = {
                path: ["state"],
                equals: validatedFilters.originState,
            }
        }

        // Destination state filter
        if (validatedFilters.destinationState) {
            where.destination = {
                path: ["state"],
                equals: validatedFilters.destinationState,
            }
        }

        // Equipment type filter
        if (
            validatedFilters.equipmentType &&
            validatedFilters.equipmentType.length > 0
        ) {
            where.equipment = {
                path: ["type"],
                in: validatedFilters.equipmentType,
            }
        }

        // Rate range filters
        if (validatedFilters.minRate || validatedFilters.maxRate) {
            where.rate = {
                path: ["total"],
            }
            if (validatedFilters.minRate) {
                where.rate.gte = validatedFilters.minRate
            }
            if (validatedFilters.maxRate) {
                where.rate.lte = validatedFilters.maxRate
            }
        }

        // Miles range filters
        if (validatedFilters.minMiles || validatedFilters.maxMiles) {
            where.OR = [
                {
                    miles: {
                        ...(validatedFilters.minMiles && {
                            gte: validatedFilters.minMiles,
                        }),
                        ...(validatedFilters.maxMiles && {
                            lte: validatedFilters.maxMiles,
                        }),
                    },
                },
                {
                    estimatedMiles: {
                        ...(validatedFilters.minMiles && {
                            gte: validatedFilters.minMiles,
                        }),
                        ...(validatedFilters.maxMiles && {
                            lte: validatedFilters.maxMiles,
                        }),
                    },
                },
            ]
        }

        // Tags filter
        if (validatedFilters.tags && validatedFilters.tags.length > 0) {
            where.tags = {
                hasSome: validatedFilters.tags,
            }
        }

        // Search filter
        if (validatedFilters.search) {
            const searchTerm = validatedFilters.search
            where.OR = [
                {
                    referenceNumber: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                { customer: { path: ["name"], string_contains: searchTerm } },
                { origin: { path: ["name"], string_contains: searchTerm } },
                { origin: { path: ["city"], string_contains: searchTerm } },
                { origin: { path: ["state"], string_contains: searchTerm } },
                {
                    destination: {
                        path: ["name"],
                        string_contains: searchTerm,
                    },
                },
                {
                    destination: {
                        path: ["city"],
                        string_contains: searchTerm,
                    },
                },
                {
                    destination: {
                        path: ["state"],
                        string_contains: searchTerm,
                    },
                },
                {
                    cargo: {
                        path: ["description"],
                        string_contains: searchTerm,
                    },
                },
                { notes: { contains: searchTerm, mode: "insensitive" } },
            ]
        }

        // Build order by clause
        const orderBy: any = {}
        const sortBy = validatedFilters.sortBy || "pickupDate"
        const sortOrder = validatedFilters.sortOrder || "asc"

        // Map UI sort keys to Prisma field names only in orderBy
        if (sortBy === "pickupDate") {
            orderBy.scheduledPickupDate = sortOrder
        } else if (sortBy === "deliveryDate") {
            orderBy.scheduledDeliveryDate = sortOrder
        } else if (sortBy === "customer") {
            orderBy.customer = { path: ["name"], sort: sortOrder }
        } else if (sortBy === "rate") {
            orderBy.rate = { path: ["total"], sort: sortOrder }
        } else {
            orderBy[sortBy] = sortOrder
        }

        // Pagination
        const page = validatedFilters.page || 1
        const limit = validatedFilters.limit || 50
        const skip = (page - 1) * limit // Execute queries
        const [loads, totalCount] = await Promise.all([
            db.load.findMany({
                where,
                include: {
                    driver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                    vehicle: {
                        select: {
                            id: true,
                            unitNumber: true,
                            make: true,
                            model: true,
                        },
                    },
                    trailer: {
                        select: {
                            id: true,
                            unitNumber: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),

            db.load.count({ where }),
        ])

        return {
            success: true,
            data: {
                loads,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    pages: Math.ceil(totalCount / limit),
                },
            },
        }
    } catch (error) {
        console.error("Error fetching loads:", error)
        throw new Error("Failed to fetch loads")
    }
}

// Get active loads for dispatch board
export async function getActiveLoadsForDispatchBoard(orgId: string) {
    try {
        await checkUserAccess(orgId)

        const loads = await db.load.findMany({
            where: {
                organizationId: orgId,
                status: {
                    in: ["assigned", "in_transit"],
                },
            },
            include: {
                driver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
                vehicle: {
                    select: {
                        id: true,
                        unitNumber: true,
                        make: true,
                        model: true,
                    },
                },
                trailer: {
                    select: {
                        id: true,
                        unitNumber: true,
                    },
                },
            },
            orderBy: {
                scheduledPickupDate: "asc",
            },
        })

        return {
            success: true,
            data: loads,
        }
    } catch (error) {
        console.error("Error fetching dispatch board loads:", error)
        throw new Error("Failed to fetch dispatch board loads")
    }
}

// Get available drivers for load assignment
export async function getAvailableDriversForLoad(
    orgId: string,
    loadRequirements: any = {}
) {
    try {
        await checkUserAccess(orgId)

        const where: any = {
            organizationId: orgId,
            status: "active",
        }

        // Add CDL requirements if specified
        if (loadRequirements.cdlClass) {
            where.licenseClass = { in: loadRequirements.cdlClass }
        }

        // Exclude drivers who are already assigned to active loads
        const drivers = await db.driver.findMany({
            where: {
                ...where,
                loads: {
                    none: {
                        status: {
                            in: ["assigned", "in_transit"],
                        },
                    },
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeId: true,
                phone: true,
                email: true,
                licenseClass: true,
                licenseNumber: true,
                licenseExpiration: true,
                status: true,
            },
            orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
        })

        return {
            success: true,
            data: drivers,
        }
    } catch (error) {
        console.error("Error fetching available drivers:", error)
        throw new Error("Failed to fetch available drivers")
    }
}

// Get available vehicles for load assignment
export async function getAvailableVehiclesForLoad(
    orgId: string,
    loadRequirements: any = {}
) {
    try {
        await checkUserAccess(orgId)

        const where: any = {
            organizationId: orgId,
            status: "active",
        }

        // Add equipment type requirements if specified
        if (loadRequirements.vehicleType) {
            where.type = loadRequirements.vehicleType
        }

        // Exclude vehicles that are already assigned to active loads
        const vehicles = await db.vehicle.findMany({
            where: {
                ...where,
                loads: {
                    none: {
                        status: {
                            in: ["assigned", "in_transit"],
                        },
                    },
                },
            },
            select: {
                id: true,
                unitNumber: true,
                make: true,
                model: true,
                year: true,
                type: true,
                status: true,
                currentOdometer: true,
                lastInspectionDate: true,
                nextInspectionDue: true,
            },
            orderBy: {
                unitNumber: "asc",
            },
        })

        return {
            success: true,
            data: vehicles,
        }
    } catch (error) {
        console.error("Error fetching available vehicles:", error)
        throw new Error("Failed to fetch available vehicles")
    }
}

// Get available trailers for load assignment
export async function getAvailableTrailersForLoad(
    orgId: string,
    loadRequirements: any = {}
) {
    try {
        await checkUserAccess(orgId)

        const where: any = {
            organizationId: orgId,
            status: "active",
            type: { not: "tractor" }, // Only get trailers, not tractors
        }

        // Add trailer type requirements if specified
        if (loadRequirements.trailerType) {
            where.type = loadRequirements.trailerType
        }

        // Exclude trailers that are already assigned to active loads
        const trailers = await db.vehicle.findMany({
            where: {
                ...where,
                trailerLoads: {
                    none: {
                        status: {
                            in: ["assigned", "in_transit"],
                        },
                    },
                },
            },
            select: {
                id: true,
                unitNumber: true,
                make: true,
                model: true,
                year: true,
                type: true,
                status: true,
                lastInspectionDate: true,
                nextInspectionDue: true,
            },
            orderBy: {
                unitNumber: "asc",
            },
        })

        return {
            success: true,
            data: trailers,
        }
    } catch (error) {
        console.error("Error fetching available trailers:", error)
        throw new Error("Failed to fetch available trailers")
    }
}

// Get load statistics for dashboard
export async function getLoadStatistics(
    orgId: string,
    dateRange: { from: Date; to: Date } = {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
    }
) {
    try {
        await checkUserAccess(orgId)

        const where = {
            organizationId: orgId,
            createdAt: {
                gte: dateRange.from,
                lte: dateRange.to,
            },
        }

        // Execute all queries in parallel for better performance
        const [
            totalLoads,
            deliveredLoads,
            inTransitLoads,
            cancelledLoads,
            totalRevenue,
            totalMiles,
        ] = await Promise.all([
            // Total loads count
            db.load.count({ where }),

            // Delivered loads count
            db.load.count({
                where: { ...where, status: "delivered" },
            }),

            // In transit loads count
            db.load.count({
                where: { ...where, status: "in_transit" },
            }),

            // Cancelled loads count
            db.load.count({
                where: { ...where, status: "cancelled" },
            }),

            // Total revenue
            db.load.aggregate({
                where: { ...where, status: "delivered" },
                _sum: { rate: true },
            }),

            // Total miles
            db.load.aggregate({
                where: { ...where, status: "delivered" },
                _sum: { actualMiles: true },
            }),
        ])

        const onTimeDeliveries = await db.load.count({
            where: {
                ...where,
                status: "delivered",
                actualDeliveryDate: {
                    lte: db.load.fields.scheduledDeliveryDate,
                },
            },
        })

        const statistics = {
            totalLoads,
            deliveredLoads,
            inTransitLoads,
            cancelledLoads,
            onTimeDeliveryRate:
                deliveredLoads > 0
                    ? (onTimeDeliveries / deliveredLoads) * 100
                    : 0,
            totalRevenue: totalRevenue._sum.rate || 0,
            totalMiles: totalMiles._sum.actualMiles || 0,
            averageRevenuePerMile: totalMiles._sum.actualMiles
                ? Number(totalRevenue._sum.rate || 0) /
                  Number(totalMiles._sum.actualMiles)
                : 0,
        }

        return {
            success: true,
            data: statistics,
        }
    } catch (error) {
        console.error("Error fetching load statistics:", error)
        throw new Error("Failed to fetch load statistics")
    }
}

// Get customer statistics
export async function getCustomerStatistics(orgId: string) {
    try {
        await checkUserAccess(orgId)

        // Get customer data aggregated from loads
        const customerStats = await db.load.groupBy({
            by: ["customerName"],
            where: {
                organizationId: orgId,
                customerName: { not: null },
            },
            _count: {
                id: true,
            },
            _sum: {
                rate: true,
                actualMiles: true,
            },
            _avg: {
                rate: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: 10, // Top 10 customers
        })

        // Get repeat customers (customers with more than one load)
        const repeatCustomers = customerStats.filter(
            customer => customer._count.id > 1
        )

        // Calculate additional metrics
        const totalCustomers = customerStats.length
        const totalLoads = customerStats.reduce(
            (sum, customer) => sum + customer._count.id,
            0
        )
        const totalRevenue = customerStats.reduce(
            (sum, customer) => sum + Number(customer._sum.rate || 0),
            0
        )

        const statistics = {
            totalCustomers,
            repeatCustomers: repeatCustomers.length,
            customerRetentionRate:
                totalCustomers > 0
                    ? (repeatCustomers.length / totalCustomers) * 100
                    : 0,
            totalLoads,
            totalRevenue,
            averageRevenuePerCustomer:
                totalCustomers > 0 ? totalRevenue / totalCustomers : 0,
            topCustomers: customerStats.map(customer => ({
                name: customer.customerName,
                loadCount: customer._count.id,
                totalRevenue: Number(customer._sum.rate || 0),
                averageRevenue: Number(customer._avg.rate || 0),
                totalMiles: Number(customer._sum.actualMiles || 0),
            })),
        }

        return {
            success: true,
            data: statistics,
        }
    } catch (error) {
        console.error("Error fetching customer statistics:", error)
        throw new Error("Failed to fetch customer statistics")
    }
}

// Get load alerts
export async function getLoadAlerts(orgId: string, severity?: string[]) {
    try {
        await checkUserAccess(orgId)

        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const threeDaysFromNow = new Date(today)
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

        // Get various types of load alerts
        const alerts: Array<{
            id: string
            type: string
            severity: string
            message: string
            details: string
            timestamp: Date
            loadId: string
        }> = []

        // 1. Overdue pickups
        const overduePickups = await db.load.findMany({
            where: {
                organizationId: orgId,
                status: "assigned",
                scheduledPickupDate: {
                    lt: today,
                },
            },
            select: {
                id: true,
                loadNumber: true,
                customerName: true,
                scheduledPickupDate: true,
                driver: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        })

        // 2. Loads without assigned drivers (due soon)
        const unassignedLoads = await db.load.findMany({
            where: {
                organizationId: orgId,
                status: "pending",
                userId: null,
                scheduledPickupDate: {
                    lte: threeDaysFromNow,
                },
            },
            select: {
                id: true,
                loadNumber: true,
                customerName: true,
                scheduledPickupDate: true,
            },
        })

        // 3. Loads at risk of being late
        const atRiskLoads = await db.load.findMany({
            where: {
                organizationId: orgId,
                status: "in_transit",
                scheduledDeliveryDate: {
                    lte: tomorrow,
                },
                actualDeliveryDate: null,
            },
            select: {
                id: true,
                loadNumber: true,
                customerName: true,
                scheduledDeliveryDate: true,
                driver: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        })

        // Format alerts
        overduePickups.forEach(load => {
            alerts.push({
                id: `overdue-${load.id}`,
                type: "overdue_pickup",
                severity: "high",
                message: `Load ${load.loadNumber} pickup is overdue`,
                details: `Customer: ${load.customerName}, Driver: ${
                    load.driver
                        ? `${load.driver.firstName} ${load.driver.lastName}`
                        : "Unassigned"
                }`,
                timestamp: new Date(),
                loadId: load.id,
            })
        })

        unassignedLoads.forEach(load => {
            alerts.push({
                id: `unassigned-${load.id}`,
                type: "unassigned_load",
                severity: "medium",
                message: `Load ${load.loadNumber} needs driver assignment`,
                details: `Customer: ${
                    load.customerName ?? "Unknown"
                }, Pickup: ${
                    load.scheduledPickupDate?.toLocaleDateString() ?? "TBD"
                }`,
                timestamp: new Date(),
                loadId: load.id,
            })
        })

        atRiskLoads.forEach(load => {
            alerts.push({
                id: `at-risk-${load.id}`,
                type: "delivery_at_risk",
                severity: "medium",
                message: `Load ${load.loadNumber} delivery at risk`,
                details: `Customer: ${
                    load.customerName
                }, Due: ${load.scheduledDeliveryDate?.toLocaleDateString()}, Driver: ${
                    load.driver
                        ? `${load.driver.firstName} ${load.driver.lastName}`
                        : "Unassigned"
                }`,
                timestamp: new Date(),
                loadId: load.id,
            })
        })

        // Filter by severity if specified
        const filteredAlerts =
            severity && severity.length > 0
                ? alerts.filter(alert => severity.includes(alert.severity))
                : alerts

        return {
            success: true,
            data: filteredAlerts.sort((a, b) => {
                const severityOrder: { [key: string]: number } = {
                    high: 3,
                    medium: 2,
                    low: 1,
                }
                return (
                    (severityOrder[b.severity] ?? 0) -
                    (severityOrder[a.severity] ?? 0)
                )
            }),
        }
    } catch (error) {
        console.error("Error fetching load alerts:", error)
        throw new Error("Failed to fetch load alerts")
    }
}

// Fetch recent activity across loads and drivers for an organization
export async function getRecentDispatchActivity(orgId: string, limit = 10) {
    try {
        await checkUserAccess(orgId)

        const logs = await db.auditLog.findMany({
            where: {
                organizationId: orgId,
                OR: [
                    { entityType: "Load" },
                    { entityType: "Driver" },
                    { entityType: "dispatch" },
                ],
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                timestamp: "desc",
            },
            take: limit,
        })

        const activity = logs.map(log => ({
            id: log.id,
            entityType: log.entityType,
            action: log.action,
            entityId: log.entityId,
            timestamp: log.timestamp,
            userName: log.user
                ? `${log.user.firstName ?? ""} ${
                      log.user.lastName ?? ""
                  }`.trim()
                : "System",
        }))

        return { success: true, data: activity }
    } catch (error) {
        console.error("Error fetching dispatch activity:", error)
        throw new Error("Failed to fetch dispatch activity")
    }
}

// Format load object for dispatch board view
function formatLoadForBoard(load: Load): Load {
    return load
}

// Fetch dispatch board data with caching
export const getDispatchBoardData = unstable_cache(
    async (orgId: string, filters?: LoadFilterInput) => {
        // Extract date range from filters if present, else use default
        let dateRange: { from: Date; to: Date } | undefined = undefined
        if (filters && (filters.startDate || filters.endDate)) {
            const from = filters.startDate
                ? new Date(filters.startDate)
                : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            const to = filters.endDate ? new Date(filters.endDate) : new Date()
            dateRange = { from, to }
        }
        const [loadsResult, driversResult, vehiclesResult, statsResult] =
            await Promise.all([
                listLoadsByOrg(orgId, filters),
                getAvailableDriversForLoad(orgId),
                getAvailableVehiclesForLoad(orgId, {}),
                getLoadStatistics(orgId, dateRange), // <-- pass dateRange, not filters
            ])

        const loads = (loadsResult?.data?.loads || []) as unknown as Load[]

        return {
            loads: loads.map(formatLoadForBoard),
            drivers: driversResult?.data || [],
            vehicles: vehiclesResult?.data || [],
            statistics: statsResult?.data,
        }
    },
    ["dispatch-board"],
    {
        revalidate: 300,
        tags: ["dispatch-board"],
    }
)

// Fetch a single load with relations and cache result
export const getLoadDetails = unstable_cache(
    async (orgId: string, loadId: string) => {
        await checkUserAccess(orgId)
        return db.load.findFirst({
            where: { id: loadId, organizationId: orgId },
            include: {
                driver: true,
                vehicle: true,
                trailer: true,
                statusEvents: { orderBy: { timestamp: "desc" } },
                organization: { select: { name: true, settings: true } },
            },
        })
    },
    ["load-details"],
    {
        revalidate: 60,
        tags: ["load-details"],
    }
)
