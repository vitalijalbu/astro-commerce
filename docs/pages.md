# Pages

## Public routes

| Route | File | Description |
|---|---|---|
| `/` | `src/pages/index.astro` | Homepage — renders sections from `src/lib/sections.ts` via `SectionRenderer` |
| `/cart` | `src/pages/cart.astro` | Cart page — client-rendered from `localStorage('storefront-cart')` |
| `/wishlist` | `src/pages/wishlist.astro` | Wishlist page — client-rendered from `localStorage('storefront-wishlist')` |
| `/search` | `src/pages/search.astro` | Search with filters — uses `SearchResults` (server:defer) |
| `/login` | `src/pages/login.astro` | Sign-in form — POST to `auth.login()` |
| `/register` | `src/pages/register.astro` | Account creation — POST to `auth.register()` |
| `/logout` | `src/pages/logout.astro` | Clear session + redirect to `/` |
| `/account/recover` | `src/pages/account/recover.astro` | Forgot password — sends reset email via API |
| `/account/reset/[token]` | `src/pages/account/reset/[token].astro` | Password reset — POST new password with token |
| `/*` | `src/pages/404.astro` | 404 Not Found |

## Account routes (authenticated)

| Route | File | Description |
|---|---|---|
| `/account` | `src/pages/account/index.astro` | Dashboard — shortcut cards to Orders, Profile, Keep shopping |
| `/account/orders` | `src/pages/account/orders.astro` | Order history — table with status badges |
| `/account/orders/[id]` | `src/pages/account/orders/[id].astro` | Order detail — items, timeline, shipping, summary, print |
| `/account/profile` | `src/pages/account/profile.astro` | Profile editing, password change, address CRUD |

## Collection routes

| Route | File | Description |
|---|---|---|
| `/collections` | `src/pages/collections/index.astro` | Collections index — paginated grid |
| `/collections/[handle]` | `src/pages/collections/[handle].astro` | Single collection — uses `CollectionResults` (server:defer) with filters |

## Product routes

| Route | File | Description |
|---|---|---|
| `/products/[handle]` | `src/pages/products/[handle].astro` | Product detail — gallery, variants, sticky bar, JSON-LD |

## Blog routes

| Route | File | Description |
|---|---|---|
| `/blog` | `src/pages/blog/index.astro` | Blog listing — search + tag filter |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | Single blog post — content + JSON-LD |

## Other routes

| Route | File | Description |
|---|---|---|
| `/brands` | `src/pages/brands/index.astro` | Brand partners listing |
| `/partials/wishlist-cards` | `src/pages/partials/wishlist-cards.astro` | HTMX-style partial for wishlist product cards |

## Layout

All pages use `src/shared/components/layout.astro` which provides:

- SEO meta tags (description, OG, Twitter, robots)
- JSON-LD structured data (WebSite, Organization, BreadcrumbList)
- Site header with mega-menu, search, wishlist, user dropdown, cart
- Announcement bar, footer, mobile menu, search sheet, cart drawer
- Client-side enhancements (cart, wishlist, basecoat dropdowns)
- Skip-to-content link for keyboard users
