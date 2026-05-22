import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  it('renders', () => {
    render(<Toolbar actions={[{ label: 'Example action' }]} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Example action/i })).toBeTruthy();
  });
});
