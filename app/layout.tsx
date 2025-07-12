import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LocalLens - Find Local Businesses Near You",
  description:
    "Search verified local businesses in your area. Real-time results powered by RapidAPI. Find restaurants, clinics, services and more.",
  keywords: "local business search, find businesses near me, local directory, business finder",
  authors: [{ name: "Hamza" }],
  creator: "Hamza",
  publisher: "LocalLens",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://locallens.com",
    siteName: "LocalLens",
    title: "LocalLens - Find Local Businesses Near You",
    description: "Search verified local businesses in your area. Real-time results powered by RapidAPI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalLens - Find Local Businesses Near You",
    description: "Search verified local businesses in your area. Real-time results powered by RapidAPI.",
    creator: "@locallens",
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "LocalLens",
              description: "Search verified local businesses in your area",
              url: "https://locallens.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://locallens.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
