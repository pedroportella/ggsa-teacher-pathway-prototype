import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders', () => {
    render(<TextInput id="example" label="Example text" />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
