/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DriverComplianceTable } from '@/components/compliance/driver-compliance-table';
import { VehicleComplianceTable } from '@/components/compliance/vehicle-compliance-table';
import { DOTInspectionManagement } from '@/components/compliance/dot-inspection-management';
import { ComplianceAlerts } from '@/components/compliance/compliance-alerts';
import { PageLayout } from '@/components/shared/PageLayout';
import { ComplianceDashboard } from '@/features/compliance/ComplianceDashboard';
import { DocumentManagerFeature } from '@/features/compliance/DocumentManagerFeature';

interface CompliancePageProps {
  params: Promise<{ orgId: string }>;
}

export default async function CompliancePage({ params }: CompliancePageProps) {
  const { orgId } = await params;

  return (
    <PageLayout className="compliance-page p-4 md:p-6">
      <div className="mt-14 mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Compliance Management</h1>
          <p className="page-subtitle">
            Monitor and manage regulatory compliance for your fleet, drivers, and documents.
          </p>
        </div>
        <div className="mr-6 flex w-full flex-col gap-4 md:w-auto">
          <Button variant="outline" size="sm" className="btn btn-outline w-full md:w-auto">
            <Eye className="mr-2 h-4 w-4" />
            Schedule Audit
          </Button>
          <Button size="sm" className="btn btn-primary w-full md:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
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
            <Suspense fallback={<div>Loading compliance dashboard...</div>}>
              <ComplianceDashboard orgId={orgId} />
            </Suspense>
          </TabsContent>

          <TabsContent value="drivers" className="mt-4">
            <Card className="card">
              <CardHeader>
                <CardTitle>Driver Compliance Status</CardTitle>
                <CardDescription>
                  Monitor driver compliance with regulations including HOS, licenses, and medical
                  certifications.
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
                  Track vehicle inspections, maintenance, and registration compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Suspense fallback={<div>Loading vehicle compliance data...</div>}>
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
                  <DocumentManagerFeature orgId={orgId} />
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
              <CardContent className="p-6 space-y-6">
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
              <CardContent className="p-6 space-y-6">
                <Suspense fallback={<div>Loading compliance alerts...</div>}>
                  <ComplianceAlerts orgId={orgId} />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
