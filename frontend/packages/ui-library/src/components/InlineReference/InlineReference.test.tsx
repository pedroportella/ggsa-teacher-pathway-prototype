import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InlineReference } from './InlineReference';

describe('InlineReference', () => {
  it('renders', () => {
    render(<InlineReference title="Example reference">Example content</InlineReference>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
