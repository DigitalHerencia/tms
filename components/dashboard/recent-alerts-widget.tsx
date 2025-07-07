import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDashboardAlertsAction } from '@/lib/actions/dashboardActions';
import type { DashboardAlert } from '@/lib/actions/dashboardActions';

interface Alert extends DashboardAlert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

interface RecentAlertsWidgetProps {
  orgId: string;
}

const severityConfig = {
  high: {
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: AlertTriangle,
    badge: 'bg-red-100 text-red-800',
  },
  medium: {
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: AlertCircle,
    badge: 'bg-yellow-100 text-yellow-800',
  },
  low: {
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: Info,
    badge: 'bg-blue-100 text-blue-800',
  },
} as const;

export default async function RecentAlertsWidget({
  orgId,
}: RecentAlertsWidgetProps) {
  if (!orgId) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-600">Organization not found.</p>
        </CardContent>
      </Card>
    );
  }

  let alerts: Alert[] = [];
  try {
    const result = await getDashboardAlertsAction(orgId);
    if (result.success && Array.isArray(result.data)) {
      alerts = result.data.slice(0, 5); // Show only 5 most recent alerts
    }
  } catch {
    alerts = [];
  }

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Recent Alerts
        </CardTitle>
        {alerts.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {alerts.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No recent alerts</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your fleet is running smoothly
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const SeverityIcon = config.icon;
              
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'rounded-lg border p-3 transition-all hover:shadow-sm',
                    config.color
                  )}
                >
                  <div className="flex items-start gap-3">
                    <SeverityIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="secondary"
                          className={cn('text-xs capitalize', config.badge)}
                        >
                          {alert.severity}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {alert.timestamp
                              ? new Date(alert.timestamp).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
