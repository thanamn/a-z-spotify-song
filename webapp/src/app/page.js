import LoginButton from './components/LoginButton';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">My Spotify App</h1>
        <p className="text-gray-300 max-w-md mx-auto">Authenticate with Spotify to view your saved tracks and playlists.</p>
        <LoginButton />
      </div>
    </div>
  );
}
