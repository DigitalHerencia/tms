'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function HosLogViewer() {
  const [date, setDate] = useState<Date>(new Date());
  const [driver, setDriver] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hours of Service Logs</h2>
          <p className="text-muted-foreground">View and manage driver hours of service records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Log Selection</CardTitle>
            <CardDescription>Select driver and date to view logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Driver</label>
              <Select value={driver} onValueChange={setDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="maria">Maria Garcia</SelectItem>
                  <SelectItem value="robert">Robert Johnson</SelectItem>
                  <SelectItem value="sarah">Sarah Williams</SelectItem>
                  <SelectItem value="michael">Michael Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar selected={date} onSelect={(date) => date && setDate(date)} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous Day
              </Button>
              <Button variant="outline" size="sm">
                Next Day
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:w-2/3">
          <CardHeader>
            <CardTitle>Driver's Daily Log</CardTitle>
            <CardDescription>
              {driver === 'all' ? 'All Drivers' : driver.charAt(0).toUpperCase() + driver.slice(1)}{' '}
              - {format(date, 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="graph">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="graph">Graph</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="graph" className="pt-4">
                <div className="flex h-[300px] items-center justify-center rounded-md border p-4">
                  <div className="text-muted-foreground text-center">
                    <p>HOS Graph Visualization</p>
                    <p className="text-sm">
                      Shows driving, on-duty, off-duty, and sleeper berth time
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="events" className="pt-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="p-2 text-left text-sm font-medium">Time</th>
                        <th className="p-2 text-left text-sm font-medium">Status</th>
                        <th className="p-2 text-left text-sm font-medium">Location</th>
                        <th className="p-2 text-left text-sm font-medium">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 text-sm">00:00</td>
                        <td className="p-2 text-sm">Off Duty</td>
                        <td className="p-2 text-sm">Chicago, IL</td>
                        <td className="p-2 text-sm">End of day</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 text-sm">06:30</td>
                        <td className="p-2 text-sm">On Duty</td>
                        <td className="p-2 text-sm">Chicago, IL</td>
                        <td className="p-2 text-sm">Pre-trip inspection</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 text-sm">07:00</td>
                        <td className="p-2 text-sm">Driving</td>
                        <td className="p-2 text-sm">Chicago, IL</td>
                        <td className="p-2 text-sm">En route to delivery</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 text-sm">11:30</td>
                        <td className="p-2 text-sm">On Duty</td>
                        <td className="p-2 text-sm">Milwaukee, WI</td>
                        <td className="p-2 text-sm">Loading/Unloading</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-sm">12:30</td>
                        <td className="p-2 text-sm">Driving</td>
                        <td className="p-2 text-sm">Milwaukee, WI</td>
                        <td className="p-2 text-sm">Return trip</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Driving Time</p>
                      <p className="text-2xl font-bold">5:30</p>
                      <p className="text-muted-foreground text-xs">Available: 5:30</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">On Duty Time</p>
                      <p className="text-2xl font-bold">8:00</p>
                      <p className="text-muted-foreground text-xs">Available: 6:00</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Off Duty Time</p>
                      <p className="text-2xl font-bold">14:00</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Sleeper Berth</p>
                      <p className="text-2xl font-bold">2:00</p>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <p className="text-sm font-medium">Cycle Summary</p>
                    <p className="text-muted-foreground mt-1 text-xs">70-hour/8-day rule</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Hours used in last 8 days:</span>
                        <span className="font-medium">58:30</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Hours available tomorrow:</span>
                        <span className="font-medium">11:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
