"use server"

import { auth } from "@clerk/nextjs/server"
import { cache } from "react"

import prisma from "@/lib/database/db"
import {
    vehicleFilterSchema,
    type VehicleFiltersData,
} from "@/schemas/vehicles"
import type { Vehicle, VehicleListResponse } from "@/types/vehicles"

/**
 * List vehicles for an organization with optional filtering and pagination.
 * - Validates the filter input using `vehicleFilterSchema`.
 * - Returns paginated results (vehicles, total, page, limit, totalPages).
 * - Server-first, feature-driven.
 */
export const listVehiclesByOrg = cache(
    async (
        orgId: string,
        filters: VehicleFiltersData = {} as VehicleFiltersData
    ): Promise<VehicleListResponse> => {
        try {
            const { userId } = await auth()
            if (!userId) {
                return {
                    vehicles: [],
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 0,
                }
            }

            const parsed = vehicleFilterSchema.parse(filters)

            const where: any = { organizationId: orgId }

            if (parsed.search) {
                const term = parsed.search
                where.OR = [
                    { unitNumber: { contains: term, mode: "insensitive" } },
                    { vin: { contains: term, mode: "insensitive" } },
                    { make: { contains: term, mode: "insensitive" } },
                    { model: { contains: term, mode: "insensitive" } },
                    { licensePlate: { contains: term, mode: "insensitive" } },
                ]
            }

            if (parsed.type) {
                where.type = parsed.type
            }

            if (parsed.status) {
                where.status = parsed.status
            }

            if (parsed.make) {
                where.make = { contains: parsed.make, mode: "insensitive" }
            }

            if (parsed.model) {
                where.model = { contains: parsed.model, mode: "insensitive" }
            }

            if (parsed.year) {
                where.year = parsed.year
            }

            if (parsed.assignedDriverId) {
                where.currentDriverId = parsed.assignedDriverId
            }

            if (parsed.maintenanceDue) {
                // Support both nextMaintenanceDate and nextInspectionDue fields
                where.OR = [
                    { nextMaintenanceDate: { lte: new Date() } },
                    { nextInspectionDue: { lte: new Date() } },
                ]
            }

            // Pagination
            const page = parsed.page || 1
            const limit = Math.min(parsed.limit || 10, 100)
            const skip = (page - 1) * limit

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
                    orderBy: { unitNumber: "asc" },
                    skip,
                    take: limit,
                }),
                prisma.vehicle.count({ where }),
            ])

            // Map Prisma result to public Vehicle type
            const vehicles: Vehicle[] = results.map(v => ({
                id: v.id,
                organizationId: v.organizationId,
                type: v.type as Vehicle["type"],
                status: v.status as Vehicle["status"],
                make: v.make ?? "",
                model: v.model ?? "",
                year: v.year ?? 0,
                vin: v.vin ?? "",
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
                // Remove currentDriverId, currentDriver, nextMaintenanceDate, nextInspectionDue, organization
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
            }))

            return {
                vehicles,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        } catch (error) {
            console.error("Error listing vehicles:", error)
            return { vehicles: [], total: 0, page: 1, limit: 10, totalPages: 0 }
        }
    }
)

/**
 * Get a single vehicle by ID for an organization.
 * - Validates user authentication and organization access.
 * - Returns null if vehicle not found or user lacks permission.
 * - Server-first, feature-driven.
 */
export const getVehicleById = cache(
    async (vehicleId: string, orgId: string): Promise<Vehicle | null> => {
        try {
            const { userId } = await auth()
            if (!userId) {
                return null
            }

            const result = await prisma.vehicle.findFirst({
                where: {
                    id: vehicleId,
                    organizationId: orgId,
                },
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
                    notes: true,
                    customFields: true,
                    createdAt: true,
                    updatedAt: true,
                    nextInspectionDue: true,
                    registrationExpiration: true,
                },
            })

            if (!result) {
                return null
            }

            // Map Prisma result to public Vehicle type
            const vehicle: Vehicle = {
                id: result.id,
                organizationId: result.organizationId,
                type: result.type as Vehicle[ "type" ],
                status: result.status as Vehicle[ "status" ],
                make: result.make ?? "",
                model: result.model ?? "",
                year: result.year ?? 0,
                vin: result.vin ?? "",
                licensePlate: result.licensePlate ?? undefined,
                licensePlateState: result.licensePlateState ?? undefined,
                unitNumber: result.unitNumber ?? undefined,
                currentOdometer: result.currentOdometer ?? undefined,
                lastOdometerUpdate: result.lastOdometerUpdate ?? undefined,
                fuelType: result.fuelType ?? undefined,
                lastInspectionDate: result.lastInspectionDate ?? undefined,
                insuranceExpiration: result.insuranceExpiration ?? undefined,
                nextInspectionDue: result.nextInspectionDue ?? undefined,
                registrationExpiration: result.registrationExpiration ?? undefined,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
                notes: result.notes ?? undefined,
                customFields: result.customFields as Record<string, any> ?? undefined,
                // Remove fields that don't exist in schema
                grossVehicleWeight: undefined,
                maxPayload: undefined,
                engineType: undefined,
                fuelCapacity: undefined,
                insuranceProvider: undefined,
                insurancePolicyNumber: undefined,
                currentLocation: undefined,
                totalMileage: undefined,
                lastMaintenanceMileage: undefined,
                nextMaintenanceDate: undefined,
                nextMaintenanceMileage: undefined,
                purchaseDate: undefined,
                purchasePrice: undefined,
                currentValue: undefined,
                driver: undefined,
                organization: undefined,
                lastMaintenanceDate: undefined
            }

            return vehicle

        } catch (error) {
            console.error("Error fetching vehicle by ID:", error)
            return null
        }
    }
)

