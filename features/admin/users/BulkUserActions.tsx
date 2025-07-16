'use client';

import { useState, useTransition } from 'react';
import { UserPlus, UserCheck, UserX, Users, Mail, Shield, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { inviteUsersAction, activateUsersAction, deactivateUsersAction, exportOrganizationDataAction } from '@/lib/actions/adminActions';

export function BulkUserActions({ orgId }: { orgId: string }) {
  const [isPending, startTransition] = useTransition();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const { toast } = useToast();

  const handleInviteUsers = async (formData: FormData) => {
    startTransition(async () => {
      const result = await inviteUsersAction(orgId, formData);
      if (result.success) {
        toast({
          title: "Success",
          description: "User invitations sent successfully.",
        });
        setInviteOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send invitations.",
          variant: "destructive",
        });
      }
    });
  };

  const handleActivateUsers = async (formData: FormData) => {
    startTransition(async () => {
      const result = await activateUsersAction(orgId, formData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Users activated successfully.",
        });
        setActivateOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to activate users.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDeactivateUsers = async (formData: FormData) => {
    startTransition(async () => {
      const result = await deactivateUsersAction(orgId, formData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Users deactivated successfully.",
        });
        setDeactivateOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to deactivate users.",
          variant: "destructive",
        });
      }
    });
  };

  const handleExportData = async (formData: FormData) => {
    startTransition(async () => {
      const result = await exportOrganizationDataAction(orgId, formData);
      if (result.success && result.data) {
        // Trigger download
        window.open(result.data.downloadUrl, '_blank');
        toast({
          title: "Success",
          description: "Data export initiated. Download will start shortly.",
        });
        setExportOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to export data.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="border-gray-200 bg-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5" />
          Bulk User Actions
        </CardTitle>
        <CardDescription className="text-gray-400">
          Manage multiple users and export organization data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Invite Users */}
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button className="flex h-20 flex-col gap-2 bg-neutral-900 border border-gray-200 text-white">
                <UserPlus className="h-6 w-6 text-blue-500" />
                <span>Invite Users</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Invite New Users
                </DialogTitle>
                <DialogDescription>
                  Send invitations to new users to join your organization.
                </DialogDescription>
              </DialogHeader>
              <form action={handleInviteUsers} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emails">Email Addresses</Label>
                  <Textarea
                    id="emails"
                    name="emails"
                    className="bg-neutral-800 text-white mt-2"
                    placeholder="Enter email addresses separated by commas"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple emails with commas
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Default Role</Label>
                  <Select name="role" defaultValue="driver" required>
                    <SelectTrigger className="bg-neutral-800 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="dispatcher">Dispatcher</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                    type="button"
                    onClick={() => setInviteOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                    type="submit"
                    disabled={isPending}>
                    {isPending ? "Sending..." : "Send Invitations"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Activate Users */}
          <Dialog open={activateOpen} onOpenChange={setActivateOpen}>
            <DialogTrigger asChild>
              <Button className="flex h-20 flex-col gap-2 bg-neutral-900 border border-gray-200 text-white">
                <UserCheck className="h-6 w-6 text-green-500" />
                <span>Activate Users</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Activate Users
                </DialogTitle>
                <DialogDescription>
                  Activate inactive users or specific user accounts.
                </DialogDescription>
              </DialogHeader>
              <form action={handleActivateUsers} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userIds">User IDs (Optional)</Label>
                  <Textarea
                    id="userIds"
                    name="userIds"
                    className="bg-neutral-800 text-white mt-2"
                    placeholder="Enter user IDs separated by commas (leave empty to activate all inactive users)"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to activate all inactive users, or specify user IDs
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                    type="button"
                    onClick={() => setActivateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                    type="submit"
                    disabled={isPending}>
                    {isPending ? "Activating..." : "Activate Users"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Deactivate Users */}
          <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
            <DialogTrigger asChild>
              <Button className="flex h-20 flex-col gap-2 bg-neutral-900 border border-gray-200 text-white">
                <UserX className="h-6 w-6 text-red-500" />
                <span>Deactivate Users</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5" />
                  Deactivate Users
                </DialogTitle>
                <DialogDescription>
                  Deactivate specific user accounts. This action requires user IDs.
                </DialogDescription>
              </DialogHeader>
              <form action={handleDeactivateUsers} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userIds">User IDs</Label>
                  <Textarea
                    id="userIds"
                    name="userIds"
                    className="bg-neutral-800 text-white mt-2"
                    placeholder="Enter user IDs separated by commas"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Specify the IDs of users to deactivate
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-600">
                    <strong>Warning:</strong> Deactivated users will lose access to the system immediately.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                    type="button"
                    onClick={() => setDeactivateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                    type="submit"
                    disabled={isPending}>
                    {isPending ? "Deactivating..." : "Deactivate Users"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Export Data */}
          <Dialog open={exportOpen} onOpenChange={setExportOpen}>
            <DialogTrigger asChild>
              <Button className="flex h-20 flex-col gap-2 bg-neutral-900 border border-gray-200 text-white">
                <Download className="h-6 w-6 text-purple-500" />
                <span>Export Data</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Organization Data
                </DialogTitle>
                <DialogDescription>
                  Export organization data for reporting or backup purposes.
                </DialogDescription>
              </DialogHeader>
              <form action={handleExportData} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exportType">Export Type</Label>
                  <Select name="exportType" defaultValue="full">
                    <SelectTrigger className="bg-neutral-800 text-white">
                      <SelectValue placeholder="Select export type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                      <SelectItem value="full">Complete Organization Data</SelectItem>
                      <SelectItem value="users">Users Only</SelectItem>
                      <SelectItem value="vehicles">Vehicles Only</SelectItem>
                      <SelectItem value="loads">Loads Only</SelectItem>
                      <SelectItem value="audit">Audit Logs Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select name="format" defaultValue="csv">
                    <SelectTrigger className="bg-neutral-800 text-white">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                    type="button"
                    onClick={() => setExportOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                    type="submit"
                    disabled={isPending}>
                    {isPending ? "Exporting..." : "Export Data"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
