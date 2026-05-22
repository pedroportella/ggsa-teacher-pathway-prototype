import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator';

describe('Separator', () => {
  it('renders', () => {
    render(<Separator />);
    expect(screen.getByLabelText(/Example separator/i)).toBeTruthy();
  });
});
