import type { Money } from '@lib/types';

const LOCALE = import.meta.env.PUBLIC_LOCALE || 'en-IE';

export function formatMoney(money: Money): string {
	return new Intl.NumberFormat(LOCALE, {
		style: 'currency',
		currency: money.currencyCode,
		minimumFractionDigits: Number.isInteger(money.amount) ? 0 : 2,
	}).format(money.amount);
}

export function discountPercent(price: Money, compareAt?: Money | null): number | null {
	if (!compareAt || compareAt.amount <= price.amount) return null;
	return Math.round((1 - price.amount / compareAt.amount) * 100);
}
