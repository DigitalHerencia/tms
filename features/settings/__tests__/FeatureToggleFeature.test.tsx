// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const user = userEvent.setup();
    await user.click(toggle);
    expect(updateFeatureToggle).toHaveBeenCalledWith({ orgId: 'org1', feature: 'demo', enabled: true });
  });
});
