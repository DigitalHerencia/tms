"use client";

import { useTransition } from "react";
import type { Load } from "@/types/dispatch";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";
import { DispatchBoardUI } from "@/components/dispatch/dispatch-board";
import { useRouter } from "next/navigation";

interface DispatchBoardFeatureProps {
  loads: Load[];
  drivers: Driver[];
  vehicles: Vehicle[];
  orgId: string;
  searchParams?: { 
    tab?: string;
    status?: string;
    driverId?: string;
    origin?: string;
    destination?: string;
    dateRange?: string;
    page?: string;
  };
}

const ITEMS_PER_PAGE = 50;

/**
 * Dispatch board for managing and filtering loads.
 *
 * The board layout reflows from lists to tabs depending on screen width. /* See dispatch-board.png */
 *
 * @param loads - Array of loads to display
 * @param drivers - Available drivers
 * @param vehicles - Available vehicles
 * @param orgId - Organization identifier
 * @param searchParams - Optional query parameters used for filtering
 */
export function DispatchBoardFeature({ loads, drivers, vehicles, orgId, searchParams = {} }: DispatchBoardFeatureProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const currentTab = searchParams.tab || "all";
  const currentPage = parseInt(searchParams.page || "1", 10);
  
  const filters = {
    status: searchParams.status || "",
    driverId: searchParams.driverId || "",
    origin: searchParams.origin || "",
    destination: searchParams.destination || "",
    dateRange: searchParams.dateRange || ""
  };

  // Filter loads based on search params
  const filterLoads = (list: Load[]) => {
    return list.filter(load => {
      if (filters.status && load.status !== filters.status) return false;
      if (filters.driverId && load.driver?.id !== filters.driverId) return false;
      if (filters.origin && !(load.origin?.city?.toLowerCase() || "").includes(filters.origin.toLowerCase())) return false;
      if (filters.destination && !(load.destination?.city?.toLowerCase() || "").includes(filters.destination.toLowerCase())) return false;
      if (filters.dateRange === "recent") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (new Date(load.pickupDate) < thirtyDaysAgo) return false;
      }
      return true;
    });
  };

  // Filter by status and paginate
  const pendingLoads = loads.filter(load => load.status === "pending");
  const assignedLoads = loads.filter(load => load.status === "assigned");
  const inTransitLoads = loads.filter(load => load.status === "in_transit");
  const completedLoads = loads.filter(load => load.status === "completed");

  const getPagedLoads = (list: Load[]) => {
    const filtered = filterLoads(list);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  };

  const filteredAll = getPagedLoads(loads);
  const filteredPending = getPagedLoads(pendingLoads);
  const filteredAssigned = getPagedLoads(assignedLoads);
  const filteredInTransit = getPagedLoads(inTransitLoads);
  const filteredCompleted = getPagedLoads(completedLoads);

  // Handlers that update URL params instead of state
  const onTabChange = (tab: string) => {
    startTransition(() => {
      router.push(`?tab=${tab}`);
    });
  };

  const onLoadClick = (load: Load) => {
    router.push(`/${orgId}/loads/${load.id}`);
  };

  const onStatusUpdate = async (loadId: string, newStatus: string) => {
    startTransition(async () => {
      await fetch(`/api/loads/${loadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      router.refresh();
    });
  };

  const onFilterChange = (field: string, value: string) => {
    const newParams = new URLSearchParams(searchParams as any);
    if (value) {
      newParams.set(field, value);
    } else {
      newParams.delete(field);
    }
    startTransition(() => {
      router.push(`?${newParams.toString()}`);
    });
  };

  const onResetFilters = () => {
    startTransition(() => {
      router.push('');
    });
  };

  return (
    <div>
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
        currentTab={currentTab}
        filters={filters}
        isPending={isPending}
        onTabChange={onTabChange}
        onLoadClick={onLoadClick}
        onStatusUpdate={onStatusUpdate}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />
    </div>
  );
}

