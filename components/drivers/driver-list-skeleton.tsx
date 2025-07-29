import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * DriverListSkeleton
 *
 * Placeholder skeleton for the driver list page.
 * Mirrors the layout of search, tabs and card grid.
 */
export function DriverListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1 bg-gray-800" />
        <Skeleton className="h-10 w-20 sm:w-10 bg-gray-800" />
      </div>
      {/* Tabs */}
      <div className="grid w-full grid-cols-3 bg-black border border-muted">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 bg-gray-800" />
        ))}
      </div>
      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-muted rounded-md border bg-neutral-900">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2 bg-gray-700" />
                <Skeleton className="h-3 w-1/3 bg-gray-700" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3 w-3/4 bg-gray-700" />
              <Skeleton className="h-3 w-2/3 bg-gray-700" />
              <Skeleton className="h-3 w-1/2 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
