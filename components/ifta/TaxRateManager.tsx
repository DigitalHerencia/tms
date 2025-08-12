import { getJurisdictionRates } from '@/lib/fetchers/iftaFetchers';
import { TaxRateManagerClient } from './TaxRateManagerClient';

export async function TaxRateManager({ orgId }: { orgId: string }) {
  const rates = await getJurisdictionRates(orgId);
  return <TaxRateManagerClient initialRates={rates} orgId={orgId} />;
}
