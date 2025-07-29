# Feature Flags

FleetFusion allows certain features to be toggled at runtime via environment variables or a remote feature management service.

## NEXT_PUBLIC_ENABLE_AUTH

- **Description:** Enables Clerk authentication and route protection.
- **Default:** `true`
- **Usage:** Set `NEXT_PUBLIC_ENABLE_AUTH=false` in your environment to disable authentication. If this variable is not set, FleetFusion attempts to fetch the flag from the service defined by `FEATURE_SERVICE_URL`.

## FEATURE_SERVICE_URL

- **Description:** Optional HTTP endpoint returning feature flag settings.
- **Format:** `https://your-flags-service.com/api`
- **Usage:** When provided, `isAuthFeatureEnabled` will fetch `/auth` from this service if no environment variable is set.

The helper `isAuthFeatureEnabled` in `lib/config/featureFlags.ts` exposes the flag state for runtime checks.
