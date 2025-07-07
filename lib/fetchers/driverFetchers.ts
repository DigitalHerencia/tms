'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/database/db';
import type {
  Driver,
  DriverListResponse,
  DriverStatsResponse,
  DriverFilters,
} from '@/types/drivers';

// ================== Utility Functions ==================

// Utility to map raw Prisma driver result to Driver type
function parseDriverData(raw: any): Driver {
  // Map all required fields from raw to Driver type
  return {
    id: raw.id,
    tenantId: raw.tenantId,
    homeTerminal: raw.homeTerminal,
    cdlNumber: raw.cdlNumber,
    cdlState: raw.cdlState,
    cdlClass: raw.cdlClass,
    cdlExpiration: raw.licenseExpiration,
    medicalCardExpiration: raw.medicalCardExpiration,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: raw.phone,
    status: raw.status,
    availabilityStatus: raw.availabilityStatus,
    hireDate: raw.hireDate,
    safetyScore: raw.safetyScore,
    violationCount: raw.violationCount,
    accidentCount: raw.accidentCount,
    isActive: raw.isActive,
    createdBy: raw.createdBy,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    // ...add any other required fields from Driver type...
  };
}

// ================== Core Fetchers ==================

// Add this type for driver with assignment info
type DriverWithAssignment = Driver & {
  currentAssignment?: {
    loadId: string;
    loadNumber: string;
    status: string;
    customerName: string | null;
    scheduledPickupDate: Date | null;
    scheduledDeliveryDate: Date | null;
    vehicleId: string | null;
    vehicleUnit?: string;
  } | null;
};

// Update DriverListResponse for this fetcher
type DriverListWithAssignmentResponse = Omit<DriverListResponse, 'drivers'> & {
  drivers: DriverWithAssignment[];
};

/**
 * Get driver by ID with permission check
 */
