import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * VehicleListSkeleton
 *
 * Placeholder skeleton for the vehicle list page.
 * Mirrors the spacing and card shapes of the final layout.
 */
export function VehicleListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search and Add Vehicle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1 bg-gray-800" />
        <Skeleton className="h-10 w-32 bg-gray-800" />
      </div>
      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-muted rounded-md border bg-neutral-900">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3 w-full bg-gray-700" />
              <Skeleton className="h-3 w-2/3 bg-gray-700" />
              <Skeleton className="h-3 w-1/2 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
