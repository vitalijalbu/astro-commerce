export interface Money {
	amount: number;
	currencyCode: string;
}

export interface ProductImage {
	id: string;
	url: string;
	alt: string;
	width?: number;
	height?: number;
}

export interface ProductVariantOption {
	name: string;
	value: string;
}

export interface ProductVariant {
	id: string;
	title: string;
	available: boolean;
	price: Money;
	compareAtPrice?: Money | null;
	options: ProductVariantOption[];
}

export interface Product {
	id: string;
	handle: string;
	title: string;
	description: string;
	descriptionHtml: string;
	vendor?: string;
	available: boolean;
	price: Money;
	compareAtPrice?: Money | null;
	rating?: number;
	reviewCount?: number;
	featuredImage: ProductImage;
	images: ProductImage[];
	tags: string[];
	variants: ProductVariant[];
	onSale: boolean;
}

export interface Collection {
	id: string;
	handle: string;
	title: string;
	description: string;
	image?: ProductImage | null;
	productCount?: number;
}

export interface MenuItem {
	label: string;
	href: string;
	children?: MenuItem[];
}

export interface CartLine {
	id: string;
	productId: string;
	variantId: string;
	handle: string;
	title: string;
	variantTitle?: string;
	image: string;
	unitPrice: Money;
	quantity: number;
}
