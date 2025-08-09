'use client';

import { useOptimistic } from 'react';
import { Switch } from '@/components/ui/switch';
import { updateFeatureToggle } from '@/lib/actions/settings/featureToggleActions';

type FeatureToggleFeatureProps = {
  orgId: string;
  flags: Record<string, boolean>;
};

export function FeatureToggleFeature({ orgId, flags }: FeatureToggleFeatureProps) {
  const [optimisticFlags, setOptimisticFlags] = useOptimistic(flags);

  const handleToggle = async (feature: string, enabled: boolean) => {
    setOptimisticFlags({ ...optimisticFlags, [feature]: enabled });
    await updateFeatureToggle({ orgId, feature, enabled });
  };

  return (
    <div className="space-y-4">
      {Object.entries(optimisticFlags).map(([feature, enabled]) => (
        <div key={feature} className="flex items-center justify-between">
          <span className="capitalize">{feature}</span>
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => handleToggle(feature, checked)}
          />
        </div>
      ))}
    </div>
  );
}
