'use client';

import { Button } from '@/components/ui/button';
import { SystemRoles } from '@/types/abac';
import type { OnboardingFormData } from '@/types/onboarding';
import { ArrowLeft, CheckCircle, Building, User, Crown, Radio, Truck, ClipboardCheck, UserCog } from 'lucide-react';
import React from 'react';

interface ReviewSubmitStepProps {
  formData: OnboardingFormData;
  isAdmin: boolean;
  onSubmit: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function ReviewSubmitStep({ formData, isAdmin, onSubmit, onPrev, isLoading }: ReviewSubmitStepProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case SystemRoles.ADMIN:
        return 'text-purple-300 bg-purple-900/30 border-purple-700/30';
      case SystemRoles.DISPATCHER:
        return 'text-blue-300 bg-blue-900/30 border-blue-700/30';
      case SystemRoles.DRIVER:
        return 'text-green-300 bg-green-900/30 border-green-700/30';
      case SystemRoles.COMPLIANCE:
        return 'text-orange-300 bg-orange-900/30 border-orange-700/30';
      case SystemRoles.MEMBER:
        return 'text-teal-300 bg-teal-900/30 border-teal-700/30';
      default:
        return 'text-gray-300 bg-gray-900/30 border-gray-700/30';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case SystemRoles.ADMIN:
        return 'Admin / Owner';
      case SystemRoles.DISPATCHER:
        return 'Dispatcher';
      case SystemRoles.DRIVER:
        return 'Driver';
      case SystemRoles.COMPLIANCE:
        return 'Compliance Officer';
      case SystemRoles.MEMBER:
        return 'Member / Employee';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case SystemRoles.ADMIN:
        return Crown;
      case SystemRoles.DISPATCHER:
        return Radio;
      case SystemRoles.DRIVER:
        return Truck;
      case SystemRoles.COMPLIANCE:
        return ClipboardCheck;
      case SystemRoles.MEMBER:
        return UserCog;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon(formData.role);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Review & Submit</h2>
        <p className="text-gray-400">
          Please review your information below. You can go back to make changes if needed.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">First Name:</span>
              <p className="text-white font-medium">{formData.firstName}</p>
            </div>
            <div>
              <span className="text-gray-400">Last Name:</span>
              <p className="text-white font-medium">{formData.lastName}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">Email:</span>
              <p className="text-white font-medium">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* Role Information */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <div className="flex items-center gap-3 mb-4">
            <RoleIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">Role</h3>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getRoleBadgeColor(formData.role)}`}>
            <RoleIcon className="h-4 w-4" />
            <span className="font-medium">{getRoleDisplayName(formData.role)}</span>
          </div>
        </div>

        {/* Organization Information */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">
              {isAdmin ? 'Company Information' : 'Organization'}
            </h3>
          </div>
          
          {isAdmin ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Company Name:</span>
                <p className="text-white font-medium">{formData.companyName}</p>
              </div>
              {(formData.dotNumber || formData.mcNumber) && (
                <div className="grid grid-cols-2 gap-4">
                  {formData.dotNumber && (
                    <div>
                      <span className="text-gray-400">DOT Number:</span>
                      <p className="text-white font-medium">{formData.dotNumber}</p>
                    </div>
                  )}
                  {formData.mcNumber && (
                    <div>
                      <span className="text-gray-400">MC Number:</span>
                      <p className="text-white font-medium">{formData.mcNumber}</p>
                    </div>
                  )}
                </div>
              )}
              {formData.address && (
                <div>
                  <span className="text-gray-400">Address:</span>
                  <p className="text-white font-medium">
                    {formData.address}
                    {formData.city && `, ${formData.city}`}
                    {formData.state && `, ${formData.state}`}
                    {formData.zip && ` ${formData.zip}`}
                  </p>
                </div>
              )}
              {formData.phone && (
                <div>
                  <span className="text-gray-400">Phone:</span>
                  <p className="text-white font-medium">{formData.phone}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Organization ID:</span>
                <p className="text-white font-medium">{formData.organizationId}</p>
              </div>
              {formData.inviteCode && (
                <div>
                  <span className="text-gray-400">Invite Code:</span>
                  <p className="text-white font-medium">{formData.inviteCode}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Setting up your account...
              </>
            ) : (
              <>
                Complete Onboarding
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            disabled={isLoading}
            className="w-full border-neutral-700 bg-neutral-800 text-gray-200 hover:bg-neutral-700 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
