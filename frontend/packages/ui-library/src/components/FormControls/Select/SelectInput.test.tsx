import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SelectInput } from './SelectInput';

describe('SelectInput', () => {
  it('renders', () => {
    render(<SelectInput id="example" label="Example select" options={['Example option']} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
