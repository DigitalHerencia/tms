'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function NotificationSettings() {
  const [emailSettings, setEmailSettings] = useState({
    dispatchUpdates: true,
    driverAssignments: true,
    loadCompletions: true,
    maintenanceAlerts: true,
    complianceReminders: true,
    financialReports: true,
    systemUpdates: false,
    marketingNews: false,
  });

  const [smsSettings, setSmsSettings] = useState({
    dispatchUpdates: false,
    driverAssignments: true,
    loadCompletions: false,
    maintenanceAlerts: true,
    complianceReminders: true,
    financialReports: false,
    systemUpdates: false,
    marketingNews: false,
  });

  const [appSettings, setAppSettings] = useState({
    dispatchUpdates: true,
    driverAssignments: true,
    loadCompletions: true,
    maintenanceAlerts: true,
    complianceReminders: true,
    financialReports: true,
    systemUpdates: true,
    marketingNews: false,
  });

  const [contactInfo, setContactInfo] = useState({
    email: 'admin@cjexpress.com',
    phone: '(312) 555-1234',
  });

  const toggleEmailSetting = (setting: string) => {
    setEmailSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const toggleSmsSetting = (setting: string) => {
    setSmsSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const toggleAppSetting = (setting: string) => {
    setAppSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="app">In-App</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-dispatch">Dispatch Updates</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications about changes to dispatch assignments
                </p>
              </div>
              <Switch
                id="email-dispatch"
                checked={emailSettings.dispatchUpdates}
                onCheckedChange={() => toggleEmailSetting('dispatchUpdates')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-driver">Driver Assignments</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications when drivers are assigned to loads
                </p>
              </div>
              <Switch
                id="email-driver"
                checked={emailSettings.driverAssignments}
                onCheckedChange={() => toggleEmailSetting('driverAssignments')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-load">Load Completions</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications when loads are completed
                </p>
              </div>
              <Switch
                id="email-load"
                checked={emailSettings.loadCompletions}
                onCheckedChange={() => toggleEmailSetting('loadCompletions')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-maintenance">Maintenance Alerts</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications about vehicle maintenance issues
                </p>
              </div>
              <Switch
                id="email-maintenance"
                checked={emailSettings.maintenanceAlerts}
                onCheckedChange={() => toggleEmailSetting('maintenanceAlerts')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-compliance">Compliance Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Receive reminders about upcoming compliance deadlines
                </p>
              </div>
              <Switch
                id="email-compliance"
                checked={emailSettings.complianceReminders}
                onCheckedChange={() => toggleEmailSetting('complianceReminders')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-financial">Financial Reports</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications about financial reports
                </p>
              </div>
              <Switch
                id="email-financial"
                checked={emailSettings.financialReports}
                onCheckedChange={() => toggleEmailSetting('financialReports')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-system">System Updates</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications about system updates and maintenance
                </p>
              </div>
              <Switch
                id="email-system"
                checked={emailSettings.systemUpdates}
                onCheckedChange={() => toggleEmailSetting('systemUpdates')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing">Marketing & News</Label>
                <p className="text-muted-foreground text-sm">
                  Receive marketing emails and industry news
                </p>
              </div>
              <Switch
                id="email-marketing"
                checked={emailSettings.marketingNews}
                onCheckedChange={() => toggleEmailSetting('marketingNews')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-address">Email Address</Label>
            <Input
              id="email-address"
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleContactInfoChange('email', e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              This is the email address where you'll receive notifications.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-dispatch">Dispatch Updates</Label>
                <p className="text-muted-foreground text-sm">
                  Receive SMS notifications about changes to dispatch assignments
                </p>
              </div>
              <Switch
                id="sms-dispatch"
                checked={smsSettings.dispatchUpdates}
                onCheckedChange={() => toggleSmsSetting('dispatchUpdates')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-driver">Driver Assignments</Label>
                <p className="text-muted-foreground text-sm">
                  Receive SMS notifications when drivers are assigned to loads
                </p>
              </div>
              <Switch
                id="sms-driver"
                checked={smsSettings.driverAssignments}
                onCheckedChange={() => toggleSmsSetting('driverAssignments')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-maintenance">Maintenance Alerts</Label>
                <p className="text-muted-foreground text-sm">
                  Receive SMS notifications about vehicle maintenance issues
                </p>
              </div>
              <Switch
                id="sms-maintenance"
                checked={smsSettings.maintenanceAlerts}
                onCheckedChange={() => toggleSmsSetting('maintenanceAlerts')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-compliance">Compliance Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Receive SMS reminders about upcoming compliance deadlines
                </p>
              </div>
              <Switch
                id="sms-compliance"
                checked={smsSettings.complianceReminders}
                onCheckedChange={() => toggleSmsSetting('complianceReminders')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input
              id="phone-number"
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => handleContactInfoChange('phone', e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              This is the phone number where you'll receive SMS notifications.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="app" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-dispatch">Dispatch Updates</Label>
                <p className="text-muted-foreground text-sm">
                  Receive in-app notifications about changes to dispatch assignments
                </p>
              </div>
              <Switch
                id="app-dispatch"
                checked={appSettings.dispatchUpdates}
                onCheckedChange={() => toggleAppSetting('dispatchUpdates')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-driver">Driver Assignments</Label>
                <p className="text-muted-foreground text-sm">
                  Receive in-app notifications when drivers are assigned to loads
                </p>
              </div>
              <Switch
                id="app-driver"
                checked={appSettings.driverAssignments}
                onCheckedChange={() => toggleAppSetting('driverAssignments')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-load">Load Completions</Label>
                <p className="text-muted-foreground text-sm">
                  Receive in-app notifications when loads are completed
                </p>
              </div>
              <Switch
                id="app-load"
                checked={appSettings.loadCompletions}
                onCheckedChange={() => toggleAppSetting('loadCompletions')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-maintenance">Maintenance Alerts</Label>
                <p className="text-muted-foreground text-sm">
                  Receive in-app notifications about vehicle maintenance issues
                </p>
              </div>
              <Switch
                id="app-maintenance"
                checked={appSettings.maintenanceAlerts}
                onCheckedChange={() => toggleAppSetting('maintenanceAlerts')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-compliance">Compliance Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Receive in-app reminders about upcoming compliance deadlines
                </p>
              </div>
              <Switch
                id="app-compliance"
                checked={appSettings.complianceReminders}
                onCheckedChange={() => toggleAppSetting('complianceReminders')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="app-system">System Updates</Label>
                <p className="text-muted-foreground text-sm">
                  Receive in-app notifications about system updates and maintenance
                </p>
              </div>
              <Switch
                id="app-system"
                checked={appSettings.systemUpdates}
                onCheckedChange={() => toggleAppSetting('systemUpdates')}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
