'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { SystemOverviewCards } from '@/components/dashboard/system-overview-cards';
import { ResourceUsageCards } from '@/components/dashboard/resource-usage-cards';
import { SystemHealthChecks } from '@/components/dashboard/system-health-checks';
import { getSystemHealthAction } from '@/lib/actions/dashboardActions';

interface SystemHealthData {
  uptime: number;
  databaseStatus: string;
  queueStatus: string;
  memoryUsage: number;
  cpuUsage: number;
}

interface SystemHealthProps {
  initialData?: SystemHealthData;
}

export function SystemHealth({ initialData }: SystemHealthProps) {
  const [healthData, setHealthData] = useState<SystemHealthData | null>(initialData || null);
  const [isLoading, startTransition] = useTransition();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshHealthData = () => {
    startTransition(async () => {
      const result = await getSystemHealthAction();
      if (result.success && result.data) {
        // Map result.data to SystemHealthData shape
        setHealthData({
          uptime: result.data.uptime,
          databaseStatus: result.data.database ?? 'unknown',
          queueStatus: 'unknown', // Default or fetch if available
          memoryUsage: 0, // Default or fetch if available
          cpuUsage: 0, // Default or fetch if available
        });
        setLastUpdate(new Date());
      }
    });
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load initial data if not provided
  useEffect(() => {
    if (!healthData) {
      refreshHealthData();
    }
  }, []);

  // Remove mock data: formatUptime only formats real uptime
  const formatUptime = (seconds: number) => {
    // Returns a string like "2d 3h 15m 20s"
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [d ? `${d}d` : '', h ? `${h}h` : '', m ? `${m}m` : '', `${s}s`]
      .filter(Boolean)
      .join(' ');
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'ok':
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Healthy
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Warning
          </Badge>
        );
      case 'error':
      case 'down':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!healthData) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading system health data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button
          size="sm"
          onClick={refreshHealthData}
          disabled={isLoading}
          className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <SystemOverviewCards
        healthData={{
          uptime: healthData.uptime,
          databaseStatus: healthData.databaseStatus,
          queueStatus: healthData.queueStatus,
        }}
        formatUptime={formatUptime}
        getStatusBadge={getStatusBadge}
      />

      <ResourceUsageCards
        memoryUsage={healthData.memoryUsage}
        cpuUsage={healthData.cpuUsage}
        getUsageColor={getUsageColor}
      />

      <SystemHealthChecks />
    </div>
  );
}
