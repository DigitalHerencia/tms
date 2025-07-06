"use client";

import { useState, useTransition } from "react";
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Shield,
  Search,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { SystemRoles } from "@/types/abac";
import type { UserManagementData } from "@/types/admin";
import { updateUserRoleAction } from "@/lib/actions/adminActions";
import { BulkUserActions } from "@/components/admin/BulkUserActions";

interface UserManagementProps {
  orgId: string;
  userData: UserManagementData;
}

export function UserManagement({ orgId, userData }: UserManagementProps) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredUsers = userData.users.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map((user) => user.id),
    );
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    startTransition(async () => {
      const result = await updateUserRoleAction(orgId, userId, newRole);

      if (result.success) {
        toast({
          title: "Role updated",
          description: "User role has been updated successfully.",
        });
      } else {
        toast({
          title: "Failed to update role",
          description: result.error || "Failed to update user role",
          variant: "destructive",
        });
      }
    });
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      [SystemRoles.ADMIN]: "bg-red-100 text-red-800",
      [SystemRoles.DISPATCHER]: "bg-blue-100 text-blue-800",
      [SystemRoles.DRIVER]: "bg-green-100 text-green-800",
      [SystemRoles.COMPLIANCE]: "bg-yellow-100 text-yellow-800",
      [SystemRoles.MEMBER]: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        variant="outline"
        className={roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"}
      >
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="border-red-300 text-red-700">
        Inactive
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-gray-400">
            Manage users, roles, and permissions for your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              /* TODO: Open invite modal */
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Users
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-gray-700 bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{userData.totalUsers}</div>
                <div className="text-sm text-gray-400">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{userData.activeUsers}</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Mail className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{userData.pendingInvitations}</div>
                <div className="text-sm text-gray-400">Pending Invitations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.values(SystemRoles).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Last Login</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-gray-700">
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage || ""} alt={user.displayName} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{user.displayName}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleUpdateRole(user.id, value)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-32 border-none bg-transparent p-0 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(SystemRoles).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                  <TableCell className="text-gray-300">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          View Permissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
