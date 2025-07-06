/**
 * Onboarding Feature - Clean, comprehensive onboarding system
 *
 * This feature provides a multi-step onboarding flow for new users:
 * 1. Personal Information - Basic user details
 * 2. Role Selection - Choose user role in the organization
 * 3. Setup - Company creation (admin) or organization joining (employee)
 * 4. Review & Submit - Final review and completion
 */

export { OnboardingFlow } from "./OnboardingFlow";

// Component exports
export { PersonalInfoStep } from "../../components/onboarding/PersonalInfoStep";
export { RoleSelectionStep } from "../../components/onboarding/RoleSelectionStep";
export { CompanySetupStep } from "../../components/onboarding/CompanySetupStep";
export { EmployeeJoinStep } from "../../components/onboarding/EmployeeJoinStep";
export { ReviewSubmitStep } from "../../components/onboarding/ReviewSubmitStep";
