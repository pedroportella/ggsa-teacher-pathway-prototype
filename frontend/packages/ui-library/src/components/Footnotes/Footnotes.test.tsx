import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footnotes } from './Footnotes';

describe('Footnotes', () => {
  it('renders', () => {
    render(<Footnotes items={['Example footnote']}/>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
