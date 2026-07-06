import { closeDrawer, initDrawerBackdrop, initDrawerCancel } from '@utils/dom';

export interface ClientCartLine {
	id: string;
	handle: string;
	title: string;
	variantTitle?: string;
	image: string;
	price: number;
	currency: string;
	quantity: number;
}

const KEY = 'storefront-cart';
const FREE_SHIPPING_THRESHOLD = 100;
let listenersBound = false;
let openDrawer: (() => void) | undefined;

const read = (): ClientCartLine[] => {
	try {
		return JSON.parse(localStorage.getItem(KEY) || '[]');
	} catch {
		return [];
	}
};

const write = (lines: ClientCartLine[]) => {
	localStorage.setItem(KEY, JSON.stringify(lines));
	render();
};

const formatMoney = (amount: number, currency: string) =>
	new Intl.NumberFormat(document.documentElement.lang || 'en', {
		style: 'currency',
		currency,
		minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
	}).format(amount);

const count = (lines: ClientCartLine[]) => lines.reduce((sum, l) => sum + l.quantity, 0);

const subtotal = (lines: ClientCartLine[]) =>
	lines.reduce((sum, l) => sum + l.quantity * l.price, 0);

function addLine(line: ClientCartLine) {
	const lines = read();
	const existing = lines.find((l) => l.id === line.id);
	if (existing) {
		existing.quantity += line.quantity;
	} else {
		lines.push(line);
	}
	write(lines);
}

function removeLine(id: string) {
	write(read().filter((l) => l.id !== id));
}

function setQuantity(id: string, quantity: number) {
	const lines = read();
	const line = lines.find((l) => l.id === id);
	if (!line) return;
	line.quantity = Math.max(1, quantity);
	write(lines);
}

function render() {
	const lines = read();

	document.querySelectorAll<HTMLElement>('[data-cart-loading]').forEach((el) => {
		el.toggleAttribute('hidden', true);
	});

	const currency = lines[0]?.currency || 'EUR';
	const currentSubtotal = subtotal(lines);
	const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - currentSubtotal);
	const progress = Math.min(100, (currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

	document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
		const n = count(lines);
		el.textContent = String(n);
		el.toggleAttribute('hidden', n === 0);
	});

	const container = document.querySelector<HTMLElement>('[data-cart-lines]');
	const empty = document.querySelector<HTMLElement>('[data-cart-empty]');
	const footer = document.querySelector<HTMLElement>('[data-cart-footer]');

	if (container) {
		if (!lines.length) {
			container.innerHTML = '';
			empty?.toggleAttribute('hidden', false);
			footer?.toggleAttribute('hidden', true);
		} else {
			empty?.toggleAttribute('hidden', true);
			footer?.toggleAttribute('hidden', false);
			container.innerHTML = lines
				.map(
					(l) => `
                <li class="flex gap-4 py-4 border-b border-line">
                    <a href="/products/${l.handle}" class="shrink-0">
                        <img src="${l.image}" alt="${l.title}" width="72" height="90"
                            class="object-cover rounded-[--radius-card] bg-paper-soft" />
                    </a>
                    <div class="flex-1 min-w-0">
                        <a href="/products/${l.handle}" class="font-medium leading-tight">${l.title}</a>
                        ${
													l.variantTitle && l.variantTitle !== 'Default'
														? `<p class="text-sm text-muted mt-0.5">${l.variantTitle}</p>`
														: ''
												}
                        <div class="flex items-center gap-3 mt-2">
                            <input type="number" min="1" value="${l.quantity}" data-cart-qty="${l.id}"
                                aria-label="Quantity"
                                class="w-14 h-8 px-2 border border-line rounded-[--radius-card] text-sm" />
                            <button type="button" data-cart-remove="${l.id}"
                                class="text-sm text-muted link-underline">Remove</button>
                        </div>
                    </div>
                    <div class="text-right font-medium">${formatMoney(l.price * l.quantity, l.currency)}</div>
                </li>
            `,
				)
				.join('');
		}
	}

	document.querySelectorAll<HTMLElement>('[data-cart-subtotal]').forEach((el) => {
		el.textContent = formatMoney(currentSubtotal, currency);
	});

	const freeShippingAmount = document.querySelector<HTMLElement>(
		'[data-cart-free-shipping-amount]',
	);
	const freeShippingMessage = document.querySelector<HTMLElement>(
		'[data-cart-free-shipping-message]',
	);
	const freeShippingProgress = document.querySelector<HTMLElement>(
		'[data-cart-free-shipping-progress]',
	);

	if (freeShippingAmount && freeShippingMessage && freeShippingProgress) {
		freeShippingProgress.style.width = `${progress}%`;
		freeShippingAmount.textContent =
			remaining > 0 ? `Add ${formatMoney(remaining, currency)}` : 'Unlocked';
		freeShippingMessage.textContent =
			remaining > 0
				? `${formatMoney(remaining, currency)} away from free shipping.`
				: 'Free shipping unlocked for this order.';
	}
}

