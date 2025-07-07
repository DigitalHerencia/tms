// Shared ContactFields component for DRY compliance
import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactFieldsProps {
  values?: Record<string, string>;
}

export function ContactFields({ values = {} }: ContactFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="customerContact">Contact Person</Label>
        <Input
          id="customerContact"
          name="customerContact"
          defaultValue={values['customerContact'] || ''}
          placeholder="e.g., John Smith"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customerPhone">Phone</Label>
        <Input
          id="customerPhone"
          name="customerPhone"
          defaultValue={values['customerPhone'] || ''}
          placeholder="e.g., 555-123-4567"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customerEmail">Email</Label>
        <Input
          id="customerEmail"
          name="customerEmail"
          type="email"
          defaultValue={values['customerEmail'] || ''}
          placeholder="e.g., john@example.com"
        />
      </div>
    </div>
  );
}
