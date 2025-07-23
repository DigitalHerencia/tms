// components/dispatch/recent-activity-row.tsx

import { Activity, Clock, PlusCircle, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRecentDispatchActivity } from "@/lib/fetchers/dispatchFetchers";
import React from "react";

// Props: header actions and summary passed as renderable children for flexibility
interface RecentActivityRowProps {
  orgId: string;
  onNewLoadClick: () => void;
  onFilterClick: () => void;
  summaryStats: React.ReactNode;
}


export async function RecentActivityRow({ orgId, onNewLoadClick, onFilterClick, summaryStats }: RecentActivityRowProps) {
  let activityItems: {
    id: string;
    organizationId: string;
    entityType: string;
    action: string;
    entityId: string;
    userName: string;
    timestamp: string;
  }[] = [];

  try {
  const result = await getRecentDispatchActivity(orgId);
  if (result.success && Array.isArray(result.data)) {
    activityItems = result.data.map(item => ({
      ...item,
      timestamp: typeof item.timestamp === "string" ? item.timestamp : item.timestamp.toISOString(),
    }));


    }
  } catch {
    activityItems = [];
  }

  const formatLabel = (item: typeof activityItems[0]) =>
    `${item.userName} ${item.action.toLowerCase()} ${item.entityType.toLowerCase()} ${item.entityId}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Recent Activity Card */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded bg-purple-500 p-1.5">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>
          {activityItems.length === 0 ? (
            <p className="text-gray-500">No recent activity.</p>
          ) : (
            <ul className="space-y-3 text-gray-200 text-sm">
              {activityItems.slice(0, 8).map(item => (
                <li key={item.id} className="flex items-center justify-between">
                  <span>{formatLabel(item)}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      {/* Header Actions Card */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-6">
          <Button size="sm" className="w-full" onClick={onNewLoadClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Load
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={onFilterClick}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </CardContent>
      </Card>
      {/* Load Summary Card */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {summaryStats}
        </CardContent>
      </Card>
    </div>
  );
}
