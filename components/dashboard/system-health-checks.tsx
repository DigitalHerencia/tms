import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import React from 'react';

export function SystemHealthChecks() {
  return (
    <Card className='bg-black border border-gray-200'>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-white" />
          <CardTitle className="text-lg">System Health Checks</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">API Endpoints</p>
              <p className="text-xs text-muted-foreground">All endpoints responding</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Background Jobs</p>
              <p className="text-xs text-muted-foreground">Queue processing normally</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">File Storage</p>
              <p className="text-xs text-muted-foreground">Storage accessible</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Email Service</p>
              <p className="text-xs text-muted-foreground">Sending notifications</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Cache System</p>
              <p className="text-xs text-muted-foreground">Cache hits optimal</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Security</p>
              <p className="text-xs text-muted-foreground">All scans clean</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
