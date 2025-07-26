"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useDispatchRealtime } from "@/hooks/use-dispatch-realtime";
import { Activity, RadioTower, RefreshCw, WifiOff } from "lucide-react";

interface DispatchHeaderProps {
  orgId: string;
  userId: string;
}

export default function DispatchHeader({ orgId }: DispatchHeaderProps) {
  if (!orgId) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-600">Organization not found.</p>
        </CardContent>
      </Card>
    );
  }

  const {
    isConnected,
    connectionStatus,
    updateCount,
    lastUpdate,
  } = useDispatchRealtime({
    orgId,
    pollingInterval: 300000,
    enableSSE: true,
  });

  const formattedLastUpdate = lastUpdate
    ? lastUpdate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently";

  return (
    <div className="flex flex-row items-baseline justify-between mb-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <RadioTower className="h-8 w-8 text-white" />
          <h1 className="text-3xl font-extrabold text-white">Dispatch Dashboard</h1>
          <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-3 py-1">
            {isConnected ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">
                  {connectionStatus === "connected"
                    ? "Live"
                    : connectionStatus === "connecting"
                    ? "Connecting..."
                    : "Reconnecting"}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-red-500 text-sm font-medium">Disconnected</span>
              </>
            )}
          </div>
        </div>
        <div className="text-sm text-white/90 font-medium">
          Real-time tools for fleet operations and management
        </div>
        <div className="flex items-center space-x-2 text-sm text-white/70">
          <RefreshCw className="h-3 w-3" />
          <span>Last update: {formattedLastUpdate}</span>
          {updateCount > 0 && (
            <span className="flex items-center gap-1 ml-4 text-blue-400">
              <Activity className="h-3 w-3" />
              {updateCount} updates
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
