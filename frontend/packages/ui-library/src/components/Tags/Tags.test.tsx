import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tags } from './Tags';

describe('Tags', () => {
  it('renders', () => {
    render(<Tags items={['Example tag']} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
