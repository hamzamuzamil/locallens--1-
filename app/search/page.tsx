import type { Metadata } from "next"
import { Suspense } from "react"
import SearchResults from "@/components/search-results"
import SearchForm from "@/components/search-form"
import { Search } from "lucide-react"

type Props = {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = searchParams.q || "businesses"
  const location = query.includes(" in ") ? query.split(" in ")[1] : "your area"
  const businessType = query.includes(" in ") ? query.split(" in ")[0] : query

  return {
    title: `Find ${query} | LocalLens`,
    description: `Search verified ${businessType} near ${location}. Real-time results powered by RapidAPI.`,
    openGraph: {
      title: `Find ${query} | LocalLens`,
      description: `Search verified ${businessType} near ${location}. Real-time results powered by RapidAPI.`,
    },
  }
}

export default function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || ""

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">LocalLens</h1>
            </a>
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

      {/* Search Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <SearchForm initialQuery={query} />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="text-center py-12">Loading results...</div>}>
            <SearchResults query={query} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
