import { persistentAtom } from './persist'

export interface WishlistItem {
  id: string
  handle: string
  title: string
  vendor: string | null
  image: string
  price: number
  currency: string
  compareAtPrice: number | null
  rating: number | null
  reviewCount: number | null
  available: boolean
}

export const $wishlist = persistentAtom<WishlistItem[]>('storefront-wishlist', [])

export function toggleWishlist(item: WishlistItem) {
  const current = $wishlist.get()
  const existing = current.find(i => i.id === item.id)
  if (existing) {
    $wishlist.set(current.filter(i => i.id !== item.id))
  } else {
    $wishlist.set([...current, item])
  }
}

export function isInWishlist(id: string): boolean {
  return $wishlist.get().some(i => i.id === id)
}

export function clearWishlist() {
  $wishlist.reset()
}
