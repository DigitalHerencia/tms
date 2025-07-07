'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Clock,
  X,
  CheckCircle,
  Info,
  Calendar,
  FileText,
  Truck,
  User,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface ComplianceAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'document' | 'inspection' | 'violation' | 'license' | 'hos' | 'maintenance';
  title: string;
  description: string;
  entityType: 'driver' | 'vehicle' | 'document';
  entityId: string;
  entityName: string;
  dueDate?: string;
  createdAt: string;
  acknowledged: boolean;
  actionRequired: boolean;
  actionUrl?: string;
}

interface ComplianceAlertsProps {
  orgId: string;
}

// Mock data for development
const mockAlerts: ComplianceAlert[] = [
  {
    id: '1',
    type: 'critical',
    category: 'document',
    title: 'CDL License Expiring Soon',
    description: 'John Doe\'s CDL license expires in 5 days (January 25, 2024)',
    entityType: 'driver',
    entityId: 'd1',
    entityName: 'John Doe',
    dueDate: '2024-01-25',
    createdAt: '2024-01-20T10:00:00Z',
    acknowledged: false,
    actionRequired: true,
    actionUrl: '/drivers/d1/documents',
  },
  {
    id: '2',
    type: 'critical',
    category: 'inspection',
    title: 'Annual Inspection Overdue',
    description: 'Vehicle TRK-003 annual inspection was due on January 10, 2024',
    entityType: 'vehicle',
    entityId: 'v3',
    entityName: 'TRK-003',
    dueDate: '2024-01-10',
    createdAt: '2024-01-15T08:30:00Z',
    acknowledged: false,
    actionRequired: true,
    actionUrl: '/vehicles/v3/inspections',
  },
  {
    id: '3',
    type: 'warning',
    category: 'hos',
    title: 'Driver Approaching HOS Limit',
    description: 'Mike Johnson has 2 hours remaining in his 14-hour duty period',
    entityType: 'driver',
    entityId: 'd2',
    entityName: 'Mike Johnson',
    createdAt: '2024-01-20T14:00:00Z',
    acknowledged: false,
    actionRequired: false,
  },
  {
    id: '4',
    type: 'warning',
    category: 'document',
    title: 'Medical Certificate Expiring',
    description: 'Sarah Wilson\'s medical certificate expires in 30 days',
    entityType: 'driver',
    entityId: 'd3',
    entityName: 'Sarah Wilson',
    dueDate: '2024-02-20',
    createdAt: '2024-01-20T09:15:00Z',
    acknowledged: false,
    actionRequired: true,
    actionUrl: '/drivers/d3/documents',
  },
  {
    id: '5',
    type: 'info',
    category: 'maintenance',
    title: 'Preventive Maintenance Due',
    description: 'Vehicle VAN-001 is due for preventive maintenance (15,000 miles)',
    entityType: 'vehicle',
    entityId: 'v4',
    entityName: 'VAN-001',
    dueDate: '2024-01-25',
    createdAt: '2024-01-19T16:20:00Z',
    acknowledged: true,
    actionRequired: true,
    actionUrl: '/vehicles/v4/maintenance',
  },
  {
    id: '6',
    type: 'success',
    category: 'inspection',
    title: 'Inspection Completed',
    description: 'Vehicle TRK-001 annual inspection completed successfully',
    entityType: 'vehicle',
    entityId: 'v1',
    entityName: 'TRK-001',
    createdAt: '2024-01-15T11:45:00Z',
    acknowledged: true,
    actionRequired: false,
  },
];

const alertTypeConfig = {
  critical: {
    icon: AlertTriangle,
    bgColor: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    badge: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    badge: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
};

const categoryConfig = {
  document: { icon: FileText, label: 'Document' },
  inspection: { icon: CheckCircle, label: 'Inspection' },
  violation: { icon: AlertTriangle, label: 'Violation' },
  license: { icon: FileText, label: 'License' },
  hos: { icon: Clock, label: 'HOS' },
  maintenance: { icon: Truck, label: 'Maintenance' },
};

export function ComplianceAlerts({ orgId }: ComplianceAlertsProps) {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'success'>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filter === 'all' || alert.type === filter;
    const matchesAcknowledged = showAcknowledged || !alert.acknowledged;
    return matchesType && matchesAcknowledged;
  });

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'critical' && !a.acknowledged).length,
    warning: alerts.filter(a => a.type === 'warning' && !a.acknowledged).length,
    actionRequired: alerts.filter(a => a.actionRequired && !a.acknowledged).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Compliance Alerts</h2>
          <p className="text-muted-foreground">
            Monitor and manage compliance notifications and alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.actionRequired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2">
        {(['all', 'critical', 'warning', 'info', 'success'] as const).map(type => (
          <Button
            key={type}
            variant={filter === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
        <Separator orientation="vertical" className="h-8" />
        <Button
          variant={showAcknowledged ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowAcknowledged(!showAcknowledged)}
        >
          Show Acknowledged
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No alerts</h3>
                <p className="mt-2 text-muted-foreground">
                  {filter === 'all' 
                    ? 'All compliance items are up to date'
                    : `No ${filter} alerts at this time`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map(alert => {
            const config = alertTypeConfig[alert.type];
            const categoryIcon = categoryConfig[alert.category];
            const Icon = config.icon;
            const CategoryIcon = categoryIcon.icon;

            return (
              <Alert
                key={alert.id}
                className={`${config.bgColor} ${alert.acknowledged ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5`} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTitle className={config.titleColor}>
                          {alert.title}
                        </AlertTitle>
                        <Badge className={config.badge}>
                          {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <CategoryIcon className="h-3 w-3" />
                          {categoryIcon.label}
                        </Badge>
                        {alert.actionRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      
                      <AlertDescription className="text-sm">
                        {alert.description}
                      </AlertDescription>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {alert.entityType === 'driver' ? (
                            <User className="h-3 w-3" />
                          ) : alert.entityType === 'vehicle' ? (
                            <Truck className="h-3 w-3" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                          {alert.entityName}
                        </div>
                        {alert.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(alert.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        <div>
                          Created: {new Date(alert.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {alert.actionRequired && alert.actionUrl && (
                        <div className="pt-2">
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!alert.acknowledged && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                        className="text-xs"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Alert>
            );
          })
        )}
      </div>
    </div>
  );
}
