export interface OrganizationKPIs {
  activeVehicles: number;
  activeVehiclesChange: string;
  activeDrivers: number;
  activeDriversChange: string;
  activeLoads: number;
  activeLoadsLive: number;
  completedLoads: number;
  inTransitLoads: number;
  totalRevenue: number;
  revenueChange: string;
  revenuePerMile: number;
  revenueTarget: number;
  totalMiles: number;
  milesChange: string;
  milesPerVehicleAvg: number;
  milesTarget: number;
  recentInspections: number;
  failedInspections: number;
  inspectionSuccessRate: number;
  upcomingMaintenance: number;
  maintenanceOverdue: number;
  maintenanceThisWeek: number;
  pendingLoads: number;
  pendingLoadsUrgent: number;
  pendingLoadsAwaitingPickup: number;
  pendingLoadsAwaitingAssignment: number;
}

export interface DashboardSummary {
  lastUpdated: string;
  totalVehicles: number;
  activeDrivers: number;
  // additional fields can be added as needed
}
