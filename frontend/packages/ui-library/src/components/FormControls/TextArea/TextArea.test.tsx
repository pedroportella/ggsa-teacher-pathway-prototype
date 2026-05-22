import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('renders', () => {
    render(<TextArea id="example" label="Example text area" />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
