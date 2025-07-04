import type { UserRole } from './auth';

export interface OnboardingStatus {
  isComplete: boolean;
  currentStep: 'profile' | 'company' | 'complete';
  steps: {
    profile: boolean;
    company: boolean;
  };
  user: {
    id: string;
    clerkId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    inviteCode?: string | null;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProfileSetupData {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface CompanySetupData {
  dotNumber?: string;
  mcNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  timezone?: string;
  dateFormat?: string;
  distanceUnit?: 'miles' | 'kilometers';
  fuelUnit?: 'gallons' | 'liters';
}

export type OnboardingStepData = ProfileSetupData | CompanySetupData;

export interface OnboardingStepProps {
  onNext: (data: OnboardingStepData) => void;
  onPrevious?: () => void;
  initialData?: Partial<OnboardingStepData>;
  isLoading?: boolean;
}

export interface JoinOrganizationResult {
  success: boolean;
  error?: string;
}
