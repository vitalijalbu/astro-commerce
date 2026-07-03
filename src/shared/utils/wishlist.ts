export interface WishlistItem {
	id: string;
	handle: string;
	title: string;
	vendor?: string;
	image: string;
	price: number;
	currency: string;
	compareAtPrice?: number | null;
	rating?: number | null;
	reviewCount?: number | null;
	available?: boolean;
}

const KEY = 'storefront-wishlist';
let listenersBound = false;

const decodeItem = (value: string | undefined): WishlistItem | null => {
	if (!value) return null;

	try {
		const parsed = JSON.parse(decodeURIComponent(value)) as WishlistItem;
		return parsed?.id ? parsed : null;
	} catch {
		return null;
	}
};

const read = (): WishlistItem[] => {
	try {
		return JSON.parse(localStorage.getItem(KEY) || '[]');
	} catch {
		return [];
	}
};

const write = (items: WishlistItem[]) => {
	localStorage.setItem(KEY, JSON.stringify(items));
	syncWishlist();
};

const toggleItem = (item: WishlistItem) => {
	const items = read();
	const exists = items.some((entry) => entry.id === item.id);
	write(exists ? items.filter((entry) => entry.id !== item.id) : [item, ...items]);
};

function renderHeaderCount() {
	const count = read().length;

	document.querySelectorAll<HTMLElement>('[data-wishlist-count]').forEach((el) => {
		el.textContent = String(count);
		el.toggleAttribute('hidden', count === 0);
	});
}

function syncToggleStates() {
	const ids = new Set(read().map((item) => item.id));

	document.querySelectorAll<HTMLElement>('[data-wishlist-toggle]').forEach((button) => {
		const item = decodeItem(button.dataset.wishlistItem);
		const id = item?.id || '';
		const active = ids.has(id);
		button.setAttribute('aria-pressed', String(active));
		button.dataset.active = active ? 'true' : 'false';
		button.setAttribute('aria-label', active ? 'Remove from wishlist' : 'Add to wishlist');
	});
}

async function renderWishlistPage() {
	const root = document.querySelector<HTMLElement>('[data-wishlist-page]');
	if (!root) return;

	const empty = root.querySelector<HTMLElement>('[data-wishlist-empty]');
	const body = root.querySelector<HTMLElement>('[data-wishlist-body]');
	const grid = root.querySelector<HTMLElement>('[data-wishlist-grid]');
	const loading = root.querySelector<HTMLElement>('[data-wishlist-loading]');
	const items = read();

	if (!empty || !body || !grid) return;

	const showEmpty = () => {
		loading?.toggleAttribute('hidden', true);
		body.toggleAttribute('hidden', true);
		empty.toggleAttribute('hidden', false);
		grid.innerHTML = '';
	};

	if (!items.length) {
		showEmpty();
		return;
	}

	empty.toggleAttribute('hidden', true);

	try {
		const ids = items.map((item) => item.id).join(',');
		const response = await fetch(`/partials/wishlist-cards?ids=${encodeURIComponent(ids)}`);
		if (!response.ok) throw new Error(`wishlist partial ${response.status}`);
		grid.innerHTML = await response.text();
	} catch {
		showEmpty();
		return;
	}

	loading?.toggleAttribute('hidden', true);
	body.toggleAttribute('hidden', false);
	syncToggleStates();
}

function syncWishlist() {
	renderHeaderCount();
	syncToggleStates();
	renderWishlistPage();
}

export function initWishlist() {
	if (!listenersBound) {
		listenersBound = true;

		document.addEventListener('click', (event) => {
			const target = (event.target as HTMLElement).closest<HTMLElement>('[data-wishlist-toggle]');
			if (!target) return;

			event.preventDefault();
			event.stopPropagation();

			const item = decodeItem(target.dataset.wishlistItem);
			if (!item) return;

			toggleItem(item);
		});
	}

	syncWishlist();
}
