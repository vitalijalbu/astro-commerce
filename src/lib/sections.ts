/**
 * Page-builder section model.
 *
 * The homepage is composed from an ordered list of "sections" — exactly the
 * shape a Statamic page-builder (Bard/Replicator) would emit. Today the data
 * lives in `homepageSections` below (static), but the contract is identical
 * to what a CMS would return, so swapping `homepageSections` for a CMS fetch
 * requires no changes to the section components or the renderer.
 *
 * Each section has a `type` (which component renders it) and a `settings`
 * object. `section-renderer.astro` maps `type` -> component.
 */

import { getLatestBlogSummaries } from './blog'

export interface BaseSection {
    /** Stable id, used as the DOM anchor / React-less key. */
    id: string
    type: SectionType
    /** Optional vertical rhythm override (maps to Tailwind padding scale). */
    spacing?: 'none' | 'sm' | 'md' | 'lg'
    /** Optional background treatment. */
    background?: 'default' | 'muted' | 'dark'
}

export type SectionType =
    | 'slideshow'
    | 'image-banner'
    | 'featured-collection'
    | 'collection-list'
    | 'collage'
    | 'rich-text'
    | 'image-with-text'
    | 'multicolumn'
    | 'newsletter'
    | 'testimonials'
    | 'blog-posts'
    | 'faq'
    | 'contact'

export interface SlideshowSection extends BaseSection {
    type: 'slideshow'
    settings: {
        autoplay?: boolean
        slides: {
            image: string
            eyebrow?: string
            heading: string
            text?: string
            cta?: { label: string; href: string }
            align?: 'left' | 'center' | 'right'
        }[]
    }
}

export interface CollageSection extends BaseSection {
    type: 'collage'
    settings: {
        heading?: string
        subheading?: string
        tiles: {
            image: string
            title: string
            href: string
            size?: 'large' | 'small'
        }[]
    }
}

export interface FaqSection extends BaseSection {
    type: 'faq'
    settings: {
        heading: string
        subheading?: string
        items: { title: string; content: string }[]
    }
}

export interface ContactSection extends BaseSection {
    type: 'contact'
    settings: {
        heading: string
        text?: string
    }
}

export interface ImageBannerSection extends BaseSection {
    type: 'image-banner'
    settings: {
        image: string
        mobileImage?: string
        heading: string
        subheading?: string
        text?: string
        primaryCta?: { label: string; href: string }
        secondaryCta?: { label: string; href: string }
        align?: 'left' | 'center' | 'right'
        height?: 'medium' | 'large' | 'full'
    }
}

export interface FeaturedCollectionSection extends BaseSection {
    type: 'featured-collection'
    settings: {
        heading: string
        subheading?: string
        collectionHandle?: string
        limit?: number
        layout?: 'grid' | 'carousel'
        cta?: { label: string; href: string }
    }
}

export interface CollectionListSection extends BaseSection {
    type: 'collection-list'
    settings: {
        heading: string
        subheading?: string
        handles?: string[]
        columns?: 2 | 3 | 4
    }
}

export interface RichTextSection extends BaseSection {
    type: 'rich-text'
    settings: {
        eyebrow?: string
        heading: string
        text: string
        cta?: { label: string; href: string }
        align?: 'left' | 'center'
    }
}

export interface ImageWithTextSection extends BaseSection {
    type: 'image-with-text'
    settings: {
        image: string
        eyebrow?: string
        heading: string
        text: string
        cta?: { label: string; href: string }
        imageSide?: 'left' | 'right'
    }
}

export interface MulticolumnSection extends BaseSection {
    type: 'multicolumn'
    settings: {
        heading?: string
        columns: { icon?: string; title: string; text: string }[]
    }
}

export interface NewsletterSection extends BaseSection {
    type: 'newsletter'
    settings: {
        heading: string
        text?: string
        placeholder?: string
        buttonLabel?: string
    }
}

export interface TestimonialsSection extends BaseSection {
    type: 'testimonials'
    settings: {
        heading?: string
        items: { quote: string; author: string; role?: string; rating?: number }[]
    }
}

export interface BlogPostsSection extends BaseSection {
    type: 'blog-posts'
    settings: {
        heading: string
        subheading?: string
        posts: {
            image: string
            title: string
            excerpt: string
            href: string
            date: string
            author?: string
            readMinutes?: number
            tags?: string[]
        }[]
    }
}

export type Section =
    | SlideshowSection
    | ImageBannerSection
    | FeaturedCollectionSection
    | CollectionListSection
    | CollageSection
    | RichTextSection
    | ImageWithTextSection
    | MulticolumnSection
    | NewsletterSection
    | TestimonialsSection
    | BlogPostsSection
    | FaqSection
    | ContactSection

/* -------------------------------------------------------------------------- */
/* Homepage content (would be supplied by Statamic in production)              */
/* -------------------------------------------------------------------------- */

const latestBlogPosts = getLatestBlogSummaries(3)

