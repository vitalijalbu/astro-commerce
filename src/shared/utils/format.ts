/** Formatting helpers shared by storefront UI. */
import type { Money } from '../../lib/types'

const LOCALE = import.meta.env.PUBLIC_LOCALE || 'en-IE'

/** Format a Money value using Intl with the catalog currency. */
export function formatMoney(money: Money): string {
    return new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: money.currencyCode,
        minimumFractionDigits: Number.isInteger(money.amount) ? 0 : 2
    }).format(money.amount)
}

/** Discount percentage, rounded, for sale badges. */
export function discountPercent(price: Money, compareAt?: Money | null): number | null {
    if (!compareAt || compareAt.amount <= price.amount) return null
    return Math.round((1 - price.amount / compareAt.amount) * 100)
}
