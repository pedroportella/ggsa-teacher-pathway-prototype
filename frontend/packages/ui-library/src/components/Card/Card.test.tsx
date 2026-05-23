import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, Panel } from './Card';

describe('Card', () => {
  it('renders', () => {
    render(<Card title="Example card">Example body</Card>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });

  it('applies custom class names to the root card', () => {
    const { container } = render(<Card className="custom-card" title="Example card">Example body</Card>);
    const card = container.querySelector('article');

    expect(card?.classList.contains('health-card')).toBe(true);
    expect(card?.classList.contains('custom-card')).toBe(true);
  });

  it('applies custom class names to the root panel', () => {
    const { container } = render(<Panel className="custom-panel" title="Example panel">Example body</Panel>);
    const panel = container.querySelector('section');

    expect(panel?.classList.contains('panel')).toBe(true);
    expect(panel?.classList.contains('custom-panel')).toBe(true);
  });
});
