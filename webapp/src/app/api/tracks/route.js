import { NextResponse } from 'next/server';
import { getSpotifyApi } from '../../../lib/spotify';
import { parseSession, getValidAccessToken } from '../../../lib/session';

export async function GET(request) {
  const session = parseSession(request.headers);
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { accessToken, refreshedCookies } = await getValidAccessToken(session);
  if (!accessToken) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const api = getSpotifyApi();
  api.setAccessToken(accessToken);
  try {
    const data = await api.getMySavedTracks({ limit: 20 });
    const res = NextResponse.json(data.body);
    if (refreshedCookies) refreshedCookies.forEach(c => res.headers.append('Set-Cookie', c));
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'failed_fetch', detail: e.message }, { status: 500 });
  }
}
