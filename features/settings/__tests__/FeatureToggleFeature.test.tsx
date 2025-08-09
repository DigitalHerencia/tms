// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeatureToggleFeature } from '../FeatureToggleFeature';

vi.mock('@/lib/actions/settings/featureToggleActions', () => ({
  updateFeatureToggle: vi.fn(),
}));

describe('FeatureToggleFeature', () => {
  it('calls action on toggle', async () => {
    const { updateFeatureToggle } = await import('@/lib/actions/settings/featureToggleActions');
    render(<FeatureToggleFeature orgId="org1" flags={{ demo: false }} />);
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(updateFeatureToggle).toHaveBeenCalledWith({ orgId: 'org1', feature: 'demo', enabled: true });
  });
});
