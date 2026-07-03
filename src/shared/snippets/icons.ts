/**
 * Storefront icon set.
 *
 * Commerce icon set (cart, account, shipping, etc.) as raw 24x24 stroke SVGs
 * using currentColor so they inherit text color and size.
 *
 * NOTE: currently unused — icons are rendered via the fulldev/ui <Icon> through
 * `@snippets/icon.astro`. Kept for reference; safe to delete if not needed.
 */
const svg = (paths: string) =>
	`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const storeIcons: Record<string, string> = {
	cart: svg(
		'<circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/><path d="M2.5 3h2l2.2 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21.5 7H6"/>',
	),
	user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
	menu: svg('<path d="M3 6h18M3 12h18M3 18h18"/>'),
	heart: svg(
		'<path d="M12 20s-7-4.6-9.3-9A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 9.3 5C19 15.4 12 20 12 20Z"/>',
	),
	truck: svg(
		'<path d="M1 3h13v11H1zM14 7h4l3 3v4h-7"/><circle cx="6" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
	),
	refresh: svg('<path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 4v5h-5"/>'),
	shield: svg('<path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/>'),
	headphones: svg(
		'<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2" y="13" width="4" height="7" rx="1.5"/><rect x="18" y="13" width="4" height="7" rx="1.5"/>',
	),
	'arrow-right': svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
	instagram: svg(
		'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6"/>',
	),
	facebook: svg('<path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1Z"/>'),
	twitter: svg(
		'<path d="M22 5.8a8 8 0 0 1-2.4.7 4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.5 1A4 4 0 0 0 12 8.8 11.3 11.3 0 0 1 3.8 4.6a4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5 4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.4-6.1 11.4-11.4v-.5A8 8 0 0 0 22 5.8Z"/>',
	),
	share: svg(
		'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
	),
};
