export interface Business {
  business_id: string
  google_id: string
  place_id: string
  google_mid: string
  phone_number: string | null
  name: string
  latitude: number
  longitude: number
  full_address: string
  review_count: number | null
  rating: number | null
  timezone: string | null
  opening_status: string | null
  working_hours: WorkingHours | null
  website: string | null
  verified: boolean
  place_link: string | null
  cid: string | null
  reviews_link: string | null
  owner_id: string | null
  owner_link: string | null
  owner_name: string | null
  booking_link: string | null
  reservations_link: string | null
  business_status: string | null
  type: string | null
  subtypes: string[]
  photos_sample: Photo[]
  reviews_per_rating: ReviewsPerRating | null
  photo_count: number
  about: About | null
  address: string
  order_link: string | null
  price_level: string | null
  district: string | null
  street_address: string | null
  city: string | null
  zipcode: string | null
  state: string | null
  country: string | null
}

export interface WorkingHours {
  [day: string]: string
}

export interface Photo {
  photo_id: string
  photo_url: string
  photo_url_large: string
  video_thumbnail_url?: string
  latitude?: number
  longitude?: number
  type?: string
  photo_datetime_utc?: string
  photo_timestamp?: number
}

export interface ReviewsPerRating {
  1?: number
  2?: number
  3?: number
  4?: number
  5?: number
}

export interface About {
  summary?: string
  details?: {
    [key: string]: any
  }
}

export interface SearchResponse {
  data: Business[]
  status: string
  request_id?: string
}

export interface SearchRequest {
  query: string
  coordinates?: string
  limit?: number
}

export interface RecentSearch {
  query: string
  timestamp: number
}

export interface ApiError {
  error: string
  details?: any
}