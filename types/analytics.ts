/**
 * Type definitions for the analytics module
 */

export interface AnalyticsTimeframe {
  start: Date;
  end: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface RevenueMetrics {
  timeframe: AnalyticsTimeframe;
  totalRevenue: number;
  revenueByCustomer: {
    customerId: string;
    customerName: string;
    revenue: number;
    percentage: number;
  }[];
  revenueByService: {
    service: string;
    revenue: number;
    percentage: number;
  }[];
  averageRatePerMile: number;
  revenuePerTruck: number;
  revenuePerDriver: number;
  revenueByPeriod: {
    period: string;
    revenue: number;
    target?: number;
  }[];
}

export interface ExpenseMetrics {
  timeframe: AnalyticsTimeframe;
  totalExpenses: number;
  expensesByCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  fuelExpenses: number;
  maintenanceExpenses: number;
  driverPayroll: number;
  insuranceCosts: number;
  expensesByPeriod: {
    period: string;
    expenses: number;
    budget?: number;
  }[];
}

export interface OperationalMetrics {
  timeframe: AnalyticsTimeframe;
  totalMiles: number;
  loadedMiles: number;
  emptyMiles: number;
  deadheadPercentage: number;
  totalLoads: number;
  averageLengthOfHaul: number;
  fuelEfficiency: number;
  utilizationRate: number;
  onTimeDeliveryRate: number;
  driverRetention: number;
}

export interface DriverPerformanceMetrics {
  timeframe: AnalyticsTimeframe;
  drivers: {
    driverId: string;
    driverName: string;
    miles: number;
    loads: number;
    revenue: number;
    fuelEfficiency: number;
    onTimeDelivery: number;
    safetyScore: number;
  }[];
  averageMilesPerDriver: number;
  averageLoadsPerDriver: number;
  averageRevenuePerDriver: number;
}

export interface VehiclePerformanceMetrics {
  timeframe: AnalyticsTimeframe;
  vehicles: {
    vehicleId: string;
    vehicleNumber: string;
    miles: number;
    loads: number;
    revenue: number;
    fuelEfficiency: number;
    maintenanceCosts: number;
    utilization: number;
  }[];
  averageMilesPerVehicle: number;
  averageLoadsPerVehicle: number;
  averageRevenuePerVehicle: number;
  maintenanceCostPerMile: number;
}

export interface ProfitabilityMetrics {
  timeframe: AnalyticsTimeframe;
  grossRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  operatingRatio: number;
  costPerMile: number;
  revenuePerMile: number;
  profitPerMile: number;
  profitByPeriod: {
    period: string;
    profit: number;
    margin: number;
  }[];
}

export interface DashboardSummary {
  averageRevenuePerMile: number;
  totalLoads: number;
  activeDrivers: number;
  activeVehicles: number;
  totalRevenue: number;
  totalMiles: number;
  activeLoads: number;
  completedLoads: number;
  averageRpm: number;
  fuelEfficiency: number;
  maintenanceCosts: number;
  driverUtilization: number;
  timeRange: string;
  lastUpdated: string;
  onTimeDeliveryRate: number;
  maintenanceAlerts: number;
  safetyScore: number;
}

export interface PredictionData extends TimeSeriesData {
  isPrediction: boolean;
}

export interface RouteAnalytics {
  id: string;
  origin: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  destination: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  frequency: number;
  revenue: number;
  avgDeliveryTime: number;
  onTimeRate: number;
  fuelCost: number;
  distance: number;
}

export interface HeatmapDataPoint {
  city: string;
  state: string;
  lat: number;
  lng: number;
  loads: number;
  revenue: number;
  utilization: number;
}

export interface AnalyticsData {
  timeSeriesData: TimeSeriesData[];
  predictions?: PredictionData[];
  summary?: DashboardSummary;
  performanceData?: PerformanceDataPoint[];
  financialData?: ProfitabilityMetrics;
  driverPerformanceMetrics?: DriverPerformanceMetrics[];
  vehicleData?: VehiclePerformanceMetrics[];
  routes?: RouteAnalytics[];
  heatmap?: HeatmapDataPoint[];
}

export interface PerformanceDataPoint {
  date: string;
  revenue?: number;
  loads?: number;
  miles?: number;
  drivers?: number;
  vehicles?: number;
  revenuePerMile?: number;
  onTimeDelivery?: number;
  utilization?: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

// --- Fleet Fusion analytics fetcher result types ---

export interface PerformanceAnalytics {
  timeSeriesData: TimeSeriesData[];
  utilizationRate: number;
  onTimeDeliveryRate: number;
  totalLoads: number;
  totalMiles: number;
  totalRevenue: number;
  averageRevenuePerMile: number;
}

export interface FinancialAnalytics {
  revenue: TimeSeriesData[];
  expenses: TimeSeriesData[];
  profitMargin: TimeSeriesData[];
  totalRevenue: number;
  totalExpenses: number;
  averageLoadValue: number;
}

export interface DriverPerformance {
  id: string;
  name: string;
  loadsCompleted: number;
  totalRevenue: number;
  totalMiles: number;
  averageRevenuePerMile: number;
  onTimeDeliveryRate: number;
}

export interface VehicleUtilization {
  id: string;
  unitNumber: string;
  make: string;
  model: string;
  loadsCompleted: number;
  totalMiles: number;
  utilizationRate: number;
  activeDays: number;
}

export interface SavePresetResult {
  success: boolean;
  data: FilterPreset;
}

export interface ProcessedAnalyticsData {
  date: string;
  revenue: number;
  loads: number;
  miles: number;
  drivers: number;
  vehicles: number;
  customers: number;
  revenuePerMile: number;
}

export interface ComparisonMetric {
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down';
}

export interface ComparisonMetrics {
  revenue: ComparisonMetric;
  loads: ComparisonMetric;
  miles: ComparisonMetric;
  rpm: ComparisonMetric;
}

export interface AnalyticsProjection {
  nextMonth: {
    revenue: number;
    loads: number;
    confidence: string;
  };
  trend: {
    direction: string;
    strength: 'weak' | 'moderate' | 'strong';
  };
}

export interface AdvancedAnalytics {
  current: ProcessedAnalyticsData[];
  previous: ProcessedAnalyticsData[] | null;
  comparison: ComparisonMetrics | null;
  filters: AnalyticsFilters;
  timeRange: {
    from: Date;
    to: Date;
  };
  projections?: AnalyticsProjection | null;
}

export interface GeographicAnalytics {
  byState: {
    state: string;
    loads: number;
    revenue: number;
    miles: number;
  }[];
  byRoute: {
    route: string;
    loads: number;
    revenue: number;
    miles: number;
  }[];
  summary: {
    totalStates: number;
    totalRoutes: number;
    averageRevenuePerState: number;
  };
}

export interface FilterPreset {
  id: string;
  name: string;
  description?: string | null;
  filters: AnalyticsFilters;
  userId: string;
  organizationId: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsFilters {
  driverId?: string;
  vehicleId?: string;
  customerName?: string;
  routeId?: string;
  customerId?: string;
  equipmentType?: string;
  priority?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  compareWithPrevious?: boolean;
  groupBy?: 'day' | 'week' | 'month' | 'quarter';
  includeProjections?: boolean;
}
