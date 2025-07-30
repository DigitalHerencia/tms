// Shared AddressFields component for DRY compliance
import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressFieldsProps<T extends Record<string, any>> {
  prefix?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: boolean;
}

export function AddressFields<T extends Record<string, any>>({ prefix = '', register, errors, required = false }: AddressFieldsProps<T>) {
  const field = (name: string) => (prefix ? `${prefix}_${name}` : name);
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={field('address')}>Address</Label>
        <Input id={field('address')} {...register(field('address') as any)} placeholder="e.g., 123 Main St" required={required} />
        {errors[field('address') as keyof FieldErrors<T>] && (
          <p className="text-sm text-red-500">{String(errors[field('address') as keyof FieldErrors<T>]?.message)}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={field('city')}>City</Label>
          <Input id={field('city')} {...register(field('city') as any)} placeholder="e.g., City" required={required} />
          {errors[field('city') as keyof FieldErrors<T>] && (
            <p className="text-sm text-red-500">{String(errors[field('city') as keyof FieldErrors<T>]?.message)}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={field('state')}>State</Label>
          <Input id={field('state')} {...register(field('state') as any)} placeholder="e.g., ST" required={required} />
          {errors[field('state') as keyof FieldErrors<T>] && (
            <p className="text-sm text-red-500">{String(errors[field('state') as keyof FieldErrors<T>]?.message)}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={field('zip')}>ZIP Code</Label>
          <Input id={field('zip')} {...register(field('zip') as any)} placeholder="e.g., 12345" required={required} />
          {errors[field('zip') as keyof FieldErrors<T>] && (
            <p className="text-sm text-red-500">{String(errors[field('zip') as keyof FieldErrors<T>]?.message)}</p>
          )}
        </div>
      </div>
    </>
  );
}
