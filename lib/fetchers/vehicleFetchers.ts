'use server';

import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

import prisma from '@/lib/database/db';
import { vehicleFilterSchema, type VehicleFiltersData } from '@/schemas/vehicles';
import type { Vehicle, VehicleListResponse } from '@/types/vehicles';


export const listVehiclesByOrg = cache(
  async (
    orgId: string,
    page = 1,
    pageSize = 10,
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

      const parsed = vehicleFilterSchema.parse({
        ...filters,
        page,
        limit: pageSize,
      });

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
      const currentPage = parsed.page;
      const limit = Math.min(parsed.limit, 100);
      const skip = (currentPage - 1) * limit;

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
        page: currentPage,
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

export const getVehicleById = cache(
  async (orgId: string, vehicleId: string): Promise<Vehicle | null> => {
    try {
      const { userId } = await auth();
      if (!userId) return null;

      const v = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
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
          unitNumber: true,
          fuelType: true,
          registrationExpiration: true,
          insuranceExpiration: true,
          currentOdometer: true,
          nextMaintenanceDate: true,
          nextMaintenanceMileage: true,
          lastMaintenanceDate: true,
          lastMaintenanceMileage: true,
          createdAt: true,
          updatedAt: true,
        },
      } as any);
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
        lastMaintenanceMileage: v.lastMaintenanceMileage ?? undefined,
        nextMaintenanceDate: v.nextMaintenanceDate ?? undefined,
        nextMaintenanceMileage: v.nextMaintenanceMileage ?? undefined,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
        driver: undefined,
        organization: undefined,
        lastMaintenanceDate: v.lastMaintenanceDate ?? undefined,
      };
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error);
      return null;
    }
  },
);
