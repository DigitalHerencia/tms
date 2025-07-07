'use client';

import { useState, useTransition } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { DriverComplianceTable } from './driver-compliance-table';
import { VehicleComplianceTable } from './vehicle-compliance-table';
import { ComplianceDocuments } from './compliance-documents';
import { runRegulatoryAudit } from '@/lib/actions/regulatoryAuditActions';

interface ComplianceDashboardProps {
  orgId: string;
}

export function ComplianceDashboard({ orgId }: ComplianceDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPending, startTransition] = useTransition();

  const handleAudit = () => {
    const now = new Date();
    const quarter = `Q${Math.floor(now.getMonth() / 3) + 1}`;
    const year = now.getFullYear();
    startTransition(async () => {
      await runRegulatoryAudit(orgId, quarter, year);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Compliance</h2>
          <p className="text-muted-foreground">
            Monitor and manage compliance for drivers, vehicles, and
            documentation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export Report</Button>
          <Button onClick={handleAudit} disabled={isPending}>
            {isPending ? 'Running...' : 'Run Compliance Check'}
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Driver Compliance
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-muted-foreground text-xs">
                  2 drivers need attention
                </p>
                <Progress value={92} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Vehicle Compliance
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-muted-foreground text-xs">
                  4 vehicles need attention
                </p>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  HOS Violations
                </CardTitle>
                <Clock className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-muted-foreground text-xs">Last 7 days</p>
                <Progress value={30} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Document Status
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-muted-foreground text-xs">
                  1 document expiring soon
                </p>
                <Progress value={96} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Compliance items requiring attention in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Driver Medical Card - John Smith
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Expires in 12 days
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-700"
                    >
                      Expiring Soon
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Vehicle #T-103 Annual Inspection
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Due in 15 days
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-700"
                    >
                      Due Soon
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">IFTA Q2 Filing</p>
                      <p className="text-muted-foreground text-xs">
                        Due in 22 days
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-blue-200 bg-blue-50 text-blue-700"
                    >
                      Upcoming
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Driver CDL - Maria Garcia
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Expires in 28 days
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-blue-200 bg-blue-50 text-blue-700"
                    >
                      Upcoming
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Trends</CardTitle>
                <CardDescription>30-day compliance metrics</CardDescription>
              </CardHeader>
              <CardContent className="flex h-[250px] items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <TrendingUp className="h-12 w-12 text-green-500" />
                  <p className="text-center text-sm">
                    Overall compliance score improved by 4% in the last 30 days
                  </p>
                  <Button variant="outline" size="sm">
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Driver Compliance Status</CardTitle>
              <CardDescription>
                Monitor driver licenses, medical cards, and HOS compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DriverComplianceTable orgId={orgId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Compliance Status</CardTitle>
              <CardDescription>
                Track vehicle inspections, registrations, and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleComplianceTable orgId={ '' } />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>
                Manage and track required documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComplianceDocuments documents={ [] } orgId={ '' } />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
