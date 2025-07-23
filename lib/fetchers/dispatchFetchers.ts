import db from "@/lib/database/db";
import { serializePrismaDataServer } from "@/lib/utils/prisma-serializer";

// Fetch all loads for an organization, including related data
export async function getLoadsByOrg(orgId: string) {
  const loads = await db.load.findMany({
    where: { organizationId: orgId },
    include: {
      customer: true,
      drivers: true,          // relation to Driver (was driverProfile)
      vehicle: true,
      trailer: true,
      statusEvents: { orderBy: { timestamp: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return serializePrismaDataServer(loads.map(load => ({
    id: load.id,
    organizationId: load.organizationId,
    referenceNumber: load.referenceNumber,
    status: load.status,
    priority: load.priority,
    customer: load.customer
      ? { id: load.customer.id, name: load.customer.name || "" }
      : null,
    // Use correct address/fields per schema
    origin: {
      address: load.originAddress,
      city: load.originCity,
      state: load.originState,
      zip: load.originZip,
      lat: load.originLat,
      lng: load.originLng,
    },
    destination: {
      address: load.destinationAddress,
      city: load.destinationCity,
      state: load.destinationState,
      zip: load.destinationZip,
      lat: load.destinationLat,
      lng: load.destinationLng,
    },
    scheduledPickupDate: load.scheduledPickupDate,
    scheduledDeliveryDate: load.scheduledDeliveryDate,
    actualPickupDate: load.actualPickupDate,
    actualDeliveryDate: load.actualDeliveryDate,
    driver: load.drivers
      ? {
          id: load.drivers.id,
          name: `${load.drivers.firstName} ${load.drivers.lastName}`.trim(),
          phone: load.drivers.phone || "",
          licenseNumber: load.drivers.licenseNumber || "",
        }
      : null,
    vehicle: load.vehicle
      ? {
          id: load.vehicle.id,
          unitNumber: load.vehicle.unitNumber,
          make: load.vehicle.make,
          model: load.vehicle.model,
          year: load.vehicle.year,
        }
      : null,
    trailer: load.trailer
      ? {
          id: load.trailer.id,
          unitNumber: load.trailer.unitNumber,
          type: load.trailer.type,
          year: load.trailer.year,
        }
      : null,
    commodity: load.commodity,
    rate: load.rate,
    estimatedMiles: load.estimatedMiles,
    actualMiles: load.actualMiles,
    hazmat: load.hazmat,
    notes: load.notes,
    instructions: load.instructions,
    tags: load.tags,
    createdAt: load.createdAt,
    updatedAt: load.updatedAt,
    statusEvents: load.statusEvents,
  })));
}

// Fetch a single load by ID (and org) for editing
export async function getLoadById(orgId: string, loadId: string) {
  const load = await db.load.findFirst({
    where: { id: loadId, organizationId: orgId },
    include: {
      customer: true,
      drivers: true,
      vehicle: true,
      trailer: true,
      statusEvents: { orderBy: { timestamp: "asc" } },
    },
  });
  if (!load) return null;
  return serializePrismaDataServer({
    id: load.id,
    organizationId: load.organizationId,
    referenceNumber: load.referenceNumber,
    status: load.status,
    priority: load.priority,
    customer: load.customer
      ? {
          id: load.customer.id,
          name: load.customer.name || "",
          contactName: load.customer.contactName || "",
          email: load.customer.email || "",
          phone: load.customer.phone || "",
          address: load.customer.address || "",
          city: load.customer.city || "",
          state: load.customer.state || "",
          zipCode: load.customer.zipCode || "",
        }
      : null,
    origin: {
      address: load.originAddress,
      city: load.originCity,
      state: load.originState,
      zip: load.originZip,
      lat: load.originLat,
      lng: load.originLng,
    },
    destination: {
      address: load.destinationAddress,
      city: load.destinationCity,
      state: load.destinationState,
      zip: load.destinationZip,
      lat: load.destinationLat,
      lng: load.destinationLng,
    },
    scheduledPickupDate: load.scheduledPickupDate,
    scheduledDeliveryDate: load.scheduledDeliveryDate,
    actualPickupDate: load.actualPickupDate,
    actualDeliveryDate: load.actualDeliveryDate,
    driver: load.drivers
      ? { id: load.drivers.id, name: `${load.drivers.firstName} ${load.drivers.lastName}`.trim() }
      : null,
    vehicle: load.vehicle
      ? { id: load.vehicle.id, unitNumber: load.vehicle.unitNumber }
      : null,
    trailer: load.trailer
      ? { id: load.trailer.id, unitNumber: load.trailer.unitNumber }
      : null,
    commodity: load.commodity,
    rate: load.rate,
    estimatedMiles: load.estimatedMiles,
    actualMiles: load.actualMiles,
    hazmat: load.hazmat,
    notes: load.notes,
    instructions: load.instructions,
    tags: load.tags,
    statusEvents: load.statusEvents,
  });
}

// Fetch all drivers for an organization
export async function getDriversByOrg(orgId: string) {
  const drivers = await db.driver.findMany({
    where: { organizationId: orgId },
    orderBy: { firstName: "asc" },
  });
  return drivers.map(d => ({
    id: d.id,
    userId: d.userId,
    status: d.status,
    email: d.email,
    phone: d.phone,
  }));
}

// Fetch all vehicles (tractors and trailers) for an organization
export async function getVehiclesByOrg(orgId: string) {
  const [vehicleRecords, trailerRecords] = await Promise.all([
    db.vehicle.findMany({ where: { organizationId: orgId } }),
    db.trailer.findMany({ where: { organizationId: orgId } }),
  ]);
  const vehicles = vehicleRecords.map(v => ({
    id: v.id,
    unitNumber: v.unitNumber,
    type: "tractor",
    make: v.make,
    model: v.model,
    year: v.year,
  }));
  const trailers = trailerRecords.map(t => ({
    id: t.id,
    unitNumber: t.unitNumber,
    type: t.type || "trailer",
    make: t.make,
    model: t.model,
    year: t.year,
  }));
  return [...vehicles, ...trailers];
}

// Fetch recent dispatch activity log entries for an org
export async function getRecentDispatchActivity(orgId: string, limit = 5) {
  const activities = await db.dispatchActivity.findMany({
    where: { organizationId: orgId },
    orderBy: { timestamp: "desc" },
    take: limit,
  });
  return { success: true, data: activities };
}
