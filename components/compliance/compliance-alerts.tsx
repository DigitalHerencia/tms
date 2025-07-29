import { getComplianceAlerts } from '@/lib/fetchers/complianceFetchers';
import { ComplianceAlertsClient } from './compliance-alerts-client';
import type { ComplianceAlert } from '@/types/compliance';

interface Props {
  orgId: string;
}

export async function ComplianceAlerts({ orgId }: Props) {
  const result = await getComplianceAlerts(orgId, { limit: 50 });
  const alerts = (result as any).success ? ((result as any).data.alerts as ComplianceAlert[]) : [];
  return <ComplianceAlertsClient orgId={orgId} initialAlerts={alerts} />;
}
