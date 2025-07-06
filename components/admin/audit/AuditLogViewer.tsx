"use client";

import { useState, useTransition, useEffect } from "react";
import { Search, Filter, Eye, Download, RefreshCw, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getAuditLogs } from "@/lib/fetchers/adminFetchers";
import type { AuditLogEntry } from "@/types/admin";

interface AuditLogViewerProps {
  orgId: string;
  initialLogs?: AuditLogEntry[];
}

export function AuditLogViewer({ orgId, initialLogs = [] }: AuditLogViewerProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [isLoading, startTransition] = useTransition();
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  const { toast } = useToast();

  // Get unique actions for filter dropdown
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  const refreshLogs = () => {
    startTransition(async () => {
      try {
        const filters = {
          action: actionFilter !== "all" ? actionFilter : undefined,
          dateRange: dateRange !== "all" ? dateRange : undefined,
          searchTerm: searchTerm || undefined,
        };
        const newLogs = await getAuditLogs(orgId, filters);
        setLogs(newLogs);
        setFilteredLogs(newLogs);
      } catch (error) {
        toast({
          title: "Failed to refresh logs",
          description: "Could not load audit logs. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const applyFilters = (logsToFilter: AuditLogEntry[] = logs) => {
    let filtered = logsToFilter;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.target.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply action filter
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const daysAgo = parseInt(dateRange.replace("d", ""));
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((log) => new Date(log.createdAt) >= cutoffDate);
    }

    setFilteredLogs(filtered);
  };

  // Apply filters when search term or filters change
  useEffect(() => {
    let filtered = logs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.target.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply action filter
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const daysAgo = parseInt(dateRange.replace("d", ""));
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((log) => new Date(log.createdAt) >= cutoffDate);
    }

    setFilteredLogs(filtered);
  }, [searchTerm, actionFilter, dateRange, logs]);

  const getActionBadge = (action: string) => {
    const actionColors = {
      create: "bg-green-100 text-green-800",
      update: "bg-blue-100 text-blue-800",
      delete: "bg-red-100 text-red-800",
      invite: "bg-purple-100 text-purple-800",
      login: "bg-gray-100 text-gray-800",
      logout: "bg-gray-100 text-gray-800",
    };

    const colorClass =
      actionColors[action as keyof typeof actionColors] || "bg-gray-100 text-gray-800";

    return (
      <Badge variant="outline" className={colorClass}>
        {action.replace("_", " ")}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const exportLogs = () => {
    const csvContent = [
      ["Date", "User", "Action", "Target", "Type", "IP Address"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.createdAt,
          log.userEmail,
          log.action,
          log.target,
          log.targetType,
          log.ipAddress || "N/A",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
          <p className="text-gray-400">Track all administrative actions and system events</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={exportLogs}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshLogs}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Activity Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Action</TableHead>
                <TableHead className="text-gray-300">Target</TableHead>
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">IP Address</TableHead>
                <TableHead className="text-gray-300">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-gray-700">
                  <TableCell className="text-gray-300">{formatDate(log.createdAt)}</TableCell>
                  <TableCell className="text-gray-300">{log.userEmail}</TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell className="text-gray-300">{log.target}</TableCell>
                  <TableCell className="text-gray-300">{log.targetType}</TableCell>
                  <TableCell className="text-gray-300">{log.ipAddress || "N/A"}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Audit Log Details</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Detailed information about this audit log entry
                          </DialogDescription>
                        </DialogHeader>
                        {selectedLog && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-300">Date</label>
                                <p className="text-white">{formatDate(selectedLog.createdAt)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-300">User</label>
                                <p className="text-white">{selectedLog.userEmail}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-300">Action</label>
                                <p className="text-white">{selectedLog.action}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-300">Target</label>
                                <p className="text-white">{selectedLog.target}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-300">Type</label>
                                <p className="text-white">{selectedLog.targetType}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-300">
                                  IP Address
                                </label>
                                <p className="text-white">{selectedLog.ipAddress || "N/A"}</p>
                              </div>
                            </div>
                            {selectedLog.metadata &&
                              Object.keys(selectedLog.metadata).length > 0 && (
                                <div>
                                  <label className="text-sm font-medium text-gray-300">
                                    Metadata
                                  </label>
                                  <pre className="mt-1 text-sm text-gray-300 bg-gray-800 p-2 rounded">
                                    {JSON.stringify(selectedLog.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
