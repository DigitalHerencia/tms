/**
 * Admin Dashboard Page
 * 
 * Comprehensive admin interface for system administration, user management,
 * billing oversight, and audit monitoring.
 */

import { Suspense } from 'react';
import { Shield, Users, CreditCard, FileText, Settings, Activity } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { BillingManagement } from '@/features/admin/BillingManagement';
import UserManagementDashboard from '@/features/admin/users/UserManagementDashboard';
import { AuditLogViewer } from '@/features/admin/AuditLogViewer';
import { SystemHealth } from '@/features/admin/SystemHealth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ orgId: string; userId?: string }>;
}) {
  const { orgId, userId } = await params;
  
  return (
    <div className="min-h-screen space-y-6 bg-neutral-900 p-6 pt-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              Administrator
            </Badge>
          </div>
          <p className="text-gray-400">
            System administration, user management, and organization oversight
          </p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <Suspense fallback={<LoadingSpinner />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">System Status</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Online</div>
              <p className="text-xs text-green-500">All systems operational</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">-</div>
              <p className="text-xs text-gray-400">Loading...</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Subscription</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">-</div>
              <p className="text-xs text-gray-400">Loading...</p>
            </CardContent>
          </Card>
          <Card className="border-gray-200 bg-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Audit Events</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">-</div>
              <p className="text-xs text-gray-400">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>
      </Suspense>

      {/* Main Admin Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-5 bg-black border border-gray-200">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600">
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600">
            <FileText className="h-4 w-4" />
            Audit
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-600">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <AdminOverview orgId={orgId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="users" className="mt-6 space-y-6">
          <Card className="border-gray-200 bg-black">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-gray-400">
                Manage user accounts, roles, and permissions for your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <UserManagementDashboard orgId={orgId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card className="border-gray-200 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Billing & Subscriptions</CardTitle>
              <CardDescription className="text-gray-400">
                Monitor subscription status, usage, and manage billing settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <BillingManagement orgId={orgId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6 space-y-6">
          <Card className="border-gray-200 bg-black">
            <CardHeader>
              <CardTitle className="text-white">Audit Logs</CardTitle>
              <CardDescription className="text-gray-400">
                View system activity, user actions, and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <AuditLogViewer orgId={orgId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6 space-y-6">
          <Card className="border-gray-200 bg-black">
            <CardHeader>
              <CardTitle className="text-white">System Health</CardTitle>
              <CardDescription className="text-gray-400">
                Monitor system performance, uptime, and infrastructure status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <SystemHealth />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
