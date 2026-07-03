import type { AstroCookies } from 'astro';

const COOKIE = 'account_addresses';
const MAX_AGE = 60 * 60 * 24 * 30;

export const COUNTRIES = [
	'Ireland',
	'United Kingdom',
	'France',
	'Germany',
	'Italy',
	'Spain',
	'Portugal',
	'Netherlands',
	'Belgium',
	'Luxembourg',
	'Austria',
	'Switzerland',
	'Denmark',
	'Sweden',
	'Norway',
	'Finland',
	'Poland',
	'Czechia',
	'Greece',
	'United States',
	'Canada',
	'Australia',
];

export interface Address {
	id: string;
	firstName: string;
	lastName: string;
	company?: string;
	line1: string;
	line2?: string;
	city: string;
	postcode: string;
	country: string;
	phone?: string;
	isDefault: boolean;
}

export type AddressInput = Omit<Address, 'id' | 'isDefault'> & {
	id?: string;
	isDefault?: boolean;
};

const SEED: Address[] = [
	{
		id: 'addr-default',
		firstName: 'Demo',
		lastName: 'Customer',
		line1: '14 Marlborough Street',
		city: 'Dublin',
		postcode: 'D01 X2P3',
		country: 'Ireland',
		isDefault: true,
	},
];

const newId = (): string =>
	`addr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function normalizeDefault(list: Address[], preferredId?: string): Address[] {
	if (list.length === 0) return list;
	const target =
		preferredId && list.some((a) => a.id === preferredId && a.isDefault) ? preferredId : null;
	if (target) {
		return list.map((a) => ({ ...a, isDefault: a.id === target }));
	}
	if (list.some((a) => a.isDefault)) return list;
	return list.map((a, i) => ({ ...a, isDefault: i === 0 }));
}

function persist(cookies: AstroCookies, list: Address[]): void {
	cookies.set(COOKIE, JSON.stringify(list), { path: '/', sameSite: 'lax', maxAge: MAX_AGE });
}

export function getAddresses(cookies: AstroCookies): Address[] {
	const raw = cookies.get(COOKIE)?.value;
	if (!raw) return SEED;
	try {
		return JSON.parse(raw) as Address[];
	} catch {
		return SEED;
	}
}

export function upsertAddress(cookies: AstroCookies, input: AddressInput): Address {
	const list = getAddresses(cookies);
	const id = input.id || newId();
	const address: Address = { ...input, id, isDefault: Boolean(input.isDefault) };

	const exists = list.some((a) => a.id === id);
	const merged = exists ? list.map((a) => (a.id === id ? address : a)) : [...list, address];

	persist(cookies, normalizeDefault(merged, id));
	return address;
}

export function deleteAddress(cookies: AstroCookies, id: string): void {
	const remaining = getAddresses(cookies).filter((a) => a.id !== id);
	persist(cookies, normalizeDefault(remaining));
}
