'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateJoinOrganizationAction } from '@/lib/actions/onboardingActions';
import type { OnboardingStepProps } from '@/types/onboarding';
import { ArrowLeft, ArrowRight, Users } from 'lucide-react';
import React, { useState } from 'react';
import { useFormState } from 'react-dom';

type EmployeeJoinStepProps = Pick<OnboardingStepProps, 'formData' | 'updateFormData' | 'onNext'> & {
  onPrev: () => void;
};

export function EmployeeJoinStep({ formData, updateFormData, onNext, onPrev }: EmployeeJoinStepProps) {
  const [validationState, validateAction] = useFormState(validateJoinOrganizationAction, null);
  const [isValidating, setIsValidating] = useState(false);

  const isValid = formData.organizationId.trim().length >= 1;

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsValidating(true);
    const formData_ = new FormData();
    formData_.append('organizationId', formData.organizationId);
    formData_.append('inviteCode', formData.inviteCode);
    
    await validateAction(formData_);
    setIsValidating(false);
  };

  const handleNext = () => {
    if (validationState?.success) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <Users className="h-6 w-6 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Join your organization</h2>
        <p className="text-gray-400">
          Your admin should have provided you with an organization ID or invite code.
        </p>
      </div>

      <form onSubmit={handleValidate} className="space-y-4 max-w-md mx-auto">
        <div className="space-y-2">
          <Label htmlFor="organizationId" className="text-sm font-medium text-gray-200">
            Organization ID or Name <span className="text-red-400">*</span>
          </Label>
          <Input
            id="organizationId"
            type="text"
            placeholder="acme-trucking or org-id-12345"
            value={formData.organizationId}
            onChange={(e) => updateFormData({ organizationId: e.target.value })}
            className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <p className="text-sm text-gray-500">
            This can be the company name slug or organization ID provided by your admin.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inviteCode" className="text-sm font-medium text-gray-200">
            Invite Code (Optional)
          </Label>
          <Input
            id="inviteCode"
            type="text"
            placeholder="INV-ABC123"
            value={formData.inviteCode}
            onChange={(e) => updateFormData({ inviteCode: e.target.value })}
            className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-sm text-gray-500">
            If you have an invite code, enter it here for faster access.
          </p>
        </div>

        {validationState?.error && (
          <div className="p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-sm text-red-300 font-medium">❌ Validation Error</p>
            <p className="text-xs text-red-400 mt-1">{validationState.error}</p>
          </div>
        )}

        {validationState?.success && (
          <div className="p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
            <p className="text-sm text-green-300 font-medium">✅ Organization Found!</p>
            <p className="text-xs text-green-400 mt-1">
              You can now proceed to complete your onboarding.
            </p>
          </div>
        )}

        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <p className="text-sm text-blue-300 font-medium">🔍 How to find your organization</p>
          <ul className="text-xs text-blue-400 mt-1 space-y-1">
            <li>• Check your email invitation for the organization ID</li>
            <li>• Ask your admin for the company slug (e.g., "acme-trucking")</li>
            <li>• Use any invite code provided during registration</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          {!validationState?.success ? (
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={!isValid || isValidating}
            >
              {isValidating ? 'Validating...' : 'Validate Organization'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="w-full bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
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
