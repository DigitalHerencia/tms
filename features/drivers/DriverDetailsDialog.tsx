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
  BarChart3,
  User,
} from 'lucide-react';
import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
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
import type { Driver } from '@/types/drivers';


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
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'on_leave':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'assigned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_transit':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
      <DialogOverlay className="fixed inset-0 z-50 bg-neutral-900 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-neutral-900 backdrop-blur-xl border border-white/10 mx-auto my-8 shadow-2xl">
        <DialogHeader className="space-y-4 px-6 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
                  {getInitials(driver.firstName, driver.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold text-white">
                  {driver.firstName} {driver.lastName}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  {driver.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {driver.email}
                    </span>
                  )}
                  {driver.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {driver.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(driver.status)}>
                {driver.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <Button variant="default" asChild className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Link href={`/${orgId}/drivers/${driver.id}`}>
                <BarChart3 className="h-4 w-4" />
                View Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex items-center gap-2 border-blue-500 text-blue-400 hover:bg-blue-500/10">
              <Link href={`/${orgId}/drivers/${driver.id}/edit`}>
                <Edit className="h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-black border border-white/20 grid w-full grid-cols-3 justify-between rounded-lg p-1 mb-6">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70 font-medium rounded-md"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="loads"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70 font-medium rounded-md"
              >
                Loads
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70 font-medium rounded-md"
              >
                Documents
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="bg-black border border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {driver.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="text-white/70 h-4 w-4" />
                          <span className="text-white">{driver.email}</span>
                        </div>
                      )}
                      {driver.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="text-white/70 h-4 w-4" />
                          <span className="text-white">{driver.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black border border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white">Employment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {driver.hireDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="text-white/70 h-4 w-4" />
                          <span className="text-white">Hire Date: {formatDate(driver.hireDate)}</span>
                        </div>
                      )}
                      {driver.terminationDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="text-white/70 h-4 w-4" />
                        <span>
                          Termination Date: {formatDate(driver.terminationDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black border border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">License Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {driver.cdlNumber && (
                      <div className="flex items-center gap-2">
                        <FileText className="text-white/70 h-4 w-4" />
                        <span className="text-white">
                          License: {driver.cdlNumber} ({driver.licenseState}
                          )
                        </span>
                      </div>
                    )}
                    {driver.licenseExpiration && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-white/70 h-4 w-4" />
                        <span className="text-white">
                          Expiration: {formatDate(driver.licenseExpiration)}
                          {isLicenseExpiringSoon && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
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

              <Card className="bg-black border border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {driver.medicalCardExpiration && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-white/70 h-4 w-4" />
                        <span className="text-white">
                          Medical Card Expiration:{' '}
                          {formatDate(driver.medicalCardExpiration)}
                          {isMedicalCardExpiringSoon && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
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
                <Card className="md:col-span-2 bg-black border border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white">{driver.notes}</p>
                  </CardContent>
                </Card>
              )}
              </div>
            </TabsContent>

          <TabsContent value="loads" className="mt-6 space-y-6">
            <Card className="bg-black border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Loads</CardTitle>
                <CardDescription className="text-white/70">
                  Recent and upcoming loads assigned to this driver
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentLoads.length > 0 ? (
                  <div className="space-y-4">
                    {recentLoads.map(load => (
                      <div key={load.id} className="rounded-md border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-white">
                              {load.referenceNumber}
                            </div>
                            <div className="text-white/70 text-sm">
                              {formatDate(load.pickupDate)} -{' '}
                              {formatDate(load.deliveryDate)}
                            </div>
                          </div>
                          <Badge className={getLoadStatusColor(load.status)}>
                            {load.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <MapPin className="text-white/70 h-4 w-4" />
                          <span className="text-white">
                            {load.originCity}, {load.originState} to{' '}
                            {load.destinationCity}, {load.destinationState}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/70 py-8 text-center">
                    <Truck className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p>No recent loads found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-6 space-y-6">
            <Card className="bg-black border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Driver Documents</CardTitle>
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
        </div>

        <DialogFooter className="flex items-center justify-between pt-4 border-t border-white/10 px-6 pb-6">
          <div className="flex gap-2">
            {driver.status === 'available' && (
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate('inactive')}
                disabled={isUpdatingStatus}
              >
                Mark Inactive
              </Button>
            )}
            {driver.status === 'inactive' && (
              <Button
                variant="default"
                onClick={() => handleStatusUpdate('active')}
                disabled={isUpdatingStatus}
                className="bg-green-600 hover:bg-green-700"
              >
                Mark Active
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link href={`/${orgId}/drivers/${driver.id}`}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Full Dashboard
              </Link>
            </Button>
            <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/10">
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
