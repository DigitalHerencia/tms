'use client';

import { DataTable } from '@/components/ui/data-table';
import {
  tripColumns,
  reportColumns,
  type IFTATrip,
  type IFTAReport,
} from '@/components/ifta/ifta-columns';

interface IftaTripTableProps {
  data: IFTATrip[];
}

interface IftaReportTableProps {
  data: IFTAReport[];
}

export function IftaTripTableClient({ data }: IftaTripTableProps) {
  return <DataTable columns={tripColumns} data={data} />;
}

export function IftaReportTableClient({ data }: IftaReportTableProps) {
  return <DataTable columns={reportColumns} data={data} />;
}
