import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
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
    <Card className="border-muted rounded-lg border bg-black p-4 hover:border-blue-500 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center text-white">
          <AlertTriangle className="h-5 w-5 mr-2 text-blue-500" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-white/30" />
            <p className="text-sm">No recent alerts</p>
            <p className="text-xs mt-1">Your fleet is running smoothly</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert, index) => {
              const bgColorClass = alert.severity === 'high' ? 'bg-red-500/10 border border-red-500/20' :
                                   alert.severity === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                                   'bg-blue-500/10 border border-blue-500/20';
              
              return (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 ${bgColorClass} rounded-lg`}
                >
                  <span className="text-sm text-white font-medium">
                    {alert.message || `${alert.severity} alert detected`}
                  </span>
                  <span className="text-xs text-white">
                    {alert.timestamp
                      ? new Date(alert.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : `${(index + 1) * 2}h ago`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
