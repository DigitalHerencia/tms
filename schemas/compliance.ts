/**
 * Compliance Validation Schemas
 * Centralized validation schemas for compliance-related data structures
 */

import { z } from 'zod';

import { addressSchema, contactSchema } from './shared';

// Compliance document validation schemas
export const createComplianceDocumentSchema = z.object({
  entityType: z.enum(['driver', 'vehicle', 'trailer', 'company']),
  entityId: z.string().min(1, 'Entity ID is required'),
  type: z.enum([
    // Company documents
    'dot_authority',
    'operating_authority',
    'business_license',
    'insurance_general',
    'insurance_cargo',
    'insurance_liability',
    'workers_comp',
    'ifta_license',
    'irs_form_2290',
    'ucr_registration',
    'drug_testing_program',
    'safety_management_cert',
    // Driver documents
    'cdl_license',
    'medical_certificate',
    'drug_test_results',
    'alcohol_test_results',
    'background_check',
    'mvr_report',
    'employment_verification',
    'road_test_certificate',
    'hazmat_endorsement',
    'twic_card',
    'passport',
    'driver_qualification_file',
    // Vehicle documents
    'vehicle_registration',
    'vehicle_title',
    'annual_inspection',
    'emission_test',
    'apportioned_registration',
    'vehicle_insurance',
    'lease_agreement',
    'maintenance_contract',
    'warranty_info',
    // Trailer documents
    'trailer_registration',
    'trailer_title',
    'trailer_inspection',
    'trailer_insurance',
    'trailer_lease',
    // Other
    'permit',
    'contract',
    'other',
  ]),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  issuedDate: z.string().min(1, 'Issued date is required'),
  expirationDate: z.string().optional(),
  documentNumber: z.string().optional(),
  issuingAuthority: z.string().optional(),
  reminderDays: z.array(z.number().min(1)).default([30, 7, 1]),
  autoRenewal: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateComplianceDocumentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  status: z
    .enum(['valid', 'expiring', 'expired', 'pending', 'rejected'])
    .optional(),
  expirationDate: z.string().optional(),
  documentNumber: z.string().optional(),
  issuingAuthority: z.string().optional(),
  reminderDays: z.array(z.number().min(1)).optional(),
  autoRenewal: z.boolean().optional(),
  renewalStatus: z
    .enum(['not_applicable', 'pending', 'in_progress', 'completed', 'failed'])
    .optional(),
  renewalNotes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const complianceDocumentFilterSchema = z.object({
  entityType: z
    .array(z.enum(['driver', 'vehicle', 'trailer', 'company']))
    .optional(),
  entityId: z.string().optional(),
  type: z.array(z.string()).optional(),
  status: z
    .array(z.enum(['valid', 'expiring', 'expired', 'pending', 'rejected']))
    .optional(),
  expiringIn: z.number().min(1).optional(), // days
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(['name', 'type', 'expirationDate', 'status', 'createdAt'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// HOS validation schemas
export const hosEntrySchema = z.object({
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum([
    'driving',
    'on_duty',
    'off_duty',
    'sleeper_berth',
    'personal_conveyance',
    'yard_moves',
  ]),
  location: z.string().min(1, 'Location is required'),
  odometer: z.number().min(0).optional(),
  engineHours: z.number().min(0).optional(),
  notes: z.string().optional(),
  automaticEntry: z.boolean().default(false),
  source: z.enum(['manual', 'eld', 'driver_app', 'gps']).default('manual'),
});

export const hosBreakSchema = z.object({
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  type: z.enum(['30_minute', '8_hour', '10_hour', '34_hour', 'other']),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
});

export const createHosLogSchema = z.object({
  driverId: z.string().min(1, 'Driver ID is required'),
  date: z.string().min(1, 'Date is required'),
  logs: z.array(hosEntrySchema).min(1, 'At least one HOS entry is required'),
  breaks: z.array(hosBreakSchema).optional(),
  notes: z.string().optional(),
  eldData: z
    .object({
      deviceId: z.string(),
      deviceManufacturer: z.string(),
      deviceModel: z.string(),
      firmwareVersion: z.string(),
      dataTransferMethod: z.enum(['web', 'email', 'usb', 'bluetooth']),
      rawData: z.record(z.any()).optional(),
    })
    .optional(),
});

export const updateHosLogSchema = z.object({
  id: z.string(),
  status: z.enum(['compliant', 'violation', 'pending_review']).optional(),
  logs: z.array(hosEntrySchema).optional(),
  breaks: z.array(hosBreakSchema).optional(),
  certifiedBy: z.string().optional(),
  certifiedAt: z.string().optional(),
  notes: z.string().optional(),
});

export const hosViolationSchema = z.object({
  hosLogId: z.string().min(1, 'HOS Log ID is required'),
  type: z.enum([
    '11_hour',
    '14_hour',
    '70_hour',
    '8_hour_break',
    '30_minute_break',
    '34_hour_restart',
    '60_70_hour',
    'other',
  ]),
  description: z.string().min(1, 'Description is required'),
  severity: z.enum(['minor', 'major', 'critical']),
  timestamp: z.string().min(1, 'Timestamp is required'),
  resolved: z.boolean().default(false),
  resolutionNotes: z.string().optional(),
  fineAmount: z.number().min(0).optional(),
  courtDate: z.string().optional(),
});

export const hosFilterSchema = z.object({
  driverId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z
    .array(z.enum(['compliant', 'violation', 'pending_review']))
    .optional(),
  hasViolations: z.boolean().optional(),
  sortBy: z.enum(['date', 'status', 'totalDriveTime', 'violations']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// DVIR validation schemas
export const dvirDefectSchema = z.object({
  category: z.enum([
    'brakes',
    'coupling',
    'engine',
    'exhaust',
    'fuel_system',
    'lights',
    'steering',
    'tires',
    'suspension',
    'electrical',
    'body',
    'other',
  ]),
  subcategory: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  severity: z.enum(['minor', 'major', 'critical', 'out_of_service']),
  location: z.string().min(1, 'Location is required'),
  repaired: z.boolean().default(false),
  repairDescription: z.string().optional(),
  partNumber: z.string().optional(),
  laborHours: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  requiresInspection: z.boolean().default(false),
  notes: z.string().optional(),
});

export const dvirImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  caption: z.string().optional(),
});

export const createDvirSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  driverId: z.string().min(1, 'Driver ID is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['pre_trip', 'post_trip', 'en_route']),
  shift: z.enum(['start', 'end']),
  odometer: z.number().min(0, 'Odometer must be a positive number'),
  engineHours: z.number().min(0).optional(),
  location: z.string().min(1, 'Location is required'),
  defects: z.array(dvirDefectSchema),
  safeToOperate: z.boolean(),
  defectsFound: z.boolean(),
  defectsCorrected: z.boolean(),
  notes: z.string().optional(),
  driverSignature: z.string().min(1, 'Driver signature is required'),
  mechanicSignature: z.string().optional(),
  mechanicName: z.string().optional(),
  mechanicCertification: z.string().optional(),
  images: z.array(dvirImageSchema).optional(),
});

export const updateDvirSchema = z.object({
  id: z.string(),
  status: z
    .enum(['pending', 'approved', 'requires_attention', 'out_of_service'])
    .optional(),
  defects: z.array(dvirDefectSchema).optional(),
  safeToOperate: z.boolean().optional(),
  defectsFound: z.boolean().optional(),
  defectsCorrected: z.boolean().optional(),
  notes: z.string().optional(),
  mechanicSignature: z.string().optional(),
  mechanicName: z.string().optional(),
  mechanicCertification: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
  images: z.array(dvirImageSchema).optional(),
});

export const dvirFilterSchema = z.object({
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.array(z.enum(['pre_trip', 'post_trip', 'en_route'])).optional(),
  status: z
    .array(
      z.enum(['pending', 'approved', 'requires_attention', 'out_of_service'])
    )
    .optional(),
  safeToOperate: z.boolean().optional(),
  defectsFound: z.boolean().optional(),
  sortBy: z.enum(['date', 'vehicle', 'driver', 'status', 'defects']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Maintenance validation schemas
export const maintenancePartSchema = z.object({
  partNumber: z.string().min(1, 'Part number is required'),
  description: z.string().min(1, 'Description is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitCost: z.number().min(0, 'Unit cost must be positive'),
  supplier: z.string().optional(),
  warranty: z
    .object({
      type: z.enum(['parts', 'labor', 'both']),
      duration: z.number().int().min(1),
      mileage: z.number().int().min(0).optional(),
      description: z.string().optional(),
      startDate: z.string(),
      warrantyNumber: z.string().optional(),
      terms: z.string().optional(),
    })
    .optional(),
});

export const maintenanceVendorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Vendor name is required'),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  rating: z.number().min(1).max(5).optional(),
  preferredVendor: z.boolean().default(false),
});

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  type: z.enum([
    'preventive',
    'corrective',
    'inspection',
    'recall',
    'warranty',
  ]),
  category: z.enum([
    'engine',
    'transmission',
    'brakes',
    'tires',
    'electrical',
    'hvac',
    'body',
    'other',
  ]),
  description: z.string().min(1, 'Description is required'),
  scheduledDate: z.string().optional(),
  dueDate: z.string().optional(),
  odometer: z.number().min(0, 'Odometer must be positive'),
  engineHours: z.number().min(0).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  vendor: maintenanceVendorSchema.optional(),
  technician: z.string().optional(),
  parts: z.array(maintenancePartSchema).optional(),
  notes: z.string().optional(),
  nextServiceOdometer: z.number().min(0).optional(),
  nextServiceDate: z.string().optional(),
});

export const updateMaintenanceSchema = z.object({
  id: z.string(),
  completedDate: z.string().optional(),
  status: z
    .enum(['scheduled', 'overdue', 'in_progress', 'completed', 'cancelled'])
    .optional(),
  technician: z.string().optional(),
  laborHours: z.number().min(0).optional(),
  laborCost: z.number().min(0).optional(),
  partsCost: z.number().min(0).optional(),
  totalCost: z.number().min(0).optional(),
  parts: z.array(maintenancePartSchema).optional(),
  notes: z.string().optional(),
  nextServiceOdometer: z.number().min(0).optional(),
  nextServiceDate: z.string().optional(),
});

export const maintenanceFilterSchema = z.object({
  vehicleId: z.string().optional(),
  type: z
    .array(
      z.enum(['preventive', 'corrective', 'inspection', 'recall', 'warranty'])
    )
    .optional(),
  status: z
    .array(
      z.enum(['scheduled', 'overdue', 'in_progress', 'completed', 'cancelled'])
    )
    .optional(),
  priority: z.array(z.enum(['low', 'medium', 'high', 'urgent'])).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  vendor: z.string().optional(),
  dueSoon: z.number().min(1).optional(), // days
  overdue: z.boolean().optional(),
  sortBy: z
    .enum([
      'scheduledDate',
      'dueDate',
      'completedDate',
      'priority',
      'cost',
      'vehicle',
    ])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Safety event validation schemas
export const witnessSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  statement: z.string().optional(),
  relationship: z.enum(['employee', 'customer', 'bystander', 'other']),
});

export const insuranceClaimSchema = z.object({
  claimNumber: z.string().min(1, 'Claim number is required'),
  insurer: z.string().min(1, 'Insurer is required'),
  adjusterId: z.string().optional(),
  adjusterPhone: z.string().optional(),
  adjusterEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  estimatedAmount: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),
  status: z.enum(['filed', 'under_review', 'approved', 'denied', 'settled']),
  filedDate: z.string().min(1, 'Filed date is required'),
  settledDate: z.string().optional(),
  notes: z.string().optional(),
});

export const correctiveActionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  completedDate: z.string().optional(),
  status: z
    .enum(['pending', 'in_progress', 'completed', 'overdue'])
    .default('pending'),
  notes: z.string().optional(),
});

export const createSafetyEventSchema = z.object({
  type: z.enum([
    'accident',
    'violation',
    'inspection',
    'complaint',
    'incident',
    'citation',
  ]),
  severity: z.enum(['minor', 'major', 'serious', 'critical']),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  injuriesReported: z.boolean().default(false),
  fatalitiesReported: z.boolean().default(false),
  propertyDamage: z.boolean().default(false),
  estimatedDamage: z.number().min(0).optional(),
  policeCalled: z.boolean().default(false),
  policeReportNumber: z.string().optional(),
  citationIssued: z.boolean().default(false),
  citationNumber: z.string().optional(),
  fineAmount: z.number().min(0).optional(),
  courtDate: z.string().optional(),
  insuranceClaim: insuranceClaimSchema.optional(),
  rootCause: z.string().optional(),
  correctiveActions: z.array(correctiveActionSchema).optional(),
  preventiveMeasures: z.array(z.string()).optional(),
  witnesses: z.array(witnessSchema).optional(),
  notes: z.string().optional(),
});

export const updateSafetyEventSchema = z.object({
  id: z.string(),
  status: z.enum(['open', 'under_review', 'closed', 'disputed']).optional(),
  investigatedBy: z.string().optional(),
  investigatedAt: z.string().optional(),
  rootCause: z.string().optional(),
  correctiveActions: z.array(correctiveActionSchema).optional(),
  preventiveMeasures: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const safetyEventFilterSchema = z.object({
  type: z
    .array(
      z.enum([
        'accident',
        'violation',
        'inspection',
        'complaint',
        'incident',
        'citation',
      ])
    )
    .optional(),
  severity: z
    .array(z.enum(['minor', 'major', 'serious', 'critical']))
    .optional(),
  status: z
    .array(z.enum(['open', 'under_review', 'closed', 'disputed']))
    .optional(),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  injuriesReported: z.boolean().optional(),
  propertyDamage: z.boolean().optional(),
  sortBy: z
    .enum(['date', 'type', 'severity', 'status', 'driver', 'vehicle'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Compliance alert validation schemas
export const complianceAlertSchema = z.object({
  type: z.enum([
    'expiring_document',
    'hos_violation',
    'maintenance_due',
    'inspection_due',
    'safety_event',
    'audit_finding',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  entityType: z.enum(['driver', 'vehicle', 'trailer', 'company', 'load']),
  entityId: z.string().min(1, 'Entity ID is required'),
  dueDate: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateComplianceAlertSchema = z.object({
  id: z.string(),
  acknowledged: z.boolean().optional(),
  resolved: z.boolean().optional(),
  resolutionNotes: z.string().optional(),
});

export const complianceAlertFilterSchema = z.object({
  type: z
    .array(
      z.enum([
        'expiring_document',
        'hos_violation',
        'maintenance_due',
        'inspection_due',
        'safety_event',
        'audit_finding',
      ])
    )
    .optional(),
  severity: z.array(z.enum(['low', 'medium', 'high', 'critical'])).optional(),
  entityType: z
    .array(z.enum(['driver', 'vehicle', 'trailer', 'company', 'load']))
    .optional(),
  entityId: z.string().optional(),
  acknowledged: z.boolean().optional(),
  resolved: z.boolean().optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'severity', 'type']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Bulk operations validation schemas
export const bulkComplianceOperationSchema = z.object({
  operation: z.enum([
    'delete',
    'update_status',
    'acknowledge_alerts',
    'resolve_alerts',
    'bulk_reminder',
  ]),
  ids: z.array(z.string()).min(1, 'At least one item must be selected'),
  data: z.record(z.any()).optional(),
});

// Additional compliance-specific schemas
export const complianceDocumentBulkSchema = z.object({
  documentIds: z.array(z.string()),
  operation: z.enum(['approve', 'reject', 'delete', 'archive']),
  notes: z.string().optional(),
});

export const complianceReportSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  reportType: z.enum(['hos', 'dvir', 'safety', 'maintenance']),
  includeMetrics: z.boolean().default(true),
  includeGraphs: z.boolean().default(true),
});

// Export types from schemas
export type CreateComplianceDocumentInput = z.infer<
  typeof createComplianceDocumentSchema
>;
export type UpdateComplianceDocumentInput = z.infer<
  typeof updateComplianceDocumentSchema
>;
export type ComplianceDocumentFilterInput = z.infer<
  typeof complianceDocumentFilterSchema
>;
export type CreateHosLogInput = z.infer<typeof createHosLogSchema>;
export type UpdateHosLogInput = z.infer<typeof updateHosLogSchema>;
export type HosViolationInput = z.infer<typeof hosViolationSchema>;
export type HosFilterInput = z.infer<typeof hosFilterSchema>;
export type CreateDvirInput = z.infer<typeof createDvirSchema>;
export type UpdateDvirInput = z.infer<typeof updateDvirSchema>;
export type DvirFilterInput = z.infer<typeof dvirFilterSchema>;
export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;
export type MaintenanceFilterInput = z.infer<typeof maintenanceFilterSchema>;
export type CreateSafetyEventInput = z.infer<typeof createSafetyEventSchema>;
export type UpdateSafetyEventInput = z.infer<typeof updateSafetyEventSchema>;
export type SafetyEventFilterInput = z.infer<typeof safetyEventFilterSchema>;
export type ComplianceAlertInput = z.infer<typeof complianceAlertSchema>;
export type UpdateComplianceAlertInput = z.infer<
  typeof updateComplianceAlertSchema
>;
export type ComplianceAlertFilterInput = z.infer<
  typeof complianceAlertFilterSchema
>;
export type BulkComplianceOperationInput = z.infer<
  typeof bulkComplianceOperationSchema
>;
export const complianceExportSchema = z.object({
  driverIds: z.array(z.string()).optional(),
  vehicleIds: z.array(z.string()).optional(),
  includeDetails: z.boolean().default(false),
});

export const complianceAlertConfigSchema = z.object({
  alertType: z.enum([
    'hos_violation',
    'medical_expiry',
    'license_expiry',
    'vehicle_inspection',
  ]),
  isEnabled: z.boolean(),
  reminderDays: z.number().min(1).max(365),
  notificationMethods: z.array(z.enum(['email', 'dashboard', 'sms'])),
});
