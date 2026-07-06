import { atom, type WritableAtom } from 'nanostores'

export function persistentAtom<T>(key: string, initial: T): WritableAtom<T> & { reset: () => void } {
  let stored: T | null = null
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(key)
      if (raw) stored = JSON.parse(raw) as T
    } catch {}
  }

  const store = atom<T>(stored ?? initial) as WritableAtom<T> & { reset: () => void }

  store.subscribe((value) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  })

  store.reset = () => {
    store.set(initial)
  }

  return store
}
