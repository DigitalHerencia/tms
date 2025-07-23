import { Activity, Clock } from "lucide-react";
import { getRecentDispatchActivity } from "@/lib/fetchers/dispatchFetchers";

interface ActivityItem {
  id: string;
  entityType: string;
  action: string;
  entityId: string;
  timestamp: string;
  userName: string;
}
interface RecentDispatchActivityProps {
  orgId: string;
}

export default async function RecentDispatchActivity({ orgId }: RecentDispatchActivityProps) {
  if (!orgId) return null;
  let activityItems: ActivityItem[] = [];
  try {
    const result = await getRecentDispatchActivity(orgId);
    if (result.success && Array.isArray(result.data)) {
      
    }
  } catch {
    activityItems = [];
  }

  const formatLabel = (item: ActivityItem) =>
    `${item.userName} ${item.action.toLowerCase()} ${item.entityType.toLowerCase()} ${item.entityId}`;

  return (
    <div className="rounded-lg border border-gray-700 bg-neutral-900 p-6 shadow">
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
          {activityItems.map(item => (
            <li key={item.id} className="flex items-center justify-between">
              <span>{formatLabel(item)}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
