import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, FileX, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ComplianceAlert } from '@/types/dashboard';

interface AlertItemProps {
  alert: ComplianceAlert;
  orgId: string;
}

const alertTypeIconMap = {
  license_expiry: Clock,
  inspection_due: Shield,
  document_missing: FileX,
  violation: AlertTriangle,
} as const;

const severityColorMap = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
} as const;

export function AlertItem({ alert, orgId }: AlertItemProps) {
  const Icon = alertTypeIconMap[alert.type] || AlertTriangle;

  return (
    <div className="flex items-start space-x-3 p-3 border-b last:border-b-0">
      <div className="flex-shrink-0 mt-1">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">
            {alert.title}
          </h4>
          <Badge className={severityColorMap[alert.severity]}>
            {alert.severity}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {alert.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {alert.entityType}: {alert.entityId}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ComplianceAlertsProps {
  alerts: ComplianceAlert[];
  orgId: string;
}

export function ComplianceAlerts({ alerts, orgId }: ComplianceAlertsProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Compliance Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No active compliance alerts. All systems are compliant.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Compliance Alerts</span>
          </div>
          <Badge variant="destructive">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-64 overflow-y-auto">
          {alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} orgId={orgId} />
          ))}
        </div>
        <div className="p-3 border-t">
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href={`/${orgId}/compliance/alerts`}>
              View All Alerts
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}