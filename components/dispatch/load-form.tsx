"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { createDispatchLoadAction, updateDispatchLoadAction } from "@/lib/actions/dispatchActions";
import { AddressFields } from "@/components/shared/AddressFields";
import { ContactFields } from "@/components/shared/ContactFields";

interface DriverOption {
  id: string;
  firstName: string;
  lastName: string;
}
interface VehicleOption {
  id: string;
  unitNumber: string;
  type: string;
}
interface LoadFormProps {
  orgId: string;
  load?: any;
  loadId?: string;
  drivers: DriverOption[];
  vehicles: VehicleOption[];
  onClose?: () => void;
}

export function LoadForm({ orgId, load, loadId, drivers, vehicles, onClose }: LoadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tractors = vehicles.filter((v) => v.type === "tractor");
  const trailers = vehicles.filter((v) => v.type === "trailer");

  // Pre-fill fields for edit mode
  const originValues = load
    ? {
        address: load.originAddress || "",
        city: load.originCity || "",
        state: load.originState || "",
        zip: load.originZip || "",
      }
    : { address: "", city: "", state: "", zip: "" };

  const destinationValues = load
    ? {
        address: load.destinationAddress || "",
        city: load.destinationCity || "",
        state: load.destinationState || "",
        zip: load.destinationZip || "",
      }
    : { address: "", city: "", state: "", zip: "" };

  const contactValues = load
    ? {
        customerContact: load.customer?.contactName || "",
        customerPhone: load.customer?.phone || "",
        customerEmail: load.customer?.email || "",
      }
    : { customerContact: "", customerPhone: "", customerEmail: "" };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    // DB schema field mapping
    if (formData.has("referenceNumber")) {
      formData.set("load_number", formData.get("referenceNumber") as string);
      formData.delete("referenceNumber");
    }
    if (formData.has("driverId")) {
      formData.set("driver_id", formData.get("driverId") as string);
      formData.delete("driverId");
    }
    if (formData.has("vehicleId")) {
      formData.set("vehicle_id", formData.get("vehicleId") as string);
      formData.delete("vehicleId");
    }
    if (formData.has("trailerId")) {
      formData.set("trailer_id", formData.get("trailerId") as string);
      formData.delete("trailerId");
    }

    try {
      let result;
      if (load && (load.id || loadId)) {
        result = await updateDispatchLoadAction(orgId, load.id || loadId, formData);
        if (result.success) {
          toast({ title: "Load updated", description: "Load details updated successfully." });
          onClose ? onClose() : router.push(`./`);
        } else {
          toast({
            title: "Update failed",
            description: result.error || "Could not update load.",
            variant: "destructive",
          });
        }
      } else {
        result = await createDispatchLoadAction(orgId, formData);
        if (result.success) {
          toast({ title: "Load created", description: "New load has been created." });
          onClose ? onClose() : router.push(`../`);
        } else {
          toast({
            title: "Creation failed",
            description: result.error || "Could not create load.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting load form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl border border-gray-700 bg-neutral-900 text-gray-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{load ? "Edit Load" : "Create New Load"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black border border-gray-700">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
              <TabsTrigger value="details">Additional Details</TabsTrigger>
            </TabsList>

            {/* Basic Info tab */}
            <TabsContent value="basic" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    name="referenceNumber"
                    defaultValue={load?.loadNumber || load?.referenceNumber || ""}
                    placeholder="e.g., L-1001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={load?.status || "pending"}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customer.name"
                  defaultValue={load?.customer?.name || ""}
                  placeholder="Customer or Company"
                  required
                />
              </div>
              <ContactFields values={contactValues} />
            </TabsContent>

            {/* Locations tab */}
            <TabsContent value="locations" className="mt-4 space-y-4">
              <div className="space-y-4">
                <Card className="bg-neutral-900 border border-gray-700">
                  <CardHeader>
                    <CardTitle>Origin</CardTitle>
                  </CardHeader>
                    <CardContent className="space-y-4">
                      <AddressFields prefix="origin" values={originValues} required />
                      <div className="space-y-2">
                        <Label htmlFor="scheduledPickupDate">Pickup Date & Time</Label>
                        <Input
                          id="scheduledPickupDate"
                          name="scheduledPickupDate"
                          type="datetime-local"
                          defaultValue={
                            load?.scheduledPickupDate
                              ? new Date(load.scheduledPickupDate).toISOString().slice(0, 16)
                              : ""
                          }
                          required
                        />
                      </div>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900 border border-gray-700">
                  <CardHeader>
                    <CardTitle>Destination</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AddressFields prefix="destination" values={destinationValues} required />
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDeliveryDate">Delivery Date & Time</Label>
                      <Input
                        id="scheduledDeliveryDate"
                        name="scheduledDeliveryDate"
                        type="datetime-local"
                        defaultValue={
                          load?.scheduledDeliveryDate
                            ? new Date(load.scheduledDeliveryDate).toISOString().slice(0, 16)
                            : ""
                        }
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Assignment tab */}
            <TabsContent value="assignment" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driverId">Driver</Label>
                <Select name="driverId" defaultValue={load?.driver_id || load?.driver?.id || ""}>
                  <SelectTrigger id="driverId">
                    <SelectValue placeholder="Not Assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not Assigned</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.firstName} {driver.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Tractor</Label>
                <Select name="vehicleId" defaultValue={load?.vehicle_id || load?.vehicle?.id || ""}>
                  <SelectTrigger id="vehicleId">
                    <SelectValue placeholder="Not Assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not Assigned</SelectItem>
                    {tractors.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.unitNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trailerId">Trailer</Label>
                <Select name="trailerId" defaultValue={load?.trailer_id || load?.trailer?.id || ""}>
                  <SelectTrigger id="trailerId">
                    <SelectValue placeholder="Not Assigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not Assigned</SelectItem>
                    {trailers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.unitNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Additional Details tab */}
            <TabsContent value="details" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="commodity">Commodity</Label>
                  <Input
                    id="commodity"
                    name="commodity"
                    defaultValue={load?.commodity || ""}
                    placeholder="e.g., Electronics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    defaultValue={load?.weight || ""}
                    placeholder="e.g., 15000"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate ($ Total)</Label>
                  <Input
                    id="rate"
                    name="rate"
                    type="number"
                    step="0.01"
                    defaultValue={load?.rate || ""}
                    placeholder="e.g., 2500.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lineHaul">Line Haul ($)</Label>
                  <Input
                    id="lineHaul"
                    name="lineHaul"
                    type="number"
                    step="0.01"
                    defaultValue={load?.lineHaul || ""}
                    placeholder="e.g., 2300.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={load?.notes || ""}
                  placeholder="Additional notes or instructions"
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-2">
            {onClose && (
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (load ? "Saving..." : "Creating...") : load ? "Update Load" : "Create Load"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
