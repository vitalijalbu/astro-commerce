// @ts-check

import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders, memoryCache } from 'astro/config';

export default defineConfig({
	devToolbar: {
		enabled: false
	},
	output: 'server',
	adapter: vercel(),
	server: { host: true, port: Number(process.env.PORT) || 4321 },

	cache: {
		provider: memoryCache(),
	},

	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport',
	},

	compressHTML: true,

	fonts: [
		{
			name: 'Inter',
			cssVariable: '--font-inter',
			provider: fontProviders.fontsource(),
			styles: ['normal'],
			weights: [400, 500, 600, 700, 800],
			subsets: ['latin', 'latin-ext'],
		},
	],
	image: {
		domains: ['picsum.photos', 'fastly.picsum.photos'],
		remotePatterns: [{ protocol: 'https' }],
		responsiveStyles: true,
		layout: 'constrained',
		service: {
			entrypoint: 'astro/assets/services/sharp',
			config: {
				limitInputPixels: true,
				jpeg: { mozjpeg: true, progressive: true, quality: 78 },
				webp: { effort: 6, quality: 76 },
				avif: { effort: 6, quality: 52 },
			},
		},
	},
	vite: {
		plugins: [tailwindcss()],
		build: {
			cssMinify: 'lightningcss',
			assetsInlineLimit: 4096,
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('lucide-static')) return 'icons'
						if (id.includes('basecoat-css')) return 'styles'
						if (id.includes('node_modules')) return 'vendor'
					},
				},
			},
		},
	},
	integrations: [],
});
