import '@auth/core/types';
import { DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface AdapterSession {
    user: {
      role: string;
      surname: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
    id?: string;
    name?: string | null;
    surname?: string | null;
    phone?: string | null;
    balance?: number;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    expires_at?: number;
    fromGoogle?: boolean;
  }

  interface Session {
    user: {
      role: string;
      surname: string;
    } & DefaultSession;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
    accessTokenExpires: number;
  }
}

declare module '@auth/core/types' {
  interface User {
    role: string;
    id?: string;
    name?: string | null;
    surname?: string | null;
    phone?: string | null;
    balance?: number;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    refresh_token?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    expires_at?: number;
    fromGoogle?: boolean;
  }
}
