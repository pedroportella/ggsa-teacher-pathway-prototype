import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { References } from './References';

describe('References', () => {
  it('renders', () => {
    render(<References items={['Example reference']} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
