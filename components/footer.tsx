"use client"

import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function Footer() {
  const { t } = useLanguage()

  const quickLinks = [
    { key: "nav.home", href: "/" },
    { key: "nav.about", href: "/about" },
    { key: "nav.rooms", href: "/rooms" },
    { key: "nav.events", href: "/events" },
    { key: "nav.gallery", href: "/gallery" },
    { key: "nav.contact", href: "/contact" },
  ]

  return (
    <footer className="bg-olive-900 text-sand-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-terracotta-400 mb-2">DAR LOUKA</h3>
            <p className="text-sm text-terracotta-300 mb-3 italic">"{t("slogan")}"</p>
            <p className="text-sand-200 mb-4 text-sm">{t("footer.tagline")}</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-terracotta-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-terracotta-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:info@darlouka.com" className="hover:text-terracotta-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t("footer.quick")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sand-200 hover:text-terracotta-400 transition-colors">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t("contact.info")}</h4>
            <ul className="space-y-3 text-sand-200">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{t("contact.address.text")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+212 XXX XXX XXX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@darlouka.com</span>
              </li>
            </ul>
          </div>

          {/* Booking Platforms */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t("booking.external")}</h4>
            <ul className="space-y-2 text-sand-200">
              <li>
                <a
                  href="https://booking.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Booking.com
                </a>
              </li>
              <li>
                <a
                  href="https://airbnb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  Airbnb
                </a>
              </li>
              <li>
                <a
                  href="https://tripadvisor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-terracotta-400 transition-colors"
                >
                  TripAdvisor
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sand-700 mt-8 pt-8 text-center text-sand-300">
          <p>
            © {new Date().getFullYear()} DAR LOUKA. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  )
}
