  import { Suspense } from 'react';
import {
  CalendarIcon,
  ClipboardCheck,
  FileText,
  TruckIcon,
  UserIcon,
  AlertTriangle,
  Download,
  Eye,
} from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DriverComplianceTable } from '@/components/compliance/driver-compliance-table';
import { VehicleComplianceTable } from '@/components/compliance/vehicle-compliance-table';
import { ComplianceDocuments } from '@/components/compliance/compliance-documents';
import { ComplianceDashboard } from '@/components/compliance/compliance-dashboard';
import { DOTInspectionManagement } from '@/components/compliance/dot-inspection-management';
import { ComplianceAlerts } from '@/components/compliance/compliance-alerts';
import { getComplianceDashboard } from '@/lib/fetchers/complianceFetchers';
import { PageLayout } from '@/components/shared/PageLayout';

interface CompliancePageProps {
  params: Promise<{ orgId: string }>
}

export default async function CompliancePage({ params }: CompliancePageProps) {
  const { orgId } = await params;
    // Fetch dashboard data with error handling
  let dashboardData: any = {};
  try {
    dashboardData = await getComplianceDashboard(orgId);
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    // Provide default data structure
    dashboardData = {
      totalDocuments: 0,
      pendingDocuments: 0,
      expiredDocuments: 0,
      expiringDocuments: 0,
      totalDrivers: 0,
      driversInCompliance: 0,
      totalVehicles: 0,
      vehiclesInCompliance: 0,
      activeViolations: 0,
    };
  }

  const hasData = dashboardData && typeof dashboardData === 'object' && dashboardData.totalDocuments !== undefined;
  
  return (
    <PageLayout className="compliance-page p-4 md:p-6">
      <div className="mt-14 mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Compliance Management</h1>
          <p className="page-subtitle">
            Monitor and manage regulatory compliance for your fleet, drivers,
            and documents.
          </p>
        </div>
        <div className="mr-6 flex w-full flex-col gap-4 md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="btn btn-outline w-full md:w-auto"
          >
            <Eye className="mr-2 h-4 w-4" />
            Schedule Audit
          </Button>
          <Button size="sm" className="btn btn-primary w-full md:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        {/* Enhanced Dashboard with Real Data */}
      <Suspense fallback={<div>Loading compliance dashboard...</div>}>
        <ComplianceDashboard orgId={orgId} />
      </Suspense>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="tabs grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="inspections">DOT</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Driver Compliance
                </CardTitle>
                <UserIcon className="h-4 w-4 text--info" />
              </CardHeader>
              <CardContent>                
                <div className="card-metric">
                  {hasData && dashboardData.totalDrivers > 0 ? 
                    `${Math.round((dashboardData.driversInCompliance / dashboardData.totalDrivers) * 100)}%` 
                    : '0%'
                  }
                </div>
                <p className="text-xs text-success">
                  {hasData ? 
                    `${dashboardData.driversInCompliance} of ${dashboardData.totalDrivers} drivers compliant` 
                    : 'No data available'
                  }
                </p>
              </CardContent>
            </Card>
            <Card className="card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Vehicle Compliance
                </CardTitle>
                <TruckIcon className="h-4 w-4 text-info" />
              </CardHeader>
              <CardContent>                
                <div className="card-metric">
                  {hasData && dashboardData.totalVehicles > 0 ? 
                    `${Math.round((dashboardData.vehiclesInCompliance / dashboardData.totalVehicles) * 100)}%` 
                    : '0%'
                  }
                </div>
                <p className="text-xs text-success">
                  {hasData ? 
                    `${dashboardData.vehiclesInCompliance} of ${dashboardData.totalVehicles} vehicles compliant` 
                    : 'No data available'
                  }
                </p>
              </CardContent>
            </Card>
            <Card className="card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Violations
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>                
                <div className="card-metric">
                  {hasData ? (dashboardData.activeViolations || 0) : 0}
                </div>
                <p className="text-xs text-danger">Requires attention</p>
              </CardContent>
            </Card>
            <Card className="card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Document Status
                </CardTitle>
                <FileText className="h-4 w-4 text-info" />
              </CardHeader>
              <CardContent>               
                <div className="card-metric">
                  {hasData && dashboardData.totalDocuments > 0 ? 
                    `${Math.round(((dashboardData.totalDocuments - dashboardData.expiredDocuments) / dashboardData.totalDocuments) * 100)}%` 
                    : '0%'
                  }
                </div>
                <p className="text-xs text-success">
                  {hasData ? 
                    `${dashboardData.totalDocuments - dashboardData.expiredDocuments} of ${dashboardData.totalDocuments} current` 
                    : 'No documents'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="drivers" className="mt-4">
          <Card className="card">
            <CardHeader>
              <CardTitle>Driver Compliance Status</CardTitle>
              <CardDescription>
                Monitor driver compliance with regulations including HOS,
                licenses, and medical certifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Suspense fallback={<div>Loading driver compliance data...</div>}>
                <DriverComplianceTable orgId={orgId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vehicles" className="mt-4">
          <Card className="card">
            <CardHeader>
              <CardTitle>Vehicle Compliance Status</CardTitle>
              <CardDescription>
                Track vehicle inspections, maintenance, and registration
                compliance.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Suspense
                fallback={<div>Loading vehicle compliance data...</div>}
              >
                <VehicleComplianceTable orgId={orgId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <Card className="card">
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>
                Manage required documentation for regulatory compliance.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Suspense fallback={<div>Loading compliance documents...</div>}>
                <ComplianceDocuments orgId={orgId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inspections" className="mt-4">
          <Card className="card">
            <CardHeader>
              <CardTitle>DOT Inspection Management</CardTitle>
              <CardDescription>
                Schedule, track, and manage DOT inspections and violations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading DOT inspection data...</div>}>
                <DOTInspectionManagement orgId={orgId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-4">
          <Card className="card">
            <CardHeader>
              <CardTitle>Compliance Alerts</CardTitle>
              <CardDescription>
                Monitor and respond to compliance alerts and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading compliance alerts...</div>}>
                <ComplianceAlerts orgId={orgId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
