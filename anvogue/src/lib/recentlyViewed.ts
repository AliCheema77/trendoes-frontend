const STORAGE_KEY = 'recently_viewed'
const MAX_ITEMS = 4

export function addRecentlyViewed(productId: string | number): void {
    if (typeof window === 'undefined') return
    const current = getRecentlyViewed()
    const filtered = current.filter(id => id !== String(productId))
    const updated = [String(productId), ...filtered].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function getRecentlyViewed(): string[] {
    if (typeof window === 'undefined') return []
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
        return []
    }
}