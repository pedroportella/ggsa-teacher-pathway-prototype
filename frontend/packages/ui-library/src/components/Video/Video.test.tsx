import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Video } from './Video';

describe('Video', () => {
  it('renders', () => {
    render(<Video title="Example video" />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
