import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const unprotectedRoutes = [
  '/login',
  '/register',
  '/validation-pending',
  '/about',
  '/rules',
  '/auth/login/callback',
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/logo.webp') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)
  ) {
    return NextResponse.next();
  }
  
  if (unprotectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  if (!req.auth) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
