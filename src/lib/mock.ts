/**
 * Static fallback catalog.
 *
 * Stored in a plain JSON file so merchandising can adjust the mock catalog
 * without editing TypeScript code. This stays the build-time fallback when
 * PrestaShop is not configured or unreachable.
 */
import storeData from '../data/mock-store.json';

import type { Collection, Product, ProductImage } from './types';

type RawProduct = {
	id: string;
	handle: string;
	title: string;
	description: string;
	descriptionHtml: string;
	vendor?: string;
	available?: boolean;
	price: number;
	compareAtPrice?: number | null;
	rating?: number;
	reviewCount?: number;
	tags?: string[];
	imageSeeds: string[];
};

type RawProductSeries = {
	handlePrefix: string;
	title: string;
	description: string;
	vendor?: string;
	basePrice: number;
	priceStep?: number;
	count: number;
	tags?: string[];
	rating?: number;
	reviewCount?: number;
	compareAtDelta?: number;
	saleEvery?: number;
	imageSeedPrefix: string;
};

type RawCollection = {
	id: string;
	handle: string;
	title: string;
	description: string;
	imageSeed: string;
	productCount?: number;
};

type MockStoreData = {
	currencyCode: string;
	products: RawProduct[];
	productSeries?: RawProductSeries[];
	collections: RawCollection[];
};

const store = storeData as MockStoreData;

const makeImage = (seed: string, alt: string, width = 900, height = 1200): ProductImage => ({
	id: seed,
	url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
	alt,
	width,
	height,
});

const money = (amount: number) => ({ amount, currencyCode: store.currencyCode });

const createProductFromRaw = (product: RawProduct): Product => {
	const images = product.imageSeeds.map((seed, index) =>
		makeImage(seed, index === 0 ? product.title : `${product.title} detail ${index}`),
	);
	const compareAtPrice = product.compareAtPrice ? money(product.compareAtPrice) : null;

	return {
		id: product.id,
		handle: product.handle,
		title: product.title,
		description: product.description,
		descriptionHtml: product.descriptionHtml,
		vendor: product.vendor,
		available: product.available ?? true,
		price: money(product.price),
		compareAtPrice,
		rating: product.rating,
		reviewCount: product.reviewCount,
		featuredImage: images[0],
		images,
		tags: product.tags ?? [],
		onSale: !!compareAtPrice && compareAtPrice.amount > product.price,
		variants: [
			{
				id: `${product.handle}-default`,
				title: 'Default',
				available: product.available ?? true,
				price: money(product.price),
				compareAtPrice,
				options: [{ name: 'Title', value: 'Default' }],
			},
		],
	};
};

const seriesProducts: Product[] = (store.productSeries ?? []).flatMap((series) =>
	Array.from({ length: series.count }, (_, index) => {
		const itemNumber = index + 1;
		const suffix = String(itemNumber).padStart(2, '0');
		const price = series.basePrice + index * (series.priceStep ?? 0);
		const onSale = !!series.saleEvery && itemNumber % series.saleEvery === 0;

		return createProductFromRaw({
			id: `${series.handlePrefix}-${suffix}`,
			handle: `${series.handlePrefix}-${suffix}`,
			title: `${series.title} ${suffix}`,
			description: series.description,
			descriptionHtml: `<p>${series.description}</p><ul><li>Storefront mock product</li><li>Static fallback catalog</li><li>Ready for paginated browsing</li></ul>`,
			vendor: series.vendor,
			available: true,
			price,
			compareAtPrice: onSale && series.compareAtDelta ? price + series.compareAtDelta : null,
			rating: series.rating,
			reviewCount: (series.reviewCount ?? 10) + index,
			tags: series.tags ?? [],
			imageSeeds: [
				`${series.imageSeedPrefix}-${suffix}`,
				`${series.imageSeedPrefix}-${suffix}-detail`,
			],
		});
	}),
);

export const mockProducts: Product[] = [
	...store.products.map(createProductFromRaw),
	...seriesProducts,
];

export const mockCollections: Collection[] = store.collections.map((collection) => {
	const productCount =
		collection.productCount ??
		mockProducts.filter((product) => {
			const tags = product.tags.map((tag) => tag.toLowerCase());

			if (collection.handle === 'sale') return product.onSale;
			if (collection.handle === 'new-arrivals')
				return tags.includes('new') || tags.includes('new-arrivals');

			return tags.includes(collection.handle.toLowerCase());
		}).length;

	return {
		id: collection.id,
		handle: collection.handle,
		title: collection.title,
		description: collection.description,
		image: makeImage(collection.imageSeed, collection.title, 1200, 1500),
		productCount,
	};
});
