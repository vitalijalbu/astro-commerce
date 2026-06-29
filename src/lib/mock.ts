/**
 * Static fallback catalog.
 *
 * Used whenever the PrestaShop webservice is not configured (no env vars)
 * or unreachable. This keeps the storefront fully renderable at build time
 * and during local development without a live backend.
 */
import type { Collection, Product } from './types'

const CURRENCY = 'EUR'

const img = (seed: string, alt: string) => ({
    id: seed,
    url: `https://picsum.photos/seed/${seed}/900/1200`,
    alt,
    width: 900,
    height: 1200
})

function makeProduct(
    handle: string,
    title: string,
    price: number,
    opts: Partial<Product> & { compareAt?: number; tags?: string[] } = {}
): Product {
    const compareAt = opts.compareAt ?? null
    return {
        id: handle,
        handle,
        title,
        description: `${title} — crafted with premium materials and a timeless design that fits every occasion.`,
        descriptionHtml: `<p>${title} — crafted with premium materials and a timeless design that fits every occasion.</p><ul><li>Premium, durable build</li><li>Designed in-house</li><li>Free returns within 30 days</li></ul>`,
        vendor: 'Atelier',
        available: true,
        price: { amount: price, currencyCode: CURRENCY },
        compareAtPrice: compareAt ? { amount: compareAt, currencyCode: CURRENCY } : null,
        rating: 4.5,
        reviewCount: 24,
        featuredImage: img(handle, title),
        images: [img(handle, title), img(`${handle}-2`, `${title} alternate`)],
        tags: opts.tags ?? [],
        onSale: !!compareAt && compareAt > price,
        variants: [
            {
                id: `${handle}-default`,
                title: 'Default',
                available: true,
                price: { amount: price, currencyCode: CURRENCY },
                compareAtPrice: compareAt ? { amount: compareAt, currencyCode: CURRENCY } : null,
                options: [{ name: 'Title', value: 'Default' }]
            }
        ]
    }
}

export const mockProducts: Product[] = [
    makeProduct('linen-blazer', 'Linen Blazer', 189, { compareAt: 240, tags: ['new'] }),
    makeProduct('merino-knit', 'Merino Wool Knit', 129, { tags: ['new'] }),
    makeProduct('canvas-tote', 'Canvas Tote Bag', 59),
    makeProduct('leather-loafers', 'Leather Loafers', 159, { compareAt: 199 }),
    makeProduct('silk-scarf', 'Printed Silk Scarf', 79, { tags: ['new'] }),
    makeProduct('denim-jacket', 'Selvedge Denim Jacket', 219),
    makeProduct('cashmere-beanie', 'Cashmere Beanie', 69, { compareAt: 89 }),
    makeProduct('oxford-shirt', 'Oxford Cotton Shirt', 89, { tags: ['new'] })
]

export const mockCollections: Collection[] = [
    {
        id: 'new-arrivals',
        handle: 'new-arrivals',
        title: 'New Arrivals',
        description: 'The latest additions to the collection.',
        image: {
            id: 'col-new',
            url: 'https://picsum.photos/seed/col-new/1200/1500',
            alt: 'New arrivals'
        },
        productCount: 12
    },
    {
        id: 'menswear',
        handle: 'menswear',
        title: 'Menswear',
        description: 'Tailored essentials for the modern wardrobe.',
        image: {
            id: 'col-men',
            url: 'https://picsum.photos/seed/col-men/1200/1500',
            alt: 'Menswear'
        },
        productCount: 34
    },
    {
        id: 'accessories',
        handle: 'accessories',
        title: 'Accessories',
        description: 'Finishing touches that make the outfit.',
        image: {
            id: 'col-acc',
            url: 'https://picsum.photos/seed/col-acc/1200/1500',
            alt: 'Accessories'
        },
        productCount: 18
    },
    {
        id: 'sale',
        handle: 'sale',
        title: 'Sale',
        description: 'Selected pieces at a reduced price.',
        image: {
            id: 'col-sale',
            url: 'https://picsum.photos/seed/col-sale/1200/1500',
            alt: 'Sale'
        },
        productCount: 9
    }
]
