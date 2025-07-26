"use client";

import { Activity as ActivityIcon, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RecentActivityProps {
  params: { userId: string };
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
  }>;
}

export function RecentActivityRow({
  params,
  stats,
  RecentActivity,
}: RecentActivityProps) {
  const formatLabel = (item: any) =>
    `${item.userName} ${item.action.toLowerCase()} ${item.entityType.toLowerCase()} ${item.entityId}`;

  const [first, ...rest] = RecentActivity;

  return (
    <Card className="bg-black border border-gray-200">
      <CardHeader>
        <div className="flex items-baseline justify-between">
          {/* 1) Title + description */}
          <div className="flex flex-col gap-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <ActivityIcon className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Dispatch activities for today
            </CardDescription>

          {/* 2) Stats on top, first activity item right below it */}
          <div className="flex flex-col gap-2 text-sm text-white">
            <span className="space-x-2">
              {stats.totalLoads} loads total   |  {stats.pendingLoads} pending | {"   "}
              {stats.assignedLoads} assigned  |  {stats.inTransitLoads} in transit | {"   "}
              {stats.completedLoads}  completed
            </span>
            {first && (
              <span className="text-white">
                {formatLabel(first)}
              </span>
            )}
          </div>
            </div>

          {/* 3) Buttons in a vertical column */}
          <div className="flex flex-col gap-4">
            <Link href={`/dispatch/${params.userId}/new`} passHref>
              <Button
                size="sm"
                className="w-36 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add New Load
              </Button>
            </Link>
            <Link href={`/dispatch/${params.userId}/edit`} passHref>
              <Button
                size="sm"
                className="w-36 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit Load
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      {rest.length > 0 && (
        <CardContent className="pt-0">
          <ul className="space-y-3 text-gray-200 text-sm">
            {rest.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between"
              >
                <span>{formatLabel(item)}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
