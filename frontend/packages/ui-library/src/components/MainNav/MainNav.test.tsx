import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MainNav } from './MainNav';

describe('MainNav', () => {
  it('renders', () => {
    render(<MainNav links={[{ href: '#', label: 'Example nav' }]} />);
    expect(screen.getByRole('navigation', { name: /main/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Example nav/i })).toBeTruthy();
  });
});
