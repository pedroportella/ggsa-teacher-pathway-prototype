import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table } from './Table';

describe('Table', () => {
  it('renders', () => {
    render(<Table headers={['Example heading']} rows={[['Example cell']]} />);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
