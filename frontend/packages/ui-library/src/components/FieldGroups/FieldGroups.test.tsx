import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FieldGroups } from './FieldGroups';

describe('FieldGroups', () => {
  it('renders', () => {
    render(<FieldGroups items={[{ label: 'Example label', value: 'Example value' }]} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
