/**
 * Compliance Dashboard Page
 *
 * Compliance officer dashboard for managing documents, monitoring compliance, and tracking violations
 */

import { Suspense } from 'react';
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
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { DriverComplianceTable } from '@/components/compliance/driver-compliance-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ComplianceDashboardPageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

export default async function ComplianceDashboardPage({
  params,
}: ComplianceDashboardPageProps) {
  const { orgId, userId } = await params;
  return (
    <>
      <div className="space-y-6 p-6 pt-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Compliance Center
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage compliance for drivers, vehicles, and
              documentation.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="default"
              className="w-full border border-gray-200 bg-black hover:bg-neutral-900"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button
              variant="default"
              className="w-full border border-gray-200 bg-black hover:bg-neutral-900"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 bg-black">
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

          <Card className="border-gray-200 bg-black">
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

          <Card className="border-gray-200 bg-black">
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

          <Card className="border-gray-200 bg-black">
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

        {/* Critical Alerts */}
        <Card className="border-gray-200 bg-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Compliance Alerts
            </CardTitle>
            <CardDescription className="text-red-700">
              Items requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-red-200 bg-white p-3">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-medium text-red-800">
                      Driver Medical Certificate Expired
                    </div>
                    <div className="text-sm text-red-600">
                      John Smith - Expired 2 days ago
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Take Action
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-md border border-amber-200 bg-white p-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-amber-500" />
                  <div>
                    <div className="font-medium text-amber-800">
                      Vehicle Inspection Due
                    </div>
                    <div className="text-sm text-amber-600">
                      Vehicle T-103 - Due in 3 days
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Deadlines */}
          <Card className="border-gray-200 bg-black">
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
                    <p className="text-sm font-medium">IFTA Q4 Filing</p>
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

          {/* Compliance Trends */}
          <Card className="border-gray-200 bg-black">
            <CardHeader>
              <CardTitle>Compliance Trends</CardTitle>
              <CardDescription>
                30-day compliance metrics and improvements
              </CardDescription>
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

        {/* Document Management */}
        <Card className="border-gray-200 bg-black">
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>
              Recent uploads and document status tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-neutral-900">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">
                      Medical Certificate - John Smith
                    </div>
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
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="font-medium">
                      Annual Inspection - Vehicle T-101
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Approved yesterday
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  Approved
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">
                      Insurance Certificate Update
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Uploaded 2 days ago
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  Current
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver Compliance Table */}
        <Card className="border-gray-200 bg-black">
          <CardHeader>
            <CardTitle>Driver Compliance Status</CardTitle>
            <CardDescription>
              Monitor driver licenses, medical cards, and HOS compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {' '}
            <Suspense fallback={<LoadingSpinner />}>
              <DriverComplianceTable orgId={orgId} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Audit Preparation */}
        <Card className="border-gray-200 bg-black">
          <CardHeader>
            <CardTitle>Audit Preparation</CardTitle>
            <CardDescription>
              Tools and reports for regulatory compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 bg-neutral-900 md:grid-cols-3">
              <Button variant="outline" className="flex h-20 flex-col gap-2">
                <Shield className="h-6 w-6" />
                <span>Generate Compliance Report</span>
              </Button>

              <Button variant="outline" className="flex h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Export All Documents</span>
              </Button>

              <Button variant="outline" className="flex h-20 flex-col gap-2">
                <Clock className="h-6 w-6" />
                <span>HOS Violation Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
