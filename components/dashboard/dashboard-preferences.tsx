'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, RotateCcw } from 'lucide-react';
import { useDashboardPreferences } from '@/hooks/useDashboardPreferences';

export function DashboardPreferences() {
  const { preferences, updatePreferences, resetPreferences } = useDashboardPreferences();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-4 w-4 mr-2" />
        Preferences
      </Button>
    );
  }

  return (
    <Card className="w-80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Dashboard Preferences</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          ×
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Widget Visibility */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Show Widgets</Label>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="show-kpis" className="text-sm">KPI Cards</Label>
            <Switch
              id="show-kpis"
              checked={preferences.showKPIs}
              onCheckedChange={(checked) => updatePreferences({ showKPIs: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-actions" className="text-sm">Quick Actions</Label>
            <Switch
              id="show-actions"
              checked={preferences.showQuickActions}
              onCheckedChange={(checked) => updatePreferences({ showQuickActions: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-activity" className="text-sm">Recent Activity</Label>
            <Switch
              id="show-activity"
              checked={preferences.showRecentActivity}
              onCheckedChange={(checked) => updatePreferences({ showRecentActivity: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-alerts" className="text-sm">Compliance Alerts</Label>
            <Switch
              id="show-alerts"
              checked={preferences.showAlerts}
              onCheckedChange={(checked) => updatePreferences({ showAlerts: checked })}
            />
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Theme</Label>
          <Select
            value={preferences.theme}
            onValueChange={(value: 'light' | 'dark' | 'system') => 
              updatePreferences({ theme: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refresh Interval */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Auto Refresh</Label>
          <Select
            value={preferences.refreshInterval.toString()}
            onValueChange={(value) => 
              updatePreferences({ refreshInterval: parseInt(value) })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 minute</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="0">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetPreferences}
          className="w-full"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
}