"use client";

import { useState, useTransition } from "react";
import { Activity, Users, Truck, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { OrganizationStats, SystemHealth } from "@/types/admin";

interface AdminDashboardProps {
  orgId: string;
  stats: OrganizationStats;
  systemHealth: SystemHealth;
}

export function AdminDashboard({ orgId, stats, systemHealth }: AdminDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "degraded":
        return "text-yellow-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Healthy
          </Badge>
        );
      case "degraded":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            Degraded
          </Badge>
        );
      case "down":
        return <Badge variant="destructive">Down</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const refreshData = () => {
    startTransition(() => {
      // Refresh page data
      window.location.reload();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-neutral-400">Manage your organization and monitor system health</p>
        </div>
        <Button
          onClick={refreshData}
          disabled={isPending}
          variant="outline"
          className="border-gray-600 bg-transparent text-white hover:bg-gray-800"
        >
          {isPending ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-700 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.userCount}</div>
            <p className="text-xs text-green-400">{stats.activeUserCount} active</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.vehicleCount}</div>
            <p className="text-xs text-gray-400">Fleet size</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Drivers</CardTitle>
            <Users className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.driverCount}</div>
            <p className="text-xs text-gray-400">Active drivers</p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Loads</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.loadCount}</div>
            <p className="text-xs text-gray-400">Total loads</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">System Health</CardTitle>
          <CardDescription className="text-gray-400">
            Monitor system performance and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Database</span>
                {getStatusBadge(systemHealth.databaseStatus)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Queue</span>
                {getStatusBadge(systemHealth.queueStatus)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Uptime</span>
                <span className="text-sm font-medium text-white">
                  {formatUptime(systemHealth.uptime)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Connections</span>
                <span className="text-sm font-medium text-white">
                  {systemHealth.activeConnections}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Memory</span>
                <span className="text-sm font-medium text-white">
                  {formatBytes(systemHealth.memoryUsage)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">CPU</span>
                <span className="text-sm font-medium text-white">
                  {systemHealth.cpuUsage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Last Updated</span>
                <span className="text-sm font-medium text-white">
                  {new Date(systemHealth.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className={`h-4 w-4 ${getStatusColor(systemHealth.databaseStatus)}`} />
                <span className="text-sm text-gray-400">Overall Status</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics */}
      {(stats.userGrowth || stats.vehicleGrowth || stats.driverGrowth || stats.loadGrowth) && (
        <Card className="border-gray-700 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white">Growth Metrics</CardTitle>
            <CardDescription className="text-gray-400">30-day growth trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.userGrowth && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">User Growth</div>
                    <div className="text-sm text-green-400">+{stats.userGrowth}%</div>
                  </div>
                </div>
              )}
              {stats.vehicleGrowth && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Vehicle Growth</div>
                    <div className="text-sm text-green-400">+{stats.vehicleGrowth}%</div>
                  </div>
                </div>
              )}
              {stats.driverGrowth && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Driver Growth</div>
                    <div className="text-sm text-green-400">+{stats.driverGrowth}%</div>
                  </div>
                </div>
              )}
              {stats.loadGrowth && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Load Growth</div>
                    <div className="text-sm text-green-400">+{stats.loadGrowth}%</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
