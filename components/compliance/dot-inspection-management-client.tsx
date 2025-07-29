'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  AlertTriangle,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import type { DOTInspection } from '@/types/compliance';

interface DOTInspectionManagementClientProps {
  orgId: string;
  initialInspections: DOTInspection[];
}

const columns: ColumnDef<DOTInspection>[] = [
  {
    accessorKey: 'vehicleUnit',
    header: 'Vehicle',
  },
  {
    accessorKey: 'inspectionType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('inspectionType') as string;
      return (
        <Badge variant="outline">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variants = {
        completed: 'bg-green-100 text-green-800 hover:bg-green-100',
        scheduled: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
        overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
        failed: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
      };
      
      return (
        <Badge className={variants[status as keyof typeof variants]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'scheduledDate',
    header: 'Scheduled Date',
    cell: ({ row }) => {
      return new Date(row.getValue('scheduledDate')).toLocaleDateString();
    },
  },
  {
    accessorKey: 'inspector',
    header: 'Inspector',
  },
  {
    accessorKey: 'violations',
    header: 'Violations',
    cell: ({ row }) => {
      const violations = row.getValue('violations') as number;
      return (
        <div className="flex items-center gap-2">
          {violations > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
          <span>{violations}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => {
      const score = row.getValue('score') as number | undefined;
      if (!score) return <span className="text-muted-foreground">-</span>;
      
      const color = score >= 90 ? 'text-green-600' : score >= 70 ? 'text-yellow-600' : 'text-red-600';
      return <span className={color}>{score}%</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const inspection = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {inspection.reportUrl && (
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              Reschedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DOTInspectionManagementClient({ orgId, initialInspections }: DOTInspectionManagementClientProps) {
  const [inspections] = useState<DOTInspection[]>(initialInspections);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch = 
      inspection.vehicleUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: inspections.length,
    completed: inspections.filter(i => i.status === 'completed').length,
    scheduled: inspections.filter(i => i.status === 'scheduled').length,
    overdue: inspections.filter(i => i.status === 'overdue').length,
    failed: inspections.filter(i => i.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">DOT Inspection Management</h2>
          <p className="text-muted-foreground">
            Manage vehicle inspections and compliance reporting
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Inspection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule New Inspection</DialogTitle>
              <DialogDescription>
                Schedule a new DOT inspection for a vehicle.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trk-001">TRK-001</SelectItem>
                    <SelectItem value="trk-002">TRK-002</SelectItem>
                    <SelectItem value="van-001">VAN-001</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Inspection Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="roadside">Roadside</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Scheduled Date</Label>
                <Input type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inspector">Inspector</Label>
                <Input placeholder="Inspector name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input placeholder="Inspection location" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea placeholder="Additional notes..." />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Schedule Inspection</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inspections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inspections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Records</CardTitle>
          <CardDescription>
            View and manage all vehicle inspections
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredInspections.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No inspection records found.
            </p>
          ) : (
            <DataTable columns={columns} data={filteredInspections} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
