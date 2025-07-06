/**
 * Invitation Statistics Component
 *
 * Displays invitation metrics and statistics in a dashboard format.
 */

"use client";

import React from "react";
import { Users, Clock, CheckCircle, XCircle, AlertTriangle, Mail } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  type InvitationStats,
  STATUS_DISPLAY_NAMES,
  ROLE_DISPLAY_NAMES,
} from "@/types/invitations";

interface InvitationStatsProps {
  stats: InvitationStats;
}

export function InvitationStats({ stats }: InvitationStatsProps) {
  const statCards = [
    {
      title: "Total Invitations",
      value: stats.total,
      icon: Mail,
      description: "All time invitations sent",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      description: "Awaiting response",
      variant: "warning" as const,
    },
    {
      title: "Accepted",
      value: stats.accepted,
      icon: CheckCircle,
      description: "Successfully joined",
      variant: "success" as const,
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon,
      icon: AlertTriangle,
      description: "Expire within 24h",
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* By Role */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invitations by Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(stats.byRole)
              .filter(([_, count]) => count > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([role, count]) => (
                <div key={role} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {ROLE_DISPLAY_NAMES[role as keyof typeof ROLE_DISPLAY_NAMES]}
                  </span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity (7 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sent</span>
              <Badge variant="outline">{stats.recentActivity.sent}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Accepted</span>
              <Badge variant="outline">{stats.recentActivity.accepted}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revoked</span>
              <Badge variant="outline">{stats.recentActivity.revoked}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