export const homepageSections: Section[] = [
    {
        id: 'hero',
        type: 'slideshow',
        settings: {
            autoplay: true,
            slides: [
                {
                    image: 'https://picsum.photos/seed/hero1/2000/1100',
                    eyebrow: 'New Season',
                    heading: 'Considered essentials for every day',
                    text: 'Timeless pieces, responsibly made.',
                    cta: { label: 'Shop new in', href: '/collections/new-arrivals' },
                    align: 'left'
                },
                {
                    image: 'https://picsum.photos/seed/hero2/2000/1100',
                    eyebrow: 'The Linen Edit',
                    heading: 'Light layers for warmer days',
                    text: 'Breathable, natural, beautifully cut.',
                    cta: { label: 'Explore the edit', href: '/collections/all' },
                    align: 'left'
                },
                {
                    image: 'https://picsum.photos/seed/hero3/2000/1100',
                    eyebrow: 'Up to 40% off',
                    heading: 'Final reductions',
                    text: 'Selected styles, while stocks last.',
                    cta: { label: 'Shop sale', href: '/collections/sale' },
                    align: 'center'
                }
            ]
        }
    },
    {
        id: 'value-props',
        type: 'multicolumn',
        background: 'muted',
        settings: {
            columns: [
                { icon: 'truck', title: 'Free shipping', text: 'On all orders over €100, everywhere.' },
                { icon: 'refresh', title: '30-day returns', text: 'Not quite right? Send it back, on us.' },
                { icon: 'shield', title: 'Secure checkout', text: 'Encrypted payments you can trust.' },
                { icon: 'headphones', title: 'Here to help', text: 'Real people, Monday to Friday.' }
            ]
        }
    },
    {
        id: 'featured',
        type: 'featured-collection',
        settings: {
            heading: 'Best sellers',
            subheading: 'The pieces our customers keep coming back for.',
            collectionHandle: 'best-sellers',
            limit: 4,
            layout: 'grid',
            cta: { label: 'View all', href: '/collections/all' }
        }
    },
    {
        id: 'collections',
        type: 'collection-list',
        background: 'muted',
        settings: {
            heading: 'Shop by category',
            handles: ['new-arrivals', 'menswear', 'accessories', 'sale'],
            columns: 4
        }
    },
    {
        id: 'collage',
        type: 'collage',
        settings: {
            heading: 'The edit',
            subheading: 'A few of our favourite things this season.',
            tiles: [
                { image: 'https://picsum.photos/seed/tile1/900/1100', title: 'Outerwear', href: '/collections/menswear', size: 'large' },
                { image: 'https://picsum.photos/seed/tile2/700/500', title: 'Knitwear', href: '/collections/new-arrivals', size: 'small' },
                { image: 'https://picsum.photos/seed/tile3/700/500', title: 'Accessories', href: '/collections/accessories', size: 'small' }
            ]
        }
    },
    {
        id: 'editorial',
        type: 'image-with-text',
        settings: {
            image: 'https://picsum.photos/seed/editorial/1200/1400',
            eyebrow: 'Our story',
            heading: 'Made to last, designed to be worn',
            text: 'We work with a small number of trusted ateliers to make fewer, better things — using natural materials and fair production at every step.',
            cta: { label: 'About us', href: '/pages/about' },
            imageSide: 'left'
        }
    },
    {
        id: 'new-in',
        type: 'featured-collection',
        settings: {
            heading: 'Just landed',
            subheading: 'Fresh arrivals, added weekly.',
            collectionHandle: 'new-arrivals',
            limit: 8,
            layout: 'carousel'
        }
    },
    {
        id: 'reviews',
        type: 'testimonials',
        background: 'muted',
        settings: {
            heading: 'Loved by thousands',
            items: [
                { quote: 'The quality is genuinely exceptional. My blazer gets compliments every time I wear it.', author: 'Elena R.', role: 'Verified buyer', rating: 5 },
                { quote: 'Fast shipping, beautiful packaging, and the fit is perfect. Will absolutely order again.', author: 'Marco T.', role: 'Verified buyer', rating: 5 },
                { quote: 'Finally a brand that does timeless basics right. Everything works together.', author: 'Sofia L.', role: 'Verified buyer', rating: 5 }
            ]
        }
    },
    {
        id: 'journal',
        type: 'blog-posts',
        settings: {
            heading: 'From the journal',
            subheading: 'Stories, guides and behind-the-scenes.',
            posts: latestBlogPosts.map(post => ({
                image: post.image,
                title: post.title,
                excerpt: post.excerpt,
                href: post.href,
                date: post.date,
                author: post.author,
                readMinutes: post.readMinutes,
                tags: post.tags
            }))
        }
    },
    {
        id: 'faq',
        type: 'faq',
        background: 'muted',
        settings: {
            heading: 'Frequently asked',
            subheading: 'Everything you need to know before you order.',
            items: [
                { title: 'How long does shipping take?', content: 'Standard delivery is 2–4 working days. Express options are available at checkout.' },
                { title: 'What is your returns policy?', content: 'Return anything within 30 days for a full refund — no questions asked. Items must be unworn with tags attached.' },
                { title: 'Do you ship internationally?', content: 'Yes, we ship worldwide. Duties and taxes are calculated at checkout for most destinations.' },
                { title: 'How do I track my order?', content: 'You\'ll receive a tracking link by email as soon as your order ships. You can also see status in your account.' }
            ]
        }
    },
    {
        id: 'newsletter',
        type: 'newsletter',
        background: 'dark',
        settings: {
            heading: 'Join the list',
            text: 'Be first to know about new arrivals, restocks and members-only offers.',
            placeholder: 'Enter your email',
            buttonLabel: 'Subscribe'
        }
    },
    {
        id: 'contact',
        type: 'contact',
        settings: {
            heading: 'Get in touch',
            text: 'Questions about an order or a product? Our team replies within one working day.'
        }
    }
]
