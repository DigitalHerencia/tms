'use client';

export function IftaReportTable() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-2 text-left text-sm font-medium">Quarter</th>
              <th className="p-2 text-left text-sm font-medium">Filing Date</th>
              <th className="p-2 text-left text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}
