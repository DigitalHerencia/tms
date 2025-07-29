'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { AnalyticsFilters } from '@/lib/fetchers/analyticsFetchers';
import { Download, FileText, Mail, Settings, Table } from 'lucide-react';
import { useState } from 'react';

interface ExportOptionsProps {
  orgId: string;
  filters: AnalyticsFilters;
  data?: any;
}

interface ScheduledReport {
  id: string;
  name: string;
  format: 'pdf' | 'excel' | 'csv';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  filters: AnalyticsFilters;
  lastSent?: string;
  nextSend: string;
  isActive: boolean;
}

export function ExportOptions({ orgId, filters, data }: ExportOptionsProps) {
  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [scheduleFrequency, setScheduleFrequency] = useState('weekly');
  const [recipients, setRecipients] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const availableMetrics = [
    { id: 'revenue', label: 'Total Revenue', category: 'Financial' },
    { id: 'loads', label: 'Load Count', category: 'Operations' },
    { id: 'miles', label: 'Total Miles', category: 'Operations' },
    { id: 'fuel_costs', label: 'Fuel Costs', category: 'Financial' },
    {
      id: 'driver_performance',
      label: 'Driver Performance',
      category: 'Performance',
    },
    {
      id: 'vehicle_utilization',
      label: 'Vehicle Utilization',
      category: 'Performance',
    },
    {
      id: 'on_time_delivery',
      label: 'On-Time Delivery %',
      category: 'Performance',
    },
    {
      id: 'geographic_analysis',
      label: 'Geographic Analysis',
      category: 'Analysis',
    },
  ];

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/analytics/${orgId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          filters,
          metrics: selectedMetrics.length > 0 ? selectedMetrics : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: `Analytics report exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export analytics report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleReport = async () => {
    try {
      const response = await fetch(`/api/analytics/${orgId}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: reportName,
          description: reportDescription,
          frequency: scheduleFrequency,
          recipients: recipients
            .split(',')
            .map((email) => email.trim())
            .filter(Boolean),
          filters,
          metrics: selectedMetrics,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule report');
      }

      toast({
        title: 'Report scheduled',
        description: `${reportName} has been scheduled for ${scheduleFrequency} delivery`,
      });

      setIsScheduleOpen(false);
      setReportName('');
      setReportDescription('');
      setRecipients('');
    } catch (error) {
      toast({
        title: 'Scheduling failed',
        description: 'Failed to schedule report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId],
    );
  };

  return (
    <div className="flex items-center gap-2">
      {/* Quick Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Quick Export</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('excel')}>
            <Table className="mr-2 h-4 w-4" />
            Export as Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            <Table className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom Report Builder */}
      <Dialog open={isCustomReportOpen} onOpenChange={setIsCustomReportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Custom Report
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Custom Report Builder</DialogTitle>
            <DialogDescription>
              Create a custom analytics report with specific metrics and formatting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Enter report description"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Select Metrics to Include</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                {' '}
                {Object.entries(
                  availableMetrics.reduce(
                    (acc, metric) => {
                      if (!acc[metric.category]) acc[metric.category] = [];
                      acc[metric.category]?.push(metric);
                      return acc;
                    },
                    {} as Record<string, typeof availableMetrics>,
                  ),
                ).map(([category, metrics]) => (
                  <div key={category} className="space-y-2">
                    <div className="font-medium text-sm">{category}</div>
                    {metrics.map((metric) => (
                      <div key={metric.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={metric.id}
                          checked={selectedMetrics.includes(metric.id)}
                          onCheckedChange={() => toggleMetric(metric.id)}
                        />
                        <Label htmlFor={metric.id} className="text-sm font-normal">
                          {metric.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomReportOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleExport('pdf')}
              disabled={selectedMetrics.length === 0 || !reportName.trim()}
            >
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Reports */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Automated Reports</DialogTitle>
            <DialogDescription>
              Set up automated delivery of analytics reports to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="schedule-name">Report Name</Label>
              <Input
                id="schedule-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g., Weekly Performance Report"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Delivery Frequency</Label>
              <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Email Recipients</Label>
              <Input
                id="recipients"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="email1@company.com, email2@company.com"
              />
              <p className="text-xs text-muted-foreground">Separate multiple emails with commas</p>
            </div>

            <div className="space-y-4">
              <Label>Metrics to Include</Label>
              <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto">
                {availableMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`schedule-${metric.id}`}
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={() => toggleMetric(metric.id)}
                    />
                    <Label htmlFor={`schedule-${metric.id}`} className="text-sm font-normal">
                      {metric.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleScheduleReport}
              disabled={!reportName.trim() || !recipients.trim()}
            >
              Schedule Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
