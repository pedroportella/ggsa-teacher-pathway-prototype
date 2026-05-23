import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReleaseStatus } from './ReleaseStatus';

describe('ReleaseStatus', () => {
  it('renders', () => {
    render(<ReleaseStatus>Example content</ReleaseStatus>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
