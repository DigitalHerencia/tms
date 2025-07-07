'use client';

import { Phone, Mail, Calendar, FileText } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils/utils';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: string;
  licenseState?: string;
  licenseExpiration?: Date;
  medicalCardExpiration?: Date;
  hireDate?: Date;
}

interface DriverCardProps {
  driver: Driver;
  onClick: () => void;
}

export function DriverCard({ driver, onClick }: DriverCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {getInitials(driver.firstName, driver.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="leading-none font-medium">
            {driver.firstName} {driver.lastName}
          </h3>
          <Badge className={getStatusColor(driver.status)}>
            {driver.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
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
          {driver.hireDate && (
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span>Hired: {formatDate(driver.hireDate)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3">
        <div className="w-full space-y-1">
          {driver.licenseState && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <FileText className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-xs">License:</span>
              </div>
              <span className="text-xs font-medium">{driver.licenseState}</span>
            </div>
          )}
          {driver.licenseExpiration && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-xs">
                  License Exp:
                </span>
              </div>
              <span className="text-xs font-medium">
                {formatDate(driver.licenseExpiration)}
              </span>
            </div>
          )}
          {driver.medicalCardExpiration && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-xs">
                  Medical Exp:
                </span>
              </div>
              <span className="text-xs font-medium">
                {formatDate(driver.medicalCardExpiration)}
              </span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
