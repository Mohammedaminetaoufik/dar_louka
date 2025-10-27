"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/home/hero"
import { Features } from "@/components/home/features"
import { RoomPreview } from "@/components/home/room-preview"
import { Testimonials } from "@/components/home/testimonials"
import { CallToAction } from "@/components/home/call-to-action"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <RoomPreview />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
