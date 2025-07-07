'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RateRow {
  jurisdiction: string;
  rate: number;
}

interface TaxRateManagerClientProps {
  initialRates: Record<string, number>;
}

export function TaxRateManagerClient({ initialRates }: TaxRateManagerClientProps) {
  const [rates, setRates] = useState<RateRow[]>(
    Object.entries(initialRates).map(([j, r]) => ({ jurisdiction: j, rate: r }))
  );
  const [edited, setEdited] = useState<Record<string, number>>({});

  const handleChange = (j: string, val: string) => {
    setEdited(prev => ({ ...prev, [j]: parseFloat(val) || 0 }));
  };

  const applyChanges = () => {
    setRates(rates.map(r => ({
      ...r,
      rate: edited[r.jurisdiction] ?? r.rate,
    })));
    setEdited({});
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Jurisdiction Tax Rates</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">State</th>
            <th className="p-2 text-right">Rate</th>
          </tr>
        </thead>
        <tbody>
          {rates.map(row => (
            <tr key={row.jurisdiction} className="border-b">
              <td className="p-2">{row.jurisdiction}</td>
              <td className="p-2 text-right">
                <Input
                  className="w-24 text-right"
                  defaultValue={row.rate}
                  onChange={e => handleChange(row.jurisdiction, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button size="sm" onClick={applyChanges}>
        Save Changes
      </Button>
    </div>
  );
}
