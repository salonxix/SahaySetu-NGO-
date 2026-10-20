import { describe, it, expect } from 'vitest';
import {
  registerNgoSchema,
  registerUserSchema,
  loginSchema,
  passwordSchema,
} from '@/lib/auth/validation';

describe('Auth Validation Schemas', () => {
  describe('Password Strength Schema', () => {
    it('accepts strong passwords with letters and numbers', () => {
      const result = passwordSchema.safeParse('Password123');
      expect(result.success).toBe(true);
    });

    it('rejects passwords shorter than 8 characters', () => {
      const result = passwordSchema.safeParse('Pass1');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 8 characters');
      }
    });

    it('rejects passwords without numbers', () => {
      const result = passwordSchema.safeParse('PasswordOnly');
      expect(result.success).toBe(false);
    });

    it('rejects passwords without letters', () => {
      const result = passwordSchema.safeParse('123456789');
      expect(result.success).toBe(false);
    });
  });

  describe('NGO Registration Schema', () => {
    const validNgo = {
      ngoName: 'Pratham NGO',
      registrationNumber: 'DL/2020/00192',
      focusSector: 'Education',
      contactPerson: 'Ravi Kumar',
      email: 'ravi@pratham.org',
      phoneNumber: '+91 9876543210',
      state: 'Delhi',
      city: 'Delhi',
      password: 'SecurePassword123',
      confirmPassword: 'SecurePassword123',
    };

    it('validates a complete valid NGO registration', () => {
      const result = registerNgoSchema.safeParse(validNgo);
      expect(result.success).toBe(true);
    });

    it('fails when passwords do not match', () => {
      const result = registerNgoSchema.safeParse({
        ...validNgo,
        confirmPassword: 'MismatchedPassword123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
          'Passwords do not match'
        );
      }
    });

    it('fails on invalid email format', () => {
      const result = registerNgoSchema.safeParse({
        ...validNgo,
        email: 'invalid-email-format',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined();
      }
    });

    it('fails when required fields are missing', () => {
      const result = registerNgoSchema.safeParse({
        ...validNgo,
        registrationNumber: '',
        focusSector: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Citizen / User Registration Schema', () => {
    const validUser = {
      fullName: 'Rahul Sharma',
      email: 'rahul@example.com',
      phoneNumber: '+91 9876543210',
      state: 'Maharashtra',
      preferredLanguage: 'Marathi',
      password: 'CitizenPassword123',
      confirmPassword: 'CitizenPassword123',
    };

    it('validates a complete valid citizen registration', () => {
      const result = registerUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('fails on short full name', () => {
      const result = registerUserSchema.safeParse({
        ...validUser,
        fullName: 'R',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Login Schema', () => {
    it('validates valid login credentials', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'Password123',
        role: 'ngo',
      });
      expect(result.success).toBe(true);
    });

    it('fails when email is empty', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'Password123',
      });
      expect(result.success).toBe(false);
    });
  });
});
