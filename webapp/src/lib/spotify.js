import SpotifyWebApi from 'spotify-web-api-node';

export function getSpotifyApi() {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
        console.error('[spotify] Missing required env vars. Have:', {
            SPOTIFY_CLIENT_ID: !!SPOTIFY_CLIENT_ID,
            SPOTIFY_CLIENT_SECRET: !!SPOTIFY_CLIENT_SECRET,
            SPOTIFY_REDIRECT_URI: !!SPOTIFY_REDIRECT_URI
        });
        throw new Error('Spotify environment variables not configured');
    }
    return new SpotifyWebApi({
        clientId: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET,
        redirectUri: SPOTIFY_REDIRECT_URI
    });
}
