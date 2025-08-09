import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { logTripAction } from '@/lib/actions/ifta/tripActions';

interface TripLoggerProps {
  orgId: string;
}

export function TripLoggerFeature({ orgId }: TripLoggerProps) {
  return (
    <form action={(formData) => logTripAction(orgId, formData)} className="space-y-4">
      <Input name="date" type="date" required />
      <Input name="vehicleId" placeholder="Vehicle ID" required />
      <Input name="loadId" placeholder="Load ID" />
      <Input name="jurisdiction" placeholder="State" required />
      <Input name="distance" type="number" step="0.1" placeholder="Miles" required />
      <Button type="submit">Log Trip</Button>
    </form>
  );
}

export default TripLoggerFeature;
