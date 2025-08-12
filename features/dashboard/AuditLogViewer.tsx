'use client';

import { useState } from 'react';
import { AuditLogTable } from '@/components/dashboard/audit-log-table';
import type { AuditLogEntry } from '@/types/dashboard';

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
}

export function AuditLogViewer({ logs }: AuditLogViewerProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const getActionBadgeVariant = (
    action: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined => {
    switch (action.toLowerCase()) {
      case 'delete':
        return 'destructive';
      case 'update':
        return 'secondary';
      case 'create':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <AuditLogTable
      logs={logs}
      selectedLog={selectedLog}
      setSelectedLog={setSelectedLog}
      getActionBadgeVariant={getActionBadgeVariant}
    />
  );
}
