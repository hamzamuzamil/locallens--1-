import type { Metadata } from "next"
import BusinessDetail from "@/components/business-detail"
import { Search } from "lucide-react"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app, you'd fetch the business data here
  return {
    title: `Business Details | LocalLens`,
    description: "Detailed information about this local business including contact details, hours, and location.",
  }
}

export default function BusinessPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
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

      <BusinessDetail businessId={params.id} />
    </div>
  )
}
