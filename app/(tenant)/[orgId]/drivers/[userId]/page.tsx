import { Suspense, useState } from 'react';
import { notFound } from 'next/navigation';
import { getDriverById } from '@/lib/fetchers/driverFetchers';
import { CurrentLoadCard } from '@/components/drivers/current-load-card';
import { UpcomingLoadsCard } from '@/components/drivers/upcoming-loads-card';
import { RecentActivityCard } from '@/components/drivers/recent-activity-card';
import { PerformanceOverviewCard } from '@/components/drivers/performance-card';
import { HosStatusCards } from '@/components/drivers/hos-status-cards';
import { DocumentStatusCard } from '@/components/drivers/document-status-card';
import { AssignmentDialogWrapper } from '@/features/drivers/AssignmentDialogWrapper';
import { Driver } from '@/types/drivers';
import { DriversSkeleton } from '@/components/drivers/drivers-skeleton';
import DriversListHeader from '@/components/drivers/drivers-list-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, BarChart3, User } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageLayout } from '@/components/shared/PageLayout';

// Next.js 15 async params pattern
interface PageProps {
  params: Promise<{ orgId: string; userId: string }>; // userId can be either user ID or driver ID
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'inactive':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'suspended':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'terminated':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export default async function DriverDashboardPage({ params }: PageProps) {
  const { orgId, userId } = await params;
  const driver = await getDriverById(userId, orgId);

  if (!driver) {
    notFound();
  }

  return (
    <PageLayout>
      {/* Back Navigation and Driver Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-neutral-600 text-white hover:bg-neutral-700"
          >
            <Link href={`/${orgId}/drivers`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Drivers
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={driver.profileImage || '/white_logo.png'}
                alt={`${driver.firstName} ${driver.lastName}`}
              />
              <AvatarFallback className="bg-neutral-700 text-white">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white">
                {driver.firstName} {driver.lastName}
              </h1>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(driver.status)}>
                  {driver.status.replace('_', ' ')}
                </Badge>
                {driver.companyName && (
                  <Badge
                    variant="outline"
                    className="border-blue-500/30 text-blue-400 bg-blue-500/10"
                  >
                    {driver.companyName}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={`/${orgId}/drivers/${userId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Driver Assignment Section */}
      <Suspense fallback={<DriversSkeleton />}>
        <AssignmentDialogWrapper
          driverId={driver.id}
          currentAssignment={driver.currentAssignment}
        />
      </Suspense>

      {/* HOS Status Cards - Top Priority */}
      <Suspense fallback={<DriversSkeleton />}>
        <HosStatusCards hosStatus={null} />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<DriversSkeleton />}>
          <CurrentLoadCard assignment={(driver as any).currentAssignmentDetails} />
        </Suspense>

        <Suspense fallback={<DriversSkeleton />}>
          <UpcomingLoadsCard driverId={driver.id} orgId={orgId} />
        </Suspense>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<DriversSkeleton />}>
          <RecentActivityCard driverId={driver.id} orgId={orgId} />
        </Suspense>

        <Suspense fallback={<DriversSkeleton />}>
          <PerformanceOverviewCard analytics={null} />
        </Suspense>
      </div>

      {/* Document Status - Full Width */}
      <Suspense fallback={<DriversSkeleton />}>
        <DocumentStatusCard driverId={driver.id} orgId={orgId} />
      </Suspense>
    </PageLayout>
  );
}
