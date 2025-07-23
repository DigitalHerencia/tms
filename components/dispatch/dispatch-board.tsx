"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatchRealtime } from "@/hooks/use-dispatch-realtime";
import {
  Activity, 
  Filter, PlusCircle, RefreshCw, Wifi, WifiOff
} from "lucide-react";
import { LoadCard } from "@/components/dispatch/load-card";
import { LoadDetailsDialog } from "@/components/dispatch/load-details-dialog";
import { LoadForm } from "@/components/dispatch/load-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateDispatchLoadAction } from "@/lib/actions/dispatchActions";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";

// ---------------------- FIX HERE ----------------------
interface DispatchBoardProps {
  loads: any[];
  drivers: Driver[]; // <-- Fix: now an array
  vehicles: Vehicle[];
  orgId: string;
}
// ------------------------------------------------------

export function DispatchBoard({ loads, drivers, vehicles, orgId }: DispatchBoardProps) {
  const router = useRouter();
  const [selectedLoad, setSelectedLoad] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { isConnected, connectionStatus, updateCount, lastUpdate, reconnect } = useDispatchRealtime({
    orgId,
    pollingInterval: 30000,
    enableSSE: true,
  });
  const [filters, setFilters] = useState({
    status: "",
    driverId: "",
    origin: "",
    destination: "",
    dateRange: "",
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [viewMode, setViewMode] = useState<"paginated" | "all">("paginated");

  // Tab lists by status
  const pendingLoads = loads.filter(load => load.status === "pending");
  const assignedLoads = loads.filter(load => load.status === "assigned");
  const inTransitLoads = loads.filter(load => load.status === "in_transit");
  const completedLoads = loads.filter(load => load.status === "completed");

  // Clicks and dialog logic
  const handleLoadClick = (load: any) => {
    setSelectedLoad(load);
    setIsDetailsOpen(true);
  };
  const handleNewLoadClick = () => setIsFormOpen(true);
  const handleFormClose = () => {
    setIsFormOpen(false);
    router.refresh();
  };
  const handleFilterClick = () => setIsFilterOpen(true);

  // Filter loads by selected criteria
  const filterLoads = (list: any[]) => {
    return list.filter(load => {
      if (filters.status && load.status !== filters.status) return false;
      if (filters.driverId && load.driver?.id !== filters.driverId) return false;
      if (filters.origin && !(load.originCity?.toLowerCase() || "").includes(filters.origin.toLowerCase())) return false;
      if (filters.destination && !(load.destinationCity?.toLowerCase() || "").includes(filters.destination.toLowerCase())) return false;
      if (filters.dateRange === "recent") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (new Date(load.scheduledPickupDate) < thirtyDaysAgo) return false;
      }
      return true;
    });
  };

  // Pagination
  const paginateLoads = (list: any[]) => {
    if (viewMode === "all" || list.length <= itemsPerPage) return list;
    const start = (currentPage - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  // Filtered result sets for tabs
  const filteredAll = paginateLoads(filterLoads(loads));
  const filteredPending = paginateLoads(filterLoads(pendingLoads));
  const filteredAssigned = paginateLoads(filterLoads(assignedLoads));
  const filteredInTransit = paginateLoads(filterLoads(inTransitLoads));
  const filteredCompleted = paginateLoads(filterLoads(completedLoads));

  // Status update handler
  const handleStatusUpdate = async (orgId: string, loadId: string, formData: FormData ) => {
    setUpdatingId(loadId);
    try {
      await updateDispatchLoadAction(orgId, loadId, formData);
      router.refresh();
    } catch (error) {
      console.error("Error updating load status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
    setActiveTab(activeTab);
  };
  const resetFilters = () => {
    setFilters({ status: "", driverId: "", origin: "", destination: "", dateRange: "" });
  };

  if (!loads || loads.length === 0) {
    return <div className="py-12 text-center text-gray-500">No loads found for this organization.</div>;
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Real-time connection indicator */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="relative">
                  <Wifi className="h-4 w-4 text-green-500" />
                  {connectionStatus === "connected" && (
                    <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  )}
                </div>
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {connectionStatus === "connected"
                  ? "Live Updates"
                  : connectionStatus === "connecting"
                  ? "Connecting..."
                  : "Disconnected"}
              </span>
            </div>
            {updateCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Activity className="h-3 w-3 text-blue-400" />
                <span>{updateCount} updates</span>
                {lastUpdate && (
                  <span className="hidden sm:inline">• Last update at {lastUpdate.toLocaleTimeString()}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus === "connected" && (
              <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400">
                Real-time
              </Badge>
            )}
            {!isConnected && (
              <Button variant="outline" size="sm" onClick={reconnect} className="text-xs">
                <RefreshCw className="mr-1 h-3 w-3" />
                Reconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Header actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Button size="sm" onClick={handleNewLoadClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Load
          </Button>
          <Button variant="outline" size="sm" onClick={handleFilterClick}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        {/* Quick summary stats */}
        <div className="text-sm text-muted-foreground">
          {filteredAll.length} loads total • {pendingLoads.length} pending • {assignedLoads.length} assigned •{" "}
          {inTransitLoads.length} in transit • {completedLoads.length} completed
        </div>
      </div>

      {/* Tabs for load status categories */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={val => setActiveTab(val)}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">
            All <Badge className="ml-1 bg-primary text-primary-foreground">{filteredAll.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <Badge className="ml-1 bg-yellow-500 text-black">{filteredPending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="assigned">
            Assigned <Badge className="ml-1 bg-blue-500 text-white">{filteredAssigned.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in_transit">
            In Transit <Badge className="ml-1 bg-indigo-500 text-white">{filteredInTransit.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <Badge className="ml-1 bg-green-600 text-white">{filteredCompleted.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab panels with load cards */}
        {[
          { value: "all", list: filteredAll },
          { value: "pending", list: filteredPending },
          { value: "assigned", list: filteredAssigned },
          { value: "in_transit", list: filteredInTransit },
          { value: "completed", list: filteredCompleted }
        ].map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tab.list.map(load => (
                <LoadCard
                  key={load.id}
                  load={load}
                  onClick={() => handleLoadClick(load)}
                />
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

      {/* New Load form dialog */}
      <Dialog open={isFormOpen} onOpenChange={open => !open && setIsFormOpen(false)}>
        <DialogContent className="max-w-3xl">
          <LoadForm orgId={orgId} vehicles={vehicles} onClose={handleFormClose} drivers={drivers} />
        </DialogContent>
      </Dialog>

      {/* Filter dialog */}
      <Dialog open={isFilterOpen} onOpenChange={open => !open && setIsFilterOpen(false)}>
        <DialogContent className="max-w-xs">
          <div className="space-y-4 p-1">
            <div>
              <Label>Status</Label>
              <Select
                onValueChange={value => setFilters(prev => ({ ...prev, status: value }))}
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
                onChange={e => setFilters(prev => ({ ...prev, driverId: e.target.value }))}
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
                onChange={e => setFilters(prev => ({ ...prev, origin: e.target.value }))}
                placeholder="City name"
              />
            </div>
            <div>
              <Label>Destination City</Label>
              <Input
                className="mt-1"
                value={filters.destination}
                onChange={e => setFilters(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="City name"
              />
            </div>
            <div>
              <Label>Date Range</Label>
              <select
                className="mt-1 w-full rounded border bg-transparent px-2 py-1 text-sm"
                value={filters.dateRange}
                onChange={e => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <option value="recent">Last 30 days</option>
                <option value="">Any time</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button type="button" size="sm" onClick={applyFilters}>
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Details dialog - only render if a load is selected */}
      {selectedLoad && (
        <LoadDetailsDialog
          load={selectedLoad}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          drivers={drivers}
          vehicles={vehicles}
          orgid={orgId}
        />
      )}
    </div>
  );
}
