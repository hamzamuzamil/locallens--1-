"use client"

import { useState, useEffect } from "react"
import { Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { recentSearches } from "@/lib/storage"
import { RecentSearch } from "@/types/business"

export default function RecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>([])

  useEffect(() => {
    setSearches(recentSearches.get())
  }, [])

  const removeSearch = (queryToRemove: string) => {
    recentSearches.remove(queryToRemove)
    setSearches(recentSearches.get())
  }

  const clearAllSearches = () => {
    recentSearches.clear()
    setSearches([])
  }

  if (searches.length === 0) return null

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Searches
          </h3>
          <Button variant="ghost" size="sm" onClick={clearAllSearches} className="text-slate-500 hover:text-slate-700">
            Clear All
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {searches.map((search, index) => (
            <div
              key={`${search.query}-${search.timestamp}`}
              className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 group hover:bg-gray-200 transition-colors"
            >
              <a
                href={`/search?q=${encodeURIComponent(search.query)}`}
                className="text-slate-700 hover:text-blue-500 transition-colors"
              >
                {search.query}
              </a>
              <button
                onClick={() => removeSearch(search.query)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove search: ${search.query}`}
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
