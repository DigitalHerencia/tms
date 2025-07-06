/**
 * Invitation Management Feature
 *
 * Main component for managing organization invitations.
 * Provides comprehensive invitation management capabilities including
 * creating, viewing, filtering, and managing invitations.
 */

import React from "react";

import { InvitationList } from "@/components/invitations/InvitationList";
import { InvitationStats } from "@/components/invitations/InvitationStats";
import { CreateInvitationDialog } from "@/components/invitations/CreateInvitationDialog";
import { BulkInvitationDialog } from "@/components/invitations/BulkInvitationDialog";
import { getOrganizationInvitations, getInvitationStats } from "@/lib/fetchers/invitationFetchers";
import {
  type InvitationFilters,
  type InvitationPagination,
  type InvitationStats as IInvitationStats,
} from "@/types/invitations";

interface InvitationManagementProps {
  organizationId: string;
  filters?: InvitationFilters;
  pagination?: InvitationPagination;
}

export async function InvitationManagement({
  organizationId,
  filters,
  pagination,
}: InvitationManagementProps) {
  const [invitationData, stats] = await Promise.all([
    getOrganizationInvitations(organizationId, filters, pagination),
    getInvitationStats(organizationId),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invitation Management</h1>
          <p className="text-muted-foreground">Manage user invitations for your organization</p>
        </div>
        <div className="flex gap-2">
          <CreateInvitationDialog organizationId={organizationId} />
          <BulkInvitationDialog organizationId={organizationId} />
        </div>
      </div>

      <InvitationStats stats={stats} />

      <InvitationList
        organizationId={organizationId}
        invitations={invitationData.invitations}
        total={invitationData.total}
        page={invitationData.page}
        limit={invitationData.limit}
        totalPages={invitationData.totalPages}
      />
    </div>
  );
}
