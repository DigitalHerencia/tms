"use client";

import { AssignmentDialogButton } from '@/features/drivers/AssignmentDialogButton';

interface AssignmentDialogWrapperProps {
  driverId: string;
  currentAssignment: any;
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
