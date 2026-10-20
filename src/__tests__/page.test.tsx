import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '../app/page';

describe('Landing Page - Home', () => {
  it('renders the main brand name and hero headline', () => {
    render(<Home />);
    const brandLinks = screen.getAllByLabelText(/SahaySetu Home/i);
    expect(brandLinks.length).toBeGreaterThan(0);

    const mainHeading = screen.getByRole('heading', {
      name: /Connecting NGOs to the support they need/i,
      level: 1,
    });
    expect(mainHeading).toBeInTheDocument();
  });

  it('renders all key sections and navigation targets', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /Finding support shouldn't be another challenge/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /How SahaySetu Works/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Empowering NGOs with clarity and efficiency/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Connecting communities directly with trusted initiatives/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Explore Welfare Schemes by Category/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Designed for everyone, everywhere/i })
    ).toBeInTheDocument();
  });

  it('provides accessible call-to-actions to register and login', () => {
    render(<Home />);
    const registerNgoLinks = screen.getAllByRole('link', { name: /Register.*NGO/i });
    expect(registerNgoLinks.length).toBeGreaterThan(0);

    const exploreLinks = screen.getAllByRole('link', { name: /Explore Schemes/i });
    expect(exploreLinks.length).toBeGreaterThan(0);
  });
});
