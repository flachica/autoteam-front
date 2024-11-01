import axios from 'axios';
import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PlayerService } from './services/playerService';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      credentials: {
        email: {},
        phone: {},
        password: {},
        role: {},
        surname: {},
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          if ("access_token" in credentials) {
            const jwt = require('jsonwebtoken');
            const secret = process.env.AUTH_SECRET;
            const decoded = jwt.verify(credentials.access_token, secret);
            return {
              id: decoded.id,
              name: decoded.name,
              surname: decoded.surname,
              email: decoded.email,
              role: decoded.role,
              phone: decoded.phone,
              balance: decoded.balance,
              accessToken: credentials.access_token as string,
            } as User;
          }
          const playerService = new PlayerService();
          const player = await playerService.authenticate(
            credentials.email as string,
            credentials.phone as string,
            credentials.password as string,
          );

          if (!player) {
            return null;
          }
          return {
            id: player.id.toString(),
            name: player.name,
            surname: player.surname,
            email: player.email,
            role: player.role,
            phone: player.phone,
            balance: player.balance,
          };
        } catch (error) {
          return Promise.reject(error);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      let withError = false;
      if (account?.provider === 'google') {
        try {
          const playerService = new PlayerService();
          const player = await playerService.authenticateGoogle(
            account.id_token,
          );

          if (!player) {
            return false;
          }
          user.id = player.id.toString();
          user.name = player.name;
          user.surname = player.surname;
          user.role = player.role;
          user.phone = player.phone;
          user.balance = player.balance;
          user.accessToken = account.id_token;
          user.refreshToken = account.refresh_token;
          user.fromGoogle = true;
          return true;
        } catch (error) {
          if (
            (error as any).response?.data?.message?.error ===
            'CredentialNotValidated'
          ) {
            return '/validation-pending';
          }
          console.error(
            'Error al finalizar la autenticación con Google:',
            error,
          );
          withError = true;
        }
      }
      return !withError;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.surname = (token.surname as string) || '';
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.balance = token.balance;
        session.user.accessToken = token.token || token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && account.provider === 'google') {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        if (account.expires_at)
          token.accessTokenExpires = account.expires_at * 1000;
      }

      if (user) {
        token.id = user.id;
        token.surname = user.surname;
        token.role = user.role;
        token.phone = user.phone;
        token.balance = user.balance;
        token.token = user.accessToken;
        token.refreshToken = user.refreshToken;
        if (user.expires_at) {
          token.accessTokenExpires = user.expires_at * 1000;
        }
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      if (token.refreshToken && user.fromGoogle) {
        return refreshGoogleAccessToken(token);
      } else {
        if (!token.accessToken) {
          token.accessToken = generateAccessToken(user);
        }
        return token;
      }
    },
  },
});

async function refreshGoogleAccessToken(token: any) {
  try {
    const url = 'https://oauth2.googleapis.com/token';

    const response = await axios.post(url, null, {
      params: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Error refreshing access token', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

function generateAccessToken(user: User) {
  const jwt = require('jsonwebtoken');
  const secret = process.env.AUTH_SECRET;
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      phone: user.phone,
      balance: user.balance,
    },
    secret,
    { 
      expiresIn: process.env.TOKEN_EXPIRES_IN,
      keyid: process.env.CREDENTIAL_TOKEN_KEY_ID,
    },
  );
  return token;
}
