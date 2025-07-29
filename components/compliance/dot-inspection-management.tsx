import { getDOTInspections } from '@/lib/fetchers/complianceFetchers';
import { DOTInspectionManagementClient } from './dot-inspection-management-client';
import type { DOTInspection } from '@/types/compliance';

interface Props {
  orgId: string;
}

export async function DOTInspectionManagement({ orgId }: Props) {
  const result = await getDOTInspections(orgId);
  const inspections = (result as any).success ? (result as any).data as DOTInspection[] : [];
  return <DOTInspectionManagementClient orgId={orgId} initialInspections={inspections} />;
}
