'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  Activity,
  TrendingUp,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { DashboardData, QuickAction } from '@/types/dashboard';
import type { UserContext } from '@/types/auth';
import { SystemRoles } from '@/types/abac';

interface MobileDashboardLayoutProps {
  user: UserContext;
  dashboardData: DashboardData;
  roleBasedData: {
    kpis: any[];
    quickActions: QuickAction[];
  };
  children: React.ReactNode;
}

export function MobileDashboardLayout({
  user,
  dashboardData,
  roleBasedData,
  children,
}: MobileDashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  if (!isMobile) {
    return <>{children}</>;
  }

  const getRoleGreeting = () => {
    switch (user.role) {
      case SystemRoles.ADMIN:
        return `Admin - ${dashboardData.metrics.totalVehicles} vehicles`;
      case SystemRoles.DISPATCHER:
        return `Dispatch - ${dashboardData.metrics.activeLoads} loads`;
      case SystemRoles.DRIVER:
        return `Driver Portal`;
      case SystemRoles.COMPLIANCE:
        return `Compliance - ${dashboardData.metrics.criticalAlerts} alerts`;
      case SystemRoles.ADMIN:
        return `Financial Overview`;
      case SystemRoles.MEMBER:
        return `Fleet Overview`;
      default:
        return 'Fleet operations';
    }
  };

  const getStatusIndicator = () => {
    const criticalIssues = dashboardData.metrics.criticalAlerts;
    if (criticalIssues > 0) {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {criticalIssues}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
        <Activity className="h-3 w-3 mr-1" />
        OK
      </Badge>
    );
  };

  const priorityActions = roleBasedData.quickActions
    .filter((action) => action.priority === 'high')
    .slice(0, 3);

  const keyStats = [
    {
      label: 'Active Loads',
      value: dashboardData.metrics.activeLoads,
      color: 'text-blue-600',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: 'Available Vehicles',
      value: dashboardData.metrics.availableVehicles,
      color: 'text-green-600',
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: 'Active Drivers',
      value: dashboardData.metrics.activeDrivers,
      color: 'text-purple-600',
      icon: <Activity className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
            Dashboard
            {getStatusIndicator()}
          </h1>
          <p className="text-sm text-muted-foreground">{getRoleGreeting()}</p>
        </div>

        {/* Menu Sheet for Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="space-y-4 py-4">
              <h3 className="font-semibold">Quick Actions</h3>
              {roleBasedData.quickActions.slice(0, 6).map((action, index) => (
                <Button key={index} variant="ghost" className="w-full justify-start" asChild>
                  <a href={action.href}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${action.color} text-white`}>
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Key Stats - Collapsible */}
      <Card>
        <CardHeader
          className="pb-2 cursor-pointer"
          onClick={() => setIsStatsExpanded(!isStatsExpanded)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Key Metrics</CardTitle>
            {isStatsExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </CardHeader>
        {isStatsExpanded && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-2">
              {keyStats.map((stat, index) => (
                <div key={index} className="text-center p-2">
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                  <div className={`font-bold text-sm ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Priority Actions - Always Visible */}
      {priorityActions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Priority Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {priorityActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  asChild
                >
                  <a href={action.href}>
                    <div className="flex items-center gap-3 w-full">
                      <div className={`p-2 rounded ${action.color} text-white`}>
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                      {action.badge && (
                        <Badge variant={action.badge.variant} className="text-xs">
                          {action.badge.text}
                        </Badge>
                      )}
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Actions - Collapsible */}
      <Card>
        <CardHeader
          className="pb-2 cursor-pointer"
          onClick={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              All Actions ({roleBasedData.quickActions.length})
            </CardTitle>
            {isQuickActionsExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </CardHeader>
        {isQuickActionsExpanded && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {roleBasedData.quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-auto p-3 flex flex-col items-center text-center"
                  asChild
                >
                  <a href={action.href}>
                    <div className={`p-2 rounded ${action.color} text-white mb-2`}>
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="font-medium text-xs">{action.title}</div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recent Activity - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {dashboardData.recentActivity.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded border">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{activity.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Desktop Content (hidden on mobile) */}
      <div className="hidden">{children}</div>
    </div>
  );
}
