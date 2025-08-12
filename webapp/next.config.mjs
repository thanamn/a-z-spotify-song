/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {},
	env: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI
	},
	serverRuntimeConfig: {},
	output: 'standalone'
};

export default nextConfig;
