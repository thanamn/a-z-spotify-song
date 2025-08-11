export default function PlaylistList({ playlists }) {
  if (!playlists?.length) return <p className="text-sm text-gray-400">No playlists.</p>;
  return (
    <ul className="space-y-2">
      {playlists.map(p => (
        <li key={p.id} className="p-3 rounded bg-gray-800/40 flex items-center gap-3">
          {p.images?.[2] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.images[2].url} alt="cover" className="w-10 h-10 rounded object-cover" />
          )}
          <div>
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-gray-400">{p.tracks?.total} tracks</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
