/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {},
	env: {
		// Expose base URL optionally for server components fetching in dashboard
		NEXT_PUBLIC_BASE_URL: process.env.RENDER_EXTERNAL_URL || ''
	},
	serverRuntimeConfig: {},
	output: 'standalone'
};

export default nextConfig;
