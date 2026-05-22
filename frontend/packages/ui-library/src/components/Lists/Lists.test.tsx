import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Lists } from './Lists';

describe('Lists', () => {
  it('renders', () => {
    render(<Lists items={['Example item']}/>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
