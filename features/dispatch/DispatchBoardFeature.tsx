"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";
import { DispatchBoardUI } from "@/components/dispatch/dispatch-board"; 

interface DispatchBoardFeatureProps {
  loads: any[];
  drivers: Driver[];
  vehicles: Vehicle[];
  orgId: string;
}

export function DispatchBoardFeature({ loads, drivers, vehicles, orgId }: DispatchBoardFeatureProps) {
  const router = useRouter();
  const [selectedLoad, setSelectedLoad] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [filters, setFilters] = useState({
    status: "",
    driverId: "",
    origin: "",
    destination: "",
    dateRange: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [viewMode, setViewMode] = useState<"paginated" | "all">("paginated");

  // Tab lists by status
  const pendingLoads = loads.filter(load => load.status === "pending");
  const assignedLoads = loads.filter(load => load.status === "assigned");
  const inTransitLoads = loads.filter(load => load.status === "in_transit");
  const completedLoads = loads.filter(load => load.status === "completed");

  // Filter and paginate
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

  const paginateLoads = (list: any[]) => {
    if (viewMode === "all" || list.length <= itemsPerPage) return list;
    const start = (currentPage - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  // Filtered lists
  const filteredAll = paginateLoads(filterLoads(loads));
  const filteredPending = paginateLoads(filterLoads(pendingLoads));
  const filteredAssigned = paginateLoads(filterLoads(assignedLoads));
  const filteredInTransit = paginateLoads(filterLoads(inTransitLoads));
  const filteredCompleted = paginateLoads(filterLoads(completedLoads));

  // Handlers
  const onTabChange = (tab: string) => setActiveTab(tab);
  const onLoadClick = (load: any) => { setSelectedLoad(load); setIsDetailsOpen(true); };
  const onNewLoadClick = () => setIsFormOpen(true);
  const onFilterClick = () => setIsFilterOpen(true);
  const onFilterChange = (field: string, value: any) => setFilters(prev => ({ ...prev, [field]: value }));
  const onApplyFilters = () => { setIsFilterOpen(false); setActiveTab(activeTab); };
  const onResetFilters = () => setFilters({ status: "", driverId: "", origin: "", destination: "", dateRange: "" });

  return (
    <DispatchBoardUI
      loads={loads}
      drivers={drivers}
      vehicles={vehicles}
      orgId={orgId}
      filteredAll={filteredAll}
      filteredPending={filteredPending}
      filteredAssigned={filteredAssigned}
      filteredInTransit={filteredInTransit}
      filteredCompleted={filteredCompleted}
      isFormOpen={isFormOpen}
      isDetailsOpen={isDetailsOpen}
      isFilterOpen={isFilterOpen}
      activeTab={activeTab}
      filters={filters}
      selectedLoad={selectedLoad}
      onTabChange={onTabChange}
      onLoadClick={onLoadClick}
      onNewLoadClick={onNewLoadClick}
      onFilterClick={onFilterClick}
      onFilterChange={onFilterChange}
      onApplyFilters={onApplyFilters}
      onResetFilters={onResetFilters}
    />
  );
}
