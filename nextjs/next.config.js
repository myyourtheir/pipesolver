/** @type {import('next').NextConfig} */
module.exports = {
	async redirects() {
		return [
			// Basic redirect
			{
				source: '/',
				destination: '/home',
				permanent: true,
			},
			// Wildcard path matching
			{
				source: '/blog/:slug',
				destination: '/news/:slug',
				permanent: true,
			},
		]
	},
	transpilePackages: ['three'],
	reactStrictMode: true,
	env: {
		BASE_URL: process.env.BASE_URL,
	}
}
