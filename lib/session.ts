import type { SessionOptions } from 'iron-session';

export interface SessionData {
  username: string;
  createdAt: number;
}

export const sessionOptions: SessionOptions = {
  cookieName: 'prof-website-session',
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
};
