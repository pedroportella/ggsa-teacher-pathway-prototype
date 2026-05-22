import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContentPage } from './ContentPage';

describe('ContentPage', () => {
  it('renders', () => {
    render(<ContentPage title="Example ContentPage">Example content</ContentPage>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
