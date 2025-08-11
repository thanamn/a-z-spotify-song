export default function LoginButton() {
  return (
    <a
      href="/api/auth/login"
      className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded shadow transition"
    >
      Login with Spotify
    </a>
  );
}
