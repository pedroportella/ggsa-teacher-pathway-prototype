import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Figure } from './Figure';

describe('Figure', () => {
  it('renders', () => {
    render(<Figure src="/example.png" alt="Example image" caption="Example caption"/>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
