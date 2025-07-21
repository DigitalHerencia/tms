// components/dashboard/billing-usage-metrics.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress }                                 from '@/components/ui/progress';
import { Alert, AlertDescription }                 from '@/components/ui/alert';
import { Users, Car, AlertCircle }                  from 'lucide-react';

interface UsageInfo {
  users: number;
  maxUsers: number;
  vehicles: number;
  maxVehicles: number;
}

interface BillingUsageMetricsProps {
  usage: UsageInfo;
}

export function BillingUsageMetrics({ usage }: BillingUsageMetricsProps) {
  const userUsagePercent    = (usage.users    / usage.maxUsers)    * 100;
  const vehicleUsagePercent = (usage.vehicles / usage.maxVehicles) * 100;

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
      {/* User Usage Card */}
      <Card className="rounded-md shadow-md bg-black border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
            User Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">{usage.users}</span>
            <span className="text-xs text-gray-400">of {usage.maxUsers} users</span>
          </div>
          <Progress value={userUsagePercent} className="h-2" />
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{userUsagePercent.toFixed(1)}% used</span>
            <span className={
              userUsagePercent > 90  ? 'text-red-600'    :
              userUsagePercent > 75  ? 'text-yellow-600' :
                                       'text-green-600'
            }>
              {usage.maxUsers - usage.users} remaining
            </span>
          </div>
          {userUsagePercent > 90 && (
            <Alert className="border-red-600 bg-black">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-xs text-red-600">
                You're approaching your user limit. Consider upgrading your plan.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Usage Card */}
      <Card className="rounded-md shadow-md bg-black border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <Car className="h-4 w-4 text-blue-500 flex-shrink-0" />
            Vehicle Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">{usage.vehicles}</span>
            <span className="text-xs text-gray-400">of {usage.maxVehicles} vehicles</span>
          </div>
          <Progress value={vehicleUsagePercent} className="h-2" />
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">{vehicleUsagePercent.toFixed(1)}% used</span>
            <span className={
              vehicleUsagePercent > 90  ? 'text-red-600'    :
              vehicleUsagePercent > 75  ? 'text-yellow-600' :
                                          'text-green-600'
            }>
              {usage.maxVehicles - usage.vehicles} remaining
            </span>
          </div>
          {vehicleUsagePercent > 90 && (
            <Alert className="border-red-600 bg-black">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-xs text-red-600">
                You're approaching your vehicle limit. Consider upgrading your plan.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
