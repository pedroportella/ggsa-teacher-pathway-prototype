import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Filter } from './Filter';

describe('Filter', () => {
  it('renders', () => {
    render(<Filter >Example content</Filter>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
