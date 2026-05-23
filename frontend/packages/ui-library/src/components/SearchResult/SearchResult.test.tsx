import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SearchResult } from './SearchResult';

describe('SearchResult', () => {
  it('renders', () => {
    render(<SearchResult title="Example result" href="#" />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
