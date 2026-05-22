import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageAlerts } from './PageAlerts';

describe('PageAlerts', () => {
  it('renders', () => {
    render(<PageAlerts title="Example alert">Example content</PageAlerts>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
