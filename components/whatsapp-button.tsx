'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  // Update this with your WhatsApp number (with country code, no spaces or special chars)
  const whatsappNumber = '212XXXXXXXXX' // Replace with your actual number
  const whatsappMessage = 'Hello! I am interested in booking at DAR LOUKA.'

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  )
}
