import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccordionGroup } from './AccordionGroup';

describe('AccordionGroup', () => {
  it('renders', () => {
    render(
      <AccordionGroup
        items={[{ id: 'example', title: 'Example accordion', content: 'Example body' }]}
      />,
    );
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
