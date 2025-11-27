import type React from "react"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { LayoutWrapper } from "@/components/layout-wrapper"
import WhatsAppButton from "@/components/whatsapp-button"
import type { Metadata } from "next"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Dar Louka – Maison d'hôte Marrakech | Guest House Morocco | Atlas Retreat",
  description:
    "Dar Louka – Atlas Retreat en Terre Berbère. Découvrez notre maison d'hôte authentique à Tahanaout, près de Marrakech. Séjour unique blend of Berber hospitality, Atlas Mountains views, and traditional Moroccan architecture. Book your authentic guest house experience now.",
  keywords:
    "maison d'hôte Marrakech, maison d'hôte Maroc, guesthouse Marrakech, guest house Morocco, riad Tahanaout, Berber accommodation, Atlas Mountains retreat, authentic Moroccan hospitality, bed and breakfast Marrakech, ecolodge Morocco",
  authors: [{ name: "DAR LOUKA" }],
  openGraph: {
    title: "Dar Louka – Maison d'hôte Marrakech | Guest House Morocco",
    description: "Experience authentic Moroccan hospitality at Dar Louka, our charming guesthouse in Tahanaout near Marrakech",
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    siteName: "Dar Louka - Atlas Retreat en Terre Berbère",
    url: "https://darlouka.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dar Louka – Maison d'hôte Marrakech | Guest House Morocco",
    description: "Authentic guesthouse in Tahanaout, Marrakech with Atlas Mountain views",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    languages: {
      en: "https://darlouka.com/en",
      fr: "https://darlouka.com/fr",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="canonical" href="https://darlouka.com" />
        <meta name="language" content="English, French" />
        <meta name="geo.position" content="31.3547;-7.9388" />
        <meta name="ICBM" content="31.3547, -7.9388" />
        <meta name="geo.placename" content="Tahanaout, Marrakech, Morocco" />
        <meta name="geo.region" content="MA-MAR" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://darlouka.com/#organization",
                  "name": "Dar Louka",
                  "url": "https://darlouka.com",
                  "logo": "https://darlouka.com/logo.png",
                  "description": "Dar Louka – Atlas Retreat en Terre Berbère. Authentic guesthouse in Tahanaout, Marrakech",
                  "sameAs": [
                    "https://www.facebook.com/darlouka",
                    "https://www.instagram.com/darlouka"
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Douar Ait Souka, Tahanaout",
                    "addressLocality": "Marrakech",
                    "addressRegion": "Marrakech-Safi",
                    "postalCode": "40000",
                    "addressCountry": "MA"
                  },
                  "telephone": "+212-524-48XXXX",
                  "email": "info@darlouka.com"
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://darlouka.com/#localbusiness",
                  "name": "Dar Louka - Maison d'hôte",
                  "image": "https://darlouka.com/images/dar-louka.jpg",
                  "description": "Authentic Moroccan guesthouse offering Berber hospitality with Atlas Mountain views",
                  "url": "https://darlouka.com",
                  "telephone": "+212-524-48XXXX",
                  "priceRange": "$$",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Douar Ait Souka, Tahanaout",
                    "addressLocality": "Marrakech",
                    "addressRegion": "Marrakech-Safi",
                    "addressCountry": "MA"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 31.3547,
                    "longitude": -7.9388
                  },
                  "areaServed": {
                    "@type": "City",
                    "name": "Marrakech"
                  },
                  "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "opens": "08:00",
                    "closes": "22:00"
                  }
                },
                {
                  "@type": "LodgingBusiness",
                  "@id": "https://darlouka.com/#lodging",
                  "name": "Dar Louka",
                  "description": "Dar Louka – Atlas Retreat en Terre Berbère. Authentic Moroccan guesthouse combining traditional Berber architecture with modern comfort",
                  "url": "https://darlouka.com",
                  "image": "https://darlouka.com/images/dar-louka.jpg",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Douar Ait Souka, Tahanaout",
                    "addressLocality": "Marrakech",
                    "addressCountry": "MA"
                  },
                  "telephone": "+212-524-48XXXX",
                  "email": "info@darlouka.com",
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 31.3547,
                    "longitude": -7.9388
                  },
                  "priceRange": "$$",
                  "starRating": {
                    "@type": "Rating",
                    "ratingValue": "5"
                  },
                  "amenityFeature": [
                    {
                      "@type": "LocationFeatureSpecification",
                      "name": "Free WiFi"
                    },
                    {
                      "@type": "LocationFeatureSpecification",
                      "name": "Mountain View"
                    },
                    {
                      "@type": "LocationFeatureSpecification",
                      "name": "Breakfast Included"
                    }
                  ],
                  "checkinTime": "14:00",
                  "checkoutTime": "11:00"
                }
              ]
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}>
        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
        <WhatsAppButton />
      </body>
    </html>
  )
}
