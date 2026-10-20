'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { SanitizedUser, UserRole } from '@/types/auth';

interface AuthContextType {
  user: SanitizedUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: SanitizedUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SanitizedUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (fbUser: FirebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const role: UserRole = data.role === 'ngo' ? 'ngo' : 'user';
        const name = (data.name || data.fullName || data.ngoName || fbUser.displayName || '') as string;
        const createdAtStr =
          data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate().toISOString()
            : typeof data.createdAt === 'string'
              ? data.createdAt
              : new Date().toISOString();

        const sanitized: SanitizedUser = {
          id: fbUser.uid,
          email: fbUser.email || data.email || '',
          role,
          name,
          fullName: name,
          ngoName: name,
          registrationNumber: data.registrationNumber || '',
          focusSector: data.focusSector || '',
          contactPerson: data.contactPerson || '',
          phoneNumber: data.phoneNumber || '',
          state: data.state || '',
          city: data.city || '',
          address: data.address || '',
          createdAt: createdAtStr,
          updatedAt: new Date().toISOString(),
        } as unknown as SanitizedUser;

        setUser(sanitized);
      } else {
        setUser({
          id: fbUser.uid,
          email: fbUser.email || '',
          role: 'user',
          name: fbUser.displayName || '',
          fullName: fbUser.displayName || '',
          ngoName: '',
          registrationNumber: '',
          focusSector: '',
          contactPerson: '',
          phoneNumber: '',
          state: '',
          city: '',
          address: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as unknown as SanitizedUser);
      }
    } catch (err) {
      console.error('Error fetching user document from Firestore:', err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await fetchUserData(fbUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      await fetchUserData(auth.currentUser);
    } else {
      setUser(null);
    }
  }, [fetchUserData]);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      window.location.href = '/auth/login';
    } catch {
      window.location.href = '/auth/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
