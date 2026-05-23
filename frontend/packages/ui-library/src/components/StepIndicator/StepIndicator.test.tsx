import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StepIndicator } from './StepIndicator';

describe('StepIndicator', () => {
  it('renders', () => {
    render(<StepIndicator steps={['Example step']} current={0} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
