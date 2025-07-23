// components/dispatch/dispatch-board-ui.tsx
import { LoadCard } from "@/components/dispatch/load-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";

interface DispatchBoardUIProps {
  // Data
  loads: any[];
  drivers: Driver[];
  vehicles: Vehicle[];
  orgId: string;

  // Filtered lists
  filteredAll: any[];
  filteredPending: any[];
  filteredAssigned: any[];
  filteredInTransit: any[];
  filteredCompleted: any[];

  // State values
  isDetailsOpen: boolean;
  isFormOpen: boolean;
  isFilterOpen: boolean;
  activeTab: string;
  filters: any;
  selectedLoad: any | null;

  // Handlers
  onTabChange: (tab: string) => void;
  onLoadClick: (load: any) => void;
  onFilterClick: () => void;
  onFilterChange: (field: string, value: any) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onNewLoadClick: () => void;

}

export function DispatchBoardUI(props: DispatchBoardUIProps) {
  const {
    loads, drivers,
    filteredAll, filteredPending, filteredAssigned, filteredInTransit, filteredCompleted,
    isFilterOpen, activeTab, filters,
    onTabChange, onLoadClick, onFilterClick, onFilterChange, onApplyFilters, onResetFilters
  } = props;

  if (!loads || loads.length === 0) {
    return <div className="py-12 text-center text-gray-500">No loads found for this organization.</div>;
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Tabs for load status categories */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All <Badge>{filteredAll.length}</Badge></TabsTrigger>
          <TabsTrigger value="pending">Pending <Badge>{filteredPending.length}</Badge></TabsTrigger>
          <TabsTrigger value="assigned">Assigned <Badge>{filteredAssigned.length}</Badge></TabsTrigger>
          <TabsTrigger value="in_transit">In Transit <Badge>{filteredInTransit.length}</Badge></TabsTrigger>
          <TabsTrigger value="completed">Completed <Badge>{filteredCompleted.length}</Badge></TabsTrigger>
        </TabsList>
        {[{ value: "all", list: filteredAll },
          { value: "pending", list: filteredPending },
          { value: "assigned", list: filteredAssigned },
          { value: "in_transit", list: filteredInTransit },
          { value: "completed", list: filteredCompleted }
        ].map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tab.list.map(load => (
                <LoadCard key={load.id} load={load} onClick={() => onLoadClick(load)} />
              ))}
              {tab.list.length === 0 && (
                <p className="col-span-full py-6 text-center text-sm text-gray-500">
                  {tab.value === "all"
                    ? "No loads."
                    : `No ${tab.value.replace("_", " ")} loads.`}
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Filter dialog (remains) */}
      {isFilterOpen && (
        <div className="max-w-xs mx-auto">
          <div className="space-y-4 p-1">
            <div>
              <Label>Status</Label>
              <Select
                onValueChange={value => onFilterChange("status", value)}
                value={filters.status || ""}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Driver</Label>
              <select
                className="mt-1 w-full rounded border bg-transparent px-2 py-1 text-sm"
                value={filters.driverId}
                onChange={e => onFilterChange("driverId", e.target.value)}
              >
                <option value="">Any</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name || `${driver.firstName} ${driver.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Origin City</Label>
              <Input
                className="mt-1"
                value={filters.origin}
                onChange={e => onFilterChange("origin", e.target.value)}
                placeholder="City name"
              />
            </div>
            <div>
              <Label>Destination City</Label>
              <Input
                className="mt-1"
                value={filters.destination}
                onChange={e => onFilterChange("destination", e.target.value)}
                placeholder="City name"
              />
            </div>
            <div>
              <Label>Date Range</Label>
              <select
                className="mt-1 w-full rounded border bg-transparent px-2 py-1 text-sm"
                value={filters.dateRange}
                onChange={e => onFilterChange("dateRange", e.target.value)}
              >
                <option value="recent">Last 30 days</option>
                <option value="">Any time</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary btn-sm" onClick={onResetFilters}>Reset</button>
              <button type="button" className="btn btn-sm" onClick={onApplyFilters}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
