import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
  it('renders', () => {
    render(<Image src="/example.png" alt="Example image" />);
    expect(screen.getByAltText(/Example image/i)).toBeTruthy();
  });
});
