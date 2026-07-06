# Query & Data Provider API

## Architecture

The project uses **NanoStores** + **@nanostores/query** for client-side data fetching, providing a lightweight (<2KB) alternative to React Query / SWR, with the same staletime/retry/cache pattern — all without React.

```
src/lib/
  query.ts              — nanoquery setup (shared fetcher, cache config)
  data-provider/
    types.ts            — TypeScript interfaces (getList, getOne, create, update, delete)
    strapi.ts           — Strapi store creators (createListStore, createOneStore)
    client.ts           — HTTP client wrapper (get, post, put, patch, delete)
    index.ts            — exports
  stores/
    persist.ts          — persistentAtom: localStorage-backed nanostore
    cart.ts             — Reactive cart store ($cart, addToCart, removeFromCart, …)
    wishlist.ts         — Reactive wishlist store ($wishlist, toggleWishlist, …)
    index.ts            — exports
```

## Nanoquery Setup

`src/lib/query.ts` creates the fetcher store factory:

```ts
import { nanoquery } from '@nanostores/query'

const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: (...keys) => {
    const url = keys.filter(Boolean).join('')
    return fetch(`/api/${url}`).then(r => r.json())
  },
})
```

- **Automatic cache** with `stale-while-revalidate`
- **Re-fetch on key change** — reactive when store keys update
- **Deduplication** — concurrent requests share one promise

## Data Provider Stores

### `createListStore<T>(params)`

Returns a readable store with `{ data, total, loading, error }`.

```ts
import { createListStore } from '@lib/data-provider'
import { useStore } from '@nanostores/react' // only if using React

const productsStore = createListStore<Product>({
  resource: 'products',
  pagination: { current: 1, pageSize: 10 },
  filters: [{ field: 'price', operator: '$gte', value: 50 }],
  sorters: [{ field: 'createdAt', order: 'desc' }],
})

// Subscribe (any JS context):
productsStore.subscribe(({ data, loading }) => {
  console.log(data, loading)
})

// Read current value:
const { data, total, loading, error } = productsStore.value
```

### `createOneStore<T>(params)`

Returns a readable store with `{ data, loading, error }`.

```ts
const productStore = createOneStore<Product>({
  resource: 'products',
  id: 'abc-123',
})
```

## Client-Side Stores (Cart / Wishlist)

Uses `persistentAtom` (localStorage-backed nanostore) for reactive state that survives page reloads.

```ts
import { $cart, addToCart, removeFromCart, getItemCount } from '@lib/stores'

// Subscribe to changes
$cart.subscribe(lines => {
  console.log('Cart updated:', lines)
})

// Mutations
addToCart({
  id: crypto.randomUUID(),
  handle: 'linen-shirt',
  title: 'Linen Shirt',
  variantId: 'var-1',
  image: '/img.jpg',
  unitPrice: 89,
  currency: 'EUR',
  quantity: 1,
})

removeFromCart('some-id')
```

### Available stores

| Store | Type | Description |
|---|---|---|
| `$cart` | `WritableAtom<CartLine[]>` | Cart lines, persisted to localStorage |
| `$wishlist` | `WritableAtom<WishlistItem[]>` | Wishlist items, persisted to localStorage |

### Store actions

| Cart | Wishlist |
|---|---|
| `addToCart(line)` | `toggleWishlist(item)` |
| `removeFromCart(id)` | `isInWishlist(id)` |
| `updateQuantity(id, qty)` | `clearWishlist()` |
| `clearCart()` | |
| `getCartTotal()` | |
| `getItemCount()` | |

## Reading Stores in Astro Templates

In `.astro` files, the stores are read at build/request time on the server. They are primarily designed for **client-side interactivity** in `<script>` tags:

```astro
<script>
  import { $cart, getItemCount } from '@lib/stores'
  
  $cart.subscribe(lines => {
    document.querySelector('[data-cart-count]')!.textContent = String(getItemCount())
  })
</script>
```

## HTTP Client for Imperative Calls

For one-shot mutations (create, update, delete) or server-side calls, use `apiClient`:

```ts
import { apiClient } from '@lib/data-provider/client'

// POST
await apiClient.post('/orders', { productId: '123', quantity: 2 })

// PUT
await apiClient.put('/products/123', { title: 'Updated' })

// DELETE
await apiClient.delete('/products/123')
```
