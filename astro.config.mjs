// @ts-check

import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders, memoryCache } from 'astro/config';
import { webcore } from 'webcoreui/integration';

// https://astro.build/config
export default defineConfig({
	// SSR on-demand: necessario per l'auth cliente PrestaShop via cookie
	// (login / register / account). Node standalone legge HOST/PORT dall'ambiente.
	output: 'server',
	adapter: vercel(),
	server: { host: true, port: Number(process.env.PORT) || 4321 },

	// Astro v7: route caching SSR nativa (process-local memory cache).
	cache: {
		provider: memoryCache(),
	},

	// Prefetch dei link in viewport: navigazioni interne quasi istantanee.
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport',
	},

	// Comprimi l'HTML emesso (rimuove whitespace inutile dalle pagine SSR).
	compressHTML: true,

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
		// Pre-bundla il runtime client di WebCoreUI (modal helper) una sola volta,
		// così il dev server non lo ri-ottimizza ad ogni pagina.
		optimizeDeps: {
			include: ['webcoreui'],
		},
	},
	integrations: [webcore()],
});
