import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LabelMandatory } from './LabelMandatory';

describe('LabelMandatory', () => {
  it('renders', () => {
    render(<LabelMandatory />);
    expect(screen.getByTitle(/required/i)).toBeTruthy();
  });
});
