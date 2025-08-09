import { getCompanyProfile } from '@/lib/fetchers/settingsFetchers';
import { CompanyProfileForm } from '@/components/settings/CompanyProfileForm';
import { updateCompanyProfileAction } from '@/lib/actions/settingsActions';
import { FeatureToggleFeature } from '@/features/settings/FeatureToggleFeature';
import { getTenantFeatureFlags } from '@/lib/tenantConfig';

export default async function CompanySettingsPage({ orgId }: { orgId: string }) {
  const profile = await getCompanyProfile(orgId);
  const flags = await getTenantFeatureFlags(orgId);
  // ...render form and handle submit with server action...
  return (
    <>
      <CompanyProfileForm profile={profile} onSubmit={() => {}} />
      <FeatureToggleFeature orgId={orgId} flags={flags} />
    </>
  );
}
