import { NextResponse } from 'next/server';
import { registerNgoSchema } from '@/lib/auth/validation';
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
    const result = registerNgoSchema.safeParse(body);

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

    const {
      ngoName,
      registrationNumber,
      focusSector,
      contactPerson,
      email,
      phoneNumber,
      state,
      city,
      address,
      password,
    } = result.data;

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
    const newNgo = await UserStore.createNgoUser({
      role: 'ngo',
      ngoName,
      registrationNumber,
      focusSector,
      contactPerson,
      email,
      phoneNumber,
      state,
      city,
      address,
      passwordHash,
      verified: false,
    });

    const token = await createSessionToken({
      userId: newNgo.id,
      email: newNgo.email,
      role: 'ngo',
      displayName: newNgo.ngoName,
    });

    const sanitizedUser = UserStore.sanitizeUser(newNgo);
    const response = NextResponse.json({
      success: true,
      message: 'NGO registration successful',
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
