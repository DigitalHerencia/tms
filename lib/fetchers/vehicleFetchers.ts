'use server';

import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

import prisma from '@/lib/database/db';
import { vehicleFilterSchema, type VehicleFiltersData } from '@/schemas/vehicles';
import type { Vehicle, VehicleListResponse } from '@/types/vehicles';

/**
 * List vehicles for an organization with optional filtering and pagination.
 * - Validates the filter input using `vehicleFilterSchema`.
 * - Returns paginated results (vehicles, total, page, limit, totalPages).
 * - Server-first, feature-driven.
 */
export const listVehiclesByOrg = cache(
  async (
    orgId: string,
    filters: VehicleFiltersData = {} as VehicleFiltersData,
  ): Promise<VehicleListResponse> => {
    try {
      const { userId } = await auth();
      if (!userId) {
        return {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        };
      }

      const parsed = vehicleFilterSchema.parse(filters);

      const where: any = { organizationId: orgId };

      if (parsed.search) {
        const term = parsed.search;
        where.OR = [
          { unitNumber: { contains: term, mode: 'insensitive' } },
          { vin: { contains: term, mode: 'insensitive' } },
          { make: { contains: term, mode: 'insensitive' } },
          { model: { contains: term, mode: 'insensitive' } },
          { licensePlate: { contains: term, mode: 'insensitive' } },
        ];
      }

      if (parsed.type) {
        where.type = parsed.type;
      }

      if (parsed.status) {
        where.status = parsed.status;
      }

      if (parsed.make) {
        where.make = { contains: parsed.make, mode: 'insensitive' };
      }

      if (parsed.model) {
        where.model = { contains: parsed.model, mode: 'insensitive' };
      }

      if (parsed.year) {
        where.year = parsed.year;
      }

      if (parsed.assignedDriverId) {
        where.currentDriverId = parsed.assignedDriverId;
      }

      if (parsed.maintenanceDue) {
        // Support both nextMaintenanceDate and nextInspectionDue fields
        where.OR = [
          { nextMaintenanceDate: { lte: new Date() } },
          { nextInspectionDue: { lte: new Date() } },
        ];
      }

      // Pagination
      const page = parsed.page || 1;
      const limit = Math.min(parsed.limit || 10, 100);
      const skip = (page - 1) * limit;

      const [results, total] = await Promise.all([
        prisma.vehicle.findMany({
          where,
          select: {
            id: true,
            organizationId: true,
            type: true,
            status: true,
            make: true,
            model: true,
            year: true,
            vin: true,
            licensePlate: true,
            licensePlateState: true,
            unitNumber: true,
            currentOdometer: true,
            lastOdometerUpdate: true,
            fuelType: true,
            lastInspectionDate: true,
            insuranceExpiration: true,
            nextInspectionDue: true,
            registrationExpiration: true,
            notes: true,
            customFields: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { unitNumber: 'asc' },
          skip,
          take: limit,
        }),
        prisma.vehicle.count({ where }),
      ]);

      // Map Prisma result to public Vehicle type
      const vehicles: Vehicle[] = results.map((v) => ({
        id: v.id,
        organizationId: v.organizationId,
        type: v.type as Vehicle['type'],
        status: v.status as Vehicle['status'],
        make: v.make ?? '',
        model: v.model ?? '',
        year: v.year ?? 0,
        vin: v.vin ?? '',
        licensePlate: v.licensePlate ?? undefined,
        unitNumber: v.unitNumber ?? undefined,
        grossVehicleWeight: undefined,
        maxPayload: undefined,
        fuelType: v.fuelType ?? undefined,
        engineType: undefined,
        registrationNumber: undefined,
        registrationExpiration: v.registrationExpiration ?? undefined,
        insuranceProvider: undefined,
        insurancePolicyNumber: undefined,
        insuranceExpiration: v.insuranceExpiration ?? undefined,
        currentLocation: undefined,
        totalMileage: v.currentOdometer ?? undefined,
        lastMaintenanceMileage: undefined,
        nextMaintenanceDate: undefined,
        nextMaintenanceMileage: undefined,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        driver: undefined,
        organization: undefined,
        lastMaintenanceDate: undefined, // <-- Added to fix type error
      }));

      return {
        data: vehicles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Always return a valid VehicleListResponse on error
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    }
  },
);
export const createVehicleAction = async (
  orgId: string,
  formData: FormData,
): Promise<{ success: boolean; data?: Vehicle; error?: string }> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const vehicleData = Object.fromEntries(formData.entries());
    vehicleData.organizationId = orgId;

    const newVehicle = await prisma.vehicle.create({
      data: vehicleData as any, // Adjust type as needed
    });

    // Map Prisma result to public Vehicle type, ensuring all required fields are present
    const mappedVehicle: Vehicle = {
      id: newVehicle.id,
      organizationId: newVehicle.organizationId,
      type: newVehicle.type as Vehicle['type'], // <-- fix: cast to VehicleType
      status: newVehicle.status as Vehicle['status'], // <-- fix: cast to VehicleStatus
      make: newVehicle.make ?? '',
      model: newVehicle.model ?? '',
      year: newVehicle.year ?? 0,
      vin: newVehicle.vin ?? '',
      licensePlate: newVehicle.licensePlate ?? undefined,
      unitNumber: newVehicle.unitNumber ?? undefined,
      grossVehicleWeight: undefined, // <-- fix: field not present in Prisma result
      maxPayload: undefined, // <-- fix: field not present in Prisma result
      fuelType: newVehicle.fuelType ?? undefined,
      engineType: undefined, // <-- fix: field not present in Prisma result
      registrationNumber: undefined, // <-- fix: field not present in Prisma result
      registrationExpiration: newVehicle.registrationExpiration ?? undefined,
      insuranceProvider: undefined, // <-- fix: field not present in Prisma result
      insurancePolicyNumber: undefined, // <-- fix: field not present in Prisma result
      insuranceExpiration: newVehicle.insuranceExpiration ?? undefined,
      currentLocation: undefined, // <-- fix: field not present in Prisma result
      totalMileage: newVehicle.currentOdometer ?? undefined,
      lastMaintenanceMileage: undefined, // <-- fix: field not present in Prisma result
      nextMaintenanceDate: undefined, // <-- fix: field not present in Prisma result
      nextMaintenanceMileage: undefined, // <-- fix: field not present in Prisma result
      createdAt: newVehicle.createdAt,
      updatedAt: newVehicle.updatedAt,
      driver: undefined,
      organization: undefined,
      lastMaintenanceDate: undefined, // <-- Add this line to fix the type error
    };

    return { success: true, data: mappedVehicle };
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return { success: false, error: 'Failed to create vehicle' };
  }
};

