import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('renders', () => {
    render(<Accordion id="example" title="Example accordion">Example body</Accordion>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
