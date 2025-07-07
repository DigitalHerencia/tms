import { getJurisdictionRates } from '@/lib/fetchers/iftaFetchers';
import { TaxRateManagerClient } from './TaxRateManagerClient';

export async function TaxRateManager() {
  const rates = await getJurisdictionRates();
  return <TaxRateManagerClient initialRates={rates} />;
}
