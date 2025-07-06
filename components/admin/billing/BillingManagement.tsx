"use client";

import { useState, useTransition } from "react";
import {
  CreditCard,
  DollarSign,
  Users,
  Truck,
  TrendingUp,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getBillingInfo } from "@/lib/fetchers/adminFetchers";
import type { BillingInfo } from "@/types/admin";

interface BillingManagementProps {
  orgId: string;
  initialBillingInfo?: BillingInfo;
}

export function BillingManagement({ orgId, initialBillingInfo }: BillingManagementProps) {
  const [billingInfo, setBillingInfo] = useState(initialBillingInfo);
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const refreshBillingInfo = () => {
    startTransition(async () => {
      try {
        const newBillingInfo = await getBillingInfo(orgId);
        setBillingInfo(newBillingInfo);
        toast({
          title: "Billing info refreshed",
          description: "Billing information has been updated.",
        });
      } catch (error) {
        toast({
          title: "Failed to refresh billing info",
          description: "Could not load billing information. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (!billingInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Billing Information</h3>
          <p className="text-gray-400 mb-4">
            Unable to load billing information for this organization.
          </p>
          <Button
            onClick={refreshBillingInfo}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Loading..." : "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  const { plan, status, currentPeriodEnds, usage } = billingInfo;

  // Calculate usage percentages
  const userUsagePercent = (usage.users / usage.maxUsers) * 100;
  const vehicleUsagePercent = (usage.vehicles / usage.maxVehicles) * 100;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "past_due":
        return <Badge variant="destructive">Past Due</Badge>;
      case "canceled":
        return (
          <Badge variant="outline" className="border-red-300 text-red-700">
            Canceled
          </Badge>
        );
      case "trial":
        return (
          <Badge variant="outline" className="border-blue-300 text-blue-700">
            Trial
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanDetails = (plan: string) => {
    const plans = {
      free: { name: "Free", price: 0, features: ["Up to 5 users", "Basic features"] },
      starter: { name: "Starter", price: 29, features: ["Up to 25 users", "Standard features"] },
      professional: {
        name: "Professional",
        price: 99,
        features: ["Up to 100 users", "Advanced features"],
      },
      enterprise: { name: "Enterprise", price: 299, features: ["Unlimited users", "All features"] },
    };
    return plans[plan as keyof typeof plans] || { name: plan, price: 0, features: [] };
  };

  const planDetails = getPlanDetails(plan);

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Billing & Usage</h2>
          <p className="text-gray-400">Manage your subscription and monitor usage</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={refreshBillingInfo}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Billing
          </Button>
        </div>
      </div>

      {/* Current Plan */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Current Plan</CardTitle>
              <CardDescription className="text-gray-400">
                Your subscription details and status
              </CardDescription>
            </div>
            {getStatusBadge(status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{planDetails.name}</h3>
                <p className="text-2xl font-bold text-blue-400">
                  ${planDetails.price}
                  <span className="text-sm font-normal text-gray-400">/month</span>
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Features:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  {planDetails.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Next Billing Date</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-white">
                    {currentPeriodEnds ? new Date(currentPeriodEnds).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  Change Plan
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-gray-700 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">User Usage</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {usage.users} / {usage.maxUsers}
            </div>
            <Progress value={userUsagePercent} className="h-2 mb-2" />
            <p className={`text-xs ${getUsageColor(userUsagePercent)}`}>
              {userUsagePercent.toFixed(1)}% of limit used
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Vehicle Usage</CardTitle>
            <Truck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-2">
              {usage.vehicles} / {usage.maxVehicles}
            </div>
            <Progress value={vehicleUsagePercent} className="h-2 mb-2" />
            <p className={`text-xs ${getUsageColor(vehicleUsagePercent)}`}>
              {vehicleUsagePercent.toFixed(1)}% of limit used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Alerts */}
      {(userUsagePercent >= 80 || vehicleUsagePercent >= 80) && (
        <Card className="border-yellow-600 bg-yellow-900/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-yellow-500">Usage Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userUsagePercent >= 80 && (
                <p className="text-yellow-200">
                  You're approaching your user limit ({userUsagePercent.toFixed(1)}% used).
                </p>
              )}
              {vehicleUsagePercent >= 80 && (
                <p className="text-yellow-200">
                  You're approaching your vehicle limit ({vehicleUsagePercent.toFixed(1)}% used).
                </p>
              )}
              <p className="text-yellow-200">
                Consider upgrading your plan to avoid service interruption.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Billing History</CardTitle>
          <CardDescription className="text-gray-400">
            Your recent billing and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {billingInfo.billingHistory && billingInfo.billingHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Description</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingInfo.billingHistory.map((entry) => (
                  <TableRow key={entry.id} className="border-gray-700">
                    <TableCell className="text-gray-300">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-300">{entry.description}</TableCell>
                    <TableCell className="text-gray-300">
                      ${entry.amount} {entry.currency.toUpperCase()}
                    </TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Billing History</h3>
              <p className="text-gray-400">
                Your billing history will appear here once you have transactions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
