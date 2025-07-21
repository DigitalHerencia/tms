import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MemoryStick, Cpu, AlertTriangle } from 'lucide-react';
import React from 'react';

interface ResourceUsageCardsProps {
  memoryUsage: number;
  cpuUsage: number;
  getUsageColor: (percentage: number) => string;
}

export function ResourceUsageCards({ memoryUsage, cpuUsage, getUsageColor }: ResourceUsageCardsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className='bg-black border border-gray-200'>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MemoryStick className="w-5 h-5" />
            Memory Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{memoryUsage}%</span>
            <span className={`text-sm font-medium ${getUsageColor(memoryUsage)}`}>
              {memoryUsage < 75 ? 'Normal' : memoryUsage < 90 ? 'High' : 'Critical'}
            </span>
          </div>
          <Progress value={memoryUsage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Memory consumption by the application
          </div>
          {memoryUsage > 85 && (
            <Alert>
              <AlertTriangle className="text-red-500 h-4 w-4" />
              <AlertDescription className="text-red-500">
                High memory usage detected. Consider reviewing memory-intensive operations.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <Card className='bg-black border border-gray-200'>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            CPU Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{cpuUsage}%</span>
            <span className={`text-sm font-medium ${getUsageColor(cpuUsage)}`}>
              {cpuUsage < 50 ? 'Low' : cpuUsage < 80 ? 'Normal' : 'High'}
            </span>
          </div>
          <Progress value={cpuUsage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Current CPU utilization
          </div>
          {cpuUsage > 80 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-500"> 
                High CPU usage detected. Monitor for performance impacts.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
