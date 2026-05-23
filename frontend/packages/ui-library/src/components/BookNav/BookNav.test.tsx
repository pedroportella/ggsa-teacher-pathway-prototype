import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BookNav } from './BookNav';

describe('BookNav', () => {
  it('renders', () => {
    render(<BookNav links={[{ href: '#', label: 'Example link' }]} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
