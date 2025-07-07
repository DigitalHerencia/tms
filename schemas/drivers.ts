/**
 * Validation schemas for driver-related forms and operations
 * Using Zod for runtime validation and type safety
 */

import { z } from 'zod';

// ================== Base Schemas ==================

export const driverAddressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  country: z.string().default('US'),
});

export const driverEmergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional(),
  address: z.string().optional(),
});

export const driverLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  lastUpdated: z.string(),
  source: z.enum(['gps', 'manual', 'estimated']),
});

// ================== Driver Status Enums ==================

export const driverStatusSchema = z.enum([
  'available',
  'assigned',
  'driving',
  'on_duty',
  'off_duty',
  'sleeper_berth',
  'personal_conveyance',
  'yard_moves',
  'inactive',
  'terminated',
]);

export const driverAvailabilityStatusSchema = z.enum([
  'available',
  'busy',
  'maintenance',
  'vacation',
  'sick',
  'suspended',
]);

export const cdlClassSchema = z.enum(['A', 'B', 'C']);
export const payTypeSchema = z.enum([
  'hourly',
  'mileage',
  'salary',
  'percentage',
]);

// ================== Core Driver Schemas ==================

export const driverFormSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\d\-\\+\\(\\)\s]+$/, 'Please enter a valid phone number'),
  dateOfBirth: z.string().optional(),
  address: driverAddressSchema.optional(),

  // Employment Information
  employeeId: z
    .string()
    .max(20, 'Employee ID must be less than 20 characters')
    .optional(),
  hireDate: z.string().min(1, 'Hire date is required'),
  payRate: z.number().min(0, 'Pay rate must be positive').optional(),
  payType: payTypeSchema.optional(),
  homeTerminal: z.string().min(1, 'Home terminal is required'),

  // CDL Information
  cdlNumber: z
    .string()
    .min(1, 'CDL number is required')
    .max(30, 'CDL number must be less than 30 characters'),
  cdlState: z
    .string()
    .min(2, 'CDL state is required')
    .max(2, 'CDL state must be 2 characters'),
  cdlClass: cdlClassSchema,
  cdlExpiration: z.string().min(1, 'CDL expiration date is required'),
  endorsements: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),

  // Medical Information
  medicalCardNumber: z
    .string()
    .max(30, 'Medical card number must be less than 30 characters')
    .optional(),
  medicalCardExpiration: z
    .string()
    .min(1, 'Medical card expiration date is required'),

  // Emergency Contact
  emergencyContact: driverEmergencyContactSchema.optional(),

  // Additional Information
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const driverUpdateSchema = z.object({
  // Personal Information Updates
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\d\-\\+\\(\\)\s]+$/, 'Please enter a valid phone number')
    .optional(),
  address: driverAddressSchema.partial().optional(),

  // Employment Updates
  payRate: z.number().min(0, 'Pay rate must be positive').optional(),
  payType: payTypeSchema.optional(),
  homeTerminal: z.string().min(1, 'Home terminal is required').optional(),

  // CDL Updates
  cdlExpiration: z.string().optional(),
  endorsements: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  medicalCardExpiration: z.string().optional(),

  // Status Updates
  status: driverStatusSchema.optional(),
  availabilityStatus: driverAvailabilityStatusSchema.optional(),

  // Emergency Contact Updates
  emergencyContact: driverEmergencyContactSchema.optional(),

  // Additional Information Updates
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const driverStatusUpdateSchema = z.object({
  status: driverStatusSchema,
  availabilityStatus: driverAvailabilityStatusSchema.optional(),
  location: driverLocationSchema.optional(),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

// ================== Document Management Schemas ==================

export const driverDocumentTypeSchema = z.enum([
  'cdl_license',
  'medical_certificate',
  'drug_test_result',
  'background_check',
  'training_certificate',
  'employment_contract',
  'insurance_card',
  'w4_form',
  'i9_form',
  'safety_training',
  'hazmat_endorsement',
  'other',
]);

export const driverDocumentSchema = z.object({
  type: driverDocumentTypeSchema,
  name: z.string().min(1, 'Document name is required'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),

  // Document specifics
  issueDate: z.string().optional(),
  expirationDate: z.string().optional(),
  issuingAuthority: z
    .string()
    .max(100, 'Issuing authority must be less than 100 characters')
    .optional(),
  documentNumber: z
    .string()
    .max(50, 'Document number must be less than 50 characters')
    .optional(),

  // File information (handled separately for uploads)
  fileSize: z
    .number()
    .max(10 * 1024 * 1024, 'File size must be less than 10MB')
    .optional(),
  mimeType: z.string().optional(),
});

// ================== HOS Schemas ==================

export const hosStatusSchema = z.enum([
  'off_duty',
  'sleeper_berth',
  'driving',
  'on_duty_not_driving',
  'personal_conveyance',
  'yard_moves',
]);

export const hosEntrySchema = z.object({
  status: hosStatusSchema,
  location: z.string().min(1, 'Location is required'),
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),

  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().optional(),

  vehicleId: z.string().optional(),
  odometer: z.number().min(0, 'Odometer must be positive').optional(),
  engineHours: z.number().min(0, 'Engine hours must be positive').optional(),
  trailer: z
    .string()
    .max(20, 'Trailer must be less than 20 characters')
    .optional(),
  shipping: z
    .string()
    .max(100, 'Shipping must be less than 100 characters')
    .optional(),

  remark: z
    .string()
    .max(500, 'Remark must be less than 500 characters')
    .optional(),
  isPersonalTime: z.boolean().default(false),
  isDriving: z.boolean().default(false),
});

// ================== Assignment Schemas ==================

export const driverAssignmentSchema = z.object({
  driverId: z.string().min(1, 'Driver ID is required'),
  loadId: z.string().optional(),
  vehicleId: z.string().optional(),
  trailerId: z.string().optional(),

  assignmentType: z.enum(['load', 'maintenance', 'training', 'other']),
  scheduledStart: z.string().min(1, 'Scheduled start time is required'),
  scheduledEnd: z.string().optional(),

  instructions: z
    .string()
    .max(1000, 'Instructions must be less than 1000 characters')
    .optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

// ================== Filter Schemas ==================

export const driverFiltersSchema = z.object({
  search: z
    .string()
    .max(100, 'Search term must be less than 100 characters')
    .optional(),
  status: z.array(driverStatusSchema).optional(),
  availabilityStatus: z.array(driverAvailabilityStatusSchema).optional(),
  homeTerminal: z.array(z.string()).optional(),
  cdlClass: z.array(cdlClassSchema).optional(),
  endorsements: z.array(z.string()).optional(),

  // Expiration alerts
  cdlExpiringInDays: z.number().min(0).max(365).optional(),
  medicalExpiringInDays: z.number().min(0).max(365).optional(),

  // Performance filters
  minSafetyScore: z.number().min(0).max(100).optional(),
  maxViolations: z.number().min(0).optional(),

  // Date filters
  hiredAfter: z.string().optional(),
  hiredBefore: z.string().optional(),

  // Pagination
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const driverBulkUpdateSchema = z.object({
  driverIds: z.array(z.string()).min(1, 'At least one driver must be selected'),
  updates: z.object({
    status: driverStatusSchema.optional(),
    availabilityStatus: driverAvailabilityStatusSchema.optional(),
    homeTerminal: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// ================== Performance & Analytics Schemas ==================

export const driverPerformanceFiltersSchema = z.object({
  driverId: z.string().optional(),
  period: z
    .enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly'])
    .default('monthly'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  includeInactive: z.boolean().default(false),
});

// ================== Export Types ==================

export type DriverFormData = z.infer<typeof driverFormSchema>;
export type DriverUpdateData = z.infer<typeof driverUpdateSchema>;
export type DriverStatusUpdate = z.infer<typeof driverStatusUpdateSchema>;
export type DriverDocumentData = z.infer<typeof driverDocumentSchema>;
export type HOSEntryData = z.infer<typeof hosEntrySchema>;
export type DriverAssignmentData = z.infer<typeof driverAssignmentSchema>;
export type DriverFilters = z.infer<typeof driverFiltersSchema>;
export type DriverBulkUpdate = z.infer<typeof driverBulkUpdateSchema>;
export type DriverPerformanceFilters = z.infer<
  typeof driverPerformanceFiltersSchema
>;

export const hosLogEntrySchema = z.object({
  status: z.enum(['driving', 'on_duty', 'off_duty', 'sleeper_berth']),
  location: z.string().min(1, 'Location is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  notes: z.string().optional(),
});
