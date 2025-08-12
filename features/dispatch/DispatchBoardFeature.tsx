'use client';

import { useState, useTransition, useMemo } from 'react';
import type { Load, LoadStatus } from '@/types/dispatch';
import type { Driver } from '@/types/drivers';
import type { Vehicle } from '@/types/vehicles';
import { DispatchBoardUI } from '@/components/dispatch/dispatch-board';
import { DriverMap } from '@/components/dispatch/driver-map';
import { useRouter } from 'next/navigation';
import { useDispatchRealtime } from '@/hooks/use-dispatch-realtime';
import { updateLoadStatusAction } from '@/lib/actions/dispatchActions';

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
  };
}

const ITEMS_PER_PAGE = 50;

/**
 * Dispatch board for managing and filtering loads.
 *
 * The board layout reflows from lists to tabs depending on screen width.
 *
 * @param loads - Array of loads to display
 * @param drivers - Available drivers
 * @param vehicles - Available vehicles
 * @param orgId - Organization identifier
 * @param searchParams - Optional query parameters used for filtering
 *
 **/

export function DispatchBoardFeature({
  loads,
  drivers,
  vehicles,
  orgId,
  searchParams = {},
}: DispatchBoardFeatureProps) {
  const router = useRouter();
  const [loadList, setLoadList] = useState(loads);
  const { connectionStatus } = useDispatchRealtime({
    orgId,
    onUpdate: (update) => {
      if (!update.data) return;
      setLoadList((prev) => {
        const { loadId, load, newStatus } = update.data!;
        if (update.type === 'load_deleted') {
          return prev.filter((l) => l.id !== loadId);
        }
        if (update.type === 'new_load' && load) {
          return [load as Load, ...prev];
        }
        return prev.map((l) =>
          l.id === loadId ? { ...l, ...load, status: (newStatus as LoadStatus) ?? l.status } : l,
        );
      });
    },
  });
  const [isPending, startTransition] = useTransition();

  const currentTab = searchParams.tab || 'all';
  const currentPage = parseInt(searchParams.page || '1', 10);

  const filters = {
    status: searchParams.status || '',
    driverId: searchParams.driverId || '',
    origin: searchParams.origin || '',
    destination: searchParams.destination || '',
    dateRange: searchParams.dateRange || '',
  };

  // Filter loads once and group by status
  const filteredGroups = useMemo(() => {
    const filtered = loadList.filter((load) => {
      if (filters.status && load.status !== filters.status) return false;
      if (filters.driverId && load.driver?.id !== filters.driverId) return false;
      if (
        filters.origin &&
        !(load.origin?.city?.toLowerCase() || '').includes(filters.origin.toLowerCase())
      )
        return false;
      if (
        filters.destination &&
        !(load.destination?.city?.toLowerCase() || '').includes(filters.destination.toLowerCase())
      )
        return false;
      if (filters.dateRange === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (new Date(load.pickupDate) < thirtyDaysAgo) return false;
      }
      return true;
    });
    const groups: Record<string, Load[]> = {
      all: [],
      pending: [],
      assigned: [],
      in_transit: [],
      completed: [],
    };
    filtered.forEach((load) => {
      groups.all.push(load);
      groups[load.status]?.push(load);
    });
    return groups;
  }, [loadList, filters]);

  const getPagedLoads = (list: Load[]) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  };

  const filteredAll = getPagedLoads(filteredGroups.all);
  const filteredPending = getPagedLoads(filteredGroups.pending);
  const filteredAssigned = getPagedLoads(filteredGroups.assigned);
  const filteredInTransit = getPagedLoads(filteredGroups.in_transit);
  const filteredCompleted = getPagedLoads(filteredGroups.completed);
  const totalPages = Math.max(
    1,
    Math.ceil(
      (filteredGroups[currentTab as keyof typeof filteredGroups]?.length || 0) /
        ITEMS_PER_PAGE,
    ),
  );

  // Handlers that update URL params instead of state
  const onTabChange = (tab: string) => {
    startTransition(() => {
      router.push(`?tab=${tab}`);
    });
  };

  const onLoadClick = (load: Load) => {
    router.push(`/${orgId}/dispatch/loads/${load.id}/edit`);
  };

  const onStatusUpdate = async (loadId: string, newStatus: LoadStatus) => {
    startTransition(async () => {
      await updateLoadStatusAction(orgId, loadId, newStatus);
      setLoadList((prev) =>
        prev.map((l) => (l.id === loadId ? { ...l, status: newStatus } : l)),
      );
    });
  };

  const onFilterChange = (field: string, value: string) => {
    const newParams = new URLSearchParams(searchParams as Record<string, string>);
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

  const onPageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams as Record<string, string>);
    newParams.set('page', String(page));
    startTransition(() => {
      router.push(`?${newParams.toString()}`);
    });
  };

  return (
    <div>
      <div className="mb-4">
        <DriverMap drivers={drivers} />
        <p className="mt-2 text-xs text-gray-500">Realtime: {connectionStatus}</p>
      </div>
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
        currentPage={currentPage}
        totalPages={totalPages}
        filters={filters}
        isPending={isPending}
        onTabChange={onTabChange}
        onLoadClick={onLoadClick}
        onStatusUpdate={onStatusUpdate}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        onPageChange={onPageChange}
      />
    </div>
  );
}
