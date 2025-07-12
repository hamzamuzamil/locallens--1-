"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, MapPin, Clock, Phone, ExternalLink, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Business, SearchResponse, ApiError } from "@/types/business"

interface SearchResultsProps {
  query: string
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const searchParams = useSearchParams()

  // Get search parameters from URL
  const coordinates = searchParams.get('coordinates') || "38.447030, -101.547385"
  const limit = parseInt(searchParams.get('limit') || "12", 10)

  // Memoize search parameters to prevent unnecessary re-renders
  const searchConfig = useMemo(() => ({
    query: query.trim(),
    coordinates,
    limit: Math.min(Math.max(limit, 1), 50) // Ensure limit is between 1-50
  }), [query, coordinates, limit])

  const searchBusinesses = useCallback(async (config: typeof searchConfig) => {
    if (!config.query) return

    setLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }))
        throw new Error(errorData.error || "Failed to fetch results")
      }

      const data: SearchResponse = await response.json()

      // Handle the API response structure properly
      if (data.data && Array.isArray(data.data)) {
        setBusinesses(data.data)
        setRetryCount(0) // Reset retry count on success
      } else if (Array.isArray(data)) {
        setBusinesses(data as Business[])
        setRetryCount(0)
      } else {
        setBusinesses([])
      }
    } catch (err) {
      console.error("Search error:", err)
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError("Search timed out. Please try again.")
        } else {
          setError(err.message)
        }
      } else {
        setError("Search failed. Please try again.")
      }
      
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Effect to trigger search when config changes
  useEffect(() => {
    if (searchConfig.query) {
      searchBusinesses(searchConfig)
    }
  }, [searchConfig, searchBusinesses])

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1)
    searchBusinesses(searchConfig)
  }, [searchConfig, searchBusinesses])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-600">Searching for businesses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Something went wrong</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <div className="flex gap-3">
          <Button onClick={handleRetry} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Try Again {retryCount > 0 && `(${retryCount})`}
          </Button>
          <Button onClick={() => window.location.href = "/"} variant="ghost">
            New Search
          </Button>
        </div>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No results found</h3>
        <p className="text-slate-600 mb-4">Try adjusting your search terms or location</p>
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          Start New Search
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Search Results for "{query}"</h2>
        <p className="text-slate-600">Found {businesses.length} businesses</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {businesses.map((business, index) => (
            <motion.div
              key={business.business_id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-2">{business.name}</h3>
                      {business.subtypes && business.subtypes.length > 0 && (
                        <p className="text-sm text-blue-600 font-medium">{business.subtypes[0]}</p>
                      )}
                    </div>
                    {business.verified && (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    {business.rating && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="font-semibold text-slate-800 ml-1">{business.rating.toFixed(1)}</span>
                        </div>
                        {business.review_count && (
                          <span className="text-slate-500 text-sm">({business.review_count} reviews)</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-600 text-sm line-clamp-2">{business.full_address || business.address}</p>
                    </div>

                    {business.opening_status && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span
                          className={`text-sm font-medium ${
                            business.opening_status === "Open" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {business.opening_status}
                        </span>
                      </div>
                    )}

                    {business.phone_number && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${business.phone_number}`} className="text-blue-600 hover:text-blue-800 text-sm">
                          {business.phone_number}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button asChild className="flex-1 rounded-xl" size="sm">
                      <a href={`/business/${encodeURIComponent(business.business_id || business.place_id)}`}>
                        View Details
                      </a>
                    </Button>
                    {business.website && (
                      <Button asChild variant="outline" size="sm" className="rounded-xl bg-transparent">
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`Visit ${business.name} website`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
