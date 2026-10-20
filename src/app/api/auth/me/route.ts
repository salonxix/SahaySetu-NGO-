import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth/session';
import { UserStore } from '@/lib/auth/store';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(tokenCookie.value);
    if (!session) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      );
    }

    const user = await UserStore.findById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, user: null },
        { status: 401 }
      );
    }

    const sanitizedUser = UserStore.sanitizeUser(user);
    return NextResponse.json({
      success: true,
      user: sanitizedUser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error checking authentication status',
      },
      { status: 500 }
    );
  }
}
