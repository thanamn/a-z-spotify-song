import { NextResponse } from 'next/server';
import { getSpotifyApi } from '../../../../lib/spotify';
import { serializeSession } from '../../../../lib/session';
import cookie from 'cookie';

export async function GET(request) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const stateParam = searchParams.get('state');
  const cookiesHeader = request.headers.get('cookie') || '';
  const parsed = cookie.parse(cookiesHeader);
  const storedState = parsed['sp_state'];
  // Use environment variable for base URL, fallback to origin if not set
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || url.origin;

  if (error) {
    return NextResponse.redirect(baseUrl + '/?error=' + encodeURIComponent(error));
  }
  if (!code) {
    return NextResponse.redirect(baseUrl + '/?error=missing_code');
  }
  if (!storedState || storedState !== stateParam) {
    return NextResponse.redirect(baseUrl + '/?error=state_mismatch');
  }

  const api = getSpotifyApi();
  try {
    const data = await api.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;
    const expiresAt = Date.now() + expires_in * 1000;
    const sessionCookies = serializeSession({ accessToken: access_token, refreshToken: refresh_token, expiresAt });
    const res = NextResponse.redirect(baseUrl + '/dashboard');
    sessionCookies.forEach(c => res.headers.append('Set-Cookie', c));
    // clear state cookie
    res.headers.append('Set-Cookie', cookie.serialize('sp_state', '', { path: '/', maxAge: 0 }));
    return res;
  } catch (e) {
    console.error('Auth callback error', e.message);
    return NextResponse.redirect(baseUrl + '/?error=callback_failed');
  }
}
