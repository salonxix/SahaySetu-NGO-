import { NextResponse } from 'next/server';

export function middleware() {
  // Client-side Firebase Auth handles auth state via onAuthStateChanged()
  return NextResponse.next();
}

export const config = {
  matcher: ['/ngo/:path*', '/user/:path*', '/auth/:path*'],
};
