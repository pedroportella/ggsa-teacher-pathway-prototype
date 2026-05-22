import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders side navigation links', () => {
    render(<Sidebar links={[{ href: '/example', label: 'Example section' }]} title="Sections" />);

    expect(screen.getByRole('complementary', { name: /side navigation/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /example section/i })).toBeTruthy();
  });
});
