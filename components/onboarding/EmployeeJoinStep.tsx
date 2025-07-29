'use client';

import React, { useState } from 'react';
import { verifyOrganizationExists } from '@/lib/fetchers/onboardingFetchers';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  Key,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Phone
} from 'lucide-react';
import type { OnboardingFormData } from '@/features/onboarding/OnboardingStepper';

interface EmployeeJoinStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function EmployeeJoinStep({ formData, updateFormData, onNext, onPrev }: EmployeeJoinStepProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const isValid = formData.organizationId.trim();

  /**
   * Validates the organization ID before moving to the next step.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsValidating(true);
    setValidationError('');

  try {
      const exists = await verifyOrganizationExists(formData.organizationId);
      if (!exists) {
        setValidationError('Organization not found. Please check the ID and try again.');
        return;
      }
      onNext();
    } catch (error) {
      setValidationError('Organization not found. Please check the ID and try again.');
    } finally {
      setIsValidating(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <Users className="h-6 w-6 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Join your organization
        </h2>
        <p className="text-gray-400">
          Your admin should have provided you with an organization ID to join your company's FleetFusion account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationId" className="text-sm font-medium text-gray-200">Organization ID *</Label>
            <Input
              id="organizationId"
              type="text"
              placeholder="acme-trucking-llc"
              value={formData.organizationId}
              onChange={(e) => updateFormData({ organizationId: e.target.value.toLowerCase() })}
              className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500">
              This is usually your company name in lowercase with dashes (e.g., "acme-trucking-llc")
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inviteCode" className="text-sm font-medium text-gray-200">Invite Code (Optional)</Label>
            <Input
              id="inviteCode"
              type="text"
              placeholder="ABC123"
              value={formData.inviteCode}
              onChange={(e) => updateFormData({ inviteCode: e.target.value.toUpperCase() })}
              className="rounded-md border border-neutral-700 bg-black px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500">
              Some organizations require an invite code for additional security
            </p>
          </div>
        </div>

        {validationError && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-700/30 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {/* Help Section */}
        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <h3 className="font-medium text-white mb-2 flex items-center gap-2">
            <Key className="h-4 w-4" />
            Don't have an Organization ID?
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Your admin/owner needs to:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Complete their company setup first</li>
              <li>Go to Settings → User Management</li>
              <li>Generate an invite link or provide the Organization ID</li>
              <li>Share this information with you</li>
            </ol>
          </div>
        </div>

        {/* Contact Admin */}
        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-blue-300 font-medium">Need help?</p>
              <p className="text-xs text-blue-400 mt-1">
                Contact your system administrator or the person who invited you to join. 
                They can provide the correct Organization ID and any required invite codes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrev}
            className="w-full border-neutral-700 bg-neutral-800 text-gray-200 hover:bg-neutral-700 hover:text-white"
            disabled={isValidating}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            type="submit" 
            className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={!isValid || isValidating}
          >
            {isValidating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Validating...
              </>
            ) : (
              <>
                Join Organization
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
