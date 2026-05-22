import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders', () => {
    render(<Tooltip label="Example tooltip">Example content</Tooltip>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
