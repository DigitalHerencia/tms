"use client";

import React, { useState } from 'react';
import type { UserWithRole } from '@/types/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SquareUser } from 'lucide-react';
import { listOrganizationUsers } from '@/lib/fetchers/userFetchers';
import { RoleAssignmentModal } from '@/components/dashboard/role-assignment-modal';
import { Button } from '@/components/ui/button';
import { setClerkUserMetadata } from '@/lib/actions/onboardingActions';
import type { SystemRole } from '@/types/abac';

interface UserTableProps {
  orgId: string;
  Users: UserWithRole[];
  onAssignRole?: (user: UserWithRole) => void;
}

export function UserTable({ orgId }: UserTableProps) {
  const [modalUser, setModalUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithRole[]>([]);

  // Load users from DB on mount
  React.useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const dbUsers = await listOrganizationUsers(orgId);
      setUsers(dbUsers);
      setLoading(false);
    }
    fetchUsers();
  }, [orgId]);

  // Use feature module for mutation logic
  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(true);
    try {
      await setClerkUserMetadata(userId, orgId, newRole as SystemRole);
      const updated = await listOrganizationUsers(orgId);
      setUsers(updated);
      setModalUser(null);
    } catch (err) {
      // Optionally show error toast
      console.error('Failed to update user role:', err);
    }
    setLoading(false);
  };


  return (
    <div className="mt-2">
      <Card className="border border-gray-200 bg-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <SquareUser className="h-5 w-5" />
          User Table
        </CardTitle>
        <CardDescription className="text-gray-400">
          View and manage users in your organization
        </CardDescription>
      </CardHeader>
        <CardContent className="mt-2">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading users...</div>
          ) : (
            <table className="min-w-full bg-neutral-900 border border-gray-200 rounded-md">
              <thead>
                <tr className="bg-neutral-950 text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((User) => (
                  <tr key={User.id} className="border-b border-gray-200 hover:bg-neutral-800">
                    <td className="p-3 text-sm text-gray-300">{User.id}</td>
                    <td className="p-3 text-sm text-white">{User.name}</td>
                    <td className="p-3 text-sm text-blue-500">{User.role}</td>
                    <td className="p-3 text-sm">
                      <Button
                        className="rounded-md bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
                        onClick={() => setModalUser(User)}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      {modalUser && modalUser.id === User.id && (
                        <RoleAssignmentModal
                          userId={User.id}
                          currentRole={User.role}
                          onChange={role => handleRoleChange(User.id, role)}
                          open={true}
                          onOpenChange={open => {
                            if (!open) setModalUser(null);
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


