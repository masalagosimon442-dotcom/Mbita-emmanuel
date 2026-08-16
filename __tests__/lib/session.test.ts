/**
 * Session Management Unit Tests
 * Tests for iron-session authentication and session handling
 */

import { sessionOptions, SessionData } from '@/lib/session';

describe('Session Configuration', () => {
  it('should have valid session options', () => {
    expect(sessionOptions).toBeDefined();
    expect(sessionOptions.cookieName).toBe('admin_session');
    expect(sessionOptions.password).toBeDefined();
    expect(sessionOptions.password.length).toBeGreaterThanOrEqual(32);
  });

  it('should have secure cookie options', () => {
    expect(sessionOptions.cookieOptions).toBeDefined();
    expect(sessionOptions.cookieOptions.httpOnly).toBe(true);
    expect(sessionOptions.cookieOptions.secure).toBe(true);
    expect(sessionOptions.cookieOptions.sameSite).toBe('lax');
  });

  it('should have correct session duration', () => {
    const maxAge = sessionOptions.cookieOptions.maxAge;
    const eightHoursInSeconds = 8 * 60 * 60;
    expect(maxAge).toBe(eightHoursInSeconds);
  });
});

describe('SessionData Interface', () => {
  it('should allow valid session data', () => {
    const validSession: SessionData = {
      username: 'testuser',
      createdAt: Date.now(),
    };

    expect(validSession.username).toBe('testuser');
    expect(validSession.createdAt).toBeGreaterThan(0);
  });
});
