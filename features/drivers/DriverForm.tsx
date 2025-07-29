'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Shield, Phone, Tag, FileText, X, RotateCcw, Save } from 'lucide-react';

type SimpleDriverFormData = {
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  endorsements?: string[];
  restrictions?: string[];
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  tags?: string[];
  notes?: string;
};

type DriverFormProps = {
  initialValues?: SimpleDriverFormData;
  onSubmit: (data: SimpleDriverFormData) => void;
  submitting?: boolean;
  mode?: 'create' | 'edit';
  serverError?: string;
  onUploadDocument?: () => void;
  onCancel?: () => void;
};

export function DriverForm({
  initialValues,
  onSubmit,
  submitting,
  mode = 'create',
  serverError,
  onUploadDocument,
  onCancel,
}: DriverFormProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<SimpleDriverFormData>({
    defaultValues: initialValues || {},
  });
  const values = watch();

  // Helper for comma-separated fields
  const handleCommaInput = (field: keyof SimpleDriverFormData, value: string) => {
    setValue(
      field,
      value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    );
  };

  // Handle clear form
  const handleClear = () => {
    reset({});
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Default behavior - go back or reset form
      window.history.back();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Cancel Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === 'edit' ? 'Edit Driver' : 'Add New Driver'}
          </h1>
          <p className="text-white/70">
            {mode === 'edit'
              ? 'Update driver information and credentials'
              : 'Enter driver information and credentials to add them to your fleet'}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={submitting}
          className="border-neutral-600 text-white hover:bg-neutral-700"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {/* Address Information Card */}
        <Card className="bg-black border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5 text-blue-400" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="address-street" className="text-white mb-2 block">
                  Street Address
                </Label>
                <Input
                  id="address-street"
                  {...register('address.street')}
                  disabled={submitting}
                  placeholder="e.g., 123 Main St"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="address-city" className="text-white mb-2 block">
                    City
                  </Label>
                  <Input
                    id="address-city"
                    {...register('address.city')}
                    disabled={submitting}
                    placeholder="e.g., New York"
                    className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="address-state" className="text-white mb-2 block">
                    State
                  </Label>
                  <Input
                    id="address-state"
                    {...register('address.state')}
                    disabled={submitting}
                    placeholder="e.g., NY"
                    maxLength={2}
                    className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="address-zipCode" className="text-white mb-2 block">
                    ZIP Code
                  </Label>
                  <Input
                    id="address-zipCode"
                    {...register('address.zipCode')}
                    disabled={submitting}
                    placeholder="e.g., 12345"
                    className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address-country" className="text-white mb-2 block">
                  Country
                </Label>
                <Input
                  id="address-country"
                  {...register('address.country')}
                  disabled={submitting}
                  placeholder="e.g., USA"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CDL Endorsements and Restrictions Card */}
        <Card className="bg-black border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-green-400" />
              CDL Endorsements & Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="endorsements" className="text-white mb-2 block">
                  CDL Endorsements
                </Label>
                <Input
                  id="endorsements"
                  value={(values.endorsements || []).join(', ')}
                  onChange={(e) => handleCommaInput('endorsements', e.target.value)}
                  disabled={submitting}
                  placeholder="e.g., H, N, P, S, T, X"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                />
                <p className="text-xs text-neutral-400 mt-2">
                  Separate multiple endorsements with commas (e.g., H, N, P)
                </p>
              </div>
              <div>
                <Label htmlFor="restrictions" className="text-white mb-2 block">
                  CDL Restrictions
                </Label>
                <Input
                  id="restrictions"
                  value={(values.restrictions || []).join(', ')}
                  onChange={(e) => handleCommaInput('restrictions', e.target.value)}
                  disabled={submitting}
                  placeholder="e.g., B, E, K, L, M, N, O, V, Z"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                />
                <p className="text-xs text-neutral-400 mt-2">
                  Separate multiple restrictions with commas (e.g., B, E, K)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Card */}
        <Card className="bg-black border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Phone className="h-5 w-5 text-red-400" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="emergency-name" className="text-white mb-2 block">
                  Contact Name
                </Label>
                <Input
                  id="emergency-name"
                  {...register('emergencyContact.name')}
                  disabled={submitting}
                  placeholder="e.g., John Doe"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="emergency-relationship" className="text-white mb-2 block">
                  Relationship
                </Label>
                <Input
                  id="emergency-relationship"
                  {...register('emergencyContact.relationship')}
                  disabled={submitting}
                  placeholder="e.g., Spouse, Parent, Sibling"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="emergency-phone" className="text-white mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="emergency-phone"
                  {...register('emergencyContact.phone')}
                  disabled={submitting}
                  placeholder="e.g., 555-123-4567"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="emergency-email" className="text-white mb-2 block">
                  Email (Optional)
                </Label>
                <Input
                  id="emergency-email"
                  type="email"
                  {...register('emergencyContact.email')}
                  disabled={submitting}
                  placeholder="e.g., john.doe@example.com"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="emergency-address" className="text-white mb-2 block">
                  Address (Optional)
                </Label>
                <Input
                  id="emergency-address"
                  {...register('emergencyContact.address')}
                  disabled={submitting}
                  placeholder="e.g., 456 Oak Ave, City, State 12345"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card className="bg-black border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Tag className="h-5 w-5 text-purple-400" />
              Driver Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tags" className="text-white mb-2 block">
                Tags
              </Label>
              <Input
                id="tags"
                value={(values.tags || []).join(', ')}
                onChange={(e) => handleCommaInput('tags', e.target.value)}
                disabled={submitting}
                placeholder="e.g., experienced, night-shift, hazmat, local"
                className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400"
              />
              <p className="text-xs text-neutral-400 mt-2">
                Separate multiple tags with commas (e.g., experienced, night-shift, hazmat)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card className="bg-black border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-yellow-400" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Label htmlFor="notes" className="text-white mb-2 block">
              Notes
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              disabled={submitting}
              placeholder="Additional information about the driver..."
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-blue-400 min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-black border-gray-200">
          <CardContent className="pt-6">
            {serverError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-sm font-medium text-red-400">{serverError}</p>
              </div>
            )}

            {/* Main Action Buttons */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 font-semibold flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {mode === 'edit' ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {mode === 'edit' ? 'Update Driver' : 'Add Driver'}
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    disabled={submitting}
                    className="border-neutral-600 text-white hover:bg-neutral-700 px-6 py-2.5"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear Form
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  {onUploadDocument && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onUploadDocument}
                      disabled={submitting}
                      className="border-neutral-600 text-white hover:bg-neutral-700 px-6 py-2.5"
                    >
                      Upload Document
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="text-white hover:bg-neutral-700 px-6 py-2.5"
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Help Text */}
              <div className="text-xs text-neutral-400 pt-2 border-t border-neutral-700">
                <p>• Use "Clear Form" to reset all fields</p>
                <p>• Changes are automatically validated before submission</p>
                {mode === 'create' && (
                  <p>• Driver will be added to your active fleet upon submission</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
