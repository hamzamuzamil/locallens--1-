import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Input validation schema
const searchSchema = z.object({
  query: z.string().min(1).max(200).trim(),
  coordinates: z.string().regex(/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/).optional(),
  limit: z.number().min(1).max(50).optional(),
})

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 30 // 30 requests per minute

  const record = rateLimitStore.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= maxRequests) {
    return false
  }
  
  record.count++
  return true
}

// Sanitize string to prevent XSS
function sanitizeString(str: string): string {
  return str.replace(/[<>\"'&]/g, (match) => {
    const escapeMap: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;',
    }
    return escapeMap[match]
  })
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    // Validate request body
    const body = await request.json()
    const validatedData = searchSchema.parse(body)
    
    const { 
      query, 
      coordinates = "38.447030, -101.547385", 
      limit = 5 
    } = validatedData

    // Sanitize query
    const sanitizedQuery = sanitizeString(query)

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

    const apiResponse = await fetch("https://local-business-data.p.rapidapi.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
      body: JSON.stringify({
        queries: [sanitizedQuery],
        limit,
        region: "us",
        language: "en",
        coordinates,
        zoom: 13,
        dedup: true,
      }),
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      console.error(`API error: ${apiResponse.status} - ${errorText}`)
      
      if (apiResponse.status === 429) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again later." },
          { status: 429 }
        )
      }
      
      throw new Error(`API error: ${apiResponse.status}`)
    }

    const data = await apiResponse.json()
    
    // Add cache headers
    const response = NextResponse.json(data)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error("API Search Failed:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Search failed. Please try again." },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
