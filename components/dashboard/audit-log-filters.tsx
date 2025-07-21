import { Search, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditLogFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  actionFilter: string;
  onActionFilterChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  uniqueActions: string[];
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
  exportDisabled: boolean;
  logsCount: number;
  filteredCount: number;
}

export function AuditLogFilters({
  searchTerm,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  dateRange,
  onDateRangeChange,
  uniqueActions,
  onRefresh,
  onExport,
  isLoading,
  exportDisabled,
  logsCount,
  filteredCount,
}: AuditLogFiltersProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-neutral-800 text-white border-gray-600"
          />
        </div>
        {/* Action Filter */}
        <Select value={actionFilter} onValueChange={onActionFilterChange}>
          <SelectTrigger className="w-[160px] bg-neutral-800 text-white border-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent className="bg-black text-white border-gray-600">
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map(action => (
              <SelectItem key={action} value={action}>{action}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Date Range Filter */}
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[140px] bg-neutral-800 text-white border-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black text-white border-gray-600">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="1d">Last Day</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Results Summary & Actions */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Showing {filteredCount} of {logsCount} audit log entries
        </span>
        <div className="flex gap-2">
          <Button
            className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
            size="sm"
            onClick={onExport}
            disabled={exportDisabled}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </>
  );
}
