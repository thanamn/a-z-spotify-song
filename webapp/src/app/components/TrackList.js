export default function TrackList({ tracks }) {
  if (!tracks?.length) return <p className="text-sm text-gray-400">No saved tracks.</p>;
  return (
    <ul className="space-y-2">
      {tracks.map(t => (
        <li key={t.id} className="p-3 rounded bg-gray-800/40 flex items-center gap-3">
          {t.album?.images?.[2] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.album.images[2].url} alt="cover" className="w-10 h-10 rounded object-cover" />
          )}
          <div>
            <div className="font-medium">{t.name}</div>
            <div className="text-xs text-gray-400">{t.artists.map(a=>a.name).join(', ')}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
