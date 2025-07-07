/**
 * Type definitions for API requests and responses
 */

import type { PaginatedResponse, ApiResponse } from './index';
import type { Load, Vehicle } from './dispatch';
import type { Driver } from './drivers';
import type { ComplianceDocument, HosLog } from './compliance';
import type { FuelPurchase, IftaReport } from './ifta';

// Auth API
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  companyName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Dispatch API
export interface CreateLoadRequest {
  referenceNumber: string;
  customer: {
    id: string;
    name: string;
  };
  origin: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  destination: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  pickupDate: string;
  deliveryDate: string;
  rate: {
    total: number;
    currency: string;
    type: 'flat' | 'per_mile';
  };
  notes?: string;
}

export interface UpdateLoadRequest {
  id: string;
  status?:
    | 'pending'
    | 'assigned'
    | 'in_transit'
    | 'delivered'
    | 'completed'
    | 'cancelled';
  driver?: {
    id: string;
  };
  vehicle?: {
    id: string;
  };
  notes?: string;
}

export interface GetLoadsRequest {
  page?: number;
  limit?: number;
  status?: string;
  driverId?: string;
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
}

export type GetLoadsResponse = PaginatedResponse<Load>;

// Drivers API
export interface CreateDriverRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiration: string;
  medicalCardExpiration: string;
  hireDate: string;
  homeTerminal: string;
  notes?: string;
}

export interface UpdateDriverRequest {
  id: string;
  status?: 'available' | 'on_duty' | 'driving' | 'off_duty' | 'inactive';
  phone?: string;
  licenseExpiration?: string;
  medicalCardExpiration?: string;
  notes?: string;
}

export interface GetDriversRequest {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export type GetDriversResponse = PaginatedResponse<Driver>;

// Vehicles API
export interface CreateVehicleRequest {
  type: 'truck' | 'van' | 'trailer';
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  fuelType: 'diesel' | 'gasoline' | 'electric' | 'hybrid';
  currentOdometer?: number;
}

export interface UpdateVehicleRequest {
  id: string;
  status?: 'active' | 'maintenance' | 'out_of_service';
  currentOdometer?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

export interface GetVehiclesRequest {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
}

export type GetVehiclesResponse = PaginatedResponse<Vehicle>;

// Compliance API
export interface CreateComplianceDocumentRequest {
  type: string;
  name: string;
  description?: string;
  issuedDate: string;
  expirationDate?: string;
  documentNumber?: string;
  issuingAuthority?: string;
  notes?: string;
}

export interface GetComplianceDocumentsRequest {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}

export type GetComplianceDocumentsResponse =
  PaginatedResponse<ComplianceDocument>;

export interface GetHosLogsRequest {
  driverId: string;
  startDate: string;
  endDate: string;
}

export type GetHosLogsResponse = ApiResponse<HosLog[]>;

// IFTA API
export interface CreateFuelPurchaseRequest {
  vehicleId: string;
  driverId: string;
  date: string;
  location: {
    name: string;
    city: string;
    state: string;
    country: string;
  };
  gallons: number;
  cost: number;
  odometer: number;
  fuelType: 'diesel' | 'gasoline';
  notes?: string;
}

export interface GetFuelPurchasesRequest {
  page?: number;
  limit?: number;
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
}

export type GetFuelPurchasesResponse = PaginatedResponse<FuelPurchase>;

export interface GetIftaReportsRequest {
  year?: number;
  quarter?: number;
  status?: string;
}

export type GetIftaReportsResponse = ApiResponse<IftaReport[]>;
