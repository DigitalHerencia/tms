import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getDriverById } from '@/lib/fetchers/driverFetchers';
import { CurrentLoadCard } from '@/components/drivers/current-load-card';
import UpcomingLoads from './UpcomingLoads';
import RecentActivity from './RecentActivity';
import PerformanceOverview from './PerformanceOverview';
import { HosStatusCards } from '@/components/drivers/hos-status-cards';
import { DocumentStatusCard } from '@/components/drivers/document-status-card';
import { AssignmentDialogWrapper } from '@/features/drivers/AssignmentDialogWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, User } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getDriverDisplayStatus, getDriverStatusColor } from '@/lib/utils/driverStatus';

// Next.js 15 async params pattern
interface PageProps {
  params: Promise<{ orgId: string; userId: string }>; // userId can be either user ID or driver ID
}


export default async function DriverDashboardPage({ params }: PageProps) {
  const { orgId, userId } = await params;
  const driver = await getDriverById(userId, orgId);

  if (!driver) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
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
                <Badge className={getDriverStatusColor(driver.status)}>
                  {getDriverDisplayStatus(driver.status)}
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
      <Suspense fallback={<Skeleton />}>
        <AssignmentDialogWrapper
          driverId={driver.id}
          currentAssignment={driver.currentAssignment}
        />
      </Suspense>

      {/* HOS Status Cards - Top Priority */}
      <Suspense fallback={<Skeleton />}>
        <HosStatusCards hosStatus={null} />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<Skeleton />}>
          <CurrentLoadCard assignment={(driver as any).currentAssignmentDetails} />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <UpcomingLoads driverId={driver.id} orgId={orgId} />
        </Suspense>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<Skeleton />}>
          <RecentActivity driverId={driver.id} orgId={orgId} />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <PerformanceOverview driverId={driver.id} orgId={orgId} />
        </Suspense>
      </div>

      {/* Document Status - Full Width */}
      <Suspense fallback={<Skeleton />}>
        <DocumentStatusCard driverId={driver.id} orgId={orgId} />
      </Suspense>
    </div>
  );
}
