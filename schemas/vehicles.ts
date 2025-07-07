/**
 * Validation schemas for vehicle-related forms
 * Using Zod for runtime validation
 */

import { z } from 'zod';

export const VehicleFormSchema = z.object({
  type: z.enum(['tractor', 'trailer', 'straight_truck', 'other'], {
    required_error: 'Vehicle type is required',
  }),
  make: z.string().min(1, 'Make is required').max(50, 'Make is too long'),
  model: z.string().min(1, 'Model is required').max(50, 'Model is too long'),
  year: z
    .number()
    .min(1980, 'Year must be 1980 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  vin: z
    .string()
    .min(17, 'VIN must be exactly 17 characters')
    .max(17, 'VIN must be exactly 17 characters')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN format'),
  licensePlate: z.string().max(20, 'License plate is too long').optional(),
  unitNumber: z.string().max(20, 'Unit number is too long').optional(),

  // Specifications
  grossVehicleWeight: z
    .number()
    .min(1, 'Gross vehicle weight must be positive')
    .max(999999, 'Gross vehicle weight is too large')
    .optional(),
  maxPayload: z
    .number()
    .min(1, 'Max payload must be positive')
    .max(999999, 'Max payload is too large')
    .optional(),
  fuelType: z.string().max(30, 'Fuel type is too long').optional(),
  engineType: z.string().max(50, 'Engine type is too long').optional(),

  // Registration & Insurance
  registrationNumber: z
    .string()
    .max(50, 'Registration number is too long')
    .optional(),
  registrationExpiry: z.string().optional(),
  insuranceProvider: z
    .string()
    .max(100, 'Insurance provider name is too long')
    .optional(),
  insurancePolicyNumber: z
    .string()
    .max(50, 'Insurance policy number is too long')
    .optional(),
  insuranceExpiry: z.string().optional(),

  // Location & Mileage
  currentLocation: z
    .string()
    .max(200, 'Current location is too long')
    .optional(),
  totalMileage: z
    .number()
    .min(0, 'Total mileage cannot be negative')
    .max(9999999, 'Total mileage is too large')
    .optional(),

  // Maintenance
  nextMaintenanceDate: z.string().optional(),
  nextMaintenanceMileage: z
    .number()
    .min(0, 'Next maintenance mileage cannot be negative')
    .max(9999999, 'Next maintenance mileage is too large')
    .optional(),
});

export const VehicleUpdateStatusSchema = z.object({
  status: z.enum(
    ['available', 'assigned', 'in_maintenance', 'out_of_service', 'retired'],
    {
      required_error: 'Status is required',
    }
  ),
  notes: z.string().max(500, 'Notes are too long').optional(),
});

export const VehicleMaintenanceSchema = z.object({
  type: z.enum(['preventive', 'repair', 'inspection', 'recall'], {
    required_error: 'Maintenance type is required',
  }),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description is too long'),
  performedBy: z.string().max(100, 'Performed by is too long').optional(),
  cost: z
    .number()
    .min(0, 'Cost cannot be negative')
    .max(999999.99, 'Cost is too large')
    .optional(),
  mileageAtService: z
    .number()
    .min(0, 'Mileage at service cannot be negative')
    .max(9999999, 'Mileage at service is too large'),
  serviceDate: z.string().min(1, 'Service date is required'),
  nextServiceDue: z.string().optional(),
  nextServiceMileage: z
    .number()
    .min(0, 'Next service mileage cannot be negative')
    .max(9999999, 'Next service mileage is too large')
    .optional(),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  parts: z.array(z.string().max(100, 'Part name is too long')).optional(),
  laborHours: z
    .number()
    .min(0, 'Labor hours cannot be negative')
    .max(999, 'Labor hours is too large')
    .optional(),
  warrantyInfo: z.string().max(500, 'Warranty info is too long').optional(),
});

export const VehicleFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['tractor', 'trailer', 'straight_truck', 'other']).optional(),
  status: z
    .enum([
      'available',
      'assigned',
      'in_maintenance',
      'out_of_service',
      'retired',
    ])
    .optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  assignedDriverId: z.string().optional(),
  maintenanceDue: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type VehicleFormData = z.infer<typeof VehicleFormSchema>;
export type VehicleUpdateStatusData = z.infer<typeof VehicleUpdateStatusSchema>;
export type VehicleMaintenanceData = z.infer<typeof VehicleMaintenanceSchema>;
export type VehicleFiltersData = z.infer<typeof VehicleFiltersSchema>;

// Legacy schemas for backward compatibility
export const createVehicleSchema = VehicleFormSchema;
export const updateVehicleSchema = VehicleUpdateStatusSchema;
export const vehicleFilterSchema = VehicleFiltersSchema;
export const maintenanceRecordSchema = VehicleMaintenanceSchema;
