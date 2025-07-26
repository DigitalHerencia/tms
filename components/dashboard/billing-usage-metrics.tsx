// features/dashboard/BillingManagement.tsx
'use client';

/*
 * BillingManagementClient
 *
 * This component renders the billing management dashboard used in the FleetFusion admin interface.
 * It shows the current subscription plan alongside usage metrics for active users and vehicles,
 * and a comparison of available plans.  The top row has been refactored into a unified grid with
 * three equal columns so the subscription, users and vehicles cards are evenly spaced.  All
 * percentage calculations, limits and alert logic remain unchanged.
 */

import * as React from 'react';
import { BillingPlanOverview } from '@/components/dashboard/billing-plan-overview';
import type { BillingPlanOverviewProps } from '@/components/dashboard/billing-plan-overview';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Car, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BillingInfo } from '@/types/dashboard';

interface BillingManagementClientProps {
  billingInfo: BillingInfo;
}

export function BillingManagementClient({ billingInfo }: BillingManagementClientProps) {
  // Plan configuration
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
      features: ['Advanced features', 'Priority support', 'Unlimited everything'],
    },
  };

  const incoming = billingInfo.plan as PlanKey;
  const tier: PlanKey = incoming in planMap ? incoming : 'starter';
  const planDetails = planMap[tier];

  // Status badge helper
  const getStatusBadge: BillingPlanOverviewProps['getStatusBadge'] = (status) => {
    const bgClass =
      status === 'active'
        ? 'bg-green-600'
        : status === 'trial'
        ? 'bg-blue-600'
        : status === 'cancelled'
        ? 'bg-red-600'
        : 'bg-gray-600';
    return (
      <span
        className={
          'inline-flex items-center px-2 py-0.5 rounded text-white text-xs font-medium ' +
          bgClass
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Usage metrics
  const { users, maxUsers, vehicles, maxVehicles } = billingInfo.usage;
  const userPct = (users / maxUsers) * 100;
  const rawVehiclePct = (vehicles / maxVehicles) * 100;
  const vehiclePct = Math.min(rawVehiclePct, 100);
  const remainingUsers = maxUsers - users;
  const remainingVehicles = maxVehicles - vehicles;
  const vehicleOver = vehicles - maxVehicles;

  // Plan comparison keys
  const cardKeys: PlanKey[] = ['starter', 'growth', 'enterprise'];

  return (
    <div>
      {/* Row 1: Subscription + Usage Metrics */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3">
        {/* Subscription card */}
        <div className="flex flex-col">
          <BillingPlanOverview
            planDetails={planDetails}
            status={billingInfo.status}
            currentPeriodEnds={billingInfo.currentPeriodEnds}
            getStatusBadge={getStatusBadge}
          />
        </div>

        {/* Active Users card */}
        <Card className="rounded-md bg-black border border-gray-200">
          <CardHeader className="flex items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <Users className="h-8 w-8 text-white" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex flex-col">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-2xl font-bold text-white">{users}</span>
              <span className="text-xs text-gray-400">of {maxUsers} seats</span>
            </div>
            <div className="mb-36 text-sm">
              <span className="text-gray-300">Us</span>
              <span className="text-gray-400">Capacity used: {userPct.toFixed(1)}%</span>
              <span
                className={
                  remainingUsers <= 0
                    ? 'text-red-600'
                    : userPct > 75
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }
              >
                {remainingUsers} {remainingUsers === 1 ? 'seat' : 'seats'} remaining
              </span>
            </div>
            <div className="mt-auto">
              <Progress value={userPct} className="h-2" />
            </div>
            {userPct > 90 && (
              <Alert className="border-red-600 bg-black mt-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <AlertDescription className="text-xs text-red-600">
                  You're approaching your user limit. Consider upgrading your plan.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Active Vehicles card */}
        <Card className="rounded-md bg-black border border-gray-200">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-sm font-medium text-white">
              <Car className="h-8 w-8 text-white" />
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex flex-col">
            <div className="flex justify-between items-baseline mb-2">
              {vehicles <= maxVehicles ? (
                <>
                  <span className="text-xs font-bold text-white">{vehicles}</span>
                  <span className="text-xs text-gray-400">of {maxVehicles} vehicles</span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold text-white">{vehicles}</span>
                  <span className="text-xs text-red-600">over by {vehicleOver} vehicles</span>
                </>
              )}
            </div>
            <div className="flex flex-col space-y-1 mb-2 text-sm">
              <span className="text-gray-300">Usage Summary</span>
              <span className="text-gray-400">Capacity used: {rawVehiclePct.toFixed(1)}%</span>
              <span
                className={
                  vehicles <= maxVehicles
                    ? vehiclePct > 75
                      ? 'text-yellow-600'
                      : 'text-green-600'
                    : 'text-red-600'
                }
              >
                {vehicles <= maxVehicles
                  ? `${remainingVehicles} ${remainingVehicles === 1 ? 'slot' : 'slots'} remaining`
                  : `${vehicleOver} over limit`}
              </span>
            </div>
            <div className="mt-auto">
              <Progress value={vehiclePct} className="h-2" />
            </div>
            {rawVehiclePct > 90 && (
              <Alert className="border-red-600 bg-black mt-4">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-xs text-red-600">
                  You're approaching your vehicle limit. Consider upgrading your plan.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Plan Comparison */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-3">
        {cardKeys.map((key) => {
          const pd = planMap[key];
          return (
            <Card
              key={key}
              className="rounded-md shadow-md bg-black border border-gray-200 flex flex-col justify-between"
            >
              <CardHeader className="flex flex-col space-y-2">
                <CardTitle className="text-lg font-semibold text-white flex justify-between items-baseline">
                  <span>{pd.name}</span>
                  <span className="text-sm font-medium text-gray-400">{pd.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3 flex-1 flex flex-col">
                <div className="space-y-1 text-sm mb-4">
                  {pd.features.map((ft) => (
                    <p key={ft} className="text-gray-400 flex items-start">
                      <span className="mr-2">•</span>
                      {ft}
                    </p>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button className="w-full" variant="default">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
