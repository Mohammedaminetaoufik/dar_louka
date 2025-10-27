"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const testimonials = [
    {
      name: "Sarah Johnson",
      country: "United Kingdom",
      rating: 5,
      text: "An absolutely magical experience! The traditional Moroccan architecture combined with modern comfort made our stay unforgettable. The views of the Atlas Mountains are breathtaking.",
    },
    {
      name: "Pierre Dubois",
      country: "France",
      rating: 5,
      text: "L'hospitalité marocaine à son meilleur. Un endroit paisible et authentique, parfait pour se ressourcer. La cuisine locale est délicieuse!",
    },
    {
      name: "Ahmed Al-Rashid",
      country: "UAE",
      rating: 5,
      text: "تجربة رائعة في دار لوكا. المكان هادئ وجميل، والخدمة ممتازة. أنصح به بشدة لمن يبحث عن الأصالة المغربية.",
    },
  ]

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Guest Experiences
          </h2>
          <p className="text-xl text-muted-foreground">What our guests say about their stay</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-terracotta-500 text-terracotta-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.country}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
