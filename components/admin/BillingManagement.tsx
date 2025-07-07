'use client';

import { useState, useTransition } from 'react';
import { CreditCard, Download, AlertCircle, CheckCircle, Clock, TrendingUp, Users, Car, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { getOrganizationBillingAction } from '@/lib/actions/adminActions';

interface BillingManagementProps {
  orgId: string;
  initialBillingInfo?: {
    plan: string;
    status: string;
    currentPeriodEnds: string;
    usage: {
      users: number;
      maxUsers: number;
      vehicles: number;
      maxVehicles: number;
    };
  };
}

export function BillingManagement({ orgId, initialBillingInfo }: BillingManagementProps) {
  const [billingInfo, setBillingInfo] = useState(initialBillingInfo);
  const [isLoading, startTransition] = useTransition();

  const refreshBillingInfo = () => {
    startTransition(async () => {
      const result = await getOrganizationBillingAction(orgId);
      if (result.success && result.data) {
        setBillingInfo(result.data);
      }
    });
  };

  if (!billingInfo) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-muted-foreground">Loading billing information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { plan, status, currentPeriodEnds, usage } = billingInfo;
  
  // Calculate usage percentages
  const userUsagePercent = (usage.users / usage.maxUsers) * 100;
  const vehicleUsagePercent = (usage.vehicles / usage.maxVehicles) * 100;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Inactive</Badge>;
      case 'past_due':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Past Due</Badge>;
      case 'canceled':
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Canceled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanDetails = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'free':
        return {
          name: 'Free Plan',
          price: '$0',
          features: ['Up to 5 users', 'Up to 10 vehicles', 'Basic reporting', 'Email support'],
          color: 'text-gray-600'
        };
      case 'starter':
        return {
          name: 'Starter Plan',
          price: '$29/mo',
          features: ['Up to 25 users', 'Up to 50 vehicles', 'Advanced reporting', 'Priority support'],
          color: 'text-blue-600'
        };
      case 'professional':
        return {
          name: 'Professional Plan',
          price: '$99/mo',
          features: ['Up to 100 users', 'Up to 200 vehicles', 'Custom reports', 'Phone support'],
          color: 'text-purple-600'
        };
      case 'enterprise':
        return {
          name: 'Enterprise Plan',
          price: 'Custom',
          features: ['Unlimited users', 'Unlimited vehicles', 'Custom integrations', 'Dedicated support'],
          color: 'text-gold-600'
        };
      default:
        return {
          name: plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan',
          price: 'Contact us',
          features: ['Custom features'],
          color: 'text-gray-600'
        };
    }
  };

  const planDetails = getPlanDetails(plan);

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-2xl font-bold ${planDetails.color}`}>{planDetails.name}</h3>
              <p className="text-3xl font-bold text-muted-foreground">{planDetails.price}</p>
            </div>
            <div className="text-right">
              {getStatusBadge(status)}
              {currentPeriodEnds && (
                <p className="text-sm text-muted-foreground mt-2">
                  Next billing: {new Date(currentPeriodEnds).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Plan Features</h4>
            <ul className="space-y-2">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button size="sm" className="flex-1">
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{usage.users}</span>
                <span className="text-sm text-muted-foreground">of {usage.maxUsers} users</span>
              </div>
              <Progress value={userUsagePercent} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{userUsagePercent.toFixed(1)}% used</span>
                <span className={userUsagePercent > 90 ? 'text-red-600' : userUsagePercent > 75 ? 'text-yellow-600' : 'text-green-600'}>
                  {usage.maxUsers - usage.users} remaining
                </span>
              </div>
              {userUsagePercent > 90 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You're approaching your user limit. Consider upgrading your plan.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicle Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{usage.vehicles}</span>
                <span className="text-sm text-muted-foreground">of {usage.maxVehicles} vehicles</span>
              </div>
              <Progress value={vehicleUsagePercent} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{vehicleUsagePercent.toFixed(1)}% used</span>
                <span className={vehicleUsagePercent > 90 ? 'text-red-600' : vehicleUsagePercent > 75 ? 'text-yellow-600' : 'text-green-600'}>
                  {usage.maxVehicles - usage.vehicles} remaining
                </span>
              </div>
              {vehicleUsagePercent > 90 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You're approaching your vehicle limit. Consider upgrading your plan.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Billing Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="w-4 h-4 mr-2" />
              Update Payment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Package className="w-4 h-4 mr-2" />
              View Usage History
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={refreshBillingInfo}
              disabled={isLoading}
            >
              <TrendingUp className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['free', 'starter', 'professional', 'enterprise'].map((planType) => {
              const details = getPlanDetails(planType);
              const isCurrent = planType === plan.toLowerCase();
              
              return (
                <div key={planType} className={`border rounded-lg p-4 ${isCurrent ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className={`font-medium ${details.color}`}>{details.name}</h4>
                      <p className="text-lg font-bold">{details.price}</p>
                      {isCurrent && <Badge className="mt-1">Current</Badge>}
                    </div>
                    <ul className="space-y-1 text-xs">
                      {details.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {!isCurrent && (
                      <Button size="sm" variant="outline" className="w-full">
                        {planType === 'free' ? 'Downgrade' : 'Upgrade'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
