import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SideNav } from './SideNav';

describe('SideNav', () => {
  it('renders', () => {
    render(<SideNav links={[{ href: '#', label: 'Example side nav' }]} title="Example title" />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('complementary', { name: /side navigation/i })).toBeTruthy();
  });
});
