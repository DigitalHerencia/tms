import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioTower } from "lucide-react";

import { DispatchSkeleton } from "@/components/dispatch/dispatch-skeleton";
import { DispatchBoardFeature } from "@/features/dispatch/DispatchBoardFeature";

interface DispatchPageProps {
  params: Promise<{ orgId: string; userId: string }>;
}

/**
 * Page‑level view — **pure UI**
 * - Header rendered inside a `Card` as per design spec
 * - Business logic is delegated to the feature layer (`DispatchBoardFeature`)
 */
export default async function DispatchPage({ params }: DispatchPageProps) {
  const { orgId, userId } = await params;

  return (
    <div className="min-h-screen space-y-6 p-6 bg-neutral-900 text-white">
      {/* ——— Header ——— */}
      <Card className="rounded-md shadow-md bg-black border border-gray-200">
        <CardHeader className="flex flex-row items-center gap-2">
          <RadioTower className="h-8 w-8" />
          <div className="flex flex-col">
            <CardTitle className="text-3xl font-medium flex items-center gap-2 text-white">
              Dispatch Board
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real‑time overview of every load in your fleet
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* ——— Main Content ——— */}
      <Suspense fallback={<DispatchSkeleton />}>
        <DispatchBoardFeature orgId={orgId} userId={userId} />
      </Suspense>
    </div>
  );
}
