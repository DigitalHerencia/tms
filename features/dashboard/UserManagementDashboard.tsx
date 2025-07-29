import { BulkUserActions } from '@/components/dashboard/bulk-user-actions';
import { UserTable } from '@/components/dashboard/user-table';
import type { UserWithRole } from '@/types/dashboard';
import React from 'react';

export default function UserManagementDashboard({
  orgId,
  users,
}: {
  orgId: string;
  users: UserWithRole[];
}) {
  return (
    <div className="space-y-8">
      <BulkUserActions orgId={orgId} />
      <UserTable orgId={orgId} Users={users} />
    </div>
  );
}
