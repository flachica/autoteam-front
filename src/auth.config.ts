import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/logout',
    newUser: '/register',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnHome = nextUrl.pathname.startsWith('/home');
      const toLogout = nextUrl.pathname.startsWith('/logout');
      if (toLogout) {
        return true;
      }
      if (isOnHome) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/home', nextUrl));
      }
      return false;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