function checkout() {
	const lines = read();
	if (!lines.length) return;
	// TODO: POST `lines` to a /api/checkout endpoint that creates a
	// PrestaShop cart and returns the hosted checkout URL.
	window.location.href = '/cart';
}

export function initCart() {
	const toggle = document.querySelector<HTMLElement>('[data-cart-toggle]');
	const drawer = document.querySelector<HTMLDialogElement>('#cart-drawer');

	if (toggle && toggle.dataset.cartBound !== 'true') {
		toggle.dataset.cartBound = 'true';

		toggle.addEventListener('click', () => {
			if (drawer?.hasAttribute('open')) {
				closeDrawer(drawer);
			} else {
				drawer?.showModal();
			}
		});

		drawer?.addEventListener('close', () => {
			toggle.setAttribute('aria-expanded', 'false');
			toggle.focus();
		});

		openDrawer = () => {
			if (drawer && !drawer.hasAttribute('open')) drawer.showModal();
		};
	}

	if (drawer && drawer.dataset.cartCancelBound !== 'true') {
		drawer.dataset.cartCancelBound = 'true';
		initDrawerCancel(drawer);
		if (!drawer.dataset.cartBackdropBound) {
			drawer.dataset.cartBackdropBound = 'true';
			initDrawerBackdrop(drawer);
		}

		drawer.querySelectorAll<HTMLElement>('[data-drawer-close]').forEach(btn => {
			if (btn.dataset.bound === 'true') return
			btn.dataset.bound = 'true'
			btn.addEventListener('click', () => closeDrawer(drawer!))
		})
	}

	if (!listenersBound) {
		listenersBound = true;

		document.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;

			const add = target.closest<HTMLElement>('[data-add-to-cart]');
			if (add) {
				event.preventDefault();
				const { id, handle, title, image } = add.dataset;
				if (id && handle && title && image) {
					addLine({
						id,
						handle,
						title,
						variantTitle: add.dataset.variant,
						image,
						price: Number(add.dataset.price),
						currency: add.dataset.currency || 'EUR',
						quantity: Number(add.dataset.quantity || 1),
					});
					openDrawer?.();
				}
				return;
			}

			const remove = target.closest<HTMLElement>('[data-cart-remove]');
			if (remove) {
				if (remove.dataset.cartRemove) removeLine(remove.dataset.cartRemove);
				return;
			}

			if (target.closest('[data-cart-checkout]')) {
				event.preventDefault();
				checkout();
			}
		});

		document.addEventListener('input', (event) => {
			const qty = (event.target as HTMLElement).closest<HTMLInputElement>('[data-cart-qty]');
			if (qty?.dataset.cartQty) {
				setQuantity(qty.dataset.cartQty, Number(qty.value));
			}
		});
	}

	render();
}
