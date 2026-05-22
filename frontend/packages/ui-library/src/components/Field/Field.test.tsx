import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field } from './Field';

describe('Field', () => {
  it('renders', () => {
    render(<Field label="Example field">Example content</Field>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
