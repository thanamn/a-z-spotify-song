import TrackList from '../components/TrackList';
import PlaylistList from '../components/PlaylistList';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function fetchJson(url, cookieHeader) {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });
    if (res.status === 401) return { unauthorized: true };
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error('Fetch error', url, e.message);
    return null;
  }
}

export default async function DashboardPage() {
  const h = await headers();
  const cookieHeader = h.get('cookie') || '';
  // Use NEXT_PUBLIC_BASE_URL for API calls
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:10000';

  const [tracksData, playlistsData] = await Promise.all([
    fetchJson(base + '/api/tracks', cookieHeader),
    fetchJson(base + '/api/playlists', cookieHeader)
  ]);

  if (tracksData?.unauthorized || playlistsData?.unauthorized) {
    redirect('/');
  }

  const tracks = tracksData?.items?.map(i => i.track || i) || [];
  const playlists = playlistsData?.items || [];

  return (
    <div className="min-h-screen text-white p-8 bg-gray-950">
      <h1 className="text-3xl font-bold mb-8">Your Music</h1>
      <div className="grid gap-12 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold mb-4">Saved Tracks</h2>
          <TrackList tracks={tracks} />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Playlists</h2>
            <PlaylistList playlists={playlists} />
        </section>
      </div>
    </div>
  );
}
