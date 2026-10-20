import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';
import type { AuthSession, UserRole } from '@/types/auth';

export const SESSION_COOKIE_NAME = 'sahaysetu_session';
export const SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

const DEFAULT_SECRET = 'sahaysetu-secure-development-secret-key-32chars!';

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || DEFAULT_SECRET;
  return new Uint8Array(Buffer.from(secret, 'utf-8'));
}

/**
 * Creates a signed JWT session token.
 */
export async function createSessionToken(session: {
  userId: string;
  email: string;
  role: UserRole;
  displayName: string;
}): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_EXPIRY_SECONDS;

  return new SignJWT({
    userId: session.userId,
    email: session.email,
    role: session.role,
    displayName: session.displayName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .setSubject(session.userId)
    .sign(getSecretKey());
}

/**
 * Verifies a signed JWT session token and returns decoded session payload.
 */
export async function verifySessionToken(
  token: string
): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });

    if (
      !payload.userId ||
      !payload.email ||
      !payload.role ||
      !payload.displayName ||
      !payload.exp
    ) {
      return null;
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      displayName: payload.displayName as string,
      expiresAt: (payload.exp as number) * 1000,
    };
  } catch {
    return null;
  }
}
