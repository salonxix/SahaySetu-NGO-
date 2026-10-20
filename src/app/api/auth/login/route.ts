import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/auth/validation';
import { comparePassword } from '@/lib/auth/security';
import { UserStore } from '@/lib/auth/store';
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_EXPIRY_SECONDS,
} from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

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

    const { email, password, role } = result.data;
    const user = await UserStore.findByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password.',
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password.',
        },
        { status: 401 }
      );
    }

    // Role check if the user is logging in from a specific portal
    if (role && user.role !== role) {
      const expectedPortal = user.role === 'ngo' ? 'NGO Portal' : 'Citizen Portal';
      return NextResponse.json(
        {
          success: false,
          error: `This account is registered as a ${user.role === 'ngo' ? 'NGO Organization' : 'Citizen'}. Please log in via the ${expectedPortal}.`,
        },
        { status: 403 }
      );
    }

    const displayName =
      user.role === 'ngo' ? user.ngoName : user.fullName;

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      displayName,
    });

    const sanitizedUser = UserStore.sanitizeUser(user);
    const redirectUrl = user.role === 'ngo' ? '/ngo/dashboard' : '/user/profile';

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: sanitizedUser,
      redirectUrl,
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
            : 'Internal server error during login',
      },
      { status: 500 }
    );
  }
}
