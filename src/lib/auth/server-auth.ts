import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifySessionToken } from './session';
import { UserStore } from './store';
import type { NgoUser, GeneralUser } from '@/types/auth';

export async function getAuthenticatedNgoUser(): Promise<NgoUser | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!tokenCookie || !tokenCookie.value) {
    return null;
  }

  const session = await verifySessionToken(tokenCookie.value);
  if (!session || session.role !== 'ngo') {
    return null;
  }

  const user = await UserStore.findById(session.userId);
  if (!user || user.role !== 'ngo') {
    return null;
  }

  return user as NgoUser;
}

export async function getAuthenticatedCitizenUser(): Promise<GeneralUser | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!tokenCookie || !tokenCookie.value) {
    return null;
  }

  const session = await verifySessionToken(tokenCookie.value);
  if (!session || session.role !== 'user') {
    return null;
  }

  const user = await UserStore.findById(session.userId);
  if (!user || user.role !== 'user') {
    return null;
  }

  return user as GeneralUser;
}
