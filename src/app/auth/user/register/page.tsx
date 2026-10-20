'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getFirebaseErrorMessage } from '@/lib/firebase-errors';
import { AuthCard } from '@/components/auth/AuthCard';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { FeedbackMessage } from '@/components/auth/FeedbackMessage';
import { useAuth } from '@/context/AuthContext';

const LANGUAGES = [
  'Hindi', 'English', 'Bengali', 'Marathi', 'Telugu', 'Tamil',
  'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi'
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

export default function UserRegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    state: '',
    preferredLanguage: 'Hindi',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
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
    if (!formData.fullName.trim()) {
      newFieldErrors.fullName = ['Full name is required'];
    }
    if (!formData.email.trim()) {
      newFieldErrors.email = ['Email address is required'];
    }
    if (!formData.password) {
      newFieldErrors.password = ['Password is required'];
    } else if (formData.password.length < 6) {
      newFieldErrors.password = ['Password must be at least 6 characters'];
    }
    if (formData.password !== formData.confirmPassword) {
      newFieldErrors.confirmPassword = ['Passwords do not match'];
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        name: formData.fullName.trim(),
        email,
        role: 'user',
        createdAt: serverTimestamp(),
      });

      setSuccessMessage('Registration successful! Redirecting to discovery dashboard...');
      await refreshUser();
      router.push('/user/dashboard');
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create Citizen Account"
      subtitle="Register to discover eligible government welfare schemes & assistance"
      role="user"
      mode="register"
      onRoleChange={() => router.push('/auth/ngo/register')}
    >
      <FeedbackMessage type="error" message={errorMessage} />
      <FeedbackMessage type="success" message={successMessage} />

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">
            <span>
              Full Name <span className="required">*</span>
            </span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Pooja Verma"
            className={`form-input ${fieldErrors.fullName ? 'input-error' : ''}`}
            required
            autoComplete="name"
          />
          {fieldErrors.fullName && (
            <span className="form-error-msg">{fieldErrors.fullName[0]}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <span>
              Email Address <span className="required">*</span>
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="citizen@example.com"
            className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
            required
            autoComplete="email"
          />
          {fieldErrors.email && (
            <span className="form-error-msg">{fieldErrors.email[0]}</span>
          )}
        </div>

        {/* Phone & State */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              <span>Phone Number</span>
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+91 9123456780"
              className={`form-input ${fieldErrors.phoneNumber ? 'input-error' : ''}`}
            />
            {fieldErrors.phoneNumber && (
              <span className="form-error-msg">{fieldErrors.phoneNumber[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="state" className="form-label">
              <span>State / Region</span>
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select State</option>
              {STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferred Language */}
        <div className="form-group">
          <label htmlFor="preferredLanguage" className="form-label">
            <span>Preferred Language</span>
          </label>
          <select
            id="preferredLanguage"
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            className="form-select"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Passwords */}
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password?.[0]}
          showStrength
          required
        />

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            <span>
              Confirm Password <span className="required">*</span>
            </span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={`form-input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
            required
            autoComplete="new-password"
          />
          {fieldErrors.confirmPassword && (
            <span className="form-error-msg">{fieldErrors.confirmPassword[0]}</span>
          )}
        </div>

        <div style={{ marginTop: '1.75rem' }}>
          <button type="submit" disabled={submitting} className="btn btn-user">
            {submitting ? 'Creating Account...' : 'Register as Citizen'}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
