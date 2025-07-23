"use client";

import type { Load } from "@/types/dispatch";
import { LoadCard } from "@/components/dispatch/load-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";

interface DispatchBoardUIProps {
  // Data
  loads: Load[];
  drivers: Driver[];
  vehicles: Vehicle[];
  orgId: string;

  // Filtered lists
  filteredAll: Load[];
  filteredPending: Load[];
  filteredAssigned: Load[];
  filteredInTransit: Load[];
  filteredCompleted: Load[];

  // Current state from URL
  currentTab: string;
  filters: {
    status: string;
    driverId: string;
    origin: string;
    destination: string;
    dateRange: string;
  };
  isPending: boolean;

  // Handlers
  onTabChange: (tab: string) => void;
  onLoadClick: (load: Load) => void;
  onStatusUpdate: (loadId: string, status: string) => void;
  onFilterChange: (field: string, value: string) => void;
  onResetFilters: () => void;
}

export function DispatchBoardUI(props: DispatchBoardUIProps) {
  // Only destructure serializable props, keep handlers as props for client usage
  const {
    loads,
    filteredAll,
    filteredPending,
    filteredAssigned,
    filteredInTransit,
    filteredCompleted,
    currentTab
  } = props;

  // Handlers are accessed via props.onTabChange etc. to avoid passing functions from server

  if (!loads || loads.length === 0) {
    return <div className="py-12 text-center text-gray-500">No loads found for this organization.</div>;
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Tabs for load status categories */}
      <Tabs defaultValue="all" value={currentTab} onValueChange={props.onTabChange} className="w-full">
        <TabsList className="grid w-auto grid-cols-5 bg-black border border-gray-200">
          <TabsTrigger value="all" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-500/70">
            All <Badge className="rounded-lg bg-black">{filteredAll.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-500/70">
            Pending <Badge className="rounded-lg bg-black">{filteredPending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="assigned" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-500/70">
            Assigned <Badge className="rounded-lg bg-black">{filteredAssigned.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in_transit" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-500/70">
            In Transit <Badge className="rounded-lg bg-black">{filteredInTransit.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2 text-white data-[state=active]:bg-blue-500/70">
            Completed <Badge className="rounded-lg bg-black">{filteredCompleted.length}</Badge>
          </TabsTrigger>
        </TabsList>
        {[{ value: "all", list: filteredAll },
          { value: "pending", list: filteredPending },
          { value: "assigned", list: filteredAssigned },
          { value: "in_transit", list: filteredInTransit },
          { value: "completed", list: filteredCompleted }
        ].map((tab, idx) => (
          <TabsContent key={tab.value + '-' + idx} value={tab.value} className="width-auto mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {tab.list.map(load => (
                <LoadCard
                  key={load.id}
                  load={load}
                  onClick={() => props.onLoadClick(load)}
                  isUpdating={false}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
  </div>
  )
}