// Shared AddressFields component for DRY compliance
import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressFieldsProps {
  prefix?: string; // e.g., "origin" or "destination" or ""
  values?: Record<string, string>;
  required?: boolean;
}

export function AddressFields({
  prefix = '',
  values = {},
  required = false,
}: AddressFieldsProps) {
  const field = (name: string) =>
    prefix ? `${prefix}${name.charAt(0).toUpperCase() + name.slice(1)}` : name;
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={field('address')}>Address</Label>
        <Input
          id={field('address')}
          name={field('address')}
          defaultValue={values[field('address')] || ''}
          placeholder="e.g., 123 Main St"
          required={required}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={field('city')}>City</Label>
          <Input
            id={field('city')}
            name={field('city')}
            defaultValue={values[field('city')] || ''}
            placeholder="e.g., City"
            required={required}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={field('state')}>State</Label>
          <Input
            id={field('state')}
            name={field('state')}
            defaultValue={values[field('state')] || ''}
            placeholder="e.g., ST"
            required={required}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={field('zip')}>ZIP Code</Label>
          <Input
            id={field('zip')}
            name={field('zip')}
            defaultValue={values[field('zip')] || ''}
            placeholder="e.g., 12345"
            required={required}
          />
        </div>
      </div>
    </>
  );
}
