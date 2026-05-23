import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Layout } from './Layout';

describe('Layout', () => {
  it('renders', () => {
    render(
      <Layout links={[{ href: '#', label: 'Example nav' }]} subHeader={{ title: 'Example page' }}>
        Example content
      </Layout>,
    );
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(screen.getByRole('main')).toBeTruthy();
  });
});
