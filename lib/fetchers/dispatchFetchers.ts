import db from "@/lib/database/db";
import { serializePrismaDataServer } from "@/lib/utils/prisma-serializer";
import { transformDriver, transformVehicle, transformLoad } from "@/lib/utils/transformers";
import type { Load } from "@/types/dispatch";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";

// Fetch all loads for an organization, including related data
export async function getLoadsByOrg(orgId: string): Promise<Load[]> {
  const loads = await db.load.findMany({
    where: { organizationId: orgId },
    include: {
      customer: true,
      drivers: true,
      vehicle: true,
      trailer: true,
      statusEvents: { orderBy: { timestamp: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

    return serializePrismaDataServer(
      loads.map(load => transformLoad(load)).filter((l): l is Load => l !== null)
    );
  }

// Fetch a single load by ID (and org) for editing
export async function getLoadById(orgId: string, loadId: string): Promise<Load | null> {
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
  return serializePrismaDataServer(transformLoad(load));
}

// Fetch all drivers for an organization
export async function getDriversByOrg(orgId: string): Promise<Driver[]> {
  const drivers = await db.driver.findMany({
    where: { organizationId: orgId },
    include: {
      user: true,
      organization: true,
      loads: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          vehicle: true
        }
      }
    },
    orderBy: { firstName: "asc" },
  });

  return serializePrismaDataServer(drivers.map(driver => transformDriver(driver)));
}

// Fetch all vehicles for an organization
export async function getVehiclesByOrg(orgId: string): Promise<Vehicle[]> {
  const [vehicleRecords, trailerRecords] = await Promise.all([
    db.vehicle.findMany({ 
      where: { organizationId: orgId },
      include: {
        organization: true
      }
    }),
    db.trailer.findMany({ 
      where: { organizationId: orgId },
      include: {
        organization: true
      }
    }),
  ]);
  
  const vehicles = vehicleRecords.map(v => transformVehicle({
    ...v,
    type: "tractor"
  }));
  
  const trailers = trailerRecords.map(t => transformVehicle({
    ...t,
    type: t.type || "trailer"
  }));
  
  return serializePrismaDataServer([...vehicles, ...trailers]);
}

// Fetch load summary statistics for an organization
export async function getLoadSummaryStats(orgId: string): Promise<{
  totalLoads: number;
  pendingLoads: number;
  assignedLoads: number;
  inTransitLoads: number;
  completedLoads: number;
}> {
  try {
    const loads = await db.load.groupBy({
      by: ['status'],
      where: { organizationId: orgId },
      _count: {
        _all: true
      }
    });

    const stats = {
      totalLoads: 0,
      pendingLoads: 0,
      assignedLoads: 0,
      inTransitLoads: 0,
      completedLoads: 0
    };

    // Calculate total loads
    stats.totalLoads = loads.reduce((acc, curr) => acc + curr._count._all, 0);

    // Map specific statuses to our summary categories
    loads.forEach(({status, _count}) => {
      if (status === 'pending') {
        stats.pendingLoads += _count._all;
      } else if (status === 'assigned') {
        stats.assignedLoads += _count._all;
      } else if (['in_transit', 'at_pickup', 'picked_up', 'en_route', 'at_delivery'].includes(status)) {
        stats.inTransitLoads += _count._all;
      } else if (['delivered', 'completed', 'invoiced', 'paid'].includes(status)) {
        stats.completedLoads += _count._all;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching load summary stats:', error);
    return {
      totalLoads: 0,
      pendingLoads: 0,
      assignedLoads: 0,
      inTransitLoads: 0,
      completedLoads: 0
    };
  }
}

// Fetch recent dispatch activity log entries for an org
export async function getRecentDispatchActivity(orgId: string, limit = 5) {
  const activities = await db.dispatchActivity.findMany({
    where: { organizationId: orgId },
    orderBy: { timestamp: "desc" },
    take: limit,
  });

  const unique = Array.from(new Map(activities.map(a => [a.id, a])).values());

  return { success: true, data: unique };
}
