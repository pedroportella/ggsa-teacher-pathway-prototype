import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders', () => {
    render(<Breadcrumb links={[{ href: '#', label: 'Example crumb' }]} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
