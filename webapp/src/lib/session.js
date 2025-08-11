import cookie from 'cookie';
import crypto from 'crypto';
import { getSpotifyApi } from './spotify';

// Cookie names
const ACCESS_TOKEN = 'sp_at';
const REFRESH_TOKEN = 'sp_rt';
const ACCESS_EXPIRES = 'sp_at_exp';
const SESSION_HMAC = 'sp_sig';

const COOKIE_BASE_CONFIG = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: process.env.NODE_ENV === 'production'
};

function sign(values) {
  const secret = process.env.SESSION_SECRET || 'dev-secret';
  const h = crypto.createHmac('sha256', secret);
  h.update(values.join('|'));
  return h.digest('hex');
}

export function serializeSession({ accessToken, refreshToken, expiresAt }) {
  const cookies = [];
  const maxAge = 60 * 60 * 24 * 30; // 30 days for refresh token
  const accessValues = [accessToken, String(expiresAt), refreshToken];
  const sig = sign(accessValues);
  cookies.push(cookie.serialize(ACCESS_TOKEN, accessToken, { ...COOKIE_BASE_CONFIG, maxAge: 3600 }));
  cookies.push(cookie.serialize(REFRESH_TOKEN, refreshToken, { ...COOKIE_BASE_CONFIG, maxAge }));
  cookies.push(cookie.serialize(ACCESS_EXPIRES, String(expiresAt), { ...COOKIE_BASE_CONFIG, maxAge }));
  cookies.push(cookie.serialize(SESSION_HMAC, sig, { ...COOKIE_BASE_CONFIG, maxAge }));
  return cookies;
}

export function parseSession(reqHeaders) {
  const header = reqHeaders.get('cookie');
  if (!header) return null;
  const parsed = cookie.parse(header || '');
  const accessToken = parsed[ACCESS_TOKEN];
  const refreshToken = parsed[REFRESH_TOKEN];
  const expiresAt = parsed[ACCESS_EXPIRES] ? parseInt(parsed[ACCESS_EXPIRES], 10) : undefined;
  const sig = parsed[SESSION_HMAC];
  if (!accessToken || !refreshToken || !expiresAt || !sig) return null;
  const expected = sign([accessToken, String(expiresAt), refreshToken]);
  if (expected !== sig) return null;
  return { accessToken, refreshToken, expiresAt };
}

export async function getValidAccessToken(session) {
  if (!session) return null;
  const now = Date.now();
  if (session.expiresAt > now + 60 * 1000) {
    return { accessToken: session.accessToken, refreshedCookies: null };
  }
  // refresh
  const api = getSpotifyApi();
  api.setRefreshToken(session.refreshToken);
  try {
    const refresh = await api.refreshAccessToken();
    const { access_token, expires_in } = refresh.body;
    const expiresAt = Date.now() + expires_in * 1000;
    const cookies = serializeSession({ accessToken: access_token, refreshToken: session.refreshToken, expiresAt });
    return { accessToken: access_token, refreshedCookies: cookies };
  } catch (e) {
    console.error('Token refresh failed', e.message);
    return { accessToken: null, refreshedCookies: null };
  }
}

export function clearSessionCookies() {
  const expired = new Date(0);
  return [ACCESS_TOKEN, REFRESH_TOKEN, ACCESS_EXPIRES, SESSION_HMAC].map(name => cookie.serialize(name, '', { ...COOKIE_BASE_CONFIG, expires: expired }));
}
