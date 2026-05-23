import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QuickExit } from './QuickExit';

describe('QuickExit', () => {
  it('renders', () => {
    render(<QuickExit href="#" />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
