'use client';

import type { Driver } from '@/types/drivers';

interface DriverMapProps {
  drivers: Driver[];
}

// Simple SVG map visualization focusing on US region
export function DriverMap({ drivers }: DriverMapProps) {
  const markers = drivers.filter(
    (d) => d.currentLocation?.latitude !== undefined && d.currentLocation?.longitude !== undefined,
  );

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-lg bg-blue-50 dark:bg-blue-900">
      <svg width="100%" height="100%" viewBox="0 0 800 400" className="border rounded">
        <rect width="800" height="400" fill="#f0f9ff" className="dark:fill-gray-800" />
        {markers.map((driver) => {
          const lat = driver.currentLocation!.latitude;
          const lng = driver.currentLocation!.longitude;
          const x = ((lng + 130) / 60) * 800; // Map US longitudes -130 to -70
          const y = ((50 - lat) / 25) * 400; // Map US latitudes 25 to 50
          return (
            <circle key={driver.id} cx={x} cy={y} r={5} fill="#3b82f6">
              <title>{`${driver.firstName} ${driver.lastName}`}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}
