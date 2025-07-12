import type { Metadata } from "next"
import SearchForm from "@/components/search-form"
import RecentSearches from "@/components/recent-searches"
import { MapPin, Search, Star } from "lucide-react"
import GeolocationPrompt from "@/components/geolocation-prompt"

export const metadata: Metadata = {
  title: "LocalLens - Find Local Businesses Near You",
  description:
    "Search verified local businesses in your area. Real-time results powered by RapidAPI. Find restaurants, clinics, services and more.",
  keywords: "local business search, find businesses near me, local directory, business finder",
  openGraph: {
    title: "LocalLens - Find Local Businesses Near You",
    description: "Search verified local businesses in your area. Real-time results powered by RapidAPI.",
    type: "website",
    url: "https://locallens.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalLens - Find Local Businesses Near You",
    description: "Search verified local businesses in your area. Real-time results powered by RapidAPI.",
  },
}

const suggestedSearches = [
  { query: "Restaurants in Chicago", icon: "🍽️" },
  { query: "Clinics in Austin", icon: "🏥" },
  { query: "Coffee shops in Seattle", icon: "☕" },
  { query: "Hair salons in Miami", icon: "💇" },
  { query: "Auto repair in Denver", icon: "🔧" },
  { query: "Gyms in Los Angeles", icon: "💪" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">LocalLens</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-slate-600 hover:text-blue-500 transition-colors">
                Home
              </a>
              <a href="/about" className="text-slate-600 hover:text-blue-500 transition-colors">
                About
              </a>
              <a href="/contact" className="text-slate-600 hover:text-blue-500 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              Find Local Businesses
              <span className="text-blue-500"> Near You</span>
            </h2>
            <p className="text-xl text-slate-600 mb-12">
              Search verified local businesses in your area. Get real-time results with detailed information about
              restaurants, services, and more.
            </p>

            {/* Search Form */}
            <SearchForm />

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Location-Based</h3>
                <p className="text-slate-600">Find businesses near your current location or search by city</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Verified Results</h3>
                <p className="text-slate-600">Get accurate, up-to-date business information and ratings</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Smart Search</h3>
                <p className="text-slate-600">Intelligent search that understands your needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Searches */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">Popular Searches</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {suggestedSearches.map((search, index) => (
              <a
                key={index}
                href={`/search?q=${encodeURIComponent(search.query)}`}
                className="flex items-center space-x-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <span className="text-2xl">{search.icon}</span>
                <span className="font-medium text-slate-700">{search.query}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Searches */}
      <RecentSearches />

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold">LocalLens</h3>
              </div>
              <p className="text-slate-400">Find local businesses near you with real-time, verified results.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Popular Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="/search?q=restaurants" className="hover:text-white transition-colors">
                    Restaurants
                  </a>
                </li>
                <li>
                  <a href="/search?q=clinics" className="hover:text-white transition-colors">
                    Healthcare
                  </a>
                </li>
                <li>
                  <a href="/search?q=auto repair" className="hover:text-white transition-colors">
                    Auto Services
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Powered By</h4>
              <p className="text-slate-400 text-sm">Local Business Data API via RapidAPI</p>
              <p className="text-slate-400 text-sm mt-4">Made by Hamza | © 2025 LocalLens</p>
            </div>
          </div>
        </div>
      </footer>
      <GeolocationPrompt />
    </div>
  )
}
