"use client"

import { useState, useEffect } from "react"
import { MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { geolocationPermission, userLocation } from "@/lib/storage"

export default function GeolocationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Only show prompt if we haven't asked before and geolocation is available
    if (!geolocationPermission.hasAsked() && navigator.geolocation) {
      // Delay showing prompt to avoid blocking initial page load
      const timer = setTimeout(() => setShowPrompt(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAllow = () => {
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`
        userLocation.set(coords)
        geolocationPermission.setAsked()
        setShowPrompt(false)
        setIsLoading(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        geolocationPermission.setAsked()
        setShowPrompt(false)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const handleDeny = () => {
    geolocationPermission.setAsked()
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full rounded-2xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Enable Location</h3>
                <p className="text-sm text-slate-600">Find businesses near you</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDeny}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-slate-600 mb-6">
            Allow LocalLens to access your location to show nearby businesses and get more accurate search results.
          </p>

          <div className="flex space-x-3">
            <Button 
              onClick={handleAllow} 
              className="flex-1 rounded-xl" 
              disabled={isLoading}
            >
              {isLoading ? "Getting Location..." : "Allow Location"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDeny} 
              className="flex-1 rounded-xl bg-transparent"
              disabled={isLoading}
            >
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
