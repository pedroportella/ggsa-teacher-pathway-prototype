import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Band } from './Band';

describe('Band', () => {
  it('renders', () => {
    render(<Band title="Example band">Example content</Band>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });

  it('renders variants with actions and media', () => {
    render(
      <Band
        actions={[{ href: '#start', label: 'Start now' }]}
        description="Example description"
        image={{ alt: 'Example image', src: '/example.png' }}
        title="Example feature"
        variant="image"
      />,
    );

    expect(screen.getByRole('heading', { name: /Example feature/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Start now/i })).toBeTruthy();
    expect(screen.getByAltText(/Example image/i)).toBeTruthy();
  });
});
