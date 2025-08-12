// Clerk Billing: Use PricingTable for plan selection and link to Clerk Dashboard for payment/invoice management
'use client';

import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import React, { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationContext } from '@/components/auth/context';
import { cancelSubscriptionAction } from '@/lib/actions/dashboardActions';

export function BillingActions() {
  const { redirectToUserProfile } = useClerk();
  const org = useOrganizationContext();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleManageBilling = async () => {
    // Sends users to their Clerk Account Portal → Billing/Subcriptions
    await redirectToUserProfile();
  };

  const handleCancel = () => {
    if (!org) return;
    startTransition(async () => {
      const result = await cancelSubscriptionAction(org.id);
      if (result.success) {
        toast({
          title: 'Subscription cancelled',
          description: 'Your subscription has been cancelled.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to cancel subscription.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="mt-6 flex w-full flex-col gap-3">
      <Button
        onClick={handleManageBilling}
        className="rounded-md w-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-800"
      >
        Manage Payment & Invoices
      </Button>
      <Button
        onClick={handleCancel}
        disabled={isPending}
        className="rounded-md w-full bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-800"
      >
        Cancel Subscription
      </Button>
    </div>
  );
}
