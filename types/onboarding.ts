import type { SystemRole } from "./abac";

/**
 * Onboarding Types - Clean, comprehensive types for the onboarding process
 */

// Onboarding status and progress
export interface OnboardingStatus {
  isComplete: boolean;
  currentStep: "personal" | "role" | "setup" | "review" | "complete";
  user: {
    id: string;
    clerkId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: SystemRole;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
}

// Form data interface for the onboarding stepper
export interface OnboardingFormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;

  // Role Selection
  role: SystemRole | "";

  // Company Setup (for admin)
  companyName: string;
  dotNumber: string;
  mcNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;

  // Employee Join (for non-admin)
  organizationId: string;
  inviteCode: string;
}

// Step component props
export interface OnboardingStepProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onPrev?: () => void;
  isLoading?: boolean;
}

// Join organization validation result
export interface JoinOrganizationResult {
  success: boolean;
  error?: string;
}

// Complete onboarding result
export interface CompleteOnboardingResult {
  success: boolean;
  organizationId: string;
  organizationSlug: string;
  userId: string;
}
