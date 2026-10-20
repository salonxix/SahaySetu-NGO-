import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Navbar } from '@/components/landing/Navbar';
import { SchemesPreview } from '@/components/landing/SchemesPreview';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { AccessibilitySection } from '@/components/landing/AccessibilitySection';

describe('Landing Subcomponents', () => {
  describe('Navbar', () => {
    it('renders logo and navigation links', () => {
      render(<Navbar />);
      expect(screen.getByText('SahaySetu')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Home$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Explore Schemes$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^For NGOs$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Login$/i })).toBeInTheDocument();
    });

    it('toggles mobile menu when clicked', () => {
      render(<Navbar />);
      const toggleBtn = screen.getByRole('button', { name: /Toggle Navigation Menu/i });
      expect(toggleBtn).toBeInTheDocument();

      fireEvent.click(toggleBtn);
      expect(toggleBtn).toHaveTextContent(/Close/i);

      fireEvent.click(toggleBtn);
      expect(toggleBtn).toHaveTextContent(/Menu/i);
    });
  });

  describe('SchemesPreview', () => {
    it('switches categories when tab is clicked', () => {
      render(<SchemesPreview />);
      expect(screen.getByText('National Digital Literacy Mission Aid')).toBeInTheDocument();

      const healthcareTab = screen.getByRole('tab', { name: /Healthcare/i });
      fireEvent.click(healthcareTab);

      expect(screen.getByText('Rural Primary Health Outreach Grant')).toBeInTheDocument();

      const envTab = screen.getByRole('tab', { name: /Environment/i });
      fireEvent.click(envTab);

      expect(screen.getByText('Community Afforestation & Watershed Aid')).toBeInTheDocument();
    });
  });

  describe('HowItWorks', () => {
    it('renders all four workflow steps', () => {
      render(<HowItWorks />);
      expect(screen.getByText('Discover')).toBeInTheDocument();
      expect(screen.getByText('Understand')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Track')).toBeInTheDocument();
    });
  });

  describe('AccessibilitySection', () => {
    it('renders core accessibility commitments', () => {
      render(<AccessibilitySection />);
      expect(screen.getByText('Low-Bandwidth Optimized')).toBeInTheDocument();
      expect(screen.getByText('Accessible by Design')).toBeInTheDocument();
      expect(screen.getByText('Plain, Jargon-Free Language')).toBeInTheDocument();
      expect(screen.getByText('Multilingual Foundation')).toBeInTheDocument();
    });
  });
});
