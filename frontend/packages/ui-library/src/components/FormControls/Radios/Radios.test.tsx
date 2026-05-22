import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Radios } from './Radios';

describe('Radios', () => {
  it('renders', () => {
    render(<Radios legend="Example radios" name="example" options={[{ label: 'Example option', value: 'one' }]} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
