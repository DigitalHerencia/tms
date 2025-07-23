// components/dispatch/recent-activity-row.tsx
"use client";

import { Activity, Clock, PlusCircle, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RecentActivityProps {
params: {
    userId: string;
  };
  stats: {
    totalLoads: number;
    pendingLoads: number;
    assignedLoads: number;
    inTransitLoads: number;
    completedLoads: number;
  };
  RecentActivity: Array<{
    id: string | number;
    userName: string;
    timestamp: string;
    action: string;
    entityType: string;
    entityId: string;
  }> ;
}

export function RecentActivityRow({params, stats, RecentActivity }: RecentActivityProps) {
  const formatLabel = (item: any) =>
    `${item.userName} ${item.action.toLowerCase()} ${item.entityType.toLowerCase()} ${item.entityId}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Recent Activity Card */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-8 w-8 text-white" />
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>
          {!RecentActivity || RecentActivity.length === 0 ? (
            <p className="text-gray-500">No recent activity.</p>
          ) : (
            <ul className="space-y-3 text-gray-200 text-sm">
              {RecentActivity.slice(0, 8).map(item => (
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
          <Link href={`/dispatch/${params.userId}/new`} className="w-full">
            <Button size="sm" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Load
            </Button>
          </Link>
          <Link href={`/dispatch/${params.userId}/edit`} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Edit Load
            </Button>
          </Link>
        </CardContent>
      </Card>
      {/* Load Summary Card */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {/* Quick summary stats */}
        <div className="text-sm text-muted-foreground">
          {stats.totalLoads} loads total • {stats.pendingLoads} pending • {stats.assignedLoads} assigned •{" "}
          {stats.inTransitLoads} in transit • {stats.completedLoads} completed
        </div>
        </CardContent>
      </Card>
    </div>
  );
}

  