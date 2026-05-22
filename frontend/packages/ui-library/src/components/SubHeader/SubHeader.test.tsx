import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SubHeader } from './SubHeader';

describe('SubHeader', () => {
  it('renders', () => {
    render(<SubHeader breadcrumbs={[{ href: '/', label: 'Home' }]} introduction="Example introduction" title="Example sub header">Example content</SubHeader>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1, name: /Example sub header/i })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: /Breadcrumb/i })).toBeTruthy();
  });
});
