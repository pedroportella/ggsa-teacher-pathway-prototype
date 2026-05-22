import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkboxes } from './Checkboxes';

describe('Checkboxes', () => {
  it('renders', () => {
    render(<Checkboxes legend="Example checkboxes" name="example" options={[{ label: 'Example option', value: 'one' }]} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
