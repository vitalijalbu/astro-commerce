import { nanoquery } from '@nanostores/query'

const API_URL = (import.meta.env.PUBLIC_API_URL || '').replace(/\/$/, '')

export const [createFetcherStore, createMutatorStore] = nanoquery({
  fetcher: (...keys: (string | number | boolean | undefined | null)[]) => {
    const url = keys.filter(k => k !== undefined && k !== null && k !== false && k !== true).join('')
    if (!url) throw new Error('[query] empty url')
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`

    return fetch(fullUrl, {
      headers: { Accept: 'application/json' },
    }).then(async res => {
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`API ${res.status}: ${res.statusText}${body ? ` — ${body.slice(0, 200)}` : ''}`)
      }
      return res.json()
    })
  },
})

export { API_URL }
