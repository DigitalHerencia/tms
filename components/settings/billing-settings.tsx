'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateBillingSettings } from '@/lib/actions/settingsActions';
import { BillingSettings } from '@/types/settings';

export function BillingSettingsForm({ initial }: { initial: BillingSettings }) {
  const [formState, setFormState] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof BillingSettings, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateBillingSettings(formState.orgId, formState);
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="billingEmail">Billing Email</Label>
          <Input
            id="billingEmail"
            value={formState.billingEmail}
            onChange={e => handleChange('billingEmail', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Input
            id="paymentMethod"
            value={formState.paymentMethod}
            onChange={e => handleChange('paymentMethod', e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Billing Settings'}
        </Button>
      </div>
    </div>
  );
}

