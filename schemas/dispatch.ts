/**
 * Validation schemas for dispatch-related forms
 * Using Zod for runtime validation
 */

import { z } from 'zod';

import { addressSchema, contactSchema } from './shared';

// Location validation schema
export const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  ...addressSchema.shape,
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
});

// Customer validation schema
export const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Customer name is required'),
  contactName: z.string().optional(),
  email: z
    .string()
    .email('Please enter a valid email')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  ...addressSchema.partial().shape,
  mcNumber: z.string().optional(),
  dotNumber: z.string().optional(),
  creditLimit: z.number().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

// Equipment requirement validation schema
export const equipmentRequirementSchema = z.object({
  type: z.enum([
    'dry_van',
    'reefer',
    'flatbed',
    'step_deck',
    'lowboy',
    'tanker',
    'container',
    'other',
  ]),
  length: z.number().optional(),
  temperatureMin: z.number().optional(),
  temperatureMax: z.number().optional(),
  hazmat: z.boolean().optional(),
  overweight: z.boolean().optional(),
  oversized: z.boolean().optional(),
  specialPermits: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Cargo details validation schema
export const cargoDetailsSchema = z.object({
  description: z.string().min(1, 'Cargo description is required'),
  commodity: z.string().optional(),
  weight: z.number().min(0, 'Weight must be a positive number'),
  pieces: z.number().int().min(0).optional(),
  pallets: z.number().int().min(0).optional(),
  dimensions: z
    .object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
  value: z.number().min(0).optional(),
  hazmat: z
    .object({
      class: z.string(),
      unNumber: z.string(),
      properShippingName: z.string(),
      placard: z.string().optional(),
    })
    .optional(),
  temperature: z
    .object({
      min: z.number(),
      max: z.number(),
      unit: z.enum(['F', 'C']),
    })
    .optional(),
  specialHandling: z.array(z.string()).optional(),
});

// Rate validation schema
export const rateSchema = z.object({
  total: z.number().min(0, 'Total rate must be a positive number'),
  currency: z.string().default('USD'),
  type: z.enum(['flat', 'per_mile', 'percentage']),
  lineHaul: z.number().min(0, 'Line haul must be a positive number'),
  fuelSurcharge: z.number().min(0).optional(),
  detention: z.number().min(0).optional(),
  layover: z.number().min(0).optional(),
  loading: z.number().min(0).optional(),
  unloading: z.number().min(0).optional(),
  additionalStops: z.number().min(0).optional(),
  deadhead: z.number().min(0).optional(),
  permits: z.number().min(0).optional(),
  tolls: z.number().min(0).optional(),
  other: z.number().min(0).optional(),
  otherDescription: z.string().optional(),
  advancePay: z.number().min(0).optional(),
  brokerageRate: z.number().min(0).optional(),
  commissionRate: z.number().min(0).optional(),
  driverPay: z.number().min(0).optional(),
  driverPayType: z.enum(['percentage', 'flat', 'per_mile']).optional(),
  notes: z.string().optional(),
});

// Broker info validation schema
export const brokerInfoSchema = z.object({
  name: z.string().min(1, 'Broker name is required'),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .email('Please enter a valid email')
    .optional()
    .or(z.literal('')),
  mcNumber: z.string().optional(),
  dotNumber: z.string().optional(),
  brokerageRate: z.number().min(0).optional(),
  commissionRate: z.number().min(0).optional(),
});

// Create load validation schema
export const createLoadSchema = z.object({
  referenceNumber: z.string().min(1, 'Reference number is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  customer: customerSchema,
  origin: locationSchema,
  destination: locationSchema,
  pickupDate: z.string().min(1, 'Pickup date is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  estimatedPickupTime: z.string().optional(),
  estimatedDeliveryTime: z.string().optional(),
  equipment: equipmentRequirementSchema.optional(),
  cargo: cargoDetailsSchema,
  rate: rateSchema,
  miles: z.number().min(0).optional(),
  estimatedMiles: z.number().min(0).optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  specialInstructions: z.string().optional(),
  brokerInfo: brokerInfoSchema.optional(),
  tags: z.array(z.string()).optional(),
  createdBy: z.string().optional(),
  lastModifiedBy: z.string().optional(),
  statusEvents: z
    .array(
      z.object({
        id: z.string(),
        loadId: z.string(),
        status: z.enum([
          'draft',
          'pending',
          'posted',
          'booked',
          'confirmed',
          'assigned',
          'dispatched',
          'in_transit',
          'at_pickup',
          'picked_up',
          'en_route',
          'at_delivery',
          'delivered',
          'pod_required',
          'completed',
          'invoiced',
          'paid',
          'cancelled',
          'problem',
        ]),
        timestamp: z.date(),
        location: z.any().optional(),
        notes: z.string().optional(),
        automaticUpdate: z.boolean().optional(),
        source: z.string().optional(),
        createdBy: z.string().optional(),
      })
    )
    .optional(),
  driver: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  vehicle: z
    .object({
      id: z.string().optional(),
      unit: z.string().optional(),
    })
    .optional(),
  trailer: z
    .object({
      id: z.string().optional(),
      unit: z.string().optional(),
    })
    .optional(),
});

// Update load validation schema
export const updateLoadSchema = z.object({
  id: z.string(),
  referenceNumber: z.string().min(1, 'Reference number is required').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z
    .enum([
      'draft',
      'pending',
      'posted',
      'booked',
      'confirmed',
      'assigned',
      'dispatched',
      'in_transit',
      'at_pickup',
      'picked_up',
      'en_route',
      'at_delivery',
      'delivered',
      'pod_required',
      'completed',
      'invoiced',
      'paid',
      'cancelled',
      'problem',
    ])
    .optional(),
  customer: customerSchema.optional(),
  origin: locationSchema.optional(),
  destination: locationSchema.optional(),
  pickupDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  estimatedPickupTime: z.string().optional(),
  estimatedDeliveryTime: z.string().optional(),
  actualPickupTime: z.string().optional(),
  actualDeliveryTime: z.string().optional(),
  equipment: equipmentRequirementSchema.optional(),
  cargo: cargoDetailsSchema.optional(),
  rate: rateSchema.optional(),
  miles: z.number().min(0).optional(),
  estimatedMiles: z.number().min(0).optional(),
  fuelCost: z.number().min(0).optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  specialInstructions: z.string().optional(),
  brokerInfo: brokerInfoSchema.optional(),
  tags: z.array(z.string()).optional(),
  createdBy: z.string().optional(),
  lastModifiedBy: z.string().optional(),
  statusEvents: z
    .array(
      z.object({
        id: z.string(),
        loadId: z.string(),
        status: z.enum([
          'draft',
          'pending',
          'posted',
          'booked',
          'confirmed',
          'assigned',
          'dispatched',
          'in_transit',
          'at_pickup',
          'picked_up',
          'en_route',
          'at_delivery',
          'delivered',
          'pod_required',
          'completed',
          'invoiced',
          'paid',
          'cancelled',
          'problem',
        ]),
        timestamp: z.date(),
        location: z.any().optional(),
        notes: z.string().optional(),
        automaticUpdate: z.boolean().optional(),
        source: z.string().optional(),
        createdBy: z.string().optional(),
      })
    )
    .optional(),
  driver: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  vehicle: z
    .object({
      id: z.string().optional(),
      unit: z.string().optional(),
    })
    .optional(),
  trailer: z
    .object({
      id: z.string().optional(),
      unit: z.string().optional(),
    })
    .optional(),
});

// Load assignment validation schema
export const loadAssignmentSchema = z.object({
  loadId: z.string().min(1, 'Load ID is required'),
  driverId: z.string().min(1, 'Driver ID is required'),
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  trailerId: z.string().optional(),
  assignedAt: z.string().optional(),
  notes: z.string().optional(),
});

// Load status update validation schema
export const loadStatusUpdateSchema = z.object({
  loadId: z.string().min(1, 'Load ID is required'),
  status: z.enum([
    'draft',
    'pending',
    'posted',
    'booked',
    'confirmed',
    'assigned',
    'dispatched',
    'in_transit',
    'at_pickup',
    'picked_up',
    'en_route',
    'at_delivery',
    'delivered',
    'pod_required',
    'completed',
    'invoiced',
    'paid',
    'cancelled',
    'problem',
  ]),
  location: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional(),
  automaticUpdate: z.boolean().default(false),
  source: z
    .enum(['system', 'driver', 'dispatcher', 'customer', 'eld'])
    .default('dispatcher'),
});

// Load filtering validation schema
export const loadFilterSchema = z.object({
  status: z
    .array(
      z.enum([
        'all',
        'draft',
        'pending',
        'posted',
        'booked',
        'confirmed',
        'assigned',
        'dispatched',
        'in_transit',
        'at_pickup',
        'picked_up',
        'en_route',
        'at_delivery',
        'delivered',
        'pod_required',
        'completed',
        'invoiced',
        'paid',
        'cancelled',
        'problem',
      ])
    )
    .optional(),
  priority: z.array(z.enum(['low', 'medium', 'high', 'urgent'])).optional(),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
  customerId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  pickupDateFrom: z.string().optional(),
  pickupDateTo: z.string().optional(),
  deliveryDateFrom: z.string().optional(),
  deliveryDateTo: z.string().optional(),
  originState: z.string().optional(),
  destinationState: z.string().optional(),
  equipmentType: z
    .array(
      z.enum([
        'dry_van',
        'reefer',
        'flatbed',
        'step_deck',
        'lowboy',
        'tanker',
        'container',
        'other',
      ])
    )
    .optional(),
  minRate: z.number().min(0).optional(),
  maxRate: z.number().min(0).optional(),
  minMiles: z.number().min(0).optional(),
  maxMiles: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  sortBy: z
    .enum([
      'pickupDate',
      'deliveryDate',
      'rate',
      'miles',
      'priority',
      'status',
      'customer',
      'createdAt',
    ])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Bulk operations validation schema
export const bulkLoadOperationSchema = z.object({
  operation: z.enum([
    'delete',
    'update_status',
    'assign_driver',
    'assign_vehicle',
    'add_tags',
    'remove_tags',
  ]),
  loadIds: z.array(z.string()).min(1, 'At least one load must be selected'),
  data: z.record(z.any()).optional(),
});

// Document upload validation schema
export const loadDocumentSchema = z.object({
  loadId: z.string().min(1, 'Load ID is required'),
  name: z.string().min(1, 'Document name is required'),
  type: z.enum([
    'bol',
    'pod',
    'invoice',
    'receipt',
    'permit',
    'contract',
    'rate_confirmation',
    'other',
  ]),
  category: z.enum([
    'pickup',
    'delivery',
    'administrative',
    'billing',
    'compliance',
  ]),
  description: z.string().optional(),
  isRequired: z.boolean().default(false),
});

// Tracking update validation schema
export const trackingUpdateSchema = z.object({
  loadId: z.string().min(1, 'Load ID is required'),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
  speed: z.number().min(0).optional(),
  heading: z.number().min(0).max(360).optional(),
  source: z.enum(['gps', 'manual', 'eld', 'driver_app']).default('manual'),
  accuracy: z.number().min(0).optional(),
});

// Load alert validation schema
export const loadAlertSchema = z.object({
  loadId: z.string().min(1, 'Load ID is required'),
  type: z.enum(['warning', 'error', 'info']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(1, 'Alert title is required'),
  message: z.string().min(1, 'Alert message is required'),
  autoResolve: z.boolean().default(false),
});

// Export types from schemas
export type CreateLoadInput = z.infer<typeof createLoadSchema>;
export type UpdateLoadInput = z.infer<typeof updateLoadSchema>;
export type LoadAssignmentInput = z.infer<typeof loadAssignmentSchema>;
export type LoadStatusUpdateInput = z.infer<typeof loadStatusUpdateSchema>;
export type LoadFilterInput = z.infer<typeof loadFilterSchema>;
export type BulkLoadOperationInput = z.infer<typeof bulkLoadOperationSchema>;
export type LoadDocumentInput = z.infer<typeof loadDocumentSchema>;
export type TrackingUpdateInput = z.infer<typeof trackingUpdateSchema>;
export type LoadAlertInput = z.infer<typeof loadAlertSchema>;
