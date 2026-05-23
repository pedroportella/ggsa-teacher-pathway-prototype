import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Search } from './Search';

describe('Search', () => {
  it('renders', () => {
    render(<Search label="Example search" placeholder="Example" action="#" />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
