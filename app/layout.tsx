import type React from "react"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
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
  title: "DAR LOUKA - Authentic Moroccan Guesthouse in Tahanaout, Marrakech",
  description:
    "Experience authentic Moroccan hospitality at DAR LOUKA, a charming guesthouse nestled in the heart of Tahanaout, near Marrakech. Book your peaceful retreat surrounded by nature and traditional architecture.",
  keywords:
    "DAR LOUKA, Moroccan guesthouse, Tahanaout, Marrakech accommodation, Morocco hotel, traditional riad, Atlas Mountains, authentic Morocco experience",
  authors: [{ name: "DAR LOUKA" }],
  openGraph: {
    title: "DAR LOUKA - Authentic Moroccan Guesthouse",
    description: "Experience authentic Moroccan hospitality in Tahanaout, Marrakech",
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR", "ar_MA"],
    siteName: "DAR LOUKA",
  },
  twitter: {
    card: "summary_large_image",
    title: "DAR LOUKA - Authentic Moroccan Guesthouse",
    description: "Experience authentic Moroccan hospitality in Tahanaout, Marrakech",
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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://darlouka.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              name: "DAR LOUKA",
              description: "Authentic Moroccan guesthouse in Tahanaout, Marrakech",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Tahanaout",
                addressLocality: "Marrakech",
                addressCountry: "MA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 31.3547,
                longitude: -7.9388,
              },
              starRating: {
                "@type": "Rating",
                ratingValue: "5",
              },
              priceRange: "$$",
              telephone: "+212-xxx-xxx-xxx",
              url: "https://darlouka.com",
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
        <WhatsAppButton />
      </body>
    </html>
  )
}
