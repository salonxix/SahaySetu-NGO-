'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NgoProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ngo/dashboard?tab=profile');
  }, [router]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <p>Loading NGO Profile Workspace...</p>
      </div>
    </div>
  );
}
