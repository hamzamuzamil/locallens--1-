"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Loader2 } from "lucide-react"
import { recentSearches, userLocation } from "@/lib/storage"

const cities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "San Francisco, CA",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "El Paso, TX",
  "Nashville, TN",
  "Detroit, MI",
  "Oklahoma City, OK",
  "Portland, OR",
  "Las Vegas, NV",
  "Memphis, TN",
  "Louisville, KY",
  "Baltimore, MD",
  "Milwaukee, WI",
  "Albuquerque, NM",
  "Tucson, AZ",
  "Fresno, CA",
  "Mesa, AZ",
  "Sacramento, CA",
  "Atlanta, GA",
  "Kansas City, MO",
  "Colorado Springs, CO",
  "Miami, FL",
  "Raleigh, NC",
  "Omaha, NE",
  "Long Beach, CA",
  "Virginia Beach, VA",
  "Oakland, CA",
  "Minneapolis, MN",
  "Tulsa, OK",
  "Arlington, TX",
  "Tampa, FL",
]

interface SearchFormProps {
  initialQuery?: string
}

export default function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [filteredCities, setFilteredCities] = useState<string[]>([])
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [coordinates, setCoordinates] = useState("38.447030, -101.547385")
  const [limit, setLimit] = useState(5)

  // Initialize with saved coordinates and query from URL
  useEffect(() => {
    const savedCoords = userLocation.get()
    if (savedCoords) {
      setCoordinates(savedCoords)
      setLocation("Current Location")
    }

    const urlQuery = searchParams.get('q')
    if (urlQuery && !initialQuery) {
      setQuery(urlQuery)
    }
  }, [searchParams, initialQuery])

  useEffect(() => {
    if (location.length > 0 && location !== "Current Location") {
      const filtered = cities.filter((city) => 
        city.toLowerCase().includes(location.toLowerCase())
      ).slice(0, 5)
      setFilteredCities(filtered)
      setShowCityDropdown(filtered.length > 0)
    } else {
      setShowCityDropdown(false)
    }
  }, [location])

  const getCurrentLocation = useCallback(() => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            const coords = `${position.coords.latitude}, ${position.coords.longitude}`
            setCoordinates(coords)
            setLocation("Current Location")
            userLocation.set(coords)
            setIsGettingLocation(false)
          } catch (error) {
            console.error("Error getting location:", error)
            setIsGettingLocation(false)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    } else {
      setIsGettingLocation(false)
    }
  }, [])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const searchQuery = location && location !== "Current Location" 
      ? `${query.trim()} in ${location}` 
      : query.trim()

    // Save to recent searches
    recentSearches.add(searchQuery)

    // Build URL with search parameters including coordinates and limit
    const searchUrl = new URL('/search', window.location.origin)
    searchUrl.searchParams.set('q', searchQuery)
    searchUrl.searchParams.set('coordinates', coordinates)
    searchUrl.searchParams.set('limit', limit.toString())

    router.push(searchUrl.toString())
  }, [query, location, coordinates, limit, router])

  const selectCity = useCallback((city: string) => {
    setLocation(city)
    setShowCityDropdown(false)
    // Clear coordinates when selecting a city (will use city-based search)
    setCoordinates("38.447030, -101.547385")
  }, [])

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="What are you looking for? (e.g., restaurants, clinics)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 text-lg pl-12 pr-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Enter city or use current location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-14 text-lg pl-12 pr-16 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
          />
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-3"
          >
            {isGettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          </Button>

          {showCityDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
              {filteredCities.map((city, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectCity(city)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center space-x-4 mb-4">
        <label htmlFor="limit" className="text-sm font-medium text-slate-600">
          Results:
        </label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 transition-colors"
        >
          <option value={5}>5 results</option>
          <option value={10}>10 results</option>
          <option value={15}>15 results</option>
          <option value={20}>20 results</option>
        </select>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full md:w-auto h-14 px-8 text-lg rounded-2xl bg-blue-500 hover:bg-blue-600 transition-colors"
        disabled={!query.trim()}
      >
        <Search className="w-5 h-5 mr-2" />
        Search Nearby
      </Button>
    </form>
  )
}
