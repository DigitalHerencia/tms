// features/driver/HosStatusCards.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity, AlertTriangle } from 'lucide-react';

export function HosStatusCards({ hosStatus }: { hosStatus: any }) {
  const hosData = hosStatus?.data || null;
  const defaultData = {
    currentStatus: 'off_duty',
    availableDriveTime: 660,
    availableOnDutyTime: 840,
    usedDriveTime: 0,
    usedOnDutyTime: 0,
    cycleHours: 4200,
    usedCycleHours: 0,
    violations: [],
    complianceStatus: 'pending',
  };
  const data = hosData || defaultData;
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'driving': return 'bg-blue-100 text-blue-800';
      case 'on_duty': return 'bg-green-100 text-green-800';
      case 'off_duty': return 'bg-gray-100 text-gray-800';
      case 'sleeper_berth': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-black/40 border-gray-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(data.currentStatus)}>
              {data.currentStatus.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="text-right">
              <div className="text-xs text-gray-400">Compliance</div>
              <div className={`text-xs font-medium ${
                data.complianceStatus === 'compliant' ? 'text-green-400' :
                data.complianceStatus === 'violation' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {data.complianceStatus.toUpperCase()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black/40 border-gray-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-400" />
            Drive Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatTime(data.availableDriveTime)}</div>
          <p className="text-xs text-gray-400">Remaining of 11:00 limit</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((660 - data.availableDriveTime) / 660) * 100}%` }}></div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-300">On-Duty Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatTime(data.availableOnDutyTime)}</div>
          <p className="text-xs text-gray-400">Remaining of 14:00 limit</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${((840 - data.availableOnDutyTime) / 840) * 100}%` }}></div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-300">70-Hour Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{formatTime(data.cycleHours - data.usedCycleHours)}</div>
          <p className="text-xs text-gray-400">Remaining of 70:00 limit</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(data.usedCycleHours / data.cycleHours) * 100}%` }}></div>
          </div>
          {data.violations?.length > 0 && (
            <div className="mt-2 text-xs text-red-400">{data.violations.length} violation(s)</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
