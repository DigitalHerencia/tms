import { Suspense } from "react";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";
import { UserManagement } from "@/components/admin/users/UserManagement";
import { AuditLogViewer } from "@/components/admin/audit/AuditLogViewer";
import { BillingManagement } from "@/components/admin/billing/BillingManagement";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getOrganizationStats,
  getOrganizationUsers,
  getSystemHealth,
  getAuditLogs,
  getBillingInfo,
} from "@/lib/fetchers/adminFetchers";
import type { AdminDashboardData } from "@/types/admin";

interface AdminFeaturesProps {
  orgId: string;
}

export async function AdminFeatures({ orgId }: AdminFeaturesProps) {
  if (!orgId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Organization not found.</p>
      </div>
    );
  }

  try {
    // Fetch all admin data in parallel
    const [stats, userData, systemHealth, auditLogs, billingInfo] = await Promise.all([
      getOrganizationStats(orgId),
      getOrganizationUsers(orgId),
      getSystemHealth(),
      getAuditLogs(orgId, { limit: 50 }),
      getBillingInfo(orgId),
    ]);

    const dashboardData: AdminDashboardData = {
      organizationStats: stats,
      userData,
      billing: billingInfo,
      systemHealth,
      recentActivity: auditLogs,
    };

    return (
      <div className="min-h-screen space-y-6 bg-neutral-900 p-6 pt-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-gray-700">
            <TabsTrigger
              value="overview"
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Audit Logs
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Billing
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard
                orgId={orgId}
                stats={dashboardData.organizationStats}
                systemHealth={dashboardData.systemHealth}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <UserManagement orgId={orgId} userData={dashboardData.userData} />
            </Suspense>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <AuditLogViewer orgId={orgId} initialLogs={dashboardData.recentActivity} />
            </Suspense>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Suspense fallback={<LoadingSpinner />}>
              <BillingManagement orgId={orgId} initialBillingInfo={dashboardData.billing} />
            </Suspense>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-white mb-2">Organization Settings</h3>
              <p className="text-gray-400">Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error loading admin data:", error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load admin data. Please try again later.</p>
      </div>
    );
  }
}
