
import { listDriversByOrg } from '@/lib/fetchers/driverFetchers';
import { DriversListClient } from './DriversListClient';

interface DriversListProps {
  orgId: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

// Server component: fetch drivers and pass to client subcomponent
export default async function DriversList({ orgId, searchParams }: DriversListProps) {
  const filters = {
    page: searchParams?.page ? Number(searchParams.page) : 1,
    limit: searchParams?.limit ? Number(searchParams.limit) : 20,
    search: typeof searchParams?.q === 'string' ? searchParams.q : "",
  };
  const { data } = await listDriversByOrg(orgId, filters);
  return <DriversListClient drivers={data} orgId={orgId} />;
}
