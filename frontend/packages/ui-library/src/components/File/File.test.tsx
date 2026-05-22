import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { File } from './File';

describe('File', () => {
  it('renders', () => {
    render(<File href="#" name="Example file"/>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
