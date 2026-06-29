// @ts-check
import { defineConfig, fontProviders, memoryCache } from 'astro/config';
import { webcore } from 'webcoreui/integration';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	// SSR on-demand: necessario per l'auth cliente PrestaShop via cookie
	// (login / register / account). Node standalone legge HOST/PORT dall'ambiente.
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	server: { host: true, port: Number(process.env.PORT) || 4321 },

	// Astro v7: route caching SSR nativa (process-local memory cache).
	cache: {
		provider: memoryCache(),
	},

	// Astro v6+: gestione font nativa (self-hosted + preload automatico).
	fonts: [
		{
			name: 'Inter',
			cssVariable: '--font-inter',
			provider: fontProviders.fontsource(),
			// Evita file non usati (es. italic) e limita download ai pesi realmente usati.
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
				// Fail-fast contro input enormi e encoding moderno più efficiente.
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
			// SVG/asset piccoli (<4KB) inlined come data-URI: meno richieste HTTP.
			assetsInlineLimit: 4096,
		},
	},
	integrations: [react(), webcore()],
});
