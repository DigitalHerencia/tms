'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DriverAssignmentDialog } from '@/features/drivers/DriverAssignmentDialog';
import type { DriverAssignment } from '@/types/drivers';

export function AssignmentDialogButton({
  driverId,
  currentAssignment,
}: {
  driverId: string;
  currentAssignment?: Partial<DriverAssignment>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg"
        onClick={() => setOpen(true)}
      >
        {currentAssignment ? 'Reassign Driver' : 'Assign Driver'}
      </Button>
      <DriverAssignmentDialog
        driverId={driverId}
        open={open}
        onClose={() => setOpen(false)}
        currentAssignment={typeof currentAssignment === 'object' ? currentAssignment : undefined}
        onAssigned={() => setOpen(false)}
      />
    </>
  );
}
