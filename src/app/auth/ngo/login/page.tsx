'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getFirebaseErrorMessage } from '@/lib/firebase-errors';
import { AuthCard } from '@/components/auth/AuthCard';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { FeedbackMessage } from '@/components/auth/FeedbackMessage';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types/auth';

function NgoLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setErrorMessage('NGO authentication required to access this resource.');
    } else if (errorParam === 'role_mismatch') {
      setErrorMessage('Access denied: You must be signed in as an NGO organization.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const newFieldErrors: Record<string, string[]> = {};
    if (!formData.email.trim()) {
      newFieldErrors.email = ['Official NGO email is required'];
    }
    if (!formData.password) {
      newFieldErrors.password = ['Password is required'];
    }
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const userCredential = await signInWithEmailAndPassword(auth, email, formData.password);
      const uid = userCredential.user.uid;

      // Check role directly from Firestore
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      let actualRole: UserRole = 'ngo';
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        if (data.role === 'user') {
          actualRole = 'user';
        }
      }

      setSuccessMessage('Welcome back! Redirecting to NGO portal...');
      await refreshUser();

      if (actualRole === 'user') {
        router.push('/user/dashboard');
      } else {
        const redirectParam = searchParams.get('redirect');
        router.push(redirectParam || '/ngo/dashboard');
      }
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="NGO Organization Sign In"
      subtitle="Access NGO verified schemes, beneficiary applications, and reports"
      role="ngo"
      mode="login"
      onRoleChange={() => router.push('/auth/user/login')}
    >
      <FeedbackMessage type="error" message={errorMessage} />
      <FeedbackMessage type="success" message={successMessage} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="ngo-email" className="form-label">
            <span>
              Official NGO Email <span className="required">*</span>
            </span>
          </label>
          <input
            id="ngo-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="director@organization.org"
            className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
            required
            autoComplete="email"
          />
          {fieldErrors.email && (
            <span className="form-error-msg">{fieldErrors.email[0]}</span>
          )}
        </div>

        <PasswordInput
          id="ngo-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password?.[0]}
          required
        />

        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" disabled={submitting} className="btn btn-ngo">
            {submitting ? 'Signing In...' : 'Sign In to NGO Portal'}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}

export default function NgoLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-container">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <p>Loading NGO login...</p>
          </div>
        </div>
      }
    >
      <NgoLoginContent />
    </Suspense>
  );
}
