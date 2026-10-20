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

const FOCUS_SECTORS = [
  'Education & Literacy',
  'Health & Family Welfare',
  'Rural Development',
  'Women Empowerment',
  'Child Welfare',
  'Environment & Forests',
  'Skill Development & Livelihood',
  'Disability Support',
  'Elderly Care',
  'Other Civic Welfare',
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

export default function NgoRegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    ngoName: '',
    registrationNumber: '',
    focusSector: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    state: '',
    city: '',
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
    if (!formData.ngoName.trim()) {
      newFieldErrors.ngoName = ['NGO organization name is required'];
    }
    if (!formData.registrationNumber.trim()) {
      newFieldErrors.registrationNumber = ['Registration / Darpan ID is required'];
    }
    if (!formData.focusSector) {
      newFieldErrors.focusSector = ['Please select a focus sector'];
    }
    if (!formData.contactPerson.trim()) {
      newFieldErrors.contactPerson = ['Contact person name is required'];
    }
    if (!formData.email.trim()) {
      newFieldErrors.email = ['Official email is required'];
    }
    if (!formData.phoneNumber.trim()) {
      newFieldErrors.phoneNumber = ['Phone number is required'];
    }
    if (!formData.state) {
      newFieldErrors.state = ['Please select an operating state'];
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
        name: formData.ngoName.trim(),
        email,
        role: 'ngo',
        createdAt: serverTimestamp(),
      });

      setSuccessMessage('Registration successful! Redirecting to NGO portal...');
      await refreshUser();
      router.push('/ngo/dashboard');
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Register NGO Organization"
      subtitle="Join the SahaySetu platform to connect with schemes and reach citizens"
      role="ngo"
      mode="register"
      onRoleChange={() => router.push('/auth/user/register')}
    >
      <FeedbackMessage type="error" message={errorMessage} />
      <FeedbackMessage type="success" message={successMessage} />

      <form onSubmit={handleSubmit} noValidate>
        {/* NGO Name */}
        <div className="form-group">
          <label htmlFor="ngoName" className="form-label">
            <span>
              NGO / Organization Name <span className="required">*</span>
            </span>
          </label>
          <input
            id="ngoName"
            name="ngoName"
            type="text"
            value={formData.ngoName}
            onChange={handleChange}
            placeholder="e.g. Gram Vikas Seva Sansthan"
            className={`form-input ${fieldErrors.ngoName ? 'input-error' : ''}`}
            required
          />
          {fieldErrors.ngoName && (
            <span className="form-error-msg">{fieldErrors.ngoName[0]}</span>
          )}
        </div>

        {/* Registration & Focus Sector in 2 cols */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="registrationNumber" className="form-label">
              <span>
                NGO Darpan / Reg ID <span className="required">*</span>
              </span>
            </label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g. DL/2021/0284918"
              className={`form-input ${fieldErrors.registrationNumber ? 'input-error' : ''}`}
              required
            />
            {fieldErrors.registrationNumber && (
              <span className="form-error-msg">{fieldErrors.registrationNumber[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="focusSector" className="form-label">
              <span>
                Primary Focus Sector <span className="required">*</span>
              </span>
            </label>
            <select
              id="focusSector"
              name="focusSector"
              value={formData.focusSector}
              onChange={handleChange}
              className={`form-select ${fieldErrors.focusSector ? 'input-error' : ''}`}
              required
            >
              <option value="">Select sector</option>
              {FOCUS_SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
            {fieldErrors.focusSector && (
              <span className="form-error-msg">{fieldErrors.focusSector[0]}</span>
            )}
          </div>
        </div>

        {/* Contact Person & Phone */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="contactPerson" className="form-label">
              <span>
                Contact Person Name <span className="required">*</span>
              </span>
            </label>
            <input
              id="contactPerson"
              name="contactPerson"
              type="text"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g. Aarav Sharma"
              className={`form-input ${fieldErrors.contactPerson ? 'input-error' : ''}`}
              required
            />
            {fieldErrors.contactPerson && (
              <span className="form-error-msg">{fieldErrors.contactPerson[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              <span>
                Phone Number <span className="required">*</span>
              </span>
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className={`form-input ${fieldErrors.phoneNumber ? 'input-error' : ''}`}
              required
            />
            {fieldErrors.phoneNumber && (
              <span className="form-error-msg">{fieldErrors.phoneNumber[0]}</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <span>
              Official Email Address <span className="required">*</span>
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@organization.org"
            className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
            required
            autoComplete="email"
          />
          {fieldErrors.email && (
            <span className="form-error-msg">{fieldErrors.email[0]}</span>
          )}
        </div>

        {/* State & City */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="state" className="form-label">
              <span>
                Operating State <span className="required">*</span>
              </span>
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`form-select ${fieldErrors.state ? 'input-error' : ''}`}
              required
            >
              <option value="">Select State</option>
              {STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {fieldErrors.state && (
              <span className="form-error-msg">{fieldErrors.state[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="city" className="form-label">
              <span>City / District</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. New Delhi"
              className="form-input"
            />
          </div>
        </div>

        {/* Passwords */}
        <PasswordInput
          id="password"
          name="password"
          label="Account Password"
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
          <button type="submit" disabled={submitting} className="btn btn-ngo">
            {submitting ? 'Registering NGO...' : 'Create NGO Account'}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
