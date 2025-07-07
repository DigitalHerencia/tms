'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  Truck,
  MapPin,
  AlertTriangle,
  Edit,
} from 'lucide-react';
import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils/utils';
import {
  DocumentUpload,
  DocumentListEmpty,
} from '@/components/shared/DocumentUpload';
import { updateDriverStatusAction } from '@/lib/actions/driverActions';
import { toast } from '@/hooks/use-toast';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiration?: Date;
  medicalCardExpiration?: Date;
  hireDate?: Date;
  terminationDate?: Date;
  notes?: string;
}

interface Load {
  id: string;
  referenceNumber: string;
  status: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  pickupDate: Date;
  deliveryDate: Date;
}

interface DriverDetailsDialogProps {
  driver: Driver;
  recentLoads?: Load[];
  isOpen: boolean;
  onClose: () => void;
  orgId: string; // Add orgId for proper links and actions
}

export function DriverDetailsDialog({
  driver,
  recentLoads = [],
  isOpen,
  onClose,
  orgId,
}: DriverDetailsDialogProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    
    try {
      const result = await updateDriverStatusAction(driver.id, {
        status: newStatus as any,
      });

      if (result.success) {
        toast({
          title: 'Status Updated',
          description: `Driver status changed to ${newStatus.replace('_', ' ')}`,
        });
        onClose(); // Close dialog to refresh parent
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update driver status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getLoadStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if any documents are expiring soon (within 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const isLicenseExpiringSoon =
    driver.licenseExpiration &&
    driver.licenseExpiration > today &&
    driver.licenseExpiration < thirtyDaysFromNow;
  const isMedicalCardExpiringSoon =
    driver.medicalCardExpiration &&
    driver.medicalCardExpiration > today &&
    driver.medicalCardExpiration < thirtyDaysFromNow;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Driver Details</DialogTitle>
            <Badge className={getStatusColor(driver.status)}>
              {driver.status.replace('_', ' ')}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-muted/50 grid w-full grid-cols-3 justify-between rounded-lg p-1">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground font-medium data-[state=active]:shadow-sm"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="loads"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground font-medium data-[state=active]:shadow-sm"
            >
              Loads
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground font-medium data-[state=active]:shadow-sm"
            >
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getInitials(driver.firstName, driver.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">
                  {driver.firstName} {driver.lastName}
                </h2>
                <Badge className={getStatusColor(driver.status)}>
                  {driver.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {driver.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="text-muted-foreground h-4 w-4" />
                        <span>{driver.email}</span>
                      </div>
                    )}
                    {driver.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="text-muted-foreground h-4 w-4" />
                        <span>{driver.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Employment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {driver.hireDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span>Hire Date: {formatDate(driver.hireDate)}</span>
                      </div>
                    )}
                    {driver.terminationDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span>
                          Termination Date: {formatDate(driver.terminationDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">License Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {driver.licenseNumber && (
                      <div className="flex items-center gap-2">
                        <FileText className="text-muted-foreground h-4 w-4" />
                        <span>
                          License: {driver.licenseNumber} ({driver.licenseState}
                          )
                        </span>
                      </div>
                    )}
                    {driver.licenseExpiration && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span>
                          Expiration: {formatDate(driver.licenseExpiration)}
                          {isLicenseExpiringSoon && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-yellow-100 text-yellow-800"
                            >
                              Expiring Soon
                            </Badge>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {driver.medicalCardExpiration && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <span>
                          Medical Card Expiration:{' '}
                          {formatDate(driver.medicalCardExpiration)}
                          {isMedicalCardExpiringSoon && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-yellow-100 text-yellow-800"
                            >
                              Expiring Soon
                            </Badge>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {driver.notes && (
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{driver.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="loads" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Loads</CardTitle>
                <CardDescription>
                  Recent and upcoming loads assigned to this driver
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentLoads.length > 0 ? (
                  <div className="space-y-4">
                    {recentLoads.map(load => (
                      <div key={load.id} className="rounded-md border p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">
                              {load.referenceNumber}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {formatDate(load.pickupDate)} -{' '}
                              {formatDate(load.deliveryDate)}
                            </div>
                          </div>
                          <Badge className={getLoadStatusColor(load.status)}>
                            {load.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <MapPin className="text-muted-foreground h-4 w-4" />
                          <span>
                            {load.originCity}, {load.originState} to{' '}
                            {load.destinationCity}, {load.destinationState}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    <Truck className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No recent loads found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Driver Documents</CardTitle>
                <CardDescription>
                  Manage documents related to this driver
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DocumentUpload
                  label="Upload Document"
                  description="Add license, medical card, or other documents"
                />
                <DocumentListEmpty />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/drivers/${driver.id}/edit`}>Edit Driver</Link>
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="flex gap-2">
            {driver.status === 'active' && (
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('inactive')}
                disabled={isUpdatingStatus}
              >
                Mark Inactive
              </Button>
            )}
            {driver.status === 'inactive' && (
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('active')}
                disabled={isUpdatingStatus}
              >
                Mark Active
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
