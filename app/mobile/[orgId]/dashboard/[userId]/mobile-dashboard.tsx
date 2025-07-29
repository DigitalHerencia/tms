'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveLayout, MobileCard } from '@/components/ui/responsive-layout';
import { MobileOptimizedTable } from '@/components/ui/mobile-table';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Activity,
  TrendingUp,
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  Truck,
  Settings,
  BarChart3,
  Shield,
  MapPin,
  FileText,
} from 'lucide-react';

interface MobileDashboardProps {
  userRole: string;
  orgId: string;
  metrics: {
    revenue: number;
    activeLoads: number;
    activeDrivers: number;
    totalVehicles: number;
    availableVehicles: number;
    criticalAlerts: number;
    complianceScore: number;
  };
  quickActions: Array<{
    title: string;
    description: string;
    icon: ReactNode;
    href: string;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    subtitle: string;
    timestamp: string;
    status: 'active' | 'warning' | 'error' | 'inactive'; // Updated status type
  }>;
}

export function MobileDashboard({
  userRole,
  orgId,
  metrics,
  quickActions,
  recentActivity,
}: MobileDashboardProps) {
  const isMobile = useIsMobile();

  // Role-based KPI configuration
  const getKPICards = () => {
    const baseKPIs = [
      {
        title: 'Revenue',
        value: `$${metrics.revenue.toLocaleString()}`,
        change: '+12.5%',
        icon: <DollarSign className="h-5 w-5 text-green-600" />,
        trend: 'up',
      },
      {
        title: 'Active Loads',
        value: metrics.activeLoads.toString(),
        change: '+8.3%',
        icon: <Truck className="h-5 w-5 text-blue-600" />,
        trend: 'up',
      },
      {
        title: 'Active Drivers',
        value: metrics.activeDrivers.toString(),
        change: '+2.1%',
        icon: <Users className="h-5 w-5 text-purple-600" />,
        trend: 'up',
      },
    ];

    // Add role-specific KPIs
    if (userRole === 'admin' || userRole === 'dispatcher') {
      baseKPIs.push({
        title: 'Fleet Utilization',
        value: `${Math.round(((metrics.totalVehicles - metrics.availableVehicles) / metrics.totalVehicles) * 100)}%`,
        change: '-3.2%',
        icon: <Activity className="h-5 w-5 text-orange-600" />,
        trend: 'down',
      });
    }

    if (userRole === 'accountant') {
      baseKPIs.push({
        title: 'Profit Margin',
        value: '15.2%',
        change: '+1.8%',
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
        trend: 'up',
      });
    }

    return baseKPIs;
  };

  // Role-based navigation shortcuts
  const getNavigationShortcuts = () => {
    const baseShortcuts = [
      {
        title: 'Dashboard',
        icon: <BarChart3 className="h-5 w-5" />,
        href: `/${orgId}/dashboard`,
        description: 'Fleet overview',
      },
    ];

    if (userRole !== 'driver') {
      baseShortcuts.push(
        {
          title: 'Dispatch',
          icon: <MapPin className="h-5 w-5" />,
          href: `/${orgId}/dispatch`,
          description: 'Load management',
        },
        {
          title: 'Analytics',
          icon: <BarChart3 className="h-5 w-5" />,
          href: `/${orgId}/analytics`,
          description: 'Performance metrics',
        },
      );
    }

    if (userRole === 'admin' || userRole === 'compliance_officer') {
      baseShortcuts.push({
        title: 'Compliance',
        icon: <Shield className="h-5 w-5" />,
        href: `/${orgId}/compliance`,
        description: 'DOT & HOS logs',
      });
    }

    if (userRole === 'accountant' || userRole === 'admin') {
      baseShortcuts.push({
        title: 'IFTA Reports',
        icon: <FileText className="h-5 w-5" />,
        href: `/${orgId}/ifta`,
        description: 'Tax reporting',
      });
    }

    baseShortcuts.push({
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: `/${orgId}/settings`,
      description: 'Account settings',
    });

    return baseShortcuts;
  };

  if (!isMobile) {
    // Return regular desktop layout
    return null; // Let the main dashboard handle desktop layout
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Mobile KPI Grid */}
      <ResponsiveLayout
        mobileLayout="scroll"
        className="grid-cols-2 lg:grid-cols-4"
        mobileClassName="min-w-0"
      >
        {getKPICards().map((kpi, index) => (
          <MobileCard key={index} className="min-w-[140px] flex-shrink-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  {kpi.title}
                </div>
                {kpi.icon}
              </div>
              <div className="text-xl font-bold">{kpi.value}</div>
              <div
                className={`text-xs flex items-center gap-1 ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3 rotate-180" />
                )}
                {kpi.change}
              </div>
            </div>
          </MobileCard>
        ))}
      </ResponsiveLayout>

      {/* Quick Navigation */}
      <MobileCard title="Quick Access" subtitle="Navigate to key areas">
        <div className="grid grid-cols-2 gap-3">
          {getNavigationShortcuts().map((shortcut, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2 text-center"
              asChild
            >
              <a href={shortcut.href}>
                {shortcut.icon}
                <div>
                  <div className="text-xs font-medium">{shortcut.title}</div>
                  <div className="text-xs text-muted-foreground">{shortcut.description}</div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </MobileCard>

      {/* Critical Alerts */}
      {metrics.criticalAlerts > 0 && (
        <MobileCard title="Critical Alerts" className="border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <div className="font-semibold text-red-900">
                {metrics.criticalAlerts} Critical Alert{metrics.criticalAlerts > 1 ? 's' : ''}
              </div>
              <div className="text-sm text-red-700">Immediate attention required</div>
            </div>
            <Button variant="destructive" size="sm" className="ml-auto">
              View
            </Button>
          </div>
        </MobileCard>
      )}

      {/* Quick Actions */}
      <MobileCard title="Quick Actions">
        <ResponsiveLayout mobileLayout="scroll" className="grid-cols-3">
          {quickActions.slice(0, 6).map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              className="min-w-[100px] h-auto p-3 flex flex-col items-center gap-2 text-center flex-shrink-0"
              asChild
            >
              <a href={action.href}>
                {action.icon}
                <span className="text-xs">{action.title}</span>
              </a>
            </Button>
          ))}
        </ResponsiveLayout>
      </MobileCard>

      {/* Recent Activity */}
      <MobileOptimizedTable
        title="Recent Activity"
        data={recentActivity.map((activity) => ({
          id: activity.id,
          title: activity.title,
          subtitle: activity.subtitle,
          status:
            activity.status === 'active'
              ? 'warning'
              : activity.status === 'error'
                ? 'inactive'
                : activity.status,
          primaryValue: new Date(activity.timestamp).toLocaleTimeString(),
          timestamp: activity.timestamp,
        }))}
        emptyMessage="No recent activity"
      />

      {/* Compliance Score */}
      <MobileCard title="Compliance Status">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">
                {metrics.complianceScore}% Compliant
              </div>
              <div className="text-sm text-muted-foreground">All systems operational</div>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Excellent
          </Badge>
        </div>
      </MobileCard>
    </div>
  );
}
