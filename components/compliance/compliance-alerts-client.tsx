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
import type { ComplianceAlert } from '@/types/compliance';

interface ComplianceAlertsClientProps {
  orgId: string;
  initialAlerts: ComplianceAlert[];
}

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

export function ComplianceAlertsClient({ orgId, initialAlerts }: ComplianceAlertsClientProps) {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(initialAlerts);
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
