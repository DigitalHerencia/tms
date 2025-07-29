/**
 * Compliance Dashboard Page
 *
 * Compliance officer dashboard for managing documents, monitoring compliance, and tracking violations
 */

import React, { Suspense } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Upload,
  Shield,
  Users,
  Truck,
  ClipboardCheck,
  RefreshCw,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { DriverComplianceTable } from '@/components/compliance/driver-compliance-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ComplianceDashboardPageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

export default async function ComplianceDashboardPage({ params }: ComplianceDashboardPageProps) {
  const { orgId, userId } = await params;
  return (
    <div>
      <div className="space-y-6 p-6 pt-8">
        <div className="flex flex-row items-baseline justify-between mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-8 w-8" />
              <h1 className="text-3xl font-extrabold text-white">Compliance Center</h1>
              <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>
            </div>
            <div className="text-sm text-white/90 font-medium">
              Monitor and manage compliance for drivers, vehicles, and documentation.
            </div>
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <RefreshCw className="h-3 w-3" />
              <span>
                Last updated:{' '}
                {new Date().toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Driver Compliance</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-2xl font-bold">92%</div>
              <p className="text-muted-foreground text-xs">2 drivers need attention</p>
              <Progress value={92} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Compliance</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-2xl font-bold">85%</div>
              <p className="text-muted-foreground text-xs">4 vehicles need attention</p>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HOS Violations</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-2xl font-bold">3</div>
              <p className="text-muted-foreground text-xs">Last 7 days</p>
              <Progress value={30} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Document Status</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-2xl font-bold">96%</div>
              <p className="text-muted-foreground text-xs">1 document expiring soon</p>
              <Progress value={96} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        <Card className="border border-gray-200 bg-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Critical Compliance Alerts
            </CardTitle>
            <CardDescription className="text-red-600">
              Items requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-gray-200 bg-neutral-900 p-3">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-medium text-red-600">
                      Driver Medical Certificate Expired
                    </div>
                    <div className="text-sm text-red-600">John Smith - Expired 2 days ago</div>
                  </div>
                </div>
                <Button size="sm" className="bg-red-600">
                  Take Action
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-md border border-gray-200 bg-neutral-900 p-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-red-600" />
                  <div>
                    <div className="font-medium text-red-600">Vehicle Inspection Due</div>
                    <div className="text-sm text-red-600">Vehicle T-103 - Due in 3 days</div>
                  </div>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Upcoming Deadlines */}
          <Card className="border border-gray-200 bg-black">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>
                Compliance items requiring attention in the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Driver Medical Card - John Smith</p>
                    <p className="text-muted-foreground text-xs">Expires in 12 days</p>
                  </div>
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                    Expiring Soon
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Vehicle #T-103 Annual Inspection</p>
                    <p className="text-muted-foreground text-xs">Due in 15 days</p>
                  </div>
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                    Due Soon
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">IFTA Q4 Filing</p>
                    <p className="text-muted-foreground text-xs">Due in 22 days</p>
                  </div>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    Upcoming
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Driver CDL - Maria Garcia</p>
                    <p className="text-muted-foreground text-xs">Expires in 28 days</p>
                  </div>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    Upcoming
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Trends */}
          <Card className="border border-gray-200 bg-black">
            <CardHeader>
              <CardTitle>Compliance Trends</CardTitle>
              <CardDescription>30-day compliance metrics and improvements</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[250px] items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="h-12 w-12 text-green-500" />
                <p className="text-center text-sm">
                  Overall compliance score improved by 4% in the last 30 days
                </p>
                <Button
                  size="sm"
                  className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                >
                  View Detailed Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Management */}
        <Card className="border border-gray-200 bg-black">
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>Recent uploads and document status tracking</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-neutral-900 rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">Medical Certificate - John Smith</div>
                    <div className="text-muted-foreground text-sm">
                      Uploaded today, pending review
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-yellow-200 bg-yellow-50 text-yellow-700"
                  >
                    Pending Review
                  </Badge>
                  <Button
                    size="sm"
                    className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                  >
                    Review
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-neutral-900 rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="font-medium">Annual Inspection - Vehicle T-101</div>
                    <div className="text-muted-foreground text-sm">Approved yesterday</div>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                  Approved
                </Badge>
              </div>

              <div className="flex items-center justify-between bg-neutral-900 rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">Insurance Certificate Update</div>
                    <div className="text-muted-foreground text-sm">Uploaded 2 days ago</div>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                  Current
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Compliance Table */}
        <Card className="border border-gray-200 bg-black">
          <CardHeader>
            <CardTitle>Driver Compliance Status</CardTitle>
            <CardDescription>
              Monitor driver licenses, medical cards, and HOS compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {' '}
            <Suspense fallback={<LoadingSpinner />}>
              <DriverComplianceTable orgId={orgId} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Audit Preparation */}
        <Card className="border border-gray-200 bg-black">
          <CardHeader>
            <CardTitle>Audit Preparation</CardTitle>
            <CardDescription>Tools and reports for regulatory compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Button className="flex border border-gray-200 bg-blue-500 h-20 flex-col gap-2">
                <Shield className="h-6 w-6" />
                <span>Generate Compliance Report</span>
              </Button>

              <Button className="flex border border-gray-200 bg-blue-500 h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Export All Documents</span>
              </Button>

              <Button className="flex border border-gray-200 bg-blue-500 h-20 flex-col gap-2">
                <Clock className="h-6 w-6" />
                <span>HOS Violation Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
