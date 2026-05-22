import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders', () => {
    render(<Button>Example button</Button>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
