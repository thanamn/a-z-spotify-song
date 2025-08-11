import { NextResponse } from 'next/server';
import { getSpotifyApi } from '@/lib/spotify';
import { setSession } from '@/lib/session';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    const spotifyApi = getSpotifyApi();

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        await setSession({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in
        });

        return NextResponse.redirect('/dashboard');
    } catch (err) {
        console.error('Error getting Tokens:', err);
        return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    }
}
