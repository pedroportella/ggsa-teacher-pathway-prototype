import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders', () => {
    render(<Card title="Example card">Example body</Card>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