export const getDriverById = async (
  driverId: string,
  orgId: string
): Promise<Driver | null> => {
  try {
    const { userId, orgId: sessionOrgId } = await auth();
    if (!userId) return null;
    if (!sessionOrgId || sessionOrgId !== orgId) {
      throw new Error('Invalid organization');
    }

    const driver = await prisma.driver.findFirst({
      where: {
        id: driverId,
        organizationId: orgId,
        status: 'active',
      },
      include: {
        organization: true,
        user: true,
        complianceDocuments: true,
        loads: {
          where: {
            status: {
              in: [
                'assigned',
                'dispatched',
                'in_transit',
                'at_pickup',
                'picked_up',
                'en_route',
              ],
            },
          },
          select: {
            id: true,
            loadNumber: true,
            status: true,
            customerName: true,
            scheduledPickupDate: true,
            scheduledDeliveryDate: true,
            vehicleId: true,
            vehicle: {
              select: {
                unitNumber: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!driver) return null;

    return parseDriverData(driver);
  } catch (error) {
    console.error('Error fetching driver:', error);
    return null;
  }
};

/**
 * List drivers by organization with filtering and pagination
 */
export const listDriversByOrg = async (
  orgId: string,
  filters: DriverFilters = {}
): Promise<DriverListWithAssignmentResponse> => {
  try {
    const { userId, orgId: sessionOrgId } = await auth();
    if (!userId) {
      return { drivers: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    }
    if (!sessionOrgId || sessionOrgId !== orgId) {
      throw new Error('Invalid organization');
    }

    // Build Prisma where filter
    const where: any = {
      organizationId: orgId,
      // Only show active drivers by default
      status: { not: 'terminated' },
    };

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { licenseNumber: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.status && filters.status.length > 0) {
      where.status = { in: filters.status };
    }

    if (filters.availabilityStatus && filters.availabilityStatus.length > 0) {
      where.availabilityStatus = { in: filters.availabilityStatus };
    }

    if (filters.homeTerminal && filters.homeTerminal.length > 0) {
      where.homeTerminal = { in: filters.homeTerminal };
    }

    if (filters.cdlClass && filters.cdlClass.length > 0) {
      where.licenseClass = { in: filters.cdlClass };
    }

    // Expiration filters
    if (filters.cdlExpiringInDays !== undefined) {
      const expirationDate = new Date();
      expirationDate.setDate(
        expirationDate.getDate() + filters.cdlExpiringInDays
      );
      where.licenseExpiration = { lte: expirationDate };
    }

    if (filters.medicalExpiringInDays !== undefined) {
      const expirationDate = new Date();
      expirationDate.setDate(
        expirationDate.getDate() + filters.medicalExpiringInDays
      );
      where.medicalCardExpiration = { lte: expirationDate };
    }

    // Performance filters
    if (filters.minSafetyScore !== undefined) {
      where.safetyScore = { gte: filters.minSafetyScore };
    }

    if (filters.maxViolations !== undefined) {
      where.violationCount = { lte: filters.maxViolations };
    }

    // Date filters
    if (filters.hiredAfter) {
      where.hireDate = {
        ...(where.hireDate || {}),
        gte: new Date(filters.hiredAfter),
      };
    }
    if (filters.hiredBefore) {
      where.hireDate = {
        ...(where.hireDate || {}),
        lte: new Date(filters.hiredBefore),
      };
    }

    // Pagination
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = filters.sortBy || 'firstName';
    const sortOrder = filters.sortOrder || 'asc';
    const orderBy: any = {};
    switch (sortBy) {
      case 'firstName':
        orderBy.firstName = sortOrder;
        break;
      case 'lastName':
        orderBy.lastName = sortOrder;
        break;
      case 'status':
        orderBy.status = sortOrder;
        break;
      case 'hireDate':
        orderBy.hireDate = sortOrder;
        break;
      case 'cdlExpiration':
        orderBy.licenseExpiration = sortOrder;
        break;
      case 'safetyScore':
        orderBy.safetyScore = sortOrder;
        break;
      default:
        orderBy.firstName = 'asc';
    }

    // Get total count
    const total = await prisma.driver.count({ where }); // Fetch drivers with assignment information
    const driverResults = await prisma.driver.findMany({
      where,
      include: {
        loads: {
          where: {
            status: {
              in: [
                'assigned',
                'dispatched',
                'in_transit',
                'at_pickup',
                'picked_up',
                'en_route',
              ],
            },
          },
          select: {
            id: true,
            loadNumber: true,
            status: true,
            customerName: true,
            scheduledPickupDate: true,
            scheduledDeliveryDate: true,
            vehicleId: true,
            vehicle: {
              select: {
                unitNumber: true,
              },
            },
          },
          take: 1, // Only get the most recent active assignment
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    const parsedDriversData = driverResults.map(driver => {
      const baseDriver = parseDriverData(driver) as DriverWithAssignment;
      // Add current assignment information
      const currentAssignment = driver.loads?.[0] || null;
      return {
        ...baseDriver,
        currentAssignment: currentAssignment
          ? {
              loadId: currentAssignment.id,
              loadNumber: currentAssignment.loadNumber,
              status: currentAssignment.status,
              customerName: currentAssignment.customerName,
              scheduledPickupDate: currentAssignment.scheduledPickupDate,
              scheduledDeliveryDate: currentAssignment.scheduledDeliveryDate,
              vehicleId: currentAssignment.vehicleId,
              vehicleUnit: currentAssignment.vehicle?.unitNumber,
            }
          : null,
      } as DriverWithAssignment;
    });

    return {
      drivers: parsedDriversData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error listing drivers:', error);
    return { drivers: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  }
};

/**
 * Get available drivers for assignment
 */

/**
 * Get driver statistics for dashboard
 */
export const getDriverStats = async (
  orgId: string
): Promise<DriverStatsResponse> => {
  try {
    const { userId, orgId: sessionOrgId } = await auth();
    if (!userId) throw new Error('Authentication required');
    if (!sessionOrgId || sessionOrgId !== orgId) {
      throw new Error('Invalid organization');
    }
    // Example stats: total, active, inactive, expiring licenses, etc.
    const total = await prisma.driver.count({
      where: { organizationId: orgId },
    });
    const active = await prisma.driver.count({
      where: { organizationId: orgId, status: 'active' },
    });

    const expiringLicenses = await prisma.driver.count({
      where: {
        organizationId: orgId,
        licenseExpiration: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }, // next 30 days
      },
    });

    const expiringMedicalCards = await prisma.driver.count({
      where: {
        organizationId: orgId,
        medicalCardExpiration: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Return the stats object (fill in other fields as needed)
    return {
      totalDrivers: total,
      activeDrivers: active,
      availableDrivers: 0,
      drivingDrivers: 0,
      expiringCDLs: expiringLicenses,
      expiringMedicals: expiringMedicalCards,
      averageSafetyScore: 0,
      totalViolations: 0,
      utilizationRate: 0,
      // ...default or calculated values for other stats...
    };
  } catch (error) {
    console.error('Error fetching driver stats:', error);
    return {
      totalDrivers: 0,
      activeDrivers: 0,
      availableDrivers: 0,
      drivingDrivers: 0,
      expiringCDLs: 0,
      expiringMedicals: 0,
      averageSafetyScore: 0,
      totalViolations: 0,
      utilizationRate: 0,
      // ...default values for other stats...
    };
  }
};

// ================== HOS Fetchers ==================

// ================== Performance Fetchers ==================

export async function getVehiclesByOrg(orgId: string): Promise<any[]> {
  if (!orgId) throw new Error('orgId is required');
  const { userId } = await auth();
  if (!userId) throw new Error('Authentication required');
  return prisma.vehicle.findMany({ where: { organizationId: orgId } });
}
