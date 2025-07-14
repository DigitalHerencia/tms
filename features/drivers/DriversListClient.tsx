"use client";

import { useState } from 'react';
import { DriverCard } from '@/components/drivers/driver-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Driver } from '@/types/drivers';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DriverDetailsDialog } from '@/features/drivers/DriverDetailsDialog';

interface DriversListClientProps {
  drivers: Driver[];
  orgId: string;
}

export function DriversListClient({ drivers, orgId }: DriversListClientProps) {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailsOpen(true);
  };

  const activeDrivers = drivers.filter((driver) => 
    driver.status === 'available' || driver.status === 'assigned' || driver.status === 'driving' || driver.status === 'on_duty'
  );
  const inactiveDrivers = drivers.filter((driver) => driver.status === 'inactive' || driver.status === 'terminated');

  const filteredDrivers = drivers.filter((driver) =>
    `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredActiveDrivers = activeDrivers.filter((driver) =>
    `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredInactiveDrivers = inactiveDrivers.filter((driver) =>
    `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
          <Input
            type="search"
            placeholder="Search drivers..."
            className="pl-8 w-full bg-black border-muted text-white placeholder:text-white/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="w-full sm:w-auto h-10 sm:h-10 sm:aspect-square border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
          <Filter className="h-4 w-4" />
          <span className="sm:hidden ml-2">Filter</span>
        </Button>
      </div>

      {/* Driver Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black border border-muted">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            All <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30">{filteredDrivers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="active"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Active <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">{filteredActiveDrivers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="inactive"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/70"
          >
            Inactive <Badge className="ml-2 bg-red-500/20 text-red-400 border-red-500/30">{filteredInactiveDrivers.length}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} onClick={() => handleDriverClick(driver)} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActiveDrivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} onClick={() => handleDriverClick(driver)} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInactiveDrivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} onClick={() => handleDriverClick(driver)} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Driver Details Dialog */}
      {selectedDriver && (
        <DriverDetailsDialog
          driver={selectedDriver}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          orgId={orgId}
        />
      )}
    </div>
  );
}
