# Components

## Shared layout components (`src/shared/components/`)

| Component | Path | Description |
|---|---|---|
| `Header` | `src/shared/components/header.astro` | Sticky header with mega-menu, search toggle, wishlist link, user dropdown, cart toggle |
| `Footer` | `src/shared/components/footer.astro` | Site footer with newsletter signup, menu columns, social links, payment icons |
| `Layout` | `src/shared/components/layout.astro` | Root HTML shell — SEO meta, JSON-LD, header/footer, drawers, global scripts |
| `UserDropdown` | `src/shared/components/user-dropdown.astro` | User menu using basecoat `.dropdown-menu` pattern with keyboard nav |
| `AccountNav` | `src/shared/components/account-nav.astro` | Tab navigation for account pages (Overview, Orders, Profile) |
| `CartDrawer` | `src/shared/components/cart-drawer.astro` | Slide-out cart drawer with line items, subtotal, checkout |
| `MobileMenu` | `src/shared/components/mobile-menu.astro` | Mobile navigation drawer with sub-panel support |
| `SearchSheet` | `src/shared/components/search-sheet.astro` | Search dialog (drawer from top) |
| `AnnouncementBar` | `src/shared/components/announcement-bar.astro` | Rotating announcement messages |
| `AddressModal` | `src/shared/components/address-modal.astro` | Address CRUD dialog with form fields |
| `SectionRenderer` | `src/shared/components/section-renderer.astro` | Maps section type to section component |

## Section components (`src/shared/sections/`)

Each file corresponds to a section type used in the homepage builder:

| Component | Section Type | Description |
|---|---|---|
| `slideshow.astro` | `slideshow` | Hero carousel with text overlays |
| `featured-collection.astro` | `featured-collection` | Featured product grid |
| `featured-collection-products.astro` | (internal) | Product cards for featured collection |
| `collage.astro` | `collage` | Image collage layout |
| `image-with-text.astro` | `image-with-text` | Side-by-side image + text |
| `image-banner.astro` | `image-banner` | Full-width banner with CTA |
| `collection-list.astro` | `collection-list` | Collection cards grid |
| `collection-list-items.astro` | (internal) | Single collection card |
| `blog-posts.astro` | `blog-posts` | Recent blog posts grid |
| `brand-logos.astro` | `brand-logos` | Brand logo bar |
| `multicolumn.astro` | `multicolumn` | Icon + text columns |
| `contact.astro` | `contact` | Contact form |
| `faq.astro` | `faq` | FAQ accordion |
| `newsletter.astro` | `newsletter` | Newsletter signup form |
| `rich-text.astro` | `rich-text` | Rich editorial content |
| `testimonials.astro` | `testimonials` | Review/testimonial cards |

## Snippet components (`src/shared/snippets/`)

| Component | Description |
|---|---|
| `product-card.astro` | Product card with image, badges, rating, price, add-to-cart |
| `product-grid.astro` | Responsive grid of product cards |
| `product-carousel.astro` | Horizontal scrolling product carousel |
| `product-recommendations.astro` | Server-deferred product recommendations |
| `price.astro` | Formatted price display with compare-at |
| `quantity-picker.astro` | Quantity selector with +/- buttons |
| `collection-filters-form.astro` | Sidebar filter form for collections (tags, availability, price range) |
| `search-filters-form.astro` | Sidebar filter form for search (brand, availability, price range) |
| `filters-sheet.astro` | Mobile drawer wrapper for filter forms |
| `search-filters.astro` | Legacy search filter variant |
| `collection-results.astro` | Server-deferred island for collection listing with filters |
| `search-results.astro` | Server-deferred island for search results with filters |
| `catalog-pagination.astro` | Page navigation for catalog listings |
| `empty-state.astro` | Empty state with image, message, actions |
| `icon.astro` | SVG icon component (lucide-static icons) |
| `icon.astro` | Optimized SVG icon loader |
| `json-ld.astro` | JSON-LD structured data injector |
| `section-heading.astro` | Reusable section heading with optional link |
| `section.astro` | Section wrapper with spacing |
| `blog-card.astro` | Blog post card |
| `skeleton-product-card.astro` | Loading skeleton for product card |
| `skeleton-product-grid.astro` | Loading skeleton for product grid |
| `skeleton-cart-line.astro` | Loading skeleton for cart line item |

## React components (`src/shared/react/`)

| Component | Description |
|---|---|
| `QueryProvider.tsx` | Tanstack Query client provider (used in React islands) |
