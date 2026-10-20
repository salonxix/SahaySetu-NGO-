import { NextResponse } from 'next/server';
import { registerUserSchema } from '@/lib/auth/validation';
import { hashPassword } from '@/lib/auth/security';
import { UserStore } from '@/lib/auth/store';
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_EXPIRY_SECONDS,
} from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerUserSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, phoneNumber, state, preferredLanguage, password } =
      result.data;

    const existingUser = await UserStore.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email address already exists.',
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser = await UserStore.createGeneralUser({
      role: 'user',
      fullName,
      email,
      phoneNumber: phoneNumber || undefined,
      state: state || undefined,
      preferredLanguage: preferredLanguage || undefined,
      passwordHash,
    });

    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: 'user',
      displayName: newUser.fullName,
    });

    const sanitizedUser = UserStore.sanitizeUser(newUser);
    const response = NextResponse.json({
      success: true,
      message: 'Citizen registration successful',
      user: sanitizedUser,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_EXPIRY_SECONDS,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error during registration',
      },
      { status: 500 }
    );
  }
}
