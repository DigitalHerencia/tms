"use client";

import { AssignmentDialogButton } from '@/features/drivers/AssignmentDialogButton';
import type { DriverAssignment } from '@/types/drivers';

interface AssignmentDialogWrapperProps {
  driverId: string;
  currentAssignment: Partial<DriverAssignment>;
}

export function AssignmentDialogWrapper({ driverId, currentAssignment }: AssignmentDialogWrapperProps) {
  return (
    <div className="flex items-center justify-center w-full py-4">
      <AssignmentDialogButton 
        driverId={driverId} 
        currentAssignment={currentAssignment}
      />
    </div>
  );
}
