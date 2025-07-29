// Auth domain business logic entry point
//
// Exposes feature flag helpers and auth utilities.

import { isAuthFeatureEnabled as checkAuthFeature } from '@/lib/config/featureFlags'

// Re-export feature flag helper so consumers can import from this domain module
export const isAuthFeatureEnabled = checkAuthFeature
