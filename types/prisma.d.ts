// filepath: types/prisma.d.ts

import type { Prisma } from '@prisma/client';

// Enhanced Prisma types with additional computed fields and relations

export type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    profile: true;
    organizations: {
      include: {
        organization: true;
      };
    };
  };
}>;

export type UserWithOrganizations = Prisma.UserGetPayload<{
  include: {
    organizations: {
      include: {
        organization: true;
      };
    };
  };
}>;

export type OrganizationWithMembers = Prisma.OrganizationGetPayload<{
  include: {
    members: {
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            email: true;
            profileImage: true;
          };
        };
      };
    };
  };
}>;

export type OrganizationWithSettings = Prisma.OrganizationGetPayload<{
  include: {
    settings: true;
  };
}>;

export type DriverWithVehicles = Prisma.DriverGetPayload<{
  include: {
    vehicles: true;
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        profileImage: true;
      };
    };
    organization: true;
  };
}>;

export type DriverWithCompliance = Prisma.DriverGetPayload<{
  include: {
    complianceRecords: true;
    hosLogs: true;
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        profileImage: true;
      };
    };
  };
}>;

export type VehicleWithDriver = Prisma.VehicleGetPayload<{
  include: {
    driver: {
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            email: true;
          };
        };
      };
    };
    organization: true;
  };
}>;

export type VehicleWithCompliance = Prisma.VehicleGetPayload<{
  include: {
    complianceRecords: true;
    maintenanceRecords: true;
    inspections: true;
  };
}>;

export type LoadWithDetails = Prisma.LoadGetPayload<{
  include: {
    driver: {
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            email: true;
          };
        };
      };
    };
    vehicle: true;
    organization: true;
    pickupLocation: true;
    deliveryLocation: true;
  };
}>;

export type ComplianceRecordWithDetails = Prisma.ComplianceRecordGetPayload<{
  include: {
    driver: {
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            email: true;
          };
        };
      };
    };
    vehicle: true;
    documents: true;
  };
}>;

export type IftaReportWithTrips = Prisma.IftaReportGetPayload<{
  include: {
    trips: true;
    organization: true;
  };
}>;

export type IftaTripWithDetails = Prisma.IftaTripGetPayload<{
  include: {
    driver: {
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            email: true;
          };
        };
      };
    };
    vehicle: true;
    report: true;
  };
}>;

export type AuditLogWithUser = Prisma.AuditLogGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
      };
    };
  };
}>;

export type InvitationWithOrganization = Prisma.InvitationGetPayload<{
  include: {
    organization: true;
    invitedBy: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
      };
    };
  };
}>;

// Custom aggregate types for analytics
export type DriverPerformanceMetrics = {
  userId: string;
  totalMiles: number;
  totalLoads: number;
  onTimeDeliveries: number;
  totalRevenue: number;
  averageRating: number;
  safetyScore: number;
  fuelEfficiency: number;
};

export type VehicleUtilizationMetrics = {
  vehicleId: string;
  totalMiles: number;
  utilizationRate: number;
  maintenanceCost: number;
  fuelCost: number;
  revenueGenerated: number;
  downtime: number;
};

export type OrganizationAnalytics = {
  totalDrivers: number;
  totalVehicles: number;
  totalLoads: number;
  totalRevenue: number;
  averageDeliveryTime: number;
  complianceScore: number;
  safetyScore: number;
  fuelEfficiency: number;
};

// Compliance status enums
export type ComplianceStatus =
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'PENDING'
  | 'EXPIRED';
export type HOSStatus = 'ON_DUTY' | 'OFF_DUTY' | 'DRIVING' | 'SLEEPER_BERTH';
export type LoadStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';
export type VehicleStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'MAINTENANCE'
  | 'OUT_OF_SERVICE';

// Form validation types
export type DriverFormData = Omit<
  Prisma.DriverCreateInput,
  'organization' | 'user'
>;
export type VehicleFormData = Omit<Prisma.VehicleCreateInput, 'organization'>;
export type LoadFormData = Omit<Prisma.LoadCreateInput, 'organization'>;
export type ComplianceFormData = Omit<
  Prisma.ComplianceRecordCreateInput,
  'organization'
>;

// API response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

// Database operation result types
export type CreateResult<T> = ApiResponse<T>;
export type UpdateResult<T> = ApiResponse<T>;
export type DeleteResult = ApiResponse<{ deletedCount: number }>;

// File upload types
export type UploadedFile = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
};

// Notification types
export type NotificationSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  complianceAlerts: boolean;
  maintenanceReminders: boolean;
  dispatchUpdates: boolean;
};

// Search and filter types
export type DriverFilters = {
  status?: string;
  licenseState?: string;
  experience?: 'rookie' | 'experienced' | 'veteran';
  availabilityStatus?: 'available' | 'on_trip' | 'off_duty';
};

export type VehicleFilters = {
  status?: VehicleStatus;
  type?: string;
  year?: number;
  make?: string;
  model?: string;
};

export type LoadFilters = {
  status?: LoadStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  origin?: string;
  destination?: string;
  userId?: string;
  vehicleId?: string;
};

// Dashboard widget types
export type DashboardWidget = {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'map';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config: Record<string, unknown>;
};

export type DashboardLayout = {
  widgets: DashboardWidget[];
  preferences: {
    theme: 'light' | 'dark';
    autoRefresh: boolean;
    refreshInterval: number;
  };
};
