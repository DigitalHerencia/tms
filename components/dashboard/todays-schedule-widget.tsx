import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Sun, Sunset, Moon, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTodaysScheduleAction } from '@/lib/actions/dashboardActions';

interface ScheduleItem {
  id: string;
  description: string;
  timePeriod: string;
  count: number;
  type: string;
}

interface TodaysScheduleWidgetProps {
  orgId: string;
}

const timePeriodConfig = {
  Morning: {
    icon: Sun,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
  },
  Afternoon: {
    icon: Sunset,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    badge: 'bg-orange-100 text-orange-800',
  },
  Evening: {
    icon: Moon,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  All: {
    icon: Clock,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    badge: 'bg-gray-100 text-gray-800',
  },
} as const;

export default async function TodaysScheduleWidget({
  orgId,
}: TodaysScheduleWidgetProps) {
  if (!orgId) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-600">Organization not found.</p>
        </CardContent>
      </Card>
    );
  }

  let scheduleItems: ScheduleItem[] = [];
  try {
    const result = await getTodaysScheduleAction(orgId);
    if (result.success && Array.isArray(result.data)) {
      scheduleItems = result.data;
    }
  } catch {
    scheduleItems = [];
  }

  const totalItems = scheduleItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          Today's Schedule
        </CardTitle>
        {totalItems > 0 && (
          <Badge variant="secondary" className="text-xs">
            {totalItems} items
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {scheduleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">No items scheduled</p>
            <p className="text-xs text-muted-foreground mt-1">
              Enjoy your free day!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduleItems.map((item) => {
              const config = timePeriodConfig[item.timePeriod as keyof typeof timePeriodConfig] || timePeriodConfig.All;
              const PeriodIcon = config.icon;
              
              return (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-lg border p-3 transition-all hover:shadow-sm',
                    config.color
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <PeriodIcon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.description}
                        </p>
                        {item.type && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.type}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count > 1 && (
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          {item.count}
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={cn('text-xs capitalize', config.badge)}
                      >
                        {item.timePeriod.toLowerCase()}
                      </Badge>
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
