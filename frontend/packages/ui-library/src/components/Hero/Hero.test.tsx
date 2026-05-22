import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders', () => {
    render(<Hero title="Example hero">Example content</Hero>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
