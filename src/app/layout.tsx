import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { InteractiveAmbientCanvas } from '@/components/ui/InteractiveAmbientCanvas';

export const metadata: Metadata = {
  title: 'SahaySetu NGO | Empowering Social Impact & Civic Schemes',
  description:
    'SahaySetu is an HCI-focused platform connecting NGOs, volunteers, and citizens to government schemes and civic impact initiatives.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <InteractiveAmbientCanvas />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
