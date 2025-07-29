'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Plus, RefreshCw } from 'lucide-react';

export default function DriversListHeader() {
  const params = useParams();
  const orgId = Array.isArray(params?.orgId) ? params.orgId[0] : params?.orgId;

  let lastUpdated: string | null = null;

  try {
    const summary = JSON.parse(localStorage.getItem('fleetSummary') || '{}');
    lastUpdated = summary?.lastUpdated
      ? new Date(summary.lastUpdated).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;
  } catch {
    lastUpdated = null;
  }

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white">Driver Management</h1>
            <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
          </div>
          <h2 className="text-sm text-white/90 mb-2">
            Manage your fleet drivers with compliance tracking and performance monitoring
          </h2>
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <RefreshCw className="h-3 w-3" />
            <span>Last updated: {lastUpdated || '2 minutes ago'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
          >
            <Link href={`/${orgId}/drivers/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
