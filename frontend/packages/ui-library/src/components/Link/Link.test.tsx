import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders', () => {
    render(<Link href="#">Example content</Link>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
