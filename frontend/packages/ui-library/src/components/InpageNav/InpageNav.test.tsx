import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InpageNav } from './InpageNav';

describe('InpageNav', () => {
  it('renders', () => {
    render(<InpageNav links={[{ href: '#example', label: 'Example section' }]} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
