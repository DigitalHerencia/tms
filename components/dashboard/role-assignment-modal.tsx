'use client';

import React, { useState, useTransition } from 'react';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function RoleAssignmentModal({
  userId,
  currentRole,
  onChange,
  open,
  onOpenChange,
}: {
  userId: string;
  currentRole: string;
  onChange: (userId: string, role: string) => void; // updated signature
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState(currentRole);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      onChange(userId, role); // pass userId and role
      onOpenChange(false);
    });
  };

  return (
    <Card className="border border-gray-200 bg-black">
      <CardContent>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="bg-black sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Set User Role
              </DialogTitle>
              <DialogDescription>Assign a new role to this user.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" value={role} onValueChange={setRole} required>
                  <SelectTrigger className="bg-neutral-800 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white">
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="dispatcher">Dispatcher</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? 'Saving...' : 'Save Role'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
