import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pager } from './Pager';

describe('Pager', () => {
  it('renders', () => {
    render(<Pager previousHref="#" nextHref="#" />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
