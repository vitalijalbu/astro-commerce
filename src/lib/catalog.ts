/**
 * High-level catalog access used by pages and sections.
 *
 * Always returns data: it tries the PrestaShop webservice first and
 * transparently falls back to the static mock catalog when PrestaShop is
 * not configured or a request fails. This is what makes the storefront
 * render end-to-end with or without a live backend.
 */

import { mockCollections, mockProducts } from './mock';
import {
	fetchCollectionByHandle,
	fetchCollections,
	fetchProductByHandle,
	fetchProducts,
	isPrestashopConfigured,
} from './prestashop';
import type { Collection, Product } from './types';

async function withFallback<T>(label: string, live: () => Promise<T>, fallback: T): Promise<T> {
	if (!isPrestashopConfigured) return fallback;
	try {
		const result = await live();
		// Treat an empty list as "nothing to show" but keep real empties for
		// single-item lookups handled by the caller.
		return result;
	} catch (error) {
		console.warn(`[catalog] ${label} fell back to mock data:`, (error as Error).message);
		return fallback;
	}
}

export async function getProducts(limit = 12): Promise<Product[]> {
	const products = await withFallback('getProducts', () => fetchProducts(limit), mockProducts);
	return products.slice(0, limit);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
	return withFallback(
		`getProductByHandle(${handle})`,
		() => fetchProductByHandle(handle),
		mockProducts.find((p) => p.handle === handle) ?? null,
	);
}

export async function getCollections(limit = 12): Promise<Collection[]> {
	const collections = await withFallback(
		'getCollections',
		() => fetchCollections(limit),
		mockCollections,
	);
	return collections.slice(0, limit);
}

/* Collections derived from the catalog rather than stored as their own entity. */
const VIRTUAL_COLLECTIONS: Record<string, Collection> = {
	'best-sellers': {
		id: 'best-sellers',
		handle: 'best-sellers',
		title: 'Best sellers',
		description: 'Our most-loved pieces, ranked by customer reviews.',
	},
};

export async function getCollectionByHandle(handle: string): Promise<Collection | null> {
	return withFallback(
		`getCollectionByHandle(${handle})`,
		() => fetchCollectionByHandle(handle),
		mockCollections.find((c) => c.handle === handle) ??
			VIRTUAL_COLLECTIONS[handle.toLowerCase()] ??
			null,
	);
}

/** Products for a given collection. Mock fallback returns a tag/handle slice. */
export async function getCollectionProducts(handle: string, limit = 12): Promise<Product[]> {
	const all = await getProducts(500);
	const normalizedHandle = handle.toLowerCase();

	const filtered =
		normalizedHandle === 'sale'
			? all.filter((product) => product.onSale)
			: normalizedHandle === 'new-arrivals'
				? all.filter((product) => {
						const tags = product.tags.map((tag) => tag.toLowerCase());
						return tags.includes('new') || tags.includes('new-arrivals');
					})
				: normalizedHandle === 'best-sellers'
					? [...all].sort(
							(a, b) =>
								(b.reviewCount ?? 0) - (a.reviewCount ?? 0) || (b.rating ?? 0) - (a.rating ?? 0),
						)
					: normalizedHandle === 'all'
						? all
						: all.filter((product) =>
								product.tags.map((tag) => tag.toLowerCase()).includes(normalizedHandle),
							);

	return filtered.slice(0, limit);
}

export { mockCollections, mockProducts };
