'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NgoRegistrationGuideRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ngo/dashboard?tab=registration-guide');
  }, [router]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <p>Loading NGO Registration & Government Support Guide...</p>
      </div>
    </div>
  );
}
