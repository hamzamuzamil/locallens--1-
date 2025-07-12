"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Clock, ExternalLink, Star, Navigation, Loader2, ArrowLeft, Globe, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Business } from "@/types/business"

interface BusinessDetailProps {
  businessId: string
}

export default function BusinessDetail({ businessId }: BusinessDetailProps) {
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/business/${encodeURIComponent(businessId)}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch business details: ${response.status}`)
        }

        const data = await response.json()
        setBusiness(data)
      } catch (err) {
        console.error("Error fetching business details:", err)
        setError(err instanceof Error ? err.message : "Failed to load business details")
      } finally {
        setLoading(false)
      }
    }

    if (businessId) {
      fetchBusinessDetails()
    }
  }, [businessId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <p className="text-slate-600">Loading business details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Error Loading Business</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
            <Button asChild>
              <a href="/">Back to Search</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Business Not Found</h2>
          <p className="text-slate-600 mb-6">The business you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/">Back to Search</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="rounded-2xl">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{business.name}</h1>
                    {business.subtypes && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {business.subtypes.map((type: string, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {business.verified && (
                    <div className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">✓ Verified</div>
                  )}
                </div>

                {business.rating && (
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              business.rating && i < Math.floor(business.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-lg">{business.rating.toFixed(1)}</span>
                    </div>
                    {business.review_count && <span className="text-slate-600">({business.review_count} reviews)</span>}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                      <div>
                        <p className="font-medium text-slate-800">Address</p>
                        <p className="text-slate-600">{business.full_address}</p>
                      </div>
                    </div>

                    {business.phone_number && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-800">Phone</p>
                          <a href={`tel:${business.phone_number}`} className="text-blue-600 hover:text-blue-800">
                            {business.phone_number}
                          </a>
                        </div>
                      </div>
                    )}

                    {business.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-800">Website</p>
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            Visit Website
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {business.opening_status && (
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-800">Status</p>
                          <span
                            className={`font-medium ${
                              business.opening_status === "Open" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {business.opening_status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  {business.phone_number && (
                    <Button asChild className="rounded-xl">
                      <a href={`tel:${business.phone_number}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="rounded-xl bg-transparent">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hours */}
            {business.working_hours && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Hours of Operation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {Object.entries(business.working_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-medium text-slate-800">{day}</span>
                        <span className="text-slate-600">{hours as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Location</h3>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Map would appear here</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full mt-4 rounded-xl bg-transparent">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {business.phone_number && (
                    <Button asChild variant="outline" className="w-full rounded-xl bg-transparent">
                      <a href={`tel:${business.phone_number}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Business
                      </a>
                    </Button>
                  )}
                  {business.website && (
                    <Button asChild variant="outline" className="w-full rounded-xl bg-transparent">
                      <a href={business.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full rounded-xl bg-transparent">
                    <a href="/">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      New Search
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
