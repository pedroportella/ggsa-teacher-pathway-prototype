import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout } from './Callout';

describe('Callout', () => {
  it('renders', () => {
    render(<Callout title="Example callout">Example body</Callout>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
