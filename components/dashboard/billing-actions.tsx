// Clerk Billing: Use PricingTable for plan selection and link to Clerk Dashboard for payment/invoice management
'use client';

import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
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
    <div className="flex items-baseline flex-col gap-3 ml-60 mr-2">
      <Button onClick={handleManageBilling} className="bg-blue-500 hover:bg-blue-800">
        Manage Payment & Invoices
      </Button>
      <Button
        onClick={handleCancel}
        disabled={isPending}
        className="bg-red-600 text-white hover:bg-red-800 w-full"
      >
        Cancel Subscription
      </Button>
    </div>
  );
}
