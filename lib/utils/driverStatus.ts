import type { DriverStatus } from '@/types/drivers';

const activeStatuses: DriverStatus[] = ['available', 'assigned', 'driving', 'on_duty', 'active'];
const inactiveStatuses: DriverStatus[] = ['inactive', 'terminated'];
const warningStatuses: DriverStatus[] = ['on_leave', 'off_duty', 'suspended'];

export function getDriverStatusColor(status: string): string {
  if (activeStatuses.includes(status as DriverStatus)) {
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  }
  if (inactiveStatuses.includes(status as DriverStatus)) {
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
  if (warningStatuses.includes(status as DriverStatus)) {
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }
  return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

export function getDriverDisplayStatus(status: string): string {
  if (activeStatuses.includes(status as DriverStatus)) {
    return 'active';
  }
  if (inactiveStatuses.includes(status as DriverStatus)) {
    return 'inactive';
  }
  return status.replace('_', ' ');
}
