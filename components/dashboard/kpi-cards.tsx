import { DashboardCards } from '@/components/dashboard/dashboard-cards';
import { getOrganizationKPIs } from '@/lib/fetchers/kpiFetchers';
import type { DashboardKPI } from '@/types/dashboard';
import type { OrganizationKPIs } from '@/types/kpi';

// Legacy KPICard component - keeping for potential backward compatibility
export function KPICard({ kpi }: { kpi: DashboardKPI }) {
  return null; // Deprecated - use DashboardCards instead
}

interface KPIGridProps {
  kpis: DashboardKPI[] | OrganizationKPIs;
  orgId: string;
}

export async function KPIGrid({ kpis, orgId }: KPIGridProps) {
  // If kpis is an array (old format), fetch the proper data structure
  if (Array.isArray(kpis)) {
    try {
      const organizationKPIs = await getOrganizationKPIs(orgId);
      return <DashboardCards kpis={organizationKPIs} />;
    } catch (error) {
      console.error('Failed to fetch organization KPIs:', error);
      // Fallback to default structure
      const fallbackKPIs: OrganizationKPIs = {
        activeVehicles: 0,
        activeVehiclesChange: "0%",
        activeDrivers: 0,
        activeDriversChange: "0%",
        activeLoads: 0,
        activeLoadsLive: 0,
        completedLoads: 0,
        inTransitLoads: 0,
        totalRevenue: 0,
        revenueChange: "0%",
        revenuePerMile: 0,
        revenueTarget: 2.5,
        totalMiles: 0,
        milesChange: "0%",
        milesPerVehicleAvg: 0,
        milesTarget: 25000,
        recentInspections: 0,
        failedInspections: 0,
        inspectionSuccessRate: 0,
        upcomingMaintenance: 0,
        maintenanceOverdue: 0,
        maintenanceThisWeek: 0,
        pendingLoads: 0,
        pendingLoadsUrgent: 0,
        pendingLoadsAwaitingPickup: 0,
        pendingLoadsAwaitingAssignment: 0,
      };
      return <DashboardCards kpis={fallbackKPIs} />;
    }
  }

  // If kpis is already in the proper format (OrganizationKPIs)
  return <DashboardCards kpis={kpis as OrganizationKPIs} />;
}