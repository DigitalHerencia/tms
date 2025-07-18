'use client';

export function IftaReportTable() {
  return (
    <div className="grid gap-4">
      <div className="border-muted rounded-lg border bg-black p-4">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-2 text-left text-sm font-medium text-white">Quarter</th>
              <th className="p-2 text-left text-sm font-medium text-white">Filing Date</th>
              <th className="p-2 text-left text-sm font-medium text-white">Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}
