import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('renders', () => {
    render(
      <Tabs
        tabs={[{ id: 'example-tab', label: 'Example tab', content: 'Example panel', active: true }]}
      />,
    );
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
