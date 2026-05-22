import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Listing } from './Listing';

describe('Listing', () => {
  it('renders', () => {
    render(<Listing title="Example listing" href="#">Example content</Listing>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
