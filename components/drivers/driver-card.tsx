import { Phone, Mail, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils/utils';
import { getDriverDisplayStatus, getDriverStatusColor } from '@/lib/utils/driverStatus';
import type { Driver } from '@/types/drivers';

interface DriverCardProps {
  driver: Driver;
  onClick?: () => void;
}

export function DriverCard({ driver, onClick }: DriverCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Card
      className="rounded-md shadow-md border border-gray-200 bg-black hover:border-blue-500 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-4">
        <Avatar className="h-12 w-12 bg-blue-500/20 text-blue-400">
          <AvatarFallback className="bg-blue-500/20 text-blue-400">
            {getInitials(driver.firstName, driver.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-white">
            {driver.firstName} {driver.lastName}
          </CardTitle>
          <Badge className={getDriverStatusColor(driver.status)}>
            {getDriverDisplayStatus(driver.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          {driver.email && (
            <div className="flex items-center gap-2 text-white/90">
              <Mail className="h-4 w-4 text-blue-400" />
              <span className="text-white">{driver.email}</span>
            </div>
          )}
          {driver.phone && (
            <div className="flex items-center gap-2 text-white/90">
              <Phone className="h-4 w-4 text-blue-400" />
              <span className="text-white">{driver.phone}</span>
            </div>
          )}
          {driver.hireDate && (
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="text-white">Hired: {formatDate(driver.hireDate)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10 pt-3">
        <div className="w-full space-y-1">
          {driver.licenseState && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-white/70">License:</span>
              </div>
              <span className="text-xs font-medium text-white">{driver.licenseState}</span>
            </div>
          )}
          {driver.licenseExpiration && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-white/70">License Exp:</span>
              </div>
              <span className="text-xs font-medium text-white">
                {formatDate(driver.licenseExpiration)}
              </span>
            </div>
          )}
          {driver.medicalCardExpiration && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs text-white/70">Medical Exp:</span>
              </div>
              <span className="text-xs font-medium text-white">
                {formatDate(driver.medicalCardExpiration)}
              </span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
