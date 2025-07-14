import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Sun, Sunset, Moon, Clock, CheckCircle } from 'lucide-react';
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
    <Card className="border-muted rounded-lg border bg-black p-4 hover:border-blue-500 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center text-white">
          <Calendar className="h-5 w-5 mr-2 text-blue-500" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {scheduleItems.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
            <p className="text-sm">No items scheduled</p>
            <p className="text-xs mt-1">Enjoy your free day!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {scheduleItems.slice(0, 3).map((item, index) => {
              const bgColorClass = item.timePeriod === 'Morning' ? 'bg-green-500/10 border border-green-500/20' :
                                   item.timePeriod === 'Afternoon' ? 'bg-blue-500/10 border border-blue-500/20' :
                                   'bg-purple-500/10 border border-purple-500/20';
              
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 ${bgColorClass} rounded-lg`}
                >
                  <span className="text-sm text-white font-medium">
                    {item.description || `${item.count || (index + 2)} loads ${item.timePeriod.toLowerCase()}`}
                  </span>
                  <span className="text-xs text-white">
                    {item.timePeriod}
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
