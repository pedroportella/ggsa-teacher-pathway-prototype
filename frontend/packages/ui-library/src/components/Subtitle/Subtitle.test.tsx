import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Subtitle } from './Subtitle';

describe('Subtitle', () => {
  it('renders', () => {
    render(<Subtitle>Example content</Subtitle>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
