import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListingPage } from './ListingPage';

describe('ListingPage', () => {
  it('renders', () => {
    render(<ListingPage title="Example ListingPage">Example content</ListingPage>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
