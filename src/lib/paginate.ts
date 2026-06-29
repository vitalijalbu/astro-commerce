export interface PaginatedResult<T> {
    items: T[]
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
}

export const parsePageParam = (value: string | null): number => {
    const parsed = Number(value)
    if (!Number.isInteger(parsed) || parsed < 1) return 1
    return parsed
}

export function paginateItems<T>(items: T[], page = 1, perPage = 24): PaginatedResult<T> {
    const totalItems = items.length
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
    const currentPage = Math.min(Math.max(1, page), totalPages)
    const start = (currentPage - 1) * perPage
    const end = start + perPage

    return {
        items: items.slice(start, end),
        currentPage,
        totalPages,
        totalItems,
        perPage
    }
}