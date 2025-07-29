import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import type { AuditLogEntry } from '@/types/dashboard';

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
  selectedLog: AuditLogEntry | null;
  setSelectedLog: (log: AuditLogEntry | null) => void;
  getActionBadgeVariant: (action: string) => "default" | "secondary" | "destructive" | "outline" | null | undefined;
}

export function AuditLogViewer({ logs, selectedLog, setSelectedLog, getActionBadgeVariant }: AuditLogViewerProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-neutral-900">
          <tr>
            <th className="text-left p-4 font-medium text-white">Date & Time</th>
            <th className="text-left p-4 font-medium text-white">User</th>
            <th className="text-left p-4 font-medium text-white">Action</th>
            <th className="text-left p-4 font-medium text-white">Target</th>
            <th className="text-left p-4 font-medium w-[100px] text-white">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id} className={`border-b border-gray-700 hover:bg-neutral-800 ${index % 2 === 0 ? 'bg-black' : 'bg-neutral-900'}`}>
              <td className="p-4 font-mono text-sm text-gray-300">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="p-4">
                <code className="text-sm bg-neutral-800 text-gray-300 px-2 py-1 rounded">
                  {log.userId}
                </code>
              </td>
              <td className="p-4">
                <Badge variant={getActionBadgeVariant(log.action)}>
                  {log.action}
                </Badge>
              </td>
              <td className="p-4 text-sm text-gray-300">
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
                    {selectedLog && selectedLog.id === log.id && (
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
  );
}