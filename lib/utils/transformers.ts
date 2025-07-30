import type { Driver } from '@/types/drivers';
import type { Vehicle } from '@/types/vehicles';
import type {
  Load,
  LoadAssignedDriver,
  LoadAssignedVehicle,
  LoadAssignedTrailer,
} from '@/types/dispatch';

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
    updatedAt: raw.updatedAt || new Date(),
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
    updatedAt: raw.updatedAt || new Date(),
  };
}

export function transformAssignedDriver(raw: any): LoadAssignedDriver {
  return {
    id: raw.id,
    userId: raw.userId ?? raw.user_id ?? '',
    name: raw.name ?? `${raw.firstName ?? ''} ${raw.lastName ?? ''}`.trim(),
    phone: raw.phone ?? undefined,
    email: raw.email ?? undefined,
    licenseNumber: raw.licenseNumber ?? raw.license_number ?? undefined,
    cdlClass: raw.licenseClass ?? raw.cdlClass ?? undefined,
    assignedAt: raw.assignedAt ?? raw.createdAt ?? new Date(),
    assignedBy: raw.assignedBy ?? raw.createdBy ?? '',
  };
}

export function transformAssignedVehicle(raw: any): LoadAssignedVehicle {
  return {
    id: raw.id,
    unit: raw.unitNumber ?? raw.unit ?? '',
    make: raw.make ?? '',
    model: raw.model ?? '',
    year: raw.year ?? 0,
    vin: raw.vin ?? '',
    licensePlate: raw.licensePlate ?? '',
    assignedAt: raw.assignedAt ?? raw.createdAt ?? new Date(),
    assignedBy: raw.assignedBy ?? raw.createdBy ?? '',
  };
}

export function transformAssignedTrailer(raw: any): LoadAssignedTrailer {
  return {
    id: raw.id,
    unit: raw.unitNumber ?? raw.unit ?? '',
    type: raw.type ?? '',
    make: raw.make ?? '',
    model: raw.model ?? '',
    year: raw.year ?? 0,
    vin: raw.vin ?? '',
    licensePlate: raw.licensePlate ?? '',
    assignedAt: raw.assignedAt ?? raw.createdAt ?? new Date(),
    assignedBy: raw.assignedBy ?? raw.createdBy ?? '',
  };
}

export function transformLoad(raw: any): Load | null {
  if (!raw) return null;

  const origin = {
    name: raw.originAddress || '',
    address: raw.originAddress || '',
    city: raw.originCity || '',
    state: raw.originState || '',
    zipCode: raw.originZip || '',
    latitude: raw.originLat ? Number(raw.originLat) : undefined,
    longitude: raw.originLng ? Number(raw.originLng) : undefined,
  };

  const destination = {
    name: raw.destinationAddress || '',
    address: raw.destinationAddress || '',
    city: raw.destinationCity || '',
    state: raw.destinationState || '',
    zipCode: raw.destinationZip || '',
    latitude: raw.destinationLat ? Number(raw.destinationLat) : undefined,
    longitude: raw.destinationLng ? Number(raw.destinationLng) : undefined,
  };

  return {
    id: raw.id,
    organizationId: raw.organizationId,
    referenceNumber: raw.referenceNumber || raw.loadNumber || '',
    status: raw.status || 'pending',
    priority: raw.priority || 'medium',
    customerId: raw.customerId,
    customer: raw.customer,
    origin,
    destination,
    pickupDate: raw.scheduledPickupDate ?? raw.actualPickupDate ?? new Date(),
    deliveryDate: raw.scheduledDeliveryDate ?? raw.actualDeliveryDate ?? new Date(),
    equipment: raw.equipment || {},
    driver: raw.drivers
      ? transformAssignedDriver(raw.drivers)
      : raw.driver
        ? transformAssignedDriver(raw.driver)
        : null,
    driverId: raw.driver_id ?? raw.driverId ?? null,
    vehicle: raw.vehicle ? transformAssignedVehicle(raw.vehicle) : undefined,
    vehicleId: raw.vehicleId || null,
    trailer: raw.trailer ? transformAssignedTrailer(raw.trailer) : undefined,
    trailerId: raw.trailerId || null,
    cargo: raw.cargo || {},
    rate: raw.rate || {},
    statusEvents: raw.statusEvents || [],
    tags: raw.tags || [],
    createdAt: raw.createdAt || new Date(),
    updatedAt: raw.updatedAt || new Date(),
    createdById: raw.createdById || '',
  };
}
