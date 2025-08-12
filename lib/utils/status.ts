import type { VehicleStatus } from '@/types/vehicles';

export function getVehicleStatusColor(status: VehicleStatus) {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'maintenance':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'inactive':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'decommissioned':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}
