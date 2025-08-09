import { IftaReportingFeature } from '@/features/ifta/IftaReportingFeature';

export default async function Page({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;
  return <IftaReportingFeature orgId={orgId} />;
}
