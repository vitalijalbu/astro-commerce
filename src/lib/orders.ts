export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderLine {
	title: string;
	variant?: string;
	quantity: number;
	price: number;
	imageSeed: string;
}

export interface OrderAddress {
	name: string;
	line1: string;
	city: string;
	postcode: string;
	country: string;
}

export interface Order {
	id: string;
	number: string;
	date: string;
	status: OrderStatus;
	currency: string;
	lines: OrderLine[];
	shipping: number;
	address: OrderAddress;
	tracking?: string;
}

const ORDERS: Order[] = [
	{
		id: '10245',
		number: '#10245',
		date: '12 Jun 2026',
		status: 'Delivered',
		currency: 'EUR',
		shipping: 0,
		tracking: 'IE9241007355',
		address: {
			name: 'Demo Customer',
			line1: '14 Marlborough Street',
			city: 'Dublin',
			postcode: 'D01 X2P3',
			country: 'Ireland',
		},
		lines: [
			{
				title: 'Linen Overshirt',
				variant: 'Sand · M',
				quantity: 1,
				price: 189,
				imageSeed: 'order-overshirt',
			},
			{ title: 'Silk Scarf', variant: 'Ivory', quantity: 1, price: 129, imageSeed: 'order-scarf' },
		],
	},
	{
		id: '10198',
		number: '#10198',
		date: '28 May 2026',
		status: 'Shipped',
		currency: 'EUR',
		shipping: 6,
		tracking: 'IE9240881204',
		address: {
			name: 'Demo Customer',
			line1: '14 Marlborough Street',
			city: 'Dublin',
			postcode: 'D01 X2P3',
			country: 'Ireland',
		},
		lines: [
			{
				title: 'Merino Crew Knit',
				variant: 'Charcoal · L',
				quantity: 1,
				price: 129,
				imageSeed: 'order-knit',
			},
		],
	},
	{
		id: '10090',
		number: '#10090',
		date: '03 May 2026',
		status: 'Delivered',
		currency: 'EUR',
		shipping: 0,
		address: {
			name: 'Demo Customer',
			line1: '14 Marlborough Street',
			city: 'Dublin',
			postcode: 'D01 X2P3',
			country: 'Ireland',
		},
		lines: [
			{
				title: 'Tailored Trousers',
				variant: 'Navy · 32',
				quantity: 1,
				price: 149,
				imageSeed: 'order-trousers',
			},
			{ title: 'Leather Belt', variant: 'Tan', quantity: 1, price: 59, imageSeed: 'order-belt' },
			{
				title: 'Cotton Socks',
				variant: 'Pack of 3',
				quantity: 1,
				price: 39,
				imageSeed: 'order-socks',
			},
		],
	},
];

export const orderSubtotal = (order: Order): number =>
	order.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

export const orderTotal = (order: Order): number => orderSubtotal(order) + order.shipping;

export const orderItemCount = (order: Order): number =>
	order.lines.reduce((sum, line) => sum + line.quantity, 0);

export function getOrders(): Order[] {
	return ORDERS;
}

export function getOrderById(id: string): Order | undefined {
	return ORDERS.find((order) => order.id === id);
}
