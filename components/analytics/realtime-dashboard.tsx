'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Truck,
  DollarSign,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Bell,
  Zap
} from 'lucide-react';
import { DashboardSummary } from '@/types/analytics';
import type { JSX } from 'react/jsx-runtime';

interface RealtimeDashboardProps {
  orgId: string;
  initial: DashboardSummary;
  timeRange: string;
  driver?: string;
  metrics: Array<{ icon: JSX.Element; label: string; value: string; change: string }>;
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
}

interface LiveMetrics {
  totalRevenue: number;
  totalLoads: number;
  activeDrivers: number;
  utilizationRate: number;
  onTimeDeliveryRate: number;
  averageLoadValue: number;
  profitMargin: number;
  timestamp: string;
}

interface AlertData {
  type: 'alert';
  level: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

interface StreamData {
  type: 'connected' | 'metrics_update' | 'alert' | 'error';
  data?: LiveMetrics;
  level?: string;
  message?: string;
  timestamp: string;
}

export function RealtimeDashboard({ 
  orgId, 
  initial, 
  timeRange, 
  driver, 
  metrics: initialMetrics 
}: RealtimeDashboardProps) {
  const [summary, setSummary] = useState(initial);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [showNotifications, setShowNotifications] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Connect to real-time stream
  const connectToStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionStatus('connecting');
    const params = new URLSearchParams({ timeRange });
    if (driver) params.set('driver', driver);
    
    const eventSource = new EventSource(`/api/analytics/${orgId}/stream?${params.toString()}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnectionStatus('connected');
      setLastUpdate(new Date());
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    eventSource.onmessage = (event) => {
      try {
        const data: StreamData = JSON.parse(event.data);
        setLastUpdate(new Date());

        switch (data.type) {
          case 'connected':
            setConnectionStatus('connected');
            break;
            
          case 'metrics_update':
            if (data.data) {
              setLiveMetrics(data.data);
              // Update summary with live data
              setSummary(prev => ({
                ...prev,
                totalRevenue: data.data!.totalRevenue,
                totalLoads: data.data!.totalLoads,
                activeDrivers: data.data!.activeDrivers
              }));
            }
            break;
            
          case 'alert':
            if (data.message && showNotifications) {
              const alert: AlertData = {
                type: 'alert',
                level: (data.level as 'warning' | 'error' | 'info') || 'info',
                message: data.message,
                timestamp: data.timestamp
              };
              setAlerts(prev => [alert, ...prev].slice(0, 5)); // Keep only last 5 alerts
            }
            break;
            
          case 'error':
            console.error('Stream error:', data.message);
            break;
        }
      } catch (error) {
        console.error('Error parsing stream data:', error);
      }
    };

    eventSource.onerror = () => {
      setConnectionStatus('disconnected');
      eventSource.close();
      
      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connectToStream();
      }, 5000);
    };
  };

  useEffect(() => {
    connectToStream();
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [orgId, timeRange, driver]);

  // Calculate trend indicators
  const calculateTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      color: change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500'
    };
  };

  // Live metrics with real-time data if available
  const currentMetrics = liveMetrics || {
    totalRevenue: summary.totalRevenue,
    totalLoads: summary.totalLoads,
    activeDrivers: summary.activeDrivers,
    utilizationRate: 75,
    onTimeDeliveryRate: 88,
    averageLoadValue: summary.totalRevenue / Math.max(summary.totalLoads, 1),
    profitMargin: 15.5,
    timestamp: new Date().toISOString()
  };

  const metrics = [
    {
      icon: <DollarSign className="h-4 w-4" />,
      label: 'Total Revenue',
      value: `$${currentMetrics.totalRevenue.toLocaleString()}`,
      change: initialMetrics[0]?.change || '+12.5%',
      trend: calculateTrend(currentMetrics.totalRevenue, summary.totalRevenue * 0.9),
      status: 'positive'
    },
    {
      icon: <Truck className="h-4 w-4" />,
      label: 'Active Loads',
      value: currentMetrics.totalLoads.toLocaleString(),
      change: initialMetrics[1]?.change || '+8.3%',
      trend: calculateTrend(currentMetrics.totalLoads, summary.totalLoads * 0.95),
      status: 'positive'
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: 'Active Drivers',
      value: currentMetrics.activeDrivers.toLocaleString(),
      change: initialMetrics[2]?.change || '+2.1%',
      trend: calculateTrend(currentMetrics.activeDrivers, summary.activeDrivers * 0.98),
      status: 'neutral'
    },
    {
      icon: <Activity className="h-4 w-4" />,
      label: 'Utilization Rate',
      value: `${currentMetrics.utilizationRate.toFixed(1)}%`,
      change: initialMetrics[3]?.change || '-3.2%',
      trend: calculateTrend(currentMetrics.utilizationRate, 78),
      status: currentMetrics.utilizationRate >= 75 ? 'positive' : 'warning'
    }
  ];

  const performanceIndicators = [
    {
      label: 'On-Time Delivery',
      value: currentMetrics.onTimeDeliveryRate,
      target: 85,
      unit: '%',
      icon: <Clock className="h-4 w-4" />,
      status: currentMetrics.onTimeDeliveryRate >= 85 ? 'good' : 'warning'
    },
    {
      label: 'Average Load Value',
      value: currentMetrics.averageLoadValue,
      target: 3000,
      unit: '$',
      icon: <DollarSign className="h-4 w-4" />,
      status: currentMetrics.averageLoadValue >= 3000 ? 'good' : 'warning'
    },
    {
      label: 'Profit Margin',
      value: currentMetrics.profitMargin,
      target: 15,
      unit: '%',
      icon: <TrendingUp className="h-4 w-4" />,
      status: currentMetrics.profitMargin >= 15 ? 'good' : 'warning'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {connectionStatus === 'connected' ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : connectionStatus === 'connecting' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-4 w-4 text-blue-500" />
            </motion.div>
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm">
            {connectionStatus === 'connected' ? 'Live' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 
             'Disconnected'}
          </span>
          {connectionStatus === 'connected' && (
            <Badge variant="outline" className="text-xs">
              Last update: {lastUpdate.toLocaleTimeString()}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center gap-1"
          >
            <Bell className="h-3 w-3" />
            {showNotifications ? 'Notifications On' : 'Notifications Off'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={connectToStream}
            disabled={connectionStatus === 'connecting'}
          >
            Reconnect
          </Button>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden ${
              metric.status === 'positive' ? 'border-green-200 dark:border-green-800' :
              metric.status === 'warning' ? 'border-yellow-200 dark:border-yellow-800' :
              'border-gray-200 dark:border-gray-700'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  {connectionStatus === 'connected' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                  )}
                </div>
                
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className={`flex items-center gap-1 text-sm ${metric.trend.color}`}>
                    {metric.trend.direction === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : metric.trend.direction === 'down' ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Activity className="h-3 w-3" />
                    )}
                    {metric.trend.percentage}%
                  </div>
                </div>
                
                {/* Animated progress bar for real-time feel */}
                <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      metric.status === 'positive' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min(100, Math.max(10, parseFloat(metric.trend.percentage)))}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Live Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {performanceIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {indicator.icon}
                  <div>
                    <p className="font-medium text-sm">{indicator.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Target: {indicator.target}{indicator.unit}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {indicator.unit === '$' ? '$' : ''}{indicator.value.toLocaleString()}{indicator.unit !== '$' ? indicator.unit : ''}
                  </span>
                  {indicator.status === 'good' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recent Alerts
            </h4>
            {alerts.map((alert, index) => (
              <motion.div
                key={`${alert.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Alert className={
                  alert.level === 'error' ? 'border-red-200 dark:border-red-800' :
                  alert.level === 'warning' ? 'border-yellow-200 dark:border-yellow-800' :
                  'border-blue-200 dark:border-blue-800'
                }>
                  {alert.level === 'error' ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : alert.level === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                  <AlertDescription className="flex items-center justify-between">
                    <span>{alert.message}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </AlertDescription>
                </Alert>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
