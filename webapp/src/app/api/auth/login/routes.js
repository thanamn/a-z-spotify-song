import { NextResponse } from 'next/server';
import { getSpotifyApi } from '@/lib/spotify';

export async function GET() {
    const spotifyApi = getSpotifyApi();
    const scopes = ['user-read-private', 'playlist-read-private', 'user-library-read'];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'some-state');
    return NextResponse.redirect(authorizeURL);
}
