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
  const driver = {
    id: raw.id,
    userId: raw.userId || raw.user_id, // Support both camelCase and snake_case
    tenantId: raw.organizationId, // Map organizationId to tenantId
    name: `${raw.firstName || ''} ${raw.lastName || ''}`.trim(), // Add name property
    homeTerminal: raw.homeTerminal || '', // Provide default if missing
    cdlNumber: raw.licenseNumber || '', // Map licenseNumber to cdlNumber
    cdlState: raw.licenseState || '', // Map licenseState to cdlState
    cdlClass: raw.licenseClass || 'A', // Map licenseClass to cdlClass with default
    cdlExpiration: raw.licenseExpiration || new Date(),
    medicalCardExpiration: raw.medicalCardExpiration || new Date(),
    firstName: raw.firstName || '',
    lastName: raw.lastName || '',
    email: raw.email || '',
    phone: raw.phone || '',
    status: raw.status,
    availabilityStatus: 'available' as const, // Default since this field doesn't exist in DB
    hireDate: raw.hireDate || new Date(),
    safetyScore: raw.safetyScore || 0,
    violationCount: raw.violationCount || 0,
    accidentCount: raw.accidentCount || 0,
    isActive: raw.status === 'active', // Derive isActive from status
    createdBy: raw.createdBy || '',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    // Optional fields
    employeeId: raw.employeeId,
    terminationDate: raw.terminationDate,
    drugTestDate: raw.drugTestDate,
    notes: raw.notes,
    // Add address if available
    address: raw.address ? {
      street: raw.address,
      city: raw.city || '',
      state: raw.state || '',
      zipCode: raw.zip || '',
      country: 'USA' // Default country
    } : undefined,
    // Parse emergency contacts if available
    emergencyContact: raw.emergencyContact1 ? {
      name: raw.emergencyContact1,
      phone: raw.emergencyContact2 || '',
      relationship: '',
      email: '',
      address: raw.emergencyContact3 || ''
    } : undefined,
    // Parse current assignment from loads (just the load ID)
    currentAssignment: raw.loads?.[0]?.id || undefined,
  };

    // Add assignment details for components that need the full object
  if (raw.loads?.[0]) {
    (driver as any).currentAssignmentDetails = {
      id: raw.loads[0].id,
      loadNumber: raw.loads[0].loadNumber,
      status: raw.loads[0].status,
      customerName: raw.loads[0].customerName,
      scheduledPickupDate: raw.loads[0].scheduledPickupDate,
      scheduledDeliveryDate: raw.loads[0].scheduledDeliveryDate,
      vehicleId: raw.loads[0].vehicleId,
      vehicleUnit: raw.loads[0].vehicle?.unitNumber,
    };
  }

  // Add organization name and profile image
  if (raw.organization) {
    (driver as any).companyName = raw.organization.name;
  }
  
  if (raw.user) {
    (driver as any).profileImage = raw.user.profileImageUrl;
  }

  return driver;
}

// ================== Core Fetchers ==================

// Add this type for driver with assignment info
type DriverWithAssignment = Driver & {
  currentAssignmentDetails?: {
    id: string;
    loadNumber: string;
    status: string;
    customerName: string | null;
    scheduledPickupDate: Date | null;
    scheduledDeliveryDate: Date | null;
    vehicleId: string | null;
    vehicleUnit?: string;
  } | null;
};

/**
 * Get driver by user ID or driver ID with permission check
 * Handles both cases where the parameter might be a user ID or driver ID
 */
export const getDriverById = async (
  userIdOrDriverId: string,
  orgId: string
): Promise<Driver | null> => {
  try {
    const { userId: sessionUserId } = await auth();
    if (!sessionUserId) {
      console.log('No session user ID found');
      return null;
    }
    
    // Check if user is a member of the organization (emulating dashboard pattern)
    const user = await prisma.user.findFirst({
      where: { id: sessionUserId, organizationId: orgId },
    });
    if (!user) {
      console.log('Session user not found in organization:', { sessionUserId, orgId });
      throw new Error('User not found or unauthorized');
    }

    // First try to find by userId (existing behavior)
    let driver = await prisma.driver.findFirst({
      where: {
        userId: userIdOrDriverId,
        organizationId: orgId,
        // Allow all statuses except terminated for driver dashboard
        status: { not: 'terminated' },
      },
      include: {
        organization: true,
        user: true,
        compliance_documents: true, // <-- FIXED property name
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

    // If not found by userId, try to find by driver ID
    if (!driver) {
      console.log('Driver not found by userId, trying by driver ID:', userIdOrDriverId);
      driver = await prisma.driver.findFirst({
        where: {
          id: userIdOrDriverId,
          organizationId: orgId,
          // Allow all statuses except terminated for driver dashboard
          status: { not: 'terminated' },
        },
        include: {
          organization: true,
          user: true,
          compliance_documents: true, // <-- FIXED property name
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
    }

    if (!driver) {
      console.log('Driver not found by either userId or driverId:', { userIdOrDriverId, orgId });
      return null;
    }

    console.log('Driver found:', { driverId: driver.id, userId: driver.userId, orgId: driver.organizationId });
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
): Promise<DriverListResponse> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    }
    
    // Check if user is a member of the organization (emulating dashboard pattern)
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId: orgId },
    });
    if (!user) throw new Error('User not found or unauthorized');

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
      return parseDriverData(driver);
    });

    return {
      data: parsedDriversData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error listing drivers:', error);
    return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
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
    const { userId } = await auth();
    if (!userId) throw new Error('Authentication required');
    
    // Check if user is a member of the organization (emulating dashboard pattern)
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId: orgId },
    });
    if (!user) throw new Error('User not found or unauthorized');
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
