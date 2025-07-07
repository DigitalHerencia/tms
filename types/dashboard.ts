// Dashboard specific types
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