import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BackToTop } from './BackToTop';

describe('BackToTop', () => {
  it('renders', () => {
    render(<BackToTop />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
