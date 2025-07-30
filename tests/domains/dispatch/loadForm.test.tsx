import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadForm } from '@/components/dispatch/load-form';
import React from 'react';

describe('LoadForm validation', () => {
  it('shows validation errors for required fields', async () => {
    render(
      <LoadForm orgId="org1" drivers={[]} vehicles={[]} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /create load/i }));
    expect(await screen.findByText('Load number is required')).toBeInTheDocument();
    expect(screen.getByText('Origin address is required')).toBeInTheDocument();
    expect(screen.getByText('Destination address is required')).toBeInTheDocument();
  });
});
