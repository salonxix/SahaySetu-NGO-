import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { TrustPurpose } from '@/components/landing/TrustPurpose';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ForNgos } from '@/components/landing/ForNgos';
import { ForUsers } from '@/components/landing/ForUsers';
import { SchemesPreview } from '@/components/landing/SchemesPreview';
import { AccessibilitySection } from '@/components/landing/AccessibilitySection';
import { FinalCta } from '@/components/landing/FinalCta';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main id="main-content" style={{ flex: 1 }}>
        <Hero />
        <TrustPurpose />
        <HowItWorks />
        <ForNgos />
        <ForUsers />
        <SchemesPreview />
        <AccessibilitySection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
