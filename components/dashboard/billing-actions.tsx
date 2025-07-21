// Clerk Billing: Use PricingTable for plan selection and link to Clerk Dashboard for payment/invoice management
'use client';

import { useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function BillingActions() {
  const { redirectToUserProfile } = useClerk();

  const handleManageBilling = async () => {
    // Sends users to their Clerk Account Portal → Billing/Subcriptions
    await redirectToUserProfile();
  };

  const handleCancel = async () => {
    // If you expose a custom Server Action to cancel, call it here.
    // Example stub:
    // await fetch(`/api/billing/cancel`, { method: 'POST' });
    alert('Cancel subscription you would wire this up to your API.');
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleManageBilling} className="bg-blue-600 hover:bg-blue-800">
        Manage Payment & Invoices
      </Button>
      <Button onClick={handleCancel} className="bg-red-600 text-white hover:bg-red-800">
        Cancel Subscription
      </Button>
    </div>
  );
}
