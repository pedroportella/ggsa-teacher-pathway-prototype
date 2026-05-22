import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Facet } from './Facet';

describe('Facet', () => {
  it('renders', () => {
    render(<Facet title="Example facet">Example content</Facet>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
