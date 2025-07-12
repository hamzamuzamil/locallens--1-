import { RecentSearch } from "@/types/business"

// Safe localStorage access for SSR compatibility
export const storage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }
}

// Recent searches management
export const recentSearches = {
  get: (): RecentSearch[] => {
    const searches = storage.getItem('recentSearches')
    if (!searches) return []
    try {
      return JSON.parse(searches)
    } catch (error) {
      console.error('Error parsing recent searches:', error)
      return []
    }
  },

  add: (query: string): void => {
    const searches = recentSearches.get()
    const newSearch: RecentSearch = { query, timestamp: Date.now() }
    const updatedSearches = [
      newSearch,
      ...searches.filter(s => s.query !== query)
    ].slice(0, 5)
    
    storage.setItem('recentSearches', JSON.stringify(updatedSearches))
  },

  remove: (query: string): void => {
    const searches = recentSearches.get()
    const updatedSearches = searches.filter(s => s.query !== query)
    storage.setItem('recentSearches', JSON.stringify(updatedSearches))
  },

  clear: (): void => {
    storage.removeItem('recentSearches')
  }
}

// User coordinates management
export const userLocation = {
  get: (): string | null => {
    return storage.getItem('userCoordinates')
  },

  set: (coordinates: string): void => {
    storage.setItem('userCoordinates', coordinates)
  },

  clear: (): void => {
    storage.removeItem('userCoordinates')
  }
}

// Geolocation permission tracking
export const geolocationPermission = {
  hasAsked: (): boolean => {
    return storage.getItem('geolocationAsked') === 'true'
  },

  setAsked: (): void => {
    storage.setItem('geolocationAsked', 'true')
  }
}