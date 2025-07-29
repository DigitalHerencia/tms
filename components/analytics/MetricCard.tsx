import React from 'react';

export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      {label}: {value}
    </div>
  );
}
