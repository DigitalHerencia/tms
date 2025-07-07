import React from 'react';
import { z } from 'zod';
import type { DriverFormData } from "@/types/drivers";

import { driverFormSchema } from '@/schemas/drivers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils/utils';

export type DriverFormProps = {
  form: {
    values: DriverFormData;
    errors: Record<string, string>;
    onChange: (field: string, value: any) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    submitting: boolean;
    serverError?: string;
    mode: 'create' | 'edit';
  };
  onUploadDocument?: () => void;
};

export function DriverForm({ form, onUploadDocument }: DriverFormProps) {
  const { values, errors, onChange, onSubmit, submitting, serverError, mode } =
    form;
  return (
    <form className="space-y-6" onSubmit={onSubmit} autoComplete="off">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={values.firstName}
            onChange={e => onChange('firstName', e.target.value)}
            disabled={submitting}
            required
            autoFocus
            className={cn(errors.firstName && 'border-red-500')}
          />
          {errors.firstName && (
            <div className="mt-1 text-xs text-red-500">{errors.firstName}</div>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={values.lastName}
            onChange={e => onChange('lastName', e.target.value)}
            disabled={submitting}
            required
            className={cn(errors.lastName && 'border-red-500')}
          />
          {errors.lastName && (
            <div className="mt-1 text-xs text-red-500">{errors.lastName}</div>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={e => onChange('email', e.target.value)}
            disabled={submitting}
            required
            className={cn(errors.email && 'border-red-500')}
          />
          {errors.email && (
            <div className="mt-1 text-xs text-red-500">{errors.email}</div>
          )}
        </div>        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={values.phone}
            onChange={e => onChange('phone', e.target.value)}
            disabled={submitting}
            required
            className={cn(errors.phone && 'border-red-500')}
          />
          {errors.phone && (
            <div className="mt-1 text-xs text-red-500">{errors.phone}</div>
          )}
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={values.dateOfBirth || ''}
            onChange={e => onChange('dateOfBirth', e.target.value)}
            disabled={submitting}
            className={cn(errors.dateOfBirth && 'border-red-500')}
          />
          {errors.dateOfBirth && (
            <div className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</div>
          )}
        </div>
        <div>
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            value={values.employeeId || ''}
            onChange={e => onChange('employeeId', e.target.value)}
            disabled={submitting}
            className={cn(errors.employeeId && 'border-red-500')}
          />
          {errors.employeeId && (
            <div className="mt-1 text-xs text-red-500">{errors.employeeId}</div>
          )}
        </div>        <div>
          <Label htmlFor="hireDate">Hire Date</Label>
          <Input
            id="hireDate"
            type="date"
            value={values.hireDate}
            onChange={e => onChange('hireDate', e.target.value)}
            disabled={submitting}
            required
            className={cn(errors.hireDate && 'border-red-500')}
          />
          {errors.hireDate && (
            <div className="mt-1 text-xs text-red-500">{errors.hireDate}</div>
          )}
        </div>
        <div>
          <Label htmlFor="payRate">Pay Rate</Label>
          <Input
            id="payRate"
            type="number"
            step="0.01"
            min="0"
            value={values.payRate || ''}
            onChange={e => onChange('payRate', parseFloat(e.target.value) || 0)}
            disabled={submitting}
            className={cn(errors.payRate && 'border-red-500')}
          />
          {errors.payRate && (
            <div className="mt-1 text-xs text-red-500">{errors.payRate}</div>
          )}
        </div>
        <div>
          <Label htmlFor="payType">Pay Type</Label>
          <Select
            value={values.payType || ''}
            onValueChange={value => onChange('payType', value)}
            disabled={submitting}
          >
            <SelectTrigger className={cn(errors.payType && 'border-red-500')}>
              <SelectValue placeholder="Select pay type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="mileage">Mileage</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>
          {errors.payType && (
            <div className="mt-1 text-xs text-red-500">{errors.payType}</div>
          )}
        </div>
        <div>
          <Label htmlFor="homeTerminal">Home Terminal</Label>
          <Input
            id="homeTerminal"
            value={values.homeTerminal}
            onChange={e => onChange('homeTerminal', e.target.value)}
            disabled={submitting}
            required
            className={cn(errors.homeTerminal && 'border-red-500')}
          />
          {errors.homeTerminal && (
            <div className="mt-1 text-xs text-red-500">
              {errors.homeTerminal}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="cdlNumber">CDL Number</Label>
          <Input
            id="cdlNumber"
            value={values.cdlNumber}
            onChange={e => onChange('cdlNumber', e.target.value)}
            disabled={submitting}
            required
            className={cn(errors.cdlNumber && 'border-red-500')}
          />
          {errors.cdlNumber && (
            <div className="mt-1 text-xs text-red-500">{errors.cdlNumber}</div>
          )}
        </div>
        <div>
          <Label htmlFor="cdlState">CDL State</Label>
          <Input
            id="cdlState"
            value={values.cdlState}
            onChange={e => onChange('cdlState', e.target.value)}
            disabled={submitting}
            required
            className={cn(errors.cdlState && 'border-red-500')}
            maxLength={2}
          />
          {errors.cdlState && (
            <div className="mt-1 text-xs text-red-500">{errors.cdlState}</div>
          )}
        </div>        <div>
          <Label htmlFor="cdlClass">CDL Class</Label>
          <Select
            value={values.cdlClass}
            onValueChange={value => onChange('cdlClass', value)}
            disabled={submitting}
          >
            <SelectTrigger className={cn(errors.cdlClass && 'border-red-500')}>
              <SelectValue placeholder="Select CDL class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Class A</SelectItem>
              <SelectItem value="B">Class B</SelectItem>
              <SelectItem value="C">Class C</SelectItem>
            </SelectContent>
          </Select>
          {errors.cdlClass && (
            <div className="mt-1 text-xs text-red-500">{errors.cdlClass}</div>
          )}
        </div>
        <div>
          <Label htmlFor="cdlExpiration">CDL Expiration</Label>
          <Input
            id="cdlExpiration"
            type="date"
            value={values.cdlExpiration}
            onChange={e => onChange('cdlExpiration', e.target.value)}
            disabled={submitting}
            required
            className={cn(errors.cdlExpiration && 'border-red-500')}
          />
          {errors.cdlExpiration && (
            <div className="mt-1 text-xs text-red-500">
              {errors.cdlExpiration}
            </div>
          )}
        </div>        <div>
          <Label htmlFor="medicalCardNumber">Medical Card Number</Label>
          <Input
            id="medicalCardNumber"
            value={values.medicalCardNumber || ''}
            onChange={e => onChange('medicalCardNumber', e.target.value)}
            disabled={submitting}
            className={cn(errors.medicalCardNumber && 'border-red-500')}
          />
          {errors.medicalCardNumber && (
            <div className="mt-1 text-xs text-red-500">{errors.medicalCardNumber}</div>
          )}
        </div>
        <div>
          <Label htmlFor="medicalCardExpiration">Medical Card Expiration</Label>
          <Input
            id="medicalCardExpiration"
            type="date"
            value={values.medicalCardExpiration}
            onChange={e => onChange('medicalCardExpiration', e.target.value)}
            disabled={submitting}
            required
            className={cn(errors.medicalCardExpiration && 'border-red-500')}
          />
          {errors.medicalCardExpiration && (
            <div className="mt-1 text-xs text-red-500">
              {errors.medicalCardExpiration}
            </div>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="address-street">Street Address</Label>
            <Input
              id="address-street"
              value={values.address?.street || ''}
              onChange={e => onChange('address', { ...values.address, street: e.target.value })}
              disabled={submitting}
              placeholder="e.g., 123 Main St"
              className={cn(errors['address.street'] && 'border-red-500')}
            />
            {errors['address.street'] && (
              <div className="mt-1 text-xs text-red-500">{errors['address.street']}</div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="address-city">City</Label>
              <Input
                id="address-city"
                value={values.address?.city || ''}
                onChange={e => onChange('address', { ...values.address, city: e.target.value })}
                disabled={submitting}
                placeholder="e.g., New York"
                className={cn(errors['address.city'] && 'border-red-500')}
              />
              {errors['address.city'] && (
                <div className="mt-1 text-xs text-red-500">{errors['address.city']}</div>
              )}
            </div>
            <div>
              <Label htmlFor="address-state">State</Label>
              <Input
                id="address-state"
                value={values.address?.state || ''}
                onChange={e => onChange('address', { ...values.address, state: e.target.value })}
                disabled={submitting}
                placeholder="e.g., NY"
                maxLength={2}
                className={cn(errors['address.state'] && 'border-red-500')}
              />
              {errors['address.state'] && (
                <div className="mt-1 text-xs text-red-500">{errors['address.state']}</div>
              )}
            </div>
            <div>
              <Label htmlFor="address-zipCode">ZIP Code</Label>
              <Input
                id="address-zipCode"
                value={values.address?.zipCode || ''}
                onChange={e => onChange('address', { ...values.address, zipCode: e.target.value })}
                disabled={submitting}
                placeholder="e.g., 12345"
                className={cn(errors['address.zipCode'] && 'border-red-500')}
              />
              {errors['address.zipCode'] && (
                <div className="mt-1 text-xs text-red-500">{errors['address.zipCode']}</div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="address-country">Country</Label>
            <Input
              id="address-country"
              value={values.address?.country || 'USA'}
              onChange={e => onChange('address', { ...values.address, country: e.target.value })}
              disabled={submitting}
              placeholder="e.g., USA"
              className={cn(errors['address.country'] && 'border-red-500')}
            />
            {errors['address.country'] && (
              <div className="mt-1 text-xs text-red-500">{errors['address.country']}</div>
            )}
          </div>
        </div>
      </div>

      {/* CDL Endorsements and Restrictions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">CDL Endorsements & Restrictions</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="endorsements">CDL Endorsements</Label>
            <div className="space-y-2">
              <Input
                id="endorsements"
                value={(values.endorsements || []).join(', ')}
                onChange={e => onChange('endorsements', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                disabled={submitting}
                placeholder="e.g., H, N, P, S, T, X"
                className={cn(errors.endorsements && 'border-red-500')}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple endorsements with commas (e.g., H, N, P)
              </p>
              {errors.endorsements && (
                <div className="mt-1 text-xs text-red-500">{errors.endorsements}</div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="restrictions">CDL Restrictions</Label>
            <div className="space-y-2">
              <Input
                id="restrictions"
                value={(values.restrictions || []).join(', ')}
                onChange={e => onChange('restrictions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                disabled={submitting}
                placeholder="e.g., B, E, K, L, M, N, O, V, Z"
                className={cn(errors.restrictions && 'border-red-500')}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple restrictions with commas (e.g., B, E, K)
              </p>
              {errors.restrictions && (
                <div className="mt-1 text-xs text-red-500">{errors.restrictions}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Emergency Contact</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="emergency-name">Contact Name</Label>
            <Input
              id="emergency-name"
              value={values.emergencyContact?.name || ''}
              onChange={e => onChange('emergencyContact', { ...values.emergencyContact, name: e.target.value })}
              disabled={submitting}
              placeholder="e.g., John Doe"
              className={cn(errors['emergencyContact.name'] && 'border-red-500')}
            />
            {errors['emergencyContact.name'] && (
              <div className="mt-1 text-xs text-red-500">{errors['emergencyContact.name']}</div>
            )}
          </div>
          <div>
            <Label htmlFor="emergency-relationship">Relationship</Label>
            <Input
              id="emergency-relationship"
              value={values.emergencyContact?.relationship || ''}
              onChange={e => onChange('emergencyContact', { ...values.emergencyContact, relationship: e.target.value })}
              disabled={submitting}
              placeholder="e.g., Spouse, Parent, Sibling"
              className={cn(errors['emergencyContact.relationship'] && 'border-red-500')}
            />
            {errors['emergencyContact.relationship'] && (
              <div className="mt-1 text-xs text-red-500">{errors['emergencyContact.relationship']}</div>
            )}
          </div>
          <div>
            <Label htmlFor="emergency-phone">Phone Number</Label>
            <Input
              id="emergency-phone"
              value={values.emergencyContact?.phone || ''}
              onChange={e => onChange('emergencyContact', { ...values.emergencyContact, phone: e.target.value })}
              disabled={submitting}
              placeholder="e.g., 555-123-4567"
              className={cn(errors['emergencyContact.phone'] && 'border-red-500')}
            />
            {errors['emergencyContact.phone'] && (
              <div className="mt-1 text-xs text-red-500">{errors['emergencyContact.phone']}</div>
            )}
          </div>
          <div>
            <Label htmlFor="emergency-email">Email (Optional)</Label>
            <Input
              id="emergency-email"
              type="email"
              value={values.emergencyContact?.email || ''}
              onChange={e => onChange('emergencyContact', { ...values.emergencyContact, email: e.target.value })}
              disabled={submitting}
              placeholder="e.g., john.doe@example.com"
              className={cn(errors['emergencyContact.email'] && 'border-red-500')}
            />
            {errors['emergencyContact.email'] && (
              <div className="mt-1 text-xs text-red-500">{errors['emergencyContact.email']}</div>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="emergency-address">Address (Optional)</Label>
            <Input
              id="emergency-address"
              value={values.emergencyContact?.address || ''}
              onChange={e => onChange('emergencyContact', { ...values.emergencyContact, address: e.target.value })}
              disabled={submitting}
              placeholder="e.g., 456 Oak Ave, City, State 12345"
              className={cn(errors['emergencyContact.address'] && 'border-red-500')}
            />
            {errors['emergencyContact.address'] && (
              <div className="mt-1 text-xs text-red-500">{errors['emergencyContact.address']}</div>
            )}
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tags</h3>
        <div>
          <Label htmlFor="tags">Driver Tags</Label>
          <div className="space-y-2">
            <Input
              id="tags"
              value={(values.tags || []).join(', ')}
              onChange={e => onChange('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              disabled={submitting}
              placeholder="e.g., experienced, night-shift, hazmat, local"
              className={cn(errors.tags && 'border-red-500')}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas (e.g., experienced, night-shift, hazmat)
            </p>
            {errors.tags && (
              <div className="mt-1 text-xs text-red-500">{errors.tags}</div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={values.notes || ''}
          onChange={e => onChange('notes', e.target.value)}
          disabled={submitting}
          className={cn(errors.notes && 'border-red-500')}
        />
        {errors.notes && (
          <div className="mt-1 text-xs text-red-500">{errors.notes}</div>
        )}
      </div>
      {serverError && (
        <div className="text-sm font-medium text-red-600">{serverError}</div>
      )}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={submitting} className="bg-black">
          {mode === 'edit' ? 'Update Driver' : 'Add Driver'}
        </Button>
        {onUploadDocument && (
          <Button
            type="button"
            variant="outline"
            onClick={onUploadDocument}
            disabled={submitting}
          >
            Upload Document
          </Button>
        )}
      </div>
    </form>
  );
}
