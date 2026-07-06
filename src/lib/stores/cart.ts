import { persistentAtom } from './persist'

export interface CartLine {
  id: string
  productId: string
  variantId: string
  handle: string
  title: string
  variantTitle?: string
  image: string
  unitPrice: number
  currency: string
  quantity: number
}

export const $cart = persistentAtom<CartLine[]>('storefront-cart', [])

export function addToCart(line: CartLine) {
  const current = $cart.get()
  const existing = current.find(
    l => l.variantId === line.variantId && l.handle === line.handle
  )
  if (existing) {
    $cart.set(current.map(l =>
      l.id === existing.id ? { ...l, quantity: l.quantity + line.quantity } : l
    ))
  } else {
    $cart.set([...current, line])
  }
}

export function removeFromCart(id: string) {
  $cart.set($cart.get().filter(l => l.id !== id))
}

export function updateQuantity(id: string, quantity: number) {
  $cart.set(
    $cart.get().map(l => l.id === id ? { ...l, quantity: Math.max(1, quantity) } : l)
  )
}

export function clearCart() {
  $cart.reset()
}

export function getCartTotal(): number {
  return $cart.get().reduce((s, l) => s + l.unitPrice * l.quantity, 0)
}

export function getItemCount(): number {
  return $cart.get().reduce((s, l) => s + l.quantity, 0)
}
