'use client';

import { useState, useTransition } from 'react';
import { Search, Calendar, Filter, Download, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuditLogsAction } from '@/lib/actions/adminActions';
import type { AuditLogEntry } from '@/types/admin';

interface AuditLogViewerProps {
  orgId: string;
  initialLogs?: AuditLogEntry[];
}

export function AuditLogViewer({ orgId, initialLogs = [] }: AuditLogViewerProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [isLoading, startTransition] = useTransition();
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  // Get unique actions for filter dropdown
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  const refreshLogs = () => {
    startTransition(async () => {
      const result = await getAuditLogsAction(orgId);
      if (result.success && result.data) {
        setLogs(result.data);
        applyFilters(result.data);
      }
    });
  };

  const applyFilters = (logsToFilter: AuditLogEntry[] = logs) => {
    let filtered = [...logsToFilter];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (dateRange) {
        case '1d':
          cutoff.setDate(now.getDate() - 1);
          break;
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoff.setDate(now.getDate() - 30);
          break;
        case '90d':
          cutoff.setDate(now.getDate() - 90);
          break;
      }
      
      filtered = filtered.filter(log => new Date(log.createdAt) >= cutoff);
    }

    setFilteredLogs(filtered);
  };

  // Apply filters when search term or filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setTimeout(() => applyFilters(), 300); // Debounce
  };

  const handleActionFilterChange = (value: string) => {
    setActionFilter(value);
    applyFilters();
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    applyFilters();
  };

  const exportLogs = () => {
    const csvContent = [
      ['Date', 'User', 'Action', 'Target'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.createdAt).toISOString(),
        log.userId,
        log.action,
        log.target
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('CREATE')) return 'default';
    if (action.includes('UPDATE')) return 'secondary';
    if (action.includes('DELETE')) return 'destructive';
    if (action.includes('LOGIN')) return 'outline';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Audit Log Viewer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Action Filter */}
            <Select value={actionFilter} onValueChange={handleActionFilterChange}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1d">Last Day</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshLogs}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                disabled={filteredLogs.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} audit log entries
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No audit logs found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Date & Time</th>
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Action</th>
                    <th className="text-left p-4 font-medium">Target</th>
                    <th className="text-left p-4 font-medium w-[100px]">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={log.id} className={`border-b hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                      <td className="p-4 font-mono text-sm">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {log.userId}
                        </code>
                      </td>
                      <td className="p-4">
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">
                        {log.target}
                      </td>
                      <td className="p-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Audit Log Details</DialogTitle>
                            </DialogHeader>
                            {selectedLog && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                                    <p className="mt-1 font-mono text-sm">{new Date(selectedLog.createdAt).toISOString()}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                    <p className="mt-1 font-mono text-sm">{selectedLog.userId}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Action</label>
                                    <p className="mt-1">
                                      <Badge variant={getActionBadgeVariant(selectedLog.action)}>
                                        {selectedLog.action}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Target</label>
                                    <p className="mt-1 text-sm">{selectedLog.target}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Log ID</label>
                                  <p className="mt-1 font-mono text-sm break-all">{selectedLog.id}</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
