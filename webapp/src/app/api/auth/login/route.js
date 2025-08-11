import { NextResponse } from 'next/server';
import { getSpotifyApi } from '../../../../lib/spotify';
import cookie from 'cookie';

const scopes = [
  'user-read-private',
  'playlist-read-private',
  'user-library-read'
];

export async function GET(request) {
  const api = getSpotifyApi();
  const state = Math.random().toString(36).slice(2);
  const authorizeURL = api.createAuthorizeURL(scopes, state);
  const res = NextResponse.redirect(authorizeURL, { status: 302 });
  res.headers.append('Set-Cookie', cookie.serialize('sp_state', state, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600
  }));
  return res;
}
