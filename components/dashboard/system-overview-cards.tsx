import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Database, Server, Clock } from 'lucide-react';
import React from 'react';

interface SystemOverviewCardsProps {
  healthData: {
    uptime: number;
    databaseStatus: string;
    queueStatus: string;
  };
  formatUptime: (seconds: number) => string;
  getStatusBadge: (status: string) => React.JSX.Element;
}

export function SystemOverviewCards({
  healthData,
  formatUptime,
  getStatusBadge,
}: SystemOverviewCardsProps) {
  const overallStatus =
    ['healthy', 'ok', 'active'].includes(
      healthData.databaseStatus.toLowerCase(),
    ) &&
    ['healthy', 'ok', 'active'].includes(
      healthData.queueStatus.toLowerCase(),
    )
      ? 'healthy'
      : 'warning';
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-black border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            System Uptime
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600">
              {formatUptime(healthData.uptime)}
            </div>
            <p className="text-xs text-muted-foreground">Running smoothly</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getStatusBadge(healthData.databaseStatus)}
            <p className="text-xs text-muted-foreground">Connection active</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Server className="w-4 h-4" />
            Queue Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getStatusBadge(healthData.queueStatus)}
            <p className="text-xs text-muted-foreground">Processing jobs</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-black border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Overall Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getStatusBadge(overallStatus)}
            <p className="text-xs text-muted-foreground">
              {overallStatus === 'healthy' ? 'All systems go' : 'Issues detected'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
