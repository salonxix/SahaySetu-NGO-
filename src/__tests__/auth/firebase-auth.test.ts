import { describe, it, expect } from 'vitest';
import { getFirebaseErrorMessage } from '@/lib/firebase-errors';

describe('Firebase Error Handling', () => {
  it('maps email already in use error', () => {
    const error = { code: 'auth/email-already-in-use', message: 'Email in use' };
    expect(getFirebaseErrorMessage(error)).toBe('An account with this email already exists.');
  });

  it('maps invalid email error', () => {
    const error = { code: 'auth/invalid-email', message: 'Invalid email' };
    expect(getFirebaseErrorMessage(error)).toBe('Please enter a valid email address.');
  });

  it('maps invalid credential error', () => {
    const error = { code: 'auth/invalid-credential', message: 'Invalid credentials' };
    expect(getFirebaseErrorMessage(error)).toBe('Incorrect email or password.');
  });

  it('maps wrong password error', () => {
    const error = { code: 'auth/wrong-password', message: 'Wrong password' };
    expect(getFirebaseErrorMessage(error)).toBe('Incorrect email or password.');
  });

  it('maps network request failed error', () => {
    const error = { code: 'auth/network-request-failed', message: 'Network error' };
    expect(getFirebaseErrorMessage(error)).toBe('Unable to connect. Please try again.');
  });

  it('handles unknown or unexpected errors gracefully', () => {
    const error = { code: 'auth/unknown-code', message: 'Something else' };
    expect(getFirebaseErrorMessage(error)).toBe('An unexpected error occurred. Please try again.');
  });
});
