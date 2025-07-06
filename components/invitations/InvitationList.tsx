/**
 * Invitation List Component
 *
 * Displays a filterable and paginated list of invitations with management actions.
 */

"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Mail,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { revokeInvitation, resendInvitation } from "@/lib/actions/invitationActions";
import {
  type InvitationDisplay,
  type InvitationStatus,
  InvitationStatus as Status,
  ROLE_DISPLAY_NAMES,
  STATUS_DISPLAY_NAMES,
  ROLE_COLORS,
  STATUS_COLORS,
} from "@/types/invitations";
import { SystemRoles } from "@/types/abac";

interface InvitationListProps {
  organizationId: string;
  invitations: InvitationDisplay[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function InvitationList({
  organizationId,
  invitations,
  total,
  page,
  limit,
  totalPages,
}: InvitationListProps) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { toast } = useToast();
  const router = useRouter();

  const handleRevokeInvitation = (invitationId: string, email: string) => {
    startTransition(async () => {
      try {
        const result = await revokeInvitation(invitationId);
        if (result.success) {
          toast({
            title: "Invitation Revoked",
            description: `Invitation for ${email} has been revoked.`,
          });
          router.refresh();
        } else {
          toast({
            title: "Failed to Revoke",
            description: result.error || "Failed to revoke invitation.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while revoking the invitation.",
          variant: "destructive",
        });
      }
    });
  };

  const handleResendInvitation = (invitationId: string, email: string) => {
    startTransition(async () => {
      try {
        const result = await resendInvitation(invitationId);
        if (result.success) {
          toast({
            title: "Invitation Resent",
            description: `Invitation has been resent to ${email}.`,
          });
        } else {
          toast({
            title: "Failed to Resend",
            description: result.error || "Failed to resend invitation.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while resending the invitation.",
          variant: "destructive",
        });
      }
    });
  };

  const filteredInvitations = invitations.filter((invitation) => {
    const matchesSearch = invitation.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invitation.status === statusFilter;
    const matchesRole = roleFilter === "all" || invitation.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: InvitationStatus) => {
    const colorClass = STATUS_COLORS[status];
    return (
      <Badge variant="outline" className={colorClass}>
        {STATUS_DISPLAY_NAMES[status]}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colorClass = ROLE_COLORS[role as keyof typeof ROLE_COLORS];
    return (
      <Badge variant="outline" className={colorClass}>
        {ROLE_DISPLAY_NAMES[role as keyof typeof ROLE_DISPLAY_NAMES]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Invitations ({total})</CardTitle>
          <div className="flex gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={Status.PENDING}>Pending</SelectItem>
                <SelectItem value={Status.ACCEPTED}>Accepted</SelectItem>
                <SelectItem value={Status.REVOKED}>Revoked</SelectItem>
                <SelectItem value={Status.EXPIRED}>Expired</SelectItem>
              </SelectContent>
            </Select>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Object.entries(SystemRoles).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {ROLE_DISPLAY_NAMES[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvitations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                        ? "No invitations match your filters."
                        : "No invitations found."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{invitation.email}</span>
                        {invitation.bypassOnboarding && (
                          <Badge variant="outline" className="w-fit mt-1 text-xs">
                            Skip Onboarding
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(invitation.status)}
                        {invitation.status === Status.PENDING &&
                          isExpired(invitation.expiresAt) && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {invitation.inviterName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(invitation.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className={isExpired(invitation.expiresAt) ? "text-red-600" : ""}>
                        {formatDate(invitation.expiresAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={isPending}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {invitation.status === Status.PENDING && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleResendInvitation(invitation.id, invitation.email)
                                }
                                className="cursor-pointer"
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Resend
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRevokeInvitation(invitation.id, invitation.email)
                                }
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Revoke
                              </DropdownMenuItem>
                            </>
                          )}
                          {invitation.status !== Status.PENDING && (
                            <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)}{" "}
              of {total} invitations
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`?page=${page - 1}`)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`?page=${page + 1}`)}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
