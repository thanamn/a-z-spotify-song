/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {},
	env: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI
	},
	serverRuntimeConfig: {},
	output: 'standalone',
	async redirects() {
		return [
			{
				source: '/(.*)',
				has: [{ type: 'host', value: 'a-z-spotify-song-web-app.onrender.com' }],
				protocol: 'http',
				destination: 'https://a-z-spotify-song-web-app.onrender.com/:path*',
				permanent: true,
			},
		];
	}
};

export default nextConfig;
