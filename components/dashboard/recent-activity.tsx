import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import type { ActivityItem } from '@/types/dashboard';

interface ActivityItemProps {
  activity: ActivityItem;
}

const typeIconMap = {
  load: '📦',
  driver: '👤',
  vehicle: '🚛',
  compliance: '📋',
  system: '⚙️',
} as const;

const severityColorMap = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
} as const;

export function ActivityItemCard({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-3 p-3 border-b last:border-b-0">
      <div className="flex-shrink-0 mt-0.5">
        <span className="text-lg">
          {typeIconMap[activity.type] || '📄'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground truncate">
            {activity.title}
          </h4>
          {activity.severity && (
            <Badge 
              variant="secondary" 
              className={severityColorMap[activity.severity]}
            >
              {activity.severity}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {activity.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            by {activity.userName || 'System'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {activities.map((activity) => (
            <ActivityItemCard key={activity.id} activity={activity} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}