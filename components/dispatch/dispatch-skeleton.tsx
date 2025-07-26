import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Placeholder skeleton for the dispatch board while data is loading.
 * Matches the dark theme of the dashboard.
 */
export function DispatchSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      <div className="animate-pulse space-y-2">
        <div className="h-6 w-1/3 bg-gray-700/50 rounded" /> {/* title bar */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-neutral-900 border border-gray-700">
              <CardHeader className="pb-2">
                <div className="h-4 w-1/2 bg-gray-600 rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 w-3/4 bg-gray-700 rounded" />
                  <div className="h-3 w-2/3 bg-gray-700 rounded" />
                  <div className="h-3 w-1/2 bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
