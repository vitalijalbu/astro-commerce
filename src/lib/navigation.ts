/**
 * Storefront navigation + shop metadata.
 *
 * Like `sections.ts`, this is the kind of data Statamic would own. Menu
 * structure supports one level of dropdown (Dawn's mega-menu style).
 */
import type { MenuItem } from './types'

export const shop = {
    name: 'ATELIER',
    tagline: 'Considered essentials, responsibly made.',
    email: 'hello@atelier.example',
    announcements: [
        'Free shipping on orders over €100',
        'New season just landed — explore the latest',
        '30-day easy returns, always'
    ]
}

export interface MegaPromo {
    image: string
    eyebrow?: string
    title: string
    text?: string
    href: string
    cta?: string
}

export interface NavItem extends MenuItem {
    badge?: string
    columns?: { title: string; items: MenuItem[] }[]
    promo?: MegaPromo
    children?: NavItem[]
}

export const mainMenu: NavItem[] = [
    {
        label: 'New in',
        href: '/collections/new-arrivals',
        badge: 'New'
    },
    {
        label: 'Shop',
        href: '/collections/all',
        columns: [
            {
                title: 'Categories',
                items: [
                    { label: 'All products', href: '/collections/all' },
                    { label: 'Menswear', href: '/collections/menswear' },
                    { label: 'Accessories', href: '/collections/accessories' },
                    { label: 'Knitwear', href: '/collections/new-arrivals' }
                ]
            },
            {
                title: 'Featured',
                items: [
                    { label: 'Best sellers', href: '/collections/best-sellers' },
                    { label: 'New arrivals', href: '/collections/new-arrivals' },
                    { label: 'Sale', href: '/collections/sale' },
                    { label: 'Gift cards', href: '/products/silk-scarf' }
                ]
            }
        ],
        promo: {
            image: 'https://picsum.photos/seed/menu-shop/600/700',
            eyebrow: 'New season',
            title: 'The Linen Edit',
            text: 'Breathable essentials for warmer days.',
            href: '/collections/new-arrivals',
            cta: 'Shop the edit'
        }
    },
    {
        label: 'Collections',
        href: '/collections',
        columns: [
            {
                title: 'Shop by collection',
                items: [
                    { label: 'New arrivals', href: '/collections/new-arrivals' },
                    { label: 'Best sellers', href: '/collections/best-sellers' },
                    { label: 'Accessories', href: '/collections/accessories' },
                    { label: 'Sale', href: '/collections/sale' }
                ]
            }
        ],
        promo: {
            image: 'https://picsum.photos/seed/menu-col/600/700',
            eyebrow: 'Limited',
            title: 'Atelier x Studio',
            text: 'A small-batch capsule, while stocks last.',
            href: '/collections/all',
            cta: 'Discover'
        }
    },
    { label: 'Journal', href: '/blog' },
    { label: 'About', href: '/pages/about' }
]

export const footerMenu = [
    {
        title: 'Shop',
        items: [
            { name: 'New arrivals', href: '/collections/new-arrivals' },
            { name: 'Best sellers', href: '/collections/best-sellers' },
            { name: 'Accessories', href: '/collections/accessories' },
            { name: 'Sale', href: '/collections/sale' }
        ]
    },
    {
        title: 'Help',
        items: [
            { name: 'Shipping', href: '/pages/shipping' },
            { name: 'Returns', href: '/pages/returns' },
            { name: 'Size guide', href: '/pages/size-guide' },
            { name: 'Contact', href: '/pages/contact' }
        ]
    },
    {
        title: 'Company',
        items: [
            { name: 'About us', href: '/pages/about' },
            { name: 'Journal', href: '/blog' },
            { name: 'Sustainability', href: '/pages/sustainability' },
            { name: 'Careers', href: '/pages/careers' }
        ]
    }
]
