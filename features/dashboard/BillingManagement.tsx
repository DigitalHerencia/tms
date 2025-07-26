// features/dashboard/BillingManagementClient.tsx
'use client';

import * as React from 'react';
import { Suspense } from 'react';

import { BillingPlanOverview } from '@/components/dashboard/billing-plan-overview';
import type { BillingPlanOverviewProps } from '@/components/dashboard/billing-plan-overview';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Car, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarCollapsed } from '@/components/navigation/MainNav';
import { cn } from '@/lib/utils/utils';

import type { BillingInfo } from '@/types/dashboard';

interface BillingManagementClientProps {
  billingInfo: BillingInfo;
}

export function BillingManagementClient({
  billingInfo,
}: BillingManagementClientProps) {
  const collapsed = useSidebarCollapsed();

  // ── 1) planMap & tier narrowing ──
  type PlanKey = 'starter' | 'growth' | 'enterprise';
  type PlanDetails = BillingPlanOverviewProps['planDetails'];

  const planMap: Record<PlanKey, PlanDetails> = {
    starter: {
      name: 'Starter',
      price: '$249/mo',
      color: 'text-blue-500',
      features: [
        'Up to 5 trucks',
        '2 dispatcher seats',
        '5 driver apps',
        'Core TMS features',
        '90‑day log retention',
      ],
    },
    growth: {
      name: 'Growth',
      price: '$549/mo',
      color: 'text-green-500',
      features: [
        'Up to 25 trucks',
        'Unlimited dispatcher seats',
        '25 driver apps',
        'IFTA engine',
        'Custom reports',
      ],
    },
    enterprise: {
      name: 'Enterprise',
      price: '$799/mo',
      color: 'text-purple-500',
      features: [
        'Advanced features',
        'Priority support',
        'Unlimited everything',
      ],
    },
  };

  const incoming = billingInfo.plan as PlanKey;
  const tier: PlanKey = incoming in planMap ? incoming : 'starter';
  const planDetails = planMap[tier];

  // ── 2) status badge helper ──
  const getStatusBadge: BillingPlanOverviewProps['getStatusBadge'] = (status) => {
    const bg =
      status === 'active'
        ? 'bg-green-600'
        : status === 'trial'
        ? 'bg-blue-600'
        : status === 'cancelled'
        ? 'bg-red-600'
        : 'bg-gray-600';
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold text-white',
          bg
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // ── 3) usage metrics & derived vars ──
  const { users, maxUsers, vehicles, maxVehicles } = billingInfo.usage;
  const userPct = (users / maxUsers) * 100;
  const rawVehiclePct = (vehicles / maxVehicles) * 100;
  const vehiclePct = Math.min(rawVehiclePct, 100);
  const remainingVehicles = maxVehicles - vehicles;
  const vehicleOver = vehicles - maxVehicles;

  // ── 4) plan‑card keys for row 2 ──
  const cardKeys: PlanKey[] = ['starter', 'growth', 'enterprise'];

  return (
    <div className="mt-4 space-y-6">
      {/* Row 1: Subscription + Usage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Subscription */}
        <Suspense fallback={<DashboardSkeleton />}>
          <BillingPlanOverview
            planDetails={planDetails}
            status={billingInfo.status}
            currentPeriodEnds={billingInfo.currentPeriodEnds}
            getStatusBadge={getStatusBadge}
          />
        </Suspense>

        {/* Active Users */}
        <Card className="rounded-md shadow-md bg-black border border-gray-200">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-8 w-8 text-white" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between items-center mt-8 space-y-4">
            {/* Top: used / limit */}
            <div className='flex flex-row gap-4 items-baseline'>
              <h3 className="text-4xl font-bold text-white">{users}</h3>
              <p className="text-2xl text-gray-400">
                of {maxUsers} seats
              </p>
            </div>

            <Separator />

            {/* Usage summary */}
            <div className="flex items-center mt-4 gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h4 className="text-lg text-white">Usage Summary</h4>
            </div>
            <ul className="ml-4 space-y-1 text-gray-400 text-med">
              <li>Capacity used: {userPct.toFixed(1)}%</li>
              <li className="text-med font-semibold text-gray-400">
                {maxUsers - users} seats remaining
              </li>
            </ul>

            {/* Bottom: progress bar */}
            <div className="mt-4">
              <Progress value={Math.min(userPct, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Active Vehicles */}
        <Card className="rounded-md shadow-md bg-black border border-gray-200">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Car className="h-8 w-8 text-white" />
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-between space-y-4">
            {/* Top: used / limit or over-limit */}
            <div>
              {vehicles <= maxVehicles ? (
                <div className='flex flex-row gap-4 mt-8 items-baseline'>
                  <h3 className="text-4xl font-bold text-white">{vehicles}</h3>
                  <p className="text-2xl text-gray-400">
                    of {maxVehicles} vehicles
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-4xl font-bold text-red-500">{vehicles}</h3>
                  <p className="text-2xl text-gray-400">
                    over by {vehicleOver} vehicles
                  </p>
                </>
              )}
            </div>

            <Separator />

            {/* Usage summary */}
            <div className="flex flex-row items-center mt-4 gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h4 className="text-lg text-white">Usage Summary</h4>
            </div>
            <ul className="ml-4 space-y-1 text-gray-400 text-med">
              <li>Capacity used: {rawVehiclePct.toFixed(1)}%</li>
              <li className="text-med font-semibold text-gray-400">
                {vehicles <= maxVehicles
                  ? `${remainingVehicles} slots remaining`
                  : `${vehicleOver} over limit`}
              </li>
            </ul>

            {/* Bottom: progress bar */}
            <div className="mt-4">
              <Progress value={vehiclePct} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Full Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardKeys.map((key) => {
          const pd = planMap[key];
          return (
            <Card
              key={key}
              className="rounded-md shadow-md bg-black border border-gray-200 p-6 flex flex-col"
            >
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-white">{pd.name}</h3>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-3xl font-bold text-white">{pd.price}</p>
                  <ul className="space-y-1 text-xs text-gray-400">
                    {pd.features.map((ft, i) => (
                      <li key={i} className="flex items-center">
                        • <span className="ml-2">{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="mt-6 w-full rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800">
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
