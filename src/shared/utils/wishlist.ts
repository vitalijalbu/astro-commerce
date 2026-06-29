export interface WishlistItem {
    id: string
    handle: string
    title: string
    vendor?: string
    image: string
    price: number
    currency: string
    compareAtPrice?: number | null
    rating?: number | null
    reviewCount?: number | null
    available?: boolean
}

const KEY = 'storefront-wishlist'
let listenersBound = false

const read = (): WishlistItem[] => {
    try {
        return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
        return []
    }
}

const write = (items: WishlistItem[]) => {
    localStorage.setItem(KEY, JSON.stringify(items))
    syncWishlist()
}

const formatMoney = (amount: number, currency: string) =>
    new Intl.NumberFormat(document.documentElement.lang || 'en', {
        style: 'currency',
        currency,
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2
    }).format(amount)

const toggleItem = (item: WishlistItem) => {
    const items = read()
    const exists = items.some(entry => entry.id === item.id)
    write(exists ? items.filter(entry => entry.id !== item.id) : [item, ...items])
}

function renderHeaderCount() {
    const count = read().length

    document.querySelectorAll<HTMLElement>('[data-wishlist-count]').forEach(el => {
        el.textContent = String(count)
        el.toggleAttribute('hidden', count === 0)
    })
}

function syncToggleStates() {
    const ids = new Set(read().map(item => item.id))

    document.querySelectorAll<HTMLElement>('[data-wishlist-toggle]').forEach(button => {
        const id = button.dataset.wishlistId || ''
        const active = ids.has(id)
        button.setAttribute('aria-pressed', String(active))
        button.dataset.active = active ? 'true' : 'false'
        button.setAttribute('aria-label', active ? 'Remove from wishlist' : 'Add to wishlist')
    })
}

function renderWishlistPage() {
    const root = document.querySelector<HTMLElement>('[data-wishlist-page]')
    if (!root) return

    const empty = root.querySelector<HTMLElement>('[data-wishlist-empty]')
    const body = root.querySelector<HTMLElement>('[data-wishlist-body]')
    const grid = root.querySelector<HTMLElement>('[data-wishlist-grid]')
    const items = read()

    if (!empty || !body || !grid) return

    empty.toggleAttribute('hidden', items.length > 0)
    body.toggleAttribute('hidden', items.length === 0)

    if (!items.length) {
        grid.innerHTML = ''
        return
    }

    grid.innerHTML = items.map(item => {
        const compare = item.compareAtPrice && item.compareAtPrice > item.price
            ? `<span class="text-sm text-muted line-through">${formatMoney(item.compareAtPrice, item.currency)}</span>`
            : ''

        const rating = item.rating
            ? `<p class="m-0 text-xs text-muted">${item.rating.toFixed(1)}${item.reviewCount ? ` · ${item.reviewCount} reviews` : ''}</p>`
            : ''

        return `
            <article class="group flex h-full flex-col overflow-hidden rounded-[--radius-card] border border-line bg-paper">
                <a href="/products/${item.handle}" class="relative block" aria-label="View ${item.title}">
                    <div class="aspect-square overflow-hidden bg-paper-soft">
                        <img src="${item.image}" alt="${item.title}" width="900" height="900" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <button
                        type="button"
                        data-wishlist-toggle
                        data-wishlist-id="${item.id}"
                        data-wishlist-handle="${item.handle}"
                        data-wishlist-title="${item.title.replace(/"/g, '&quot;')}"
                        data-wishlist-vendor="${(item.vendor || '').replace(/"/g, '&quot;')}"
                        data-wishlist-image="${item.image}"
                        data-wishlist-price="${item.price}"
                        data-wishlist-currency="${item.currency}"
                        data-wishlist-compare-price="${item.compareAtPrice ?? ''}"
                        data-wishlist-rating="${item.rating ?? ''}"
                        data-wishlist-review-count="${item.reviewCount ?? ''}"
                        data-wishlist-available="${item.available === false ? '0' : '1'}"
                        aria-pressed="true"
                        aria-label="Remove from wishlist"
                        class="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/92 text-ink shadow-sm transition hover:bg-white"
                        data-active="true"
                    >
                        <span aria-hidden="true">♡</span>
                    </button>
                </a>
                <div class="flex flex-1 flex-col gap-2 p-0 pt-2">
                    ${item.vendor ? `<span class="text-xs text-muted">${item.vendor}</span>` : ''}
                    <h2 class="m-0 text-base font-medium leading-snug"><a href="/products/${item.handle}" class="link-underline">${item.title}</a></h2>
                    ${rating}
                    <div class="mt-auto flex items-center gap-2 pt-1">
                        <span class="font-medium">${formatMoney(item.price, item.currency)}</span>
                        ${compare}
                    </div>
                </div>
            </article>
        `
    }).join('')
}

function syncWishlist() {
    renderHeaderCount()
    syncToggleStates()
    renderWishlistPage()
}

export function initWishlist() {
    if (!listenersBound) {
        listenersBound = true

        document.addEventListener('click', event => {
            const target = (event.target as HTMLElement).closest<HTMLElement>('[data-wishlist-toggle]')
            if (!target) return

            event.preventDefault()
            event.stopPropagation()

            toggleItem({
                id: target.dataset.wishlistId || '',
                handle: target.dataset.wishlistHandle || '',
                title: target.dataset.wishlistTitle || '',
                vendor: target.dataset.wishlistVendor || undefined,
                image: target.dataset.wishlistImage || '',
                price: Number(target.dataset.wishlistPrice || 0),
                currency: target.dataset.wishlistCurrency || 'EUR',
                compareAtPrice: target.dataset.wishlistComparePrice ? Number(target.dataset.wishlistComparePrice) : null,
                rating: target.dataset.wishlistRating ? Number(target.dataset.wishlistRating) : null,
                reviewCount: target.dataset.wishlistReviewCount ? Number(target.dataset.wishlistReviewCount) : null,
                available: target.dataset.wishlistAvailable !== '0'
            })
        })
    }

    syncWishlist()
}