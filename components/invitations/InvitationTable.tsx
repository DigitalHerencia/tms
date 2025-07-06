/**
 * Invitation Table Component
 *
 * Table for displaying and managing invitations with filtering,
 * sorting, and action capabilities.
 */

"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

import { revokeInvitation, resendInvitation } from "@/lib/actions/invitationActions";
import {
  type InvitationDisplay,
  type InvitationFilters,
  InvitationStatus,
  ROLE_DISPLAY_NAMES,
  ROLE_COLORS,
  STATUS_DISPLAY_NAMES,
  STATUS_COLORS,
} from "@/types/invitations";
import { SystemRoles, type SystemRole } from "@/types/abac";

interface InvitationTableProps {
  invitations: InvitationDisplay[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function InvitationTable({
  invitations,
  onRefresh,
  isLoading = false,
}: InvitationTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvitationStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<SystemRole | "all">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [revokeDialog, setRevokeDialog] = useState<{
    open: boolean;
    invitation: InvitationDisplay | null;
  }>({ open: false, invitation: null });

  // Filter invitations based on search term and filters
  const filteredInvitations = invitations.filter((invitation) => {
    const matchesSearch =
      invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.inviterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.organizationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || invitation.status === statusFilter;
    const matchesRole = roleFilter === "all" || invitation.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleRevoke = async (invitation: InvitationDisplay) => {
    setActionLoading(invitation.id);

    try {
      const result = await revokeInvitation(invitation.id);

      if (result.success) {
        toast({
          title: "Invitation Revoked",
          description: result.message || "The invitation has been revoked successfully.",
        });
        onRefresh?.();
      } else {
        toast({
          title: "Failed to Revoke Invitation",
          description: result.error || "An error occurred while revoking the invitation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error revoking invitation:", error);
      toast({
        title: "Error",
        description: "Failed to revoke invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setRevokeDialog({ open: false, invitation: null });
    }
  };

  const handleResend = async (invitation: InvitationDisplay) => {
    setActionLoading(invitation.id);

    try {
      const result = await resendInvitation(invitation.id);

      if (result.success) {
        toast({
          title: "Invitation Resent",
          description: result.message || "The invitation has been resent successfully.",
        });
        onRefresh?.();
      } else {
        toast({
          title: "Failed to Resend Invitation",
          description: result.error || "An error occurred while resending the invitation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to resend invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: InvitationStatus) => {
    switch (status) {
      case InvitationStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case InvitationStatus.ACCEPTED:
        return <CheckCircle className="h-4 w-4" />;
      case InvitationStatus.REVOKED:
      case InvitationStatus.EXPIRED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return expirationDate.getTime() - now.getTime() < twentyFourHours;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invitations..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(InvitationStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_DISPLAY_NAMES[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as any)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.values(SystemRoles).map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_DISPLAY_NAMES[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Table */}
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
              <TableHead>Settings</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading invitations...</p>
                </TableCell>
              </TableRow>
            ) : filteredInvitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center">
                  <Mail className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                      ? "No invitations match your filters."
                      : "No invitations found."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">{invitation.email}</TableCell>

                  <TableCell>
                    <Badge className={ROLE_COLORS[invitation.role]}>
                      {ROLE_DISPLAY_NAMES[invitation.role]}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(invitation.status)}
                      <Badge className={STATUS_COLORS[invitation.status]}>
                        {STATUS_DISPLAY_NAMES[invitation.status]}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {invitation.inviterName}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(invitation.createdAt)}
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      <span
                        className={
                          invitation.status === InvitationStatus.PENDING &&
                          isExpiringSoon(invitation.expiresAt)
                            ? "text-orange-600 font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {formatDate(invitation.expiresAt)}
                      </span>
                      {invitation.status === InvitationStatus.PENDING &&
                        isExpiringSoon(invitation.expiresAt) && (
                          <div className="text-xs text-orange-600">Expiring soon</div>
                        )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {invitation.bypassOnboarding ? (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Skip Onboarding
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Standard Flow</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={actionLoading === invitation.id}
                        >
                          <span className="sr-only">Open menu</span>
                          {actionLoading === invitation.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {invitation.status === InvitationStatus.PENDING && (
                          <>
                            <DropdownMenuItem onClick={() => handleResend(invitation)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Resend Invitation
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setRevokeDialog({ open: true, invitation })}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Revoke Invitation
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog
        open={revokeDialog.open}
        onOpenChange={(open) => setRevokeDialog({ open, invitation: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the invitation for{" "}
              <span className="font-medium">{revokeDialog.invitation?.email}</span>? This action
              cannot be undone and the invitation link will no longer work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => revokeDialog.invitation && handleRevoke(revokeDialog.invitation)}
              className="bg-red-600 hover:bg-red-700"
            >
              Revoke Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
