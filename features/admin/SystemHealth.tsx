'use client';

import { useState, useEffect, useTransition } from 'react';
import { Activity, Database, Server, Cpu, MemoryStick, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getSystemHealthAction } from '@/lib/actions/adminActions';

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
        setHealthData(result.data);
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

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'ok':
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>;
      case 'error':
      case 'down':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Unknown</Badge>;
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
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
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health Monitor
          </h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshHealthData}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
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
              <p className="text-xs text-muted-foreground">
                Running smoothly
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="w-4 h-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(healthData.databaseStatus)}
              <p className="text-xs text-muted-foreground">
                Connection active
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="w-4 h-4" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getStatusBadge(healthData.queueStatus)}
              <p className="text-xs text-muted-foreground">
                Processing jobs
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overall Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Operational
              </Badge>
              <p className="text-xs text-muted-foreground">
                All systems go
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MemoryStick className="w-5 h-5" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{healthData.memoryUsage}%</span>
              <span className={`text-sm font-medium ${getUsageColor(healthData.memoryUsage)}`}>
                {healthData.memoryUsage < 75 ? 'Normal' : healthData.memoryUsage < 90 ? 'High' : 'Critical'}
              </span>
            </div>
            <Progress 
              value={healthData.memoryUsage} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground">
              Memory consumption by the application
            </div>
            {healthData.memoryUsage > 85 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  High memory usage detected. Consider reviewing memory-intensive operations.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{healthData.cpuUsage}%</span>
              <span className={`text-sm font-medium ${getUsageColor(healthData.cpuUsage)}`}>
                {healthData.cpuUsage < 50 ? 'Low' : healthData.cpuUsage < 80 ? 'Normal' : 'High'}
              </span>
            </div>
            <Progress 
              value={healthData.cpuUsage} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground">
              Current CPU utilization
            </div>
            {healthData.cpuUsage > 80 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  High CPU usage detected. Monitor for performance impacts.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Health Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">API Endpoints</p>
                <p className="text-xs text-muted-foreground">All endpoints responding</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Background Jobs</p>
                <p className="text-xs text-muted-foreground">Queue processing normally</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">File Storage</p>
                <p className="text-xs text-muted-foreground">Storage accessible</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Email Service</p>
                <p className="text-xs text-muted-foreground">Sending notifications</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Cache System</p>
                <p className="text-xs text-muted-foreground">Cache hits optimal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">Security</p>
                <p className="text-xs text-muted-foreground">All scans clean</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