/**
 * Fetch a single vehicle by organization and vehicle ID.
 * - Returns mapped Vehicle type or null if not found/unauthorized.
 * - Server-first, feature-driven.
 */
export const getVehicleById = cache(
  async (orgId: string, vehicleId: string): Promise<Vehicle | null> => {
    try {
      const { userId } = await auth();
      if (!userId) return null;

      const v = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });
      if (!v || v.organizationId !== orgId) return null;

      // Map Prisma result to public Vehicle type
      return {
        id: v.id,
        organizationId: v.organizationId,
        type: v.type as Vehicle['type'],
        status: v.status as Vehicle['status'],
        make: v.make ?? '',
        model: v.model ?? '',
        year: v.year ?? 0,
        vin: v.vin ?? '',
        licensePlate: v.licensePlate ?? undefined,
        unitNumber: v.unitNumber ?? undefined,
        grossVehicleWeight: undefined,
        maxPayload: undefined,
        fuelType: v.fuelType ?? undefined,
        engineType: undefined,
        registrationNumber: undefined,
        registrationExpiration: v.registrationExpiration ?? undefined,
        insuranceProvider: undefined,
        insurancePolicyNumber: undefined,
        insuranceExpiration: v.insuranceExpiration ?? undefined,
        currentLocation: undefined,
        totalMileage: v.currentOdometer ?? undefined,
        lastMaintenanceMileage: undefined,
        nextMaintenanceDate: undefined,
        nextMaintenanceMileage: undefined,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        driver: undefined,
        organization: undefined,
        lastMaintenanceDate: undefined,
      };
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error);
      return null;
    }
  },
);
