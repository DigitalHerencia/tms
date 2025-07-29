export interface DashboardActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export type DashboardAlert = {
  id: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  type: string;
};

export type DashboardScheduleItem = {
  id: string;
  description: string;
  timePeriod: string;
  count: number;
  type: string;
};
// Consolidated dashboard types and interfaces
export interface DashboardMetrics {
  activeLoads: number;
  totalLoads: number;
  activeDrivers: number;
  totalDrivers: number;
  availableVehicles: number;
  totalVehicles: number;
  maintenanceVehicles: number;
  criticalAlerts: number;
  complianceScore: number;
  revenue: number;
  fuelCosts: number;
}

export interface DashboardKPI {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  permission: string[];
  priority?: 'high' | 'medium' | 'low';
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  shortcut?: string;
  category?: 'fleet' | 'dispatch' | 'compliance' | 'admin' | 'financial';
}

export interface ActivityItem {
  id: string;
  type: 'load' | 'driver' | 'vehicle' | 'compliance' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  userName: string;
  severity: 'info' | 'warning' | 'error';
}

export interface ComplianceAlert {
  id: string;
  type: 'license_expiry' | 'inspection_due' | 'document_missing' | 'violation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  entityId: string;
  entityType: 'driver' | 'vehicle';
  createdAt: Date;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  kpis: DashboardKPI[];
  quickActions: QuickAction[];
  recentActivity: ActivityItem[];
  alerts: ComplianceAlert[];
}

export interface DashboardPreferences {
  showKPIs: boolean;
  showQuickActions: boolean;
  showRecentActivity: boolean;
  showAlerts: boolean;
  theme: 'light' | 'dark' | 'system';
  refreshInterval: number; // in minutes
}

// Admin types consolidated
export interface AdminDashboardData {
  organizationStats: OrganizationStats;
  userData: UserManagementData;
  billing: BillingInfo;
  systemHealth: SystemHealth;
  recentActivity: AuditLogEntry[];
}

export interface OrganizationStats {
  userCount: number;
  activeUserCount: number;
  vehicleCount: number;
  driverCount: number;
  loadCount: number;
}

export interface UserManagementData {
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }[];
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface UsageInfo {
  users: number;
  maxUsers: number;
  vehicles: number;
  maxVehicles: number;
}

export interface BillingInfo {
  plan: string;
  status: string;
  currentPeriodEnds: string;
  usage: UsageInfo;
}

export interface SystemHealth {
  uptime: number;
  databaseStatus: string;
  queueStatus: string;
}

// Dashboard component types
export interface UserWithRole {
  id: string;
  name: string;
  role: string;
}

export interface UserTableProps {
  users: UserWithRole[];
  onAssignRole?: (user: UserWithRole) => void;
}

export interface BillingManagementProps {
  orgId: string;
  initialBillingInfo?: BillingInfo;
}

export interface PlanDetails {
  name: string;
  price: string;
  color: string;
  features: string[];
}

export interface SystemHealthData {
  uptime: number;
  databaseStatus: string;
  queueStatus: string;
  memoryUsage: number;
  cpuUsage: number;
}

export interface SystemHealthProps {
  initialData?: SystemHealthData;
}

export interface AuditLogViewerProps {
  orgId: string;
  initialLogs?: AuditLogEntry[];
}

export interface AuditLogTableProps {
  logs: AuditLogEntry[];
  selectedLog: AuditLogEntry | null;
  setSelectedLog: (log: AuditLogEntry | null) => void;
  getActionBadgeVariant: (
    action: string,
  ) => 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined;
}

export interface AuditLogFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  actionFilter: string;
  onActionFilterChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  uniqueActions: string[];
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
  exportDisabled: boolean;
  logsCount: number;
  filteredCount: number;
}

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
