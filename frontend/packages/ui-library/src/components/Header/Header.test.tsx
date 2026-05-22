import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders', () => {
    render(<Header subNavLinks={[{ href: '#contact', label: 'Contact' }]} />);
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /Search/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Good to Great Schools Australia/i })).toBeTruthy();
  });
});
