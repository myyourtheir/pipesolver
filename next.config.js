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
}
