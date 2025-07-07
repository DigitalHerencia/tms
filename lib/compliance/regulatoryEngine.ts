'use server';

import { calculateQuarterlyTaxes } from '@/lib/fetchers/iftaFetchers';
import { getHOSViolations, getComplianceAlerts } from '@/lib/fetchers/complianceFetchers';
import { getAuditLogs } from '@/lib/actions/auditLogActions';

export interface RegulatorySummary {
  quarter: string;
  year: number;
  ifta: Awaited<ReturnType<typeof calculateQuarterlyTaxes>>;
  hosViolations: number;
  safetyEvents: number;
  auditEvents: number;
}

/**
 * Aggregate IFTA, HOS, and safety compliance metrics
 */
export async function getRegulatoryComplianceSummary(
  organizationId: string,
  quarter: string,
  year: number
): Promise<RegulatorySummary> {
  const ifta = await calculateQuarterlyTaxes(organizationId, quarter, year.toString());
  const hos = await getHOSViolations(organizationId, { limit: 1 });
  const hosCount = (hos as any).success ? (hos as any).data.pagination.total : 0;
  const safety = await getComplianceAlerts(organizationId, { type: 'safety_event', limit: 1 });
  const safetyCount = (safety as any).success ? (safety as any).data.pagination.total : 0;
  const audits = await getAuditLogs(organizationId);

  return {
    quarter,
    year,
    ifta,
    hosViolations: hosCount,
    safetyEvents: safetyCount,
    auditEvents: audits.length,
  };
}
