import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders', () => {
    render(<Footer links={[{ href: '#', label: 'Example footer' }]} />);
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Example footer/i })).toBeTruthy();
  });
});
