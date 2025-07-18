import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SettingsDashboard } from '@/components/settings/settings-dashboard';
import { 
  getOrganizationSettings, 
  getUserPreferences, 
  getNotificationSettings,
  getIntegrationSettings,
  getBillingSettings 
} from '@/lib/fetchers/settingsFetchers';
import db from '@/lib/database/db';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getCurrentUser } from '@/lib/auth/auth';

export default async function SettingsPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  const { userId } = await auth();

  // Verify authentication only
  if (!userId) {
    redirect('/sign-in');
  }

  // Get current user context
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/sign-in');
  }

  // All roles can access settings now

  // Get user role for tab visibility
  const userMembership = await db.organizationMembership.findUnique({    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },    },
  });

  const userRole = userMembership?.role || 'viewer';

  // Prefetch all settings data
  const [
    organizationSettings,
    userPreferences,
    notificationSettings,
    integrationSettings,
    billingSettings,
  ] = await Promise.allSettled([
    getOrganizationSettings(orgId),
    getUserPreferences(userId),
    getNotificationSettings(userId),
    getIntegrationSettings(orgId),
    getBillingSettings(orgId),
  ]);

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization and personal settings
          </p>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <SettingsDashboard 
          orgId={orgId}
          userId={userId}
          userRole={userRole}
          initialData={{
            organization: organizationSettings.status === 'fulfilled' ? organizationSettings.value : null,
            userPreferences: userPreferences.status === 'fulfilled' ? userPreferences.value : null,
            notifications: notificationSettings.status === 'fulfilled' ? notificationSettings.value : null,
            integrations: integrationSettings.status === 'fulfilled' ? integrationSettings.value : null,
            billing: billingSettings.status === 'fulfilled' ? billingSettings.value : null,
          }}
        />
      </Suspense>
    </div>
  );
}
