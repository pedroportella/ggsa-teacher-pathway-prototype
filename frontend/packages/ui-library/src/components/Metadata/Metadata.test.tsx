import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Metadata } from './Metadata';

describe('Metadata', () => {
  it('renders', () => {
    render(<Metadata items={[{ label: 'Example label', value: 'Example value' }]} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
