import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Input validation schema
const businessIdSchema = z.string().min(1).max(200)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate business ID
    const businessId = businessIdSchema.parse(params.id)

    // Check environment variables
    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = process.env.RAPIDAPI_HOST

    if (!apiKey || !apiHost) {
      console.error("Missing API configuration")
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      )
    }

    // For now, return mock data since the API doesn't have a specific business details endpoint
    // In a real implementation, you would fetch from the business details API
    const mockBusiness = {
      business_id: businessId,
      name: "Sample Business",
      full_address: "123 Main St, Chicago, IL 60601",
      phone_number: "(555) 123-4567",
      rating: 4.5,
      review_count: 127,
      opening_status: "Open",
      website: "https://example.com",
      subtypes: ["Restaurant", "Italian Cuisine"],
      latitude: 41.8781,
      longitude: -87.6298,
      verified: true,
      working_hours: {
        Monday: "9:00 AM - 10:00 PM",
        Tuesday: "9:00 AM - 10:00 PM",
        Wednesday: "9:00 AM - 10:00 PM",
        Thursday: "9:00 AM - 10:00 PM",
        Friday: "9:00 AM - 11:00 PM",
        Saturday: "9:00 AM - 11:00 PM",
        Sunday: "10:00 AM - 9:00 PM",
      },
    }

    // Add cache headers
    const response = NextResponse.json(mockBusiness)
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')
    
    return response
  } catch (error) {
    console.error("Business details fetch failed:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid business ID" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to fetch business details" },
      { status: 500 }
    )
  }
}

// Add CORS headers
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}