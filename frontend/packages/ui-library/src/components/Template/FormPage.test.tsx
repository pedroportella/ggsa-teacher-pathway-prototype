import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormPage } from './FormPage';

describe('FormPage', () => {
  it('renders', () => {
    render(<FormPage title="Example FormPage">Example content</FormPage>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
