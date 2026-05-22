import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
  it('renders', () => {
    render(<LandingPage title="Example LandingPage">Example content</LandingPage>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
