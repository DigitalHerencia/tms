import prisma from '@/lib/database/db';

interface MaintenanceScheduleFeatureProps {
  orgId: string;
}

/**
 * Server component listing upcoming maintenance tasks for vehicles.
 * Fetches vehicles with a scheduled next maintenance date and renders a simple
 * list ordered by the upcoming service date.
 */
export default async function MaintenanceScheduleFeature({
  orgId,
}: MaintenanceScheduleFeatureProps) {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      organizationId: orgId,
      nextMaintenanceDate: { not: null },
    },
    select: {
      id: true,
      unitNumber: true,
      nextMaintenanceDate: true,
    },
    orderBy: { nextMaintenanceDate: 'asc' },
  } as any);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Upcoming Maintenance</h2>
      {vehicles.length === 0 ? (
        <p className="text-white/70">No upcoming service tasks</p>
      ) : (
        <ul className="space-y-2">
          {vehicles.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between rounded-md border border-neutral-700 p-3 text-sm"
            >
              <span>Unit #{v.unitNumber}</span>
              <span>
                {v.nextMaintenanceDate
                  ? new Date(v.nextMaintenanceDate).toLocaleDateString()
                  : 'N/A'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
