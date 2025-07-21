'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLogTable } from '@/components/dashboard/audit-log-table';
import { AuditLogFilters } from '@/components/dashboard/audit-log-filters';
import { getAuditLogs } from '@/lib/actions/auditLogActions';
import type { AuditLogEntry } from '@/types/dashboard';

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

  // Remove mock data: uniqueActions should be derived from real logs only
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  const refreshLogs = () => {
    startTransition(async () => {
      const result = await getAuditLogs(orgId);
      if (Array.isArray(result)) {
        // Map result to AuditLogEntry shape
        const mappedLogs: AuditLogEntry[] = result.map(log => ({
          ...log,
          userId: log.userId ?? '', // Ensure userId is always a string
          target: log.entityType || '', // or log.entityId or other logic as needed
          createdAt: (log.timestamp instanceof Date ? log.timestamp.toISOString() : log.timestamp), // Ensure string
        }));
        setLogs(mappedLogs);
        applyFilters(mappedLogs);
      }
    });
  };

  const applyFilters = (logsToFilter: AuditLogEntry[] = logs) => {
    let filtered = [...logsToFilter];
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }
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

  // Handlers for filters
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setTimeout(() => applyFilters(), 300);
  };
  const handleActionFilterChange = (value: string) => {
    setActionFilter(value);
    applyFilters();
  };
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    applyFilters();
  };

  // Export logs handler
  const exportLogs = () => {
    // ...existing code...
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
      <Card>
        <CardHeader className="flex flex-row items-baseline justify-between pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            Audit Log Viewer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AuditLogFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            actionFilter={actionFilter}
            onActionFilterChange={handleActionFilterChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            uniqueActions={uniqueActions}
            onRefresh={refreshLogs}
            onExport={exportLogs}
            isLoading={isLoading}
            exportDisabled={filteredLogs.length === 0}
            logsCount={logs.length}
            filteredCount={filteredLogs.length}
          />
        </CardContent>
      </Card>
      <Card className="border-gray-200 bg-black">
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No audit logs found matching your criteria.</p>
            </div>
          ) : (
            <AuditLogTable
              logs={filteredLogs}
              selectedLog={selectedLog}
              setSelectedLog={setSelectedLog}
              getActionBadgeVariant={getActionBadgeVariant}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
