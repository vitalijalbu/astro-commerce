/**
 * PrestaShop Webservice client.
 *
 * Talks to the PrestaShop REST webservice (the `/api` endpoint) using an
 * API key as HTTP Basic auth username (blank password), requesting JSON via
 * `output_format=JSON` and full resources via `display=full`.
 *
 * Configure with environment variables:
 *   PRESTASHOP_API_URL   e.g. https://shop.example.com/api
 *   PRESTASHOP_API_KEY   the webservice key generated in the PS back office
 *   PUBLIC_SHOP_URL      e.g. https://shop.example.com  (for image URLs)
 *   PUBLIC_CURRENCY      ISO currency code, defaults to EUR
 *
 * Everything is best-effort: callers (see `catalog.ts`) fall back to the
 * static mock catalog when the webservice is unconfigured or fails.
 */
import type { Collection, Money, Product, ProductImage, ProductVariant } from './types';

const API_URL = import.meta.env.PRESTASHOP_API_URL?.replace(/\/$/, '');
const API_KEY = import.meta.env.PRESTASHOP_API_KEY;
const SHOP_URL = (import.meta.env.PUBLIC_SHOP_URL || '').replace(/\/$/, '');
const CURRENCY = import.meta.env.PUBLIC_CURRENCY || 'EUR';

export const isPrestashopConfigured = Boolean(API_URL && API_KEY);

/** Build the Basic auth header from the webservice key. */
function authHeader(): string {
	const token = btoa(`${API_KEY}:`);
	return `Basic ${token}`;
}

type Query = Record<string, string | number | undefined>;

async function psFetch<T>(resource: string, query: Query = {}): Promise<T> {
	if (!isPrestashopConfigured) {
		throw new Error('PrestaShop webservice is not configured');
	}

	const params = new URLSearchParams({ output_format: 'JSON' });
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) params.set(key, String(value));
	}

	const url = `${API_URL}/${resource}?${params.toString()}`;
	const res = await fetch(url, {
		headers: {
			Authorization: authHeader(),
			Accept: 'application/json',
		},
	});

	if (!res.ok) {
		throw new Error(`PrestaShop ${resource} failed: ${res.status} ${res.statusText}`);
	}

	return res.json() as Promise<T>;
}

/**
 * PrestaShop multilang fields are serialized as `[{ id, value }]` in JSON
 * (or a plain string when a language filter is applied). Normalize both.
 */
function lang(value: unknown): string {
	if (typeof value === 'string') return value;
	if (Array.isArray(value) && value.length) {
		const first = value[0] as { value?: string };
		return first?.value ?? '';
	}
	return '';
}

function money(amount: string | number | undefined): Money {
	return { amount: Number(amount || 0), currencyCode: CURRENCY };
}

/** Best-effort front-office image URL: `{shop}/{idImage}-large_default/{handle}.jpg`. */
function imageUrl(idImage: string | number, handle: string): string {
	if (!idImage) return '';
	const base = SHOP_URL || API_URL?.replace(/\/api$/, '') || '';
	return `${base}/${idImage}-large_default/${handle}.jpg`;
}

/* -------------------------------------------------------------------------- */
/* Raw payload shapes (loosely typed — PrestaShop is permissive)              */
/* -------------------------------------------------------------------------- */

interface RawProduct {
	id: string | number;
	name: unknown;
	description: unknown;
	description_short: unknown;
	link_rewrite: unknown;
	price: string;
	id_default_image?: string | number;
	manufacturer_name?: string;
	active?: string;
	available_for_order?: string;
	associations?: {
		images?: { id: string | number }[];
		product_features?: unknown[];
	};
}

interface RawCategory {
	id: string | number;
	name: unknown;
	description: unknown;
	link_rewrite: unknown;
	id_image?: string | number;
	nb_products_recursive?: string | number;
}

/* -------------------------------------------------------------------------- */
/* Mappers                                                                     */
/* -------------------------------------------------------------------------- */

function mapProduct(raw: RawProduct): Product {
	const handle = lang(raw.link_rewrite) || String(raw.id);
	const title = lang(raw.name);
	const price = money(raw.price);
	const defaultImageId = raw.id_default_image || raw.associations?.images?.[0]?.id || '';

	const featuredImage: ProductImage = {
		id: String(defaultImageId),
		url: imageUrl(defaultImageId, handle),
		alt: title,
	};

	const images: ProductImage[] = (raw.associations?.images || []).map((i) => ({
		id: String(i.id),
		url: imageUrl(i.id, handle),
		alt: title,
	}));

	const variant: ProductVariant = {
		id: `${raw.id}-default`,
		title: 'Default',
		available: raw.available_for_order !== '0',
		price,
		compareAtPrice: null,
		options: [{ name: 'Title', value: 'Default' }],
	};

	return {
		id: String(raw.id),
		handle,
		title,
		description: lang(raw.description_short)
			.replace(/<[^>]+>/g, '')
			.trim(),
		descriptionHtml: lang(raw.description) || lang(raw.description_short),
		vendor: raw.manufacturer_name,
		available: raw.active !== '0' && raw.available_for_order !== '0',
		price,
		compareAtPrice: null,
		featuredImage,
		images: images.length ? images : [featuredImage],
		tags: [],
		onSale: false,
		variants: [variant],
	};
}

function mapCategory(raw: RawCategory): Collection {
	const handle = lang(raw.link_rewrite) || String(raw.id);
	const title = lang(raw.name);
	return {
		id: String(raw.id),
		handle,
		title,
		description: lang(raw.description)
			.replace(/<[^>]+>/g, '')
			.trim(),
		image: raw.id_image
			? { id: String(raw.id_image), url: imageUrl(raw.id_image, handle), alt: title }
			: null,
		productCount: raw.nb_products_recursive ? Number(raw.nb_products_recursive) : undefined,
	};
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

export async function fetchProducts(limit = 12): Promise<Product[]> {
	const data = await psFetch<{ products?: RawProduct[] }>('products', {
		display: 'full',
		limit,
		'filter[active]': 1,
	});
	return (data.products || []).map(mapProduct);
}

export async function fetchProductByHandle(handle: string): Promise<Product | null> {
	const data = await psFetch<{ products?: RawProduct[] }>('products', {
		display: 'full',
		'filter[link_rewrite]': handle,
		limit: 1,
	});
	const raw = data.products?.[0];
	return raw ? mapProduct(raw) : null;
}

export async function fetchCollections(limit = 12): Promise<Collection[]> {
	const data = await psFetch<{ categories?: RawCategory[] }>('categories', {
		display: 'full',
		limit,
		'filter[active]': 1,
	});
	return (data.categories || []).map(mapCategory);
}

export async function fetchCollectionByHandle(handle: string): Promise<Collection | null> {
	const data = await psFetch<{ categories?: RawCategory[] }>('categories', {
		display: 'full',
		'filter[link_rewrite]': handle,
		limit: 1,
	});
	const raw = data.categories?.[0];
	return raw ? mapCategory(raw) : null;
}
