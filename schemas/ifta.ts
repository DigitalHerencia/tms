/**
 * Validation schemas for IFTA-related forms
 * Using Zod for runtime validation
 */

import { z } from 'zod';

export const createFuelPurchaseSchema = z.object({
  vehicleId: z.string(),
  driverId: z.string(),
  date: z.string().min(1, 'Date is required'),
  location: z.object({
    name: z.string().min(1, 'Location name is required'),
    address: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  gallons: z.number().min(0.1, 'Gallons must be greater than 0'),
  cost: z.number().min(0.01, 'Cost must be greater than 0'),
  odometer: z.number().min(0, 'Odometer must be a positive number'),
  fuelType: z.enum(['diesel', 'gasoline']),
  notes: z.string().optional(),
});

export const fuelPurchaseFilterSchema = z.object({
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  fuelType: z.enum(['all', 'diesel', 'gasoline']).optional(),
});

export const createTripReportSchema = z.object({
  vehicleId: z.string(),
  driverId: z.string(),
  loadId: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  startOdometer: z.number().min(0, 'Start odometer must be a positive number'),
  endOdometer: z.number().min(0, 'End odometer must be a positive number'),
  jurisdictions: z
    .array(
      z.object({
        jurisdiction: z.string().min(1, 'Jurisdiction is required'),
        miles: z.number().min(0, 'Miles must be a positive number'),
      })
    )
    .min(1, 'At least one jurisdiction is required'),
  notes: z.string().optional(),
});

export const tripReportFilterSchema = z.object({
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  jurisdiction: z.string().optional(),
});

export const iftaReportFilterSchema = z.object({
  year: z.number().optional(),
  quarter: z.number().min(1).max(4).optional(),
  status: z
    .enum(['all', 'draft', 'submitted', 'accepted', 'rejected'])
    .optional(),
});
