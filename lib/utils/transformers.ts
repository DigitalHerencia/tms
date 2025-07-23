import type { Driver } from '@/types/drivers';
import type { Vehicle } from '@/types/vehicles';
import type { Load } from '@/types/dispatch';

export function transformDriver(raw: any): Driver {
  return {
    id: raw.id,
    name: `${raw.firstName || ''} ${raw.lastName || ''}`,
    tenantId: raw.organizationId || '',
    firstName: raw.firstName || '',
    lastName: raw.lastName || '',
    email: raw.email || '',
    phone: raw.phone || '',
    cdlNumber: raw.cdlNumber || '',
    cdlState: raw.cdlState || '',
    cdlClass: raw.cdlClass || 'A',
    cdlExpiration: raw.cdlExpiration || new Date(),
    hireDate: raw.hireDate || new Date(),
    homeTerminal: raw.homeTerminal || '',
    medicalCardExpiration: raw.medicalCardExpiration || new Date(),
    status: raw.status || 'inactive',
    availabilityStatus: raw.availabilityStatus || 'off_duty',
    userId: raw.userId || null,
    violationCount: raw.violationCount || 0,
    accidentCount: raw.accidentCount || 0,
    isActive: raw.isActive ?? true,
    createdBy: raw.createdBy || '',
    createdAt: raw.createdAt || new Date(),
    updatedAt: raw.updatedAt || new Date()
  };
}

export function transformVehicle(raw: any): Vehicle {
  return {
    id: raw.id,
    organizationId: raw.organizationId || '',
    type: raw.type || 'tractor',
    status: raw.status || 'available',
    unitNumber: raw.unitNumber || '',
    make: raw.make || null,
    model: raw.model || null,
    year: raw.year || null,
    lastMaintenanceDate: raw.lastMaintenanceDate || null,
    lastMaintenanceMileage: raw.lastMaintenanceMileage || null,
    createdAt: raw.createdAt || new Date(),
    updatedAt: raw.updatedAt || new Date()
  };
}

export function transformLoad(raw: any): Load | null {
  if (!raw) return null;

  return {
    id: raw.id,
    organizationId: raw.organizationId,
    referenceNumber: raw.referenceNumber || '',
    status: raw.status || 'pending',
    priority: raw.priority || 'medium',
    customerId: raw.customerId,
    customer: raw.customer,
    origin: raw.origin || {},
    destination: raw.destination || {},
    pickupDate: raw.pickupDate || new Date(),
    deliveryDate: raw.deliveryDate || new Date(),
    equipment: raw.equipment || {},
    driver: raw.driver,
    driverId: raw.driverId || null,
    vehicle: raw.vehicle,
    vehicleId: raw.vehicleId || null,
    cargo: raw.cargo || {},
    rate: raw.rate || {},
    statusEvents: raw.statusEvents || [],
    tags: raw.tags || [],
    createdAt: raw.createdAt || new Date(),
    updatedAt: raw.updatedAt || new Date(),
    createdById: raw.createdById || ''
  };
}
