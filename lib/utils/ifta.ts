import type { IftaPeriodData } from '../../types/ifta';

export function validateIftaPeriodData(data: IftaPeriodData | any): boolean {
  if (
    typeof data !== 'object' ||
    data === null ||
    typeof data.summary !== 'object' ||
    !Array.isArray(data.trips) ||
    !Array.isArray(data.fuelPurchases) ||
    !Array.isArray(data.jurisdictionSummary)
  ) {
    return false;
  }
  return true;
}
