/**
 * Dashboard Page
 *
 * Main dashboard showing key metrics, recent activity, and quick actions
 */

import { Suspense } from 'react';
import { Activity, BarChart, CreditCard, FileText, Settings, Shield, Users } from 'lucide-react';
import FleetOverviewHeader from '@/components/dashboard/fleet-overview-header';
import UserManagementDashboard from '@/features/dashboard/UserManagementDashboard';
import { PageLayout } from '@/components/shared/PageLayout';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { getCurrentUser } from '@/lib/auth/auth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import AdminOverview from '@/features/dashboard/AdminOverview';
import { AuditLogViewer } from '@/features/dashboard/AuditLogViewer';
import { BillingManagementClient } from '@/features/dashboard/BillingManagement';
import { getBillingInfo } from '@/lib/fetchers/dashboardFetchers';
import type { BillingInfo } from '@/types/dashboard';
import { SystemHealth } from '@/features/dashboard/SystemHealth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrganizationUsers } from '@/lib/fetchers/dashboardFetchers';
import { BillingActions } from '@/components/dashboard/billing-actions';
import { getAuditLogs } from '@/lib/fetchers/dashboardFetchers';

interface DashboardPageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { orgId, userId } = await params;

  const billingInfo = (await getBillingInfo(orgId)) as BillingInfo;

  // Get current user to check role
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: 'Unauthorized' };
  }

  const auditLogs = await getAuditLogs(orgId);

  // Fetch users for the organization
  const users = await getOrganizationUsers(orgId);

  return (
    <PageLayout className="gap-3">
      {/* Fleet Overview Header */}
      <Suspense fallback={<DashboardSkeleton />}>
        <FleetOverviewHeader orgId={orgId} userId={userId} />
      </Suspense>

      {/* Main Admin Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-auto grid-cols-5 bg-black border border-gray-200">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 text-white data-[state=active]:bg-blue-500/70"
          >
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="flex items-center gap-2 text-foreground data-[state=active]:bg-blue-500/70"
          >
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="flex items-center gap-2 text-foreground data-[state=active]:bg-blue-500/70"
          >
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="flex items-center gap-2 text-foreground data-[state=active]:bg-blue-500/70"
          >
            <FileText className="h-4 w-4" />
            Audit
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="flex items-center gap-2 text-foreground data-[state=active]:bg-blue-500/70"
          >
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="width-auto mt-6 space-y-6">
          <Card className="bg-blue-500/60">
            <CardHeader>
              <CardTitle>
                <h1 className="text-3xl font-medium flex items-center gap-2 text-foreground">
                  <BarChart className="h-8 w-8" />
                  Company Statistics
                </h1>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Key metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <AdminOverview orgId={orgId} userId={userId} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6 space-y-6">
          <Card className="bg-blue-500/60">
            <CardHeader>
              <CardTitle>
                <h1 className="text-3xl font-medium flex items-center gap-2 text-foreground">
                  <Users className="h-8 w-8" />
                  User Management
                </h1>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage user accounts, roles, and permissions for your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <UserManagementDashboard
                  orgId={orgId}
                  users={Array.isArray(users) ? users : users.users}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card className="bg-blue-500/60">
            <CardHeader className="flex flex-row">
              <div>
                <CardTitle>
                  <h1 className="text-3xl font-medium flex items-center gap-2 text-foreground">
                    <CreditCard className="h-8 w-8" />
                    Billing & Subscriptions
                  </h1>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor subscription status, usage, and manage billing settings
                </CardDescription>
              </div>
              <BillingActions />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <BillingManagementClient billingInfo={billingInfo} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6 space-y-6">
          <Card className="bg-blue-500/60">
            <CardHeader>
              <CardTitle>
                <h1 className="text-3xl font-medium flex items-center gap-2 text-foreground">
                  <FileText className="h-8 w-8" />
                  Audit Logs
                </h1>
              </CardTitle>
              <CardDescription className="text-gray-400">
                View system activity, user actions, and security events
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <AuditLogViewer
                  logs={auditLogs}
                  selectedLog={null}
                  setSelectedLog={() => {}}
                  getActionBadgeVariant={() => 'default'}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6 space-y-6">
          <Card className="bg-blue-500/60">
            <CardHeader>
              <CardTitle>
                <h1 className="text-3xl font-medium flex items-center gap-2 text-foreground">
                  <Activity className="w-8 h-8" />
                  System Health Monitor
                </h1>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Monitor system performance, uptime, and infrastructure status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <SystemHealth />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
