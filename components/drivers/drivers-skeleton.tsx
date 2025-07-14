import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * DriversSkeleton
 *
 * Closely matches the actual drivers page layout:
 * - FleetOverviewHeader (top)
 * - KPI Grid (4 cards)
 * - Bottom widgets grid (3 tall cards)
 */
export function DriversSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6 bg-black text-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-[300px] bg-gray-800" />
        <Skeleton className="h-4 w-[400px] bg-gray-800" />
      </div>
      {/* Widget Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-muted rounded-lg border bg-black p-4">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-32 bg-gray-800" />
            </CardHeader>
            <CardContent className="space-y-3 p-0">
              <Skeleton className="h-32 w-full bg-gray-800" />
              <Skeleton className="h-4 w-3/4 bg-gray-800" />
              <Skeleton className="h-4 w-2/3 bg-gray-800" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-muted rounded-lg border bg-black p-4">
            <CardContent className="flex flex-col items-center space-y-2 text-center p-0">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-800" />
              <Skeleton className="h-6 w-16 bg-gray-800" />
              <Skeleton className="h-4 w-24 bg-gray-800" />
              <Skeleton className="h-3 w-32 bg-gray-800" />
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
