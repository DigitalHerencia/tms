"use client";

import { useState } from "react";
import { LoadForm } from "@/components/dispatch/load-form";
import { LoadDetailsDialog } from "@/components/dispatch/load-details-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Driver } from "@/types/drivers";
import type { Vehicle } from "@/types/vehicles";
import type { Load } from "@/types/dispatch";

interface EditLoadFeatureProps {
  orgId: string;
  drivers: Driver[];
  vehicles: Vehicle[];
  load: Load;
  
}

export function EditLoadFeature({ orgId, drivers, vehicles, load }: EditLoadFeatureProps) {
  const [activeTab, setActiveTab] = useState("edit");
  const [filters, setFilters] = useState({
    status: "",
    driverId: "",
    origin: "",
    destination: "",
    dateRange: "",
  });
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleFilterChange = (field: string, value: string) =>
    setFilters(prev => ({ ...prev, [field]: value }));

  const handleApplyFilters = () => { /* implement if showing related/recent loads */ };
  const handleResetFilters = () =>
    setFilters({ status: "", driverId: "", origin: "", destination: "", dateRange: "" });

  return (
    <>
      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="edit">Edit Load</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <LoadForm orgId={orgId} drivers={drivers} vehicles={vehicles} load={load} />
          <Button variant="outline" size="sm" onClick={() => setShowDetailsDialog(true)}>
            View Full Details
          </Button>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <LoadDetailsDialog
            orgid={orgId}
            load={load}
            drivers={drivers}
            vehicles={vehicles}
            isOpen={true}
            onClose={() => setActiveTab("edit")}
          />
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          {/* Same filters UI as before */}
          <div>
            <Label>Status</Label>
            <Select
              onValueChange={value => handleFilterChange("status", value)}
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
              onChange={e => handleFilterChange("driverId", e.target.value)}
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
              onChange={e => handleFilterChange("origin", e.target.value)}
              placeholder="City name"
            />
          </div>
          <div>
            <Label>Destination City</Label>
            <Input
              className="mt-1"
              value={filters.destination}
              onChange={e => handleFilterChange("destination", e.target.value)}
              placeholder="City name"
            />
          </div>
          <div>
            <Label>Date Range</Label>
            <select
              className="mt-1 w-full rounded border bg-transparent px-2 py-1 text-sm"
              value={filters.dateRange}
              onChange={e => handleFilterChange("dateRange", e.target.value)}
            >
              <option value="recent">Last 30 days</option>
              <option value="">Any time</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button type="button" size="sm" onClick={handleApplyFilters}>
              Apply
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Details Dialog (when button is clicked) */}
      {showDetailsDialog && (
        <LoadDetailsDialog
          orgid={orgId}
          load={load}
          drivers={drivers}
          vehicles={vehicles}
          isOpen={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
        />
      )}
    </>
  );
}
