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
import { Driver } from '@/types/drivers';

interface DriverCardProps {
  driver: Driver;
  onClick?: () => void;
}

export function DriverCard({ driver, onClick }: DriverCardProps) {
  const getStatusColor = (status: string) => {
    // Map multiple statuses to active/inactive display
    const isActive = ['available', 'assigned', 'driving', 'on_duty'].includes(status);
    const isInactive = ['inactive', 'terminated'].includes(status);
    
    if (isActive) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    } else if (isInactive) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    } else if (status === 'on_leave' || status === 'off_duty') {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    } else {
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDisplayStatus = (status: string) => {
    const isActive = ['available', 'assigned', 'driving', 'on_duty'].includes(status);
    const isInactive = ['inactive', 'terminated'].includes(status);
    
    if (isActive) return 'active';
    if (isInactive) return 'inactive';
    return status.replace('_', ' ');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Card
      className="border-muted rounded-md border bg-black hover:border-blue-500 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <Avatar className="h-12 w-12 bg-blue-500/20 text-blue-400">
          <AvatarFallback className="bg-blue-500/20 text-blue-400">
            {getInitials(driver.firstName, driver.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="leading-none font-medium text-white">
            {driver.firstName} {driver.lastName}
          </h3>
          <Badge className={getStatusColor(driver.status)}>
            {getDisplayStatus(driver.status)}
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
                <span className="text-xs text-white/70">
                  License Exp:
                </span>
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
                <span className="text-xs text-white/70">
                  Medical Exp:
                </span>
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
