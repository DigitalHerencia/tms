'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { OnboardingStepProps } from '@/types/onboarding';
import { ArrowLeft, ArrowRight, Building } from 'lucide-react';
import React from 'react';

type CompanySetupStepProps = Pick<OnboardingStepProps, 'formData' | 'updateFormData' | 'onNext'> & {
  onPrev: () => void;
};

export function CompanySetupStep({ formData, updateFormData, onNext, onPrev }: CompanySetupStepProps) {
  const isValid = formData.companyName.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <Building className="h-6 w-6 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Set up your company</h2>
        <p className="text-gray-400">
          Tell us about your trucking company. You can always update this information later.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-gray-200">
            Company Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Acme Trucking Co."
            value={formData.companyName}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
            className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dotNumber" className="text-sm font-medium text-gray-200">
              DOT Number
            </Label>
            <Input
              id="dotNumber"
              type="text"
              placeholder="1234567"
              value={formData.dotNumber}
              onChange={(e) => updateFormData({ dotNumber: e.target.value })}
              className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mcNumber" className="text-sm font-medium text-gray-200">
              MC Number
            </Label>
            <Input
              id="mcNumber"
              type="text"
              placeholder="MC-123456"
              value={formData.mcNumber}
              onChange={(e) => updateFormData({ mcNumber: e.target.value })}
              className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-gray-200">
            Business Address
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="123 Main Street"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-200">
              City
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="Denver"
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium text-gray-200">
              State
            </Label>
            <Input
              id="state"
              type="text"
              placeholder="CO"
              value={formData.state}
              onChange={(e) => updateFormData({ state: e.target.value })}
              className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip" className="text-sm font-medium text-gray-200">
              ZIP Code
            </Label>
            <Input
              id="zip"
              type="text"
              placeholder="80202"
              value={formData.zip}
              onChange={(e) => updateFormData({ zip: e.target.value })}
              className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-200">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <p className="text-sm text-blue-300 font-medium">💡 Good to know</p>
          <p className="text-xs text-blue-400 mt-1">
            Only the company name is required to get started. You can always add or update your DOT/MC numbers,
            address, and other details later in your company settings.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={!isValid}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="w-full border-neutral-700 bg-neutral-800 text-gray-200 hover:bg-neutral-700 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}
