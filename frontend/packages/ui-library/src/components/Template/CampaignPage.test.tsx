import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CampaignPage } from './CampaignPage';

describe('CampaignPage', () => {
  it('renders', () => {
    render(<CampaignPage title="Example CampaignPage">Example content</CampaignPage>);
    expect(screen.getAllByText(/Example/i).length).toBeGreaterThan(0);
  });
});
