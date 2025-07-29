'use client';

import { DriverForm } from '@/features/drivers/DriverForm';
import { createDriverAction, updateDriverAction } from '@/lib/actions/driverActions';
import type { DriverFormData, DriverUpdateData } from '@/types/drivers';

type DriverFormFeatureProps = {
  mode?: 'create' | 'edit';
  userId?: string;
  orgId: string;
  onSuccess?: () => void;
};

export function DriverFormFeature({
  mode = 'create',
  userId,
  orgId,
  onSuccess,
}: DriverFormFeatureProps) {
  const handleSubmit = async (data: DriverFormData | DriverUpdateData) => {
    if (mode === 'edit' && userId) {
      await updateDriverAction(userId, data);
    } else {
      await createDriverAction(orgId, data);
    }
    if (onSuccess) onSuccess();
  };

  return <DriverForm onSubmit={handleSubmit} mode={mode} />;
}
