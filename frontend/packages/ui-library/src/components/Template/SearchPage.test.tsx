import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SearchPage } from './SearchPage';

describe('SearchPage', () => {
  it('renders', () => {
    render(<SearchPage title="Example SearchPage">Example content</SearchPage>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
