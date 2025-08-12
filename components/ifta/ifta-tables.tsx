'use client';

import { useState } from 'react';

import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
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
  const [query, setQuery] = useState('');
  const filtered = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(query.toLowerCase()),
    ),
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search trips..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <DataTable columns={tripColumns} data={filtered} />
    </div>
  );
}

export function IftaReportTableClient({ data }: IftaReportTableProps) {
  return <DataTable columns={reportColumns} data={data} />;
}
