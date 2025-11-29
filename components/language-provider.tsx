"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "fr")) {
      setLanguage(savedLang)
    }

    // Set HTML dir attribute for RTL
    document.documentElement.setAttribute("dir", "ltr")
    document.documentElement.setAttribute("lang", language)
  }, [language])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.setAttribute("dir", "ltr")
    document.documentElement.setAttribute("lang", lang)
  }

  const t = (key: string) => {
    return translations[language]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Slogan
    "slogan": "Atlas Retreat en Terre Berbère",
    "tagline": "Authentic Berber Hospitality in the Heart of Marrakech",
    
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.rooms": "Rooms & Booking",
    "nav.events": "Events",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",

    // Hero
    "hero.title": "Welcome to Dar Louka",
    "hero.subtitle": "Experience Authentic Moroccan Hospitality - Maison d'hôte in Tahanaout, Marrakech",
    "hero.description":
      "Discover our authentic guesthouse near Marrakech offering Berber hospitality with stunning Atlas Mountain views. Dar Louka combines traditional Moroccan architecture with modern comfort for an unforgettable retreat.",
    "hero.cta": "Book Your Stay",
    "hero.explore": "Explore",

    // Features
    "features.title": "Why Choose Dar Louka - Your Guest House in Marrakech",
    "features.authentic.title": "Authentic Berber Experience",
    "features.authentic.desc": "Traditional Moroccan architecture and genuine Berber hospitality in every corner of our guesthouse",
    "features.nature.title": "Surrounded by Atlas Mountains",
    "features.nature.desc": "Breathtaking views of the Atlas Mountains and lush gardens surrounding our maison d'hôte",
    "features.comfort.title": "Modern Comfort",
    "features.comfort.desc": "Perfect blend of traditional Moroccan charm and contemporary amenities in Tahanaout",
    "features.location.title": "Perfect Location near Marrakech",
    "features.location.desc": "Just 30 minutes from Marrakech city center, in the peaceful village of Tahanaout, Morocco",

    // About
    "about.title": "About Dar Louka - Maison d'hôte Marrakech",
    "about.subtitle": "Atlas Retreat en Terre Berbère - A Story of Tradition and Hospitality",
    "about.description":
      "Dar Louka is more than just a guesthouse. It is an authentic celebration of Moroccan culture, Berber heritage, architecture, and the warm hospitality that defines our region. Located in Tahanaout, at the foothills of the High Atlas Mountains, our maison d'hôte offers a unique escape near Marrakech.",
    "about.story": "Our Story",
    "about.story.text":
      "Built with love and respect for traditional Moroccan and Berber architecture, Dar Louka features authentic design elements including hand-carved woodwork, colorful zellige tiles, and peaceful courtyards. Every corner tells a story of craftsmanship and cultural heritage in this guesthouse near Marrakech.",
    "about.values": "Our Values",
    "about.values.text":
      "We believe in sustainable tourism, supporting local Berber communities, and preserving the natural beauty of the Atlas region. Our team is dedicated to providing personalized service that makes every guest feel at home at our maison d'hôte.",
    "about.location": "Our Location",
    "about.location.text":
      "Tahanaout is a charming Berber village at the gateway to the High Atlas Mountains, just 30 kilometers south of Marrakech. Offering the perfect balance between accessibility and tranquility, our guesthouse is ideally positioned for exploring Morocco.",
    "about.values.hospitality.title": "Authentic Berber Hospitality",
    "about.values.hospitality.desc":
      "We welcome every guest as family, sharing the warmth and generosity of Moroccan culture at our Tahanaout guesthouse",
    "about.values.community.title": "Community Support",
    "about.values.community.desc": "We work with local Berber artisans and businesses, supporting the Tahanaout and Marrakech region",
    "about.values.sustainable.title": "Sustainable Tourism",
    "about.values.sustainable.desc": "We protect our natural environment and preserve traditional Moroccan and Berber building methods",
    "about.values.quality.title": "Quality Service",
    "about.values.quality.desc": "We maintain the highest standards while respecting our cultural heritage at our maison d'hôte",
    "about.location.discover": "Discover Tahanaout near Marrakech",
    "about.location.tahanaout":
      "Tahanaout is an authentic Berber village located at the foothills of the High Atlas Mountains, just 30 kilometers south of Marrakech. Known for its weekly souk (market) and as a gateway to mountain adventures, the village offers an authentic glimpse into rural Moroccan life.",
    "about.location.activities":
      "The area is perfect for hiking, mountain biking, and exploring traditional Berber villages. The famous Toubkal National Park is easily accessible from our guest house, making Dar Louka an ideal base for both relaxation and adventure in Morocco.",

    // Rooms
    "rooms.title": "Our Rooms - Guest House Accommodation in Marrakech",
    "rooms.subtitle": "Comfort Meets Berber Tradition",
    "rooms.book": "Book Now",
    "rooms.from": "From",
    "rooms.night": "per night",
    "rooms.availability": "Check Availability",
    "rooms.atlas-suite": "Atlas Suite",
    "rooms.garden-room": "Garden Room",
    "rooms.family-suite": "Family Suite",
    "rooms.deluxe-room": "Deluxe Room",
    "rooms.atlas-suite.desc":
      "Our signature suite featuring stunning views of the Atlas Mountains. Decorated with traditional Moroccan craftsmanship including hand-carved cedar wood and colorful zellige tiles.",
    "rooms.garden-room.desc":
      "A peaceful room overlooking our lush gardens and traditional Moroccan courtyard. Perfect for couples seeking tranquility and authentic hospitality at our maison d'hôte near Marrakech.",
    "rooms.family-suite.desc":
      "Spacious suite ideal for families, featuring separate sleeping areas and two bathrooms. Combines comfort with traditional Berber and Moroccan elegance.",
    "rooms.deluxe-room.desc":
      "Elegantly appointed room featuring authentic Moroccan design elements and modern amenities. Overlooks our beautiful traditional courtyard in our Tahanaout guesthouse.",
    "rooms.features": "Room Features:",
    "rooms.external.text": "You can also book your stay through our trusted partner platforms",

    // Booking
    "booking.title": "Book Your Stay at Our Guest House near Marrakech",
    "booking.checkin": "Check-in",
    "booking.checkout": "Check-out",
    "booking.guests": "Guests",
    "booking.room": "Select Room",
    "booking.submit": "Check Availability",
    "booking.external": "Also available on",
    "booking.form.fullName": "Full Name *",
    "booking.form.email": "Email Address *",
    "booking.form.phone": "Phone Number *",
    "booking.form.guests": "Number of Guests *",
    "booking.form.checkIn": "Check-In Date *",
    "booking.form.checkOut": "Check-Out Date *",
    "booking.form.specialRequests": "Special Requests (Optional)",
    "booking.form.placeholder.name": "John Doe",
    "booking.form.placeholder.email": "john@example.com",
    "booking.form.placeholder.phone": "+212 XXX XXX XXX",
    "booking.form.placeholder.requests": "Any special requirements or requests...",
    "booking.form.bookingFor": "Booking for:",
    "booking.form.submit": "Submit Booking Request",
    "booking.form.sending": "Sending Request...",
    "booking.form.required": "* Required fields. By submitting, you agree to our booking terms.",
    "booking.form.success.title": "Booking Request Sent!",
    "booking.form.success.message": "Thank you! We'll contact you shortly at {email} to confirm.",
    "booking.form.error.name": "Please enter your name",
    "booking.form.error.email": "Please enter a valid email address",
    "booking.form.error.phone": "Please enter your phone number",
    "booking.form.error.checkIn": "Please select check-in date",
    "booking.form.error.checkOut": "Please select check-out date",
    "booking.form.error.checkOutAfterCheckIn": "Check-out date must be after check-in date",
    "booking.form.error.checkInPast": "Check-in date cannot be in the past",
    "booking.form.error.conflict": "The room is already booked from {checkIn} to {checkOut}.",
    "booking.form.error.title": "Error",

    // Events
    "events.title": "Events & Activities near Marrakech",
    "events.subtitle": "Discover the Magic of Morocco from Our Guesthouse",
    "events.local": "Local Experiences",
    "events.activities": "Activities",
    "events.activities.intro":
      "From mountain adventures to cultural experiences, discover the many activities available at DAR LOUKA",
    "events.local.intro": "Explore the surrounding region with curated day trips and excursions",
    "events.seasonal": "Seasonal Highlights",
    "events.seasonal.intro": "Experience Morocco's rich cultural calendar throughout the year",
    "events.hiking": "Atlas Mountains Hiking",
    "events.hiking.desc":
      "Explore scenic trails with breathtaking views of the High Atlas Mountains and traditional Berber villages",
    "events.biking": "Mountain Biking",
    "events.biking.desc": "Ride through valleys and mountain paths, experiencing the diverse landscapes of the region",
    "events.toubkal": "Toubkal National Park",
    "events.toubkal.desc": "Visit North Africa's highest peak and explore the stunning national park with guided tours",
    "events.souk": "Tahanaout Souk",
    "events.souk.desc":
      "Experience the authentic weekly market where locals trade goods, spices, and traditional crafts",
    "events.cooking": "Moroccan Cooking Class",
    "events.cooking.desc": "Learn to prepare traditional dishes like tagine and couscous with local ingredients",
    "events.photography": "Photography Tours",
    "events.photography.desc":
      "Capture the beauty of Moroccan landscapes, architecture, and daily life with expert guidance",
    "events.music": "Traditional Music Evenings",
    "events.music.desc": "Enjoy authentic Moroccan music performances under the stars in our courtyard",
    "events.workshops": "Cultural Workshops",
    "events.workshops.desc": "Participate in pottery, weaving, or calligraphy workshops with local artisans",
    "events.marrakech": "Day Trip to Marrakech",
    "events.marrakech.desc": "Explore the vibrant souks, historic palaces, and bustling Jemaa el-Fna square",
    "events.berber": "Berber Village Visit",
    "events.berber.desc": "Experience authentic Berber hospitality and learn about traditional mountain life",
    "events.ourika": "Ourika Valley Excursion",
    "events.ourika.desc": "Discover beautiful waterfalls and lush green valleys in this stunning natural area",
    "events.spring": "Spring (March-May)",
    "events.spring.desc":
      "Perfect hiking weather, almond blossoms in the valleys, and the Rose Festival in nearby Kelaa M'Gouna",
    "events.summer": "Summer (June-August)",
    "events.summer.desc":
      "Escape the heat of Marrakech, enjoy cool mountain breezes, and experience traditional Berber festivals",
    "events.autumn": "Autumn (September-November)",
    "events.autumn.desc": "Harvest season, saffron picking, and ideal conditions for mountain trekking and photography",
    "events.winter": "Winter (December-February)",
    "events.winter.desc":
      "Snow-capped mountain views, cozy evenings by the fire, and proximity to Oukaimeden ski resort",
    "events.duration.halfday": "Half day / Full day",
    "events.duration.2-4hours": "2-4 hours",
    "events.duration.fullday": "Full day",
    "events.duration.tuesday": "Tuesday mornings",
    "events.duration.3-4hours": "3-4 hours",
    "events.duration.flexible": "Flexible",
    "events.duration.evenings": "Evenings",
    "events.duration.2-3hours": "2-3 hours",

    // Gallery
    "gallery.title": "Gallery",
    "gallery.subtitle": "Discover Our Beautiful Spaces",

    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "We'd Love to Hear From You",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.info": "Contact Information",
    "contact.address": "Address",
    "contact.address.text": "Tahanaout, Marrakech, Morocco",
    "contact.location": "Our Location",
    "contact.form": "Send Us a Message",
    "contact.form.name": "Full Name *",
    "contact.form.email": "Email Address *",
    "contact.form.phone": "Phone Number",
    "contact.form.message": "Message *",
    "contact.form.send": "Send Message",
    "contact.form.placeholder.name": "Your name",
    "contact.form.placeholder.email": "your.email@example.com",
    "contact.form.placeholder.phone": "+212 XXX XXX XXX",
    "contact.form.placeholder.message": "Tell us about your inquiry or special requests...",
    "contact.info.address": "Address",
    "contact.info.address.line1": "Douar Ait Souka, Tahanaout",
    "contact.info.address.line2": "Marrakech-Safi, Morocco",
    "contact.info.phone": "Phone",
    "contact.info.phone.line1": "+212 524 48 XX XX",
    "contact.info.phone.line2": "+212 6XX XX XX XX",
    "contact.info.email": "Email",
    "contact.info.email.line1": "info@darlouka.com",
    "contact.info.email.line2": "reservations@darlouka.com",
    "contact.info.hours": "Reception Hours",
    "contact.info.hours.line1": "Monday - Sunday: 8:00 AM - 10:00 PM",
    "contact.info.hours.line2": "24/7 Emergency Contact Available",
    "contact.location.description":
      "Located in the heart of Tahanaout, just 30 minutes from Marrakech, surrounded by the majestic Atlas Mountains",
    "contact.directions.airport": "From Marrakech Airport",
    "contact.directions.airport.time": "45 minutes drive (40 km)",
    "contact.directions.medina": "From Marrakech Medina",
    "contact.directions.medina.time": "30 minutes drive (30 km)",
    "contact.directions.ourika": "To Ourika Valley",
    "contact.directions.ourika.time": "20 minutes drive (15 km)",
    "contact.success": "Thank you for your message! We'll get back to you soon.",

    // Footer
    "footer.tagline": "Experience authentic Moroccan hospitality",
    "footer.rights": "All rights reserved",
    "footer.quick": "Quick Links",
    "footer.follow": "Follow Us",

    // Testimonials
    "testimonials.title": "Guest Experiences",
    "testimonials.subtitle": "What our guests say about their stay",
    "testimonials.sarah":
      "An absolutely magical experience! The traditional Moroccan architecture combined with modern comfort made our stay unforgettable. The views of the Atlas Mountains are breathtaking.",
    "testimonials.pierre":
      "Moroccan hospitality at its best. A peaceful and authentic place, perfect for recharging. The local cuisine is delicious!",
    "testimonials.ahmed":
      "A wonderful experience at DAR LOUKA. The place is peaceful and beautiful, and the service is excellent. I highly recommend it for those seeking Moroccan authenticity.",

    // Room amenities
    "amenities.wifi": "Free WiFi",
    "amenities.breakfast": "Breakfast Included",
    "amenities.mountain-view": "Mountain View",
    "amenities.garden-view": "Garden View",
    "amenities.courtyard-view": "Courtyard View",
    "amenities.mountain-garden-view": "Mountain & Garden View",
    "amenities.bathroom": "Private Bathroom",
    "amenities.bathrooms": "2 Bathrooms",

    // Call to Action
    "cta.title": "Ready to Experience DAR LOUKA?",
    "cta.subtitle": "Book your authentic Moroccan getaway today",
    "cta.button": "Book Now",

    // Loading messages
    "common.loading": "Loading...",
    "loading.rooms": "Loading rooms...",
    "loading.gallery": "Loading gallery...",
    "loading.events": "Loading events...",
    "common.noData": "No data available",

    // Admin Panel
    "admin.title": "Admin Dashboard",
    "admin.welcome": "Welcome to Admin Panel",
    "admin.rooms": "Rooms",
    "admin.bookings": "Bookings",
    "admin.gallery": "Gallery",
    "admin.events": "Events",
    "admin.contacts": "Contact Messages",
    "admin.logout": "Logout",
    "admin.login": "Admin Login",
    "admin.email": "Email",
    "admin.password": "Password",
    "admin.signIn": "Sign In",
    "admin.signInError": "Invalid credentials",
    "admin.loading": "Loading...",

    // Rooms Manager
    "admin.rooms.title": "Manage Rooms",
    "admin.rooms.add": "Add New Room",
    "admin.rooms.edit": "Edit Room",
    "admin.rooms.delete": "Delete Room",
    "admin.rooms.save": "Save Room",
    "admin.rooms.cancel": "Cancel",
    "admin.rooms.name": "Room Name",
    "admin.rooms.description": "Description",
    "admin.rooms.price": "Price (MAD)",
    "admin.rooms.capacity": "Capacity",
    "admin.rooms.amenities": "Amenities",
    "admin.rooms.images": "Images",
    "admin.rooms.confirmDelete": "Are you sure you want to delete this room?",
    "admin.rooms.deleteSuccess": "Room deleted successfully",
    "admin.rooms.savingSuccess": "Room saved successfully",
    "admin.rooms.error": "Error saving room",
    "admin.rooms.addAmenity": "Add Amenity",
    "admin.rooms.removeAmenity": "Remove",
    "admin.rooms.uploadImages": "Upload Images",
    "admin.rooms.selectImages": "Select images",
    "admin.rooms.icalToken": "iCal Token",
    "admin.rooms.icalImport": "iCal Import URLs",
    "admin.rooms.copyToken": "Copy Token",
    "admin.rooms.tokenCopied": "Token copied!",
    "admin.rooms.syncIcal": "Sync iCal",
    "admin.rooms.syncSuccess": "Calendar synced successfully",
    "admin.rooms.syncError": "Error syncing calendar",
    "admin.rooms.viewIcal": "View iCal",
    "admin.rooms.noRooms": "No rooms found",

    // Bookings Manager
    "admin.bookings.title": "Manage Bookings",
    "admin.bookings.room": "Room",
    "admin.bookings.guest": "Guest Name",
    "admin.bookings.guests": "Guests",
    "admin.bookings.checkIn": "Check-in",
    "admin.bookings.checkOut": "Check-out",
    "admin.bookings.status": "Status",
    "admin.bookings.email": "Email",
    "admin.bookings.phone": "Phone",
    "admin.bookings.contact": "Contact Information",
    "admin.bookings.specialRequests": "Special Requests",
    "admin.bookings.sendConfirmation": "Send Confirmation",
    "admin.bookings.updateStatus": "Update Status",
    "admin.bookings.pending": "Pending",
    "admin.bookings.confirmed": "Confirmed",
    "admin.bookings.cancelled": "Cancelled",
    "admin.bookings.statusUpdated": "Status updated",
    "admin.bookings.noBookings": "No bookings found",

    // Booking Confirmation
    "admin.confirmation.title": "Send Booking Confirmation",
    "admin.confirmation.method": "Confirmation Method",
    "admin.confirmation.language": "Language",
    "admin.confirmation.email": "Send Email",
    "admin.confirmation.whatsapp": "Send WhatsApp",
    "admin.confirmation.phone": "Send Phone Call",
    "admin.confirmation.send": "Send",
    "admin.confirmation.sending": "Sending...",
    "admin.confirmation.success": "Confirmation sent successfully!",
    "admin.confirmation.error": "Error sending confirmation",
    "admin.confirmation.preview": "Preview",
    "admin.confirmation.english": "English",
    "admin.confirmation.french": "Français",

    // Gallery Manager
    "admin.gallery.title": "Manage Gallery",
    "admin.gallery.add": "Add Image",
    "admin.gallery.addImage": "Add Image",
    "admin.gallery.edit": "Edit Image",
    "admin.gallery.delete": "Delete Image",
    "admin.gallery.imageTitle": "Image Title",
    "admin.gallery.description": "Description",
    "admin.gallery.category": "Category",
    "admin.gallery.uploadImage": "Upload Image",
    "admin.gallery.noImages": "No images found",
    "admin.gallery.deleteSuccess": "Image deleted successfully",
    "admin.gallery.fillRequired": "Please fill all required fields",
    "admin.gallery.uploadRequired": "Please upload an image",
    "admin.gallery.saveFailed": "Failed to save image",
    "admin.gallery.error": "Error saving image",
    "admin.gallery.confirmDelete": "Are you sure you want to delete this image?",
    "admin.gallery.placeholder.title": "e.g., Moroccan Courtyard",
    "admin.gallery.placeholder.description": "Describe the image...",
    "admin.gallery.placeholder.category": "e.g., Architecture, Landscape, Rooms",
    "admin.gallery.currentImage": "Current image",
    "admin.gallery.newImageSelected": "New image selected",
    "admin.gallery.imageInstructions": "Upload an image (max 5MB). Supported: JPG, PNG, GIF",
    "admin.gallery.fileTooLarge": "File size must be less than 5MB",
    "admin.gallery.uploading": "Uploading...",
    "admin.gallery.saving": "Saving...",
    "admin.gallery.update": "Update Image",
    "admin.gallery.list": "Gallery Images",

    // Events Manager
    "admin.events.title": "Manage Events",
    "admin.events.add": "Add Event",
    "admin.events.edit": "Edit Event",
    "admin.events.delete": "Delete Event",
    "admin.events.title": "Event Title",
    "admin.events.description": "Description",
    "admin.events.date": "Date",
    "admin.events.time": "Time",
    "admin.events.location": "Location",
    "admin.events.category": "Category",
    "admin.events.price": "Price (MAD)",
    "admin.events.image": "Event Image",
    "admin.events.uploadImage": "Upload Image",
    "admin.events.noEvents": "No events found",
    "admin.events.deleteSuccess": "Event deleted successfully",
    "admin.events.fillRequired": "Please fill all required fields",
    "admin.events.uploadRequired": "Please upload an image",
    "admin.events.saveFailed": "Failed to save event",
    "admin.events.error": "Error saving event",
    "admin.events.confirmDelete": "Are you sure you want to delete this event?",
    "admin.events.placeholder.title": "e.g., Atlas Mountains Hiking",
    "admin.events.placeholder.description": "Describe the event...",
    "admin.events.placeholder.location": "e.g., Atlas Mountains",
    "admin.events.placeholder.category": "e.g., Adventure, Cultural",
    "admin.events.placeholder.price": "Optional",
    "admin.events.currentImage": "Current image",
    "admin.events.newImageSelected": "New image selected",
    "admin.events.imageInstructions": "Upload a new image (max 5MB). Supported: JPG, PNG, GIF",
    "admin.events.fileTooLarge": "File size must be less than 5MB",
    "admin.events.uploading": "Uploading...",
    "admin.events.saving": "Saving...",
    "admin.events.update": "Update Event",
    "admin.events.create": "Create Event",
    "admin.events.list": "Events List",
    "admin.events.free": "Free",

    // Contacts Manager
    "admin.contacts.title": "Contact Messages",
    "admin.contacts.name": "Name",
    "admin.contacts.email": "Email",
    "admin.contacts.phone": "Phone",
    "admin.contacts.subject": "Subject",
    "admin.contacts.message": "Message",
    "admin.contacts.date": "Date",
    "admin.contacts.noMessages": "No messages found",
    "admin.contacts.reply": "Reply",
  },
  fr: {
    // Slogan
    "slogan": "Atlas Retreat en Terre Berbère",
    "tagline": "Authenticité Berbère au Cœur de Marrakech",
    
    // Navigation
    "nav.home": "Accueil",
    "nav.about": "À Propos",
    "nav.rooms": "Chambres & Réservation",
    "nav.events": "Événements",
    "nav.gallery": "Galerie",
    "nav.contact": "Contact",

    // Hero
    "hero.title": "Bienvenue à Dar Louka",
    "hero.subtitle": "Découvrez l'Hospitalité Authentique Marocaine - Maison d'hôte à Tahanaout, Marrakech",
    "hero.description":
      "Découvrez notre maison d'hôte authentique près de Marrakech offrant l'hospitalité berbère avec une vue spectaculaire sur l'Atlas. Dar Louka combine l'architecture marocaine traditionnelle au confort moderne pour une retraite inoubliable.",
    "hero.cta": "Réserver Votre Séjour",
    "hero.explore": "Explorer",

    // Features
    "features.title": "Pourquoi Choisir Dar Louka - Votre Maison d'hôte à Marrakech",
    "features.authentic.title": "Expérience Berbère Authentique",
    "features.authentic.desc": "Architecture marocaine traditionnelle et authentique hospitalité berbère dans chaque coin de notre maison d'hôte",
    "features.nature.title": "Entouré par l'Atlas",
    "features.nature.desc": "Vues imprenables sur les montagnes de l'Atlas et jardins luxuriants entourant notre maison d'hôte",
    "features.comfort.title": "Confort Moderne",
    "features.comfort.desc": "Mélange parfait du charme marocain traditionnel et des équipements contemporains à Tahanaout",
    "features.location.title": "Emplacement Parfait près de Marrakech",
    "features.location.desc": "À seulement 30 minutes du centre-ville de Marrakech, dans le village paisible de Tahanaout, Maroc",

    // About
    "about.title": "À Propos de Dar Louka - Maison d'hôte Marrakech",
    "about.subtitle": "Atlas Retreat en Terre Berbère - Une Histoire de Tradition et d'Hospitalité",
    "about.description":
      "Dar Louka est bien plus qu'une simple maison d'hôte. C'est une authentique célébration de la culture marocaine, du patrimoine berbère, de l'architecture, et de la chaleureuse hospitalité qui définit notre région. Située à Tahanaout, aux pieds de l'Atlas, notre maison d'hôte offre une évasion unique près de Marrakech.",
    "about.story": "Notre Histoire",
    "about.story.text":
      "Construite avec amour et respect pour l'architecture marocaine et berbère traditionnelle, Dar Louka présente des éléments de design authentiques, notamment des boiseries sculptées à la main, des carreaux de zellige colorés et des cours paisibles. Chaque coin raconte une histoire d'artisanat et de patrimoine culturel dans cette maison d'hôte près de Marrakech.",
    "about.values": "Nos Valeurs",
    "about.values.text":
      "Nous croyons au tourisme durable, au soutien des communautés berbères locales, et à la préservation de la beauté naturelle de la région de l'Atlas. Notre équipe se consacre à fournir un service personnalisé qui fait que chaque invité se sente chez lui dans notre maison d'hôte.",
    "about.location": "Notre Emplacement",
    "about.location.text":
      "Tahanaout est un charmant village berbère à la porte du Haut Atlas, à seulement 30 kilomètres au sud de Marrakech. Offrant l'équilibre parfait entre accessibilité et tranquillité, notre maison d'hôte est idéalement positionnée pour explorer le Maroc.",
    "about.values.hospitality.title": "Authentique Hospitalité Berbère",
    "about.values.hospitality.desc":
      "Nous accueillons chaque invité comme une famille, partageant la chaleur et la générosité de la culture marocaine dans notre maison d'hôte de Tahanaout",
    "about.values.community.title": "Soutien Communautaire",
    "about.values.community.desc":
      "Nous travaillons avec des artisans berbères locaux et des entreprises, soutenant la région de Tahanaout et Marrakech",
    "about.values.sustainable.title": "Tourisme Durable",
    "about.values.sustainable.desc":
      "Nous protégeons notre environnement naturel et préservons les méthodes de construction marocaines et berbères traditionnelles",
    "about.values.quality.title": "Service de Qualité",
    "about.values.quality.desc":
      "Nous maintenons les normes les plus élevées tout en respectant notre patrimoine culturel dans notre maison d'hôte",
    "about.location.discover": "Découvrez Tahanaout près de Marrakech",
    "about.location.tahanaout":
      "Tahanaout est un authentique village berbère situé aux pieds du Haut Atlas, à seulement 30 kilomètres au sud de Marrakech. Connu pour son marché hebdomadaire (souk) et comme porte d'entrée vers les aventures en montagne, le village offre une vision authentique de la vie rurale marocaine.",
    "about.location.activities":
      "La région est parfaite pour la randonnée, le VTT et l'exploration des villages berbères traditionnels. Le célèbre parc national du Toubkal est facilement accessible depuis notre maison d'hôte, faisant de Dar Louka une base idéale pour la détente et l'aventure au Maroc.",

    // Rooms
    "rooms.title": "Nos Chambres - Hébergement de Maison d'hôte à Marrakech",
    "rooms.subtitle": "Confort rencontre la Tradition Berbère",
    "rooms.book": "Réserver",
    "rooms.from": "À partir de",
    "rooms.night": "par nuit",
    "rooms.availability": "Vérifier la Disponibilité",
    "rooms.atlas-suite": "Suite Atlas",
    "rooms.garden-room": "Chambre Jardin",
    "rooms.family-suite": "Suite Familiale",
    "rooms.deluxe-room": "Chambre Deluxe",
    "rooms.atlas-suite.desc":
      "Notre suite signature offrant une vue imprenable sur les montagnes de l'Atlas. Décorée avec l'artisanat marocain traditionnel, y compris du bois de cèdre sculpté à la main et des carreaux de zellige colorés.",
    "rooms.garden-room.desc":
      "Une chambre paisible donnant sur nos jardins luxuriants et notre cour marocaine traditionnelle. Parfaite pour les couples recherchant la tranquillité et l'authenticité dans notre maison d'hôte près de Marrakech.",
    "rooms.family-suite.desc":
      "Suite spacieuse idéale pour les familles, avec des espaces de couchage séparés et deux salles de bains. Combine confort et élégance marocaine et berbère traditionnelle.",
    "rooms.deluxe-room.desc":
      "Chambre élégamment aménagée avec des éléments de design marocain authentique et des équipements modernes. Donne sur notre belle cour traditionnelle dans notre maison d'hôte de Tahanaout.",
    "rooms.features": "Caractéristiques de la Chambre:",
    "rooms.external.text": "Vous pouvez également réserver votre séjour via nos plateformes partenaires de confiance",

    // Booking
    "booking.title": "Réservez Votre Séjour dans Notre Maison d'hôte près de Marrakech",
    "booking.checkin": "Arrivée",
    "booking.checkout": "Départ",
    "booking.guests": "Invités",
    "booking.room": "Choisir une Chambre",
    "booking.submit": "Vérifier la Disponibilité",
    "booking.external": "Également disponible sur",
    "booking.form.fullName": "Nom Complet *",
    "booking.form.email": "Adresse Email *",
    "booking.form.phone": "Numéro de Téléphone *",
    "booking.form.guests": "Nombre d'Invités *",
    "booking.form.checkIn": "Date d'Arrivée *",
    "booking.form.checkOut": "Date de Départ *",
    "booking.form.specialRequests": "Demandes Spéciales (Optionnel)",
    "booking.form.placeholder.name": "Jean Dupont",
    "booking.form.placeholder.email": "jean@example.com",
    "booking.form.placeholder.phone": "+212 XXX XXX XXX",
    "booking.form.placeholder.requests": "Toute exigence ou demande spéciale...",
    "booking.form.bookingFor": "Réservation pour:",
    "booking.form.submit": "Envoyer la Demande de Réservation",
    "booking.form.sending": "Envoi de la demande...",
    "booking.form.required": "* Champs obligatoires. En envoyant, vous acceptez nos conditions de réservation.",
    "booking.form.success.title": "Demande de Réservation Envoyée!",
    "booking.form.success.message": "Merci! Nous vous contacterons bientôt à {email} pour confirmer.",
    "booking.form.error.name": "Veuillez entrer votre nom",
    "booking.form.error.email": "Veuillez entrer une adresse email valide",
    "booking.form.error.phone": "Veuillez entrer votre numéro de téléphone",
    "booking.form.error.checkIn": "Veuillez sélectionner la date d'arrivée",
    "booking.form.error.checkOut": "Veuillez sélectionner la date de départ",
    "booking.form.error.checkOutAfterCheckIn": "La date de départ doit être après la date d'arrivée",
    "booking.form.error.checkInPast": "La date d'arrivée ne peut pas être dans le passé",
    "booking.form.error.conflict": "La chambre est déjà réservée du {checkIn} au {checkOut}.",
    "booking.form.error.title": "Erreur",

    // Events
    "events.title": "Événements & Activités près de Marrakech",
    "events.subtitle": "Découvrez la Magie du Maroc depuis Notre Maison d'hôte",
    "about.values.text":
      "Nous croyons au tourisme durable, au soutien des communautés locales et à la préservation de la beauté naturelle de notre région. Notre équipe se consacre à fournir un service personnalisé qui fait que chaque invité se sente chez lui.",
    "about.location": "Notre Emplacement",
    "about.location.text":
      "Tahanaout est un charmant village à la porte du Haut Atlas, offrant le tawazun muthaqf mithli lal accessibiliti wa lal hadath. Al 30 minut wal marrakech, amma lal 3awal dunya muthaqf.",
    "about.values.hospitality.title": "Hospitalité Authentique",
    "about.values.hospitality.desc":
      "Nous accueillons chaque invité comme une famille, partageant la chaleur et la générosité de la culture marocaine",
    "about.values.community.title": "Soutien Communautaire",
    "about.values.community.desc":
      "Nous travaillons avec des artisans et des entreprises locales, soutenant la communauté de Tahanaout",
    "about.values.sustainable.title": "Tourisme Durable",
    "about.values.sustainable.desc":
      "Nous protégeons notre environnement naturel et préservons les méthodes de construction traditionnelles",
    "about.values.quality.title": "Service de Qualité",
    "about.values.quality.desc":
      "Nous maintenons les normes les plus élevées tout en respectant notre patrimoine culturel",
    "about.location.discover": "Découvrir Tahanaout",
    "about.location.tahanaout":
      "Tahanaout est un charmant village berbère situé au pied des montagnes du Haut Atlas, à seulement 30 kilomètres au sud de Marrakech. Connu pour son souk hebdomadaire et comme porte d'entrée vers les aventures en montagne, le village offre un aperçu authentique de la vie rurale marocaine.",
    "about.location.activities":
      "La région est parfaite pour la randonnée, le VTT et l'exploration des villages berbères traditionnels. Le célèbre parc national du Toubkal est facilement accessible, faisant de DAR LOUKA une base idéale pour la détente et l'aventure.",

    // Rooms
    "rooms.title": "Nos Chambres",
    "rooms.subtitle": "Le Confort Rencontre la Tradition",
    "rooms.book": "Réserver",
    "rooms.from": "À partir de",
    "rooms.night": "par nuit",
    "rooms.availability": "Vérifier la Disponibilité",
    "rooms.atlas-suite": "Suite Atlas",
    "rooms.garden-room": "Chambre Jardin",
    "rooms.family-suite": "Suite Familiale",
    "rooms.deluxe-room": "Chambre Deluxe",
    "rooms.atlas-suite.desc":
      "Notre suite signature offrant une vue imprenable sur les montagnes de l'Atlas. Décorée avec l'artisanat marocain traditionnel, y compris du bois de cèdre sculpté à la main et des carreaux de zellige colorés.",
    "rooms.garden-room.desc":
      "Une chambre paisible donnant sur nos jardins luxuriants et notre cour traditionnelle. Parfaite pour les couples recherchant la tranquillité et l'ambiance marocaine authentique.",
    "rooms.family-suite.desc":
      "Suite spacieuse idéale pour les familles, avec des espaces de couchage séparés et deux salles de bains. Combine confort et élégance marocaine traditionnelle.",
    "rooms.deluxe-room.desc":
      "Chambre élégamment aménagée avec des éléments de design marocain authentique et des équipements modernes. Donne sur notre belle cour traditionnelle.",
    "rooms.features": "Caractéristiques de la Chambre:",
    "rooms.external.text": "Vous pouvez également réserver votre séjour via nos plateformes partenaires de confiance",

    // Booking
    "booking.title": "Réservez Votre Séjour",
    "booking.checkin": "Arrivée",
    "booking.checkout": "Départ",
    "booking.guests": "Invités",
    "booking.room": "Choisir une Chambre",
    "booking.submit": "Vérifier la Disponibilité",
    "booking.external": "Également disponible sur",

    // Events
    "events.title": "Événements & Activités",
    "events.subtitle": "Découvrez la Magie du Maroc",
    "events.local": "Expériences Locales",
    "events.activities": "Activités",
    "events.activities.intro":
      "Des aventures en montagne aux expériences culturelles, découvrez les nombreuses activités disponibles à DAR LOUKA",
    "events.local.intro": "Explorez la région environnante avec des excursions d'une journée organisées",
    "events.seasonal": "Points Forts Saisonniers",
    "events.seasonal.intro": "Découvrez le riche calendrier culturel du Maroc tout au long de l'année",
    "events.hiking": "Randonnée dans l'Atlas",
    "events.hiking.desc":
      "Explorez des sentiers pittoresques avec des vues imprenables sur le Haut Atlas et les villages berbères traditionnels",
    "events.biking": "VTT",
    "events.biking.desc":
      "Roulez à travers les vallées et les sentiers de montagne, en découvrant les paysages diversifiés de la région",
    "events.toubkal": "Parc National du Toubkal",
    "events.toubkal.desc":
      "Visitez le plus haut sommet d'Afrique du Nord et explorez le magnifique parc national avec des visites guidées",
    "events.souk": "Souk de Tahanaout",
    "events.souk.desc":
      "Découvrez le marché hebdomadaire authentique où les habitants échangent des produits, des épices et de l'artisanat traditionnel",
    "events.cooking": "Cours de Cuisine Marocaine",
    "events.cooking.desc":
      "Apprenez à préparer des plats traditionnels comme le tajine et le couscous avec des ingrédients locaux",
    "events.photography": "Tours Photographiques",
    "events.photography.desc":
      "Capturez la beauté des paysages, de l'architecture et de la vie quotidienne marocains avec des conseils d'experts",
    "events.music": "Soirées Musicales Traditionnelles",
    "events.music.desc": "Profitez de spectacles de musique marocaine authentique sous les étoiles dans notre cour",
    "events.workshops": "Ateliers Culturels",
    "events.workshops.desc":
      "Participez à des ateliers de poterie, de tissage ou de calligraphie avec des artisans locaux",
    "events.marrakech": "Excursion à Marrakech",
    "events.marrakech.desc": "Explorez les souks animés, les palais historiques et la place animée de Jemaa el-Fna",
    "events.berber": "Visite de Village Berbère",
    "events.berber.desc": "Découvrez l'hospitalité berbère authentique et apprenez la vie traditionnelle en montagne",
    "events.ourika": "Excursion Vallée de l'Ourika",
    "events.ourika.desc":
      "Découvrez de belles cascades et des vallées verdoyantes dans cette région naturelle magnifique",
    "events.spring": "Printemps (Mars-Mai)",
    "events.spring.desc":
      "Temps parfait pour la randonnée, fleurs d'amandiers dans les vallées et Festival des Roses à Kelaa M'Gouna",
    "events.summer": "Été (Juin-Août)",
    "events.summer.desc":
      "Échappez à la chaleur de Marrakech, profitez des brises fraîches de la montagne et découvrez les festivals berbères traditionnels",
    "events.autumn": "Automne (Septembre-Novembre)",
    "events.autumn.desc":
      "Saison des récoltes, cueillette du safran et conditions idéales pour le trekking en montagne et la photographie",
    "events.winter": "Hiver (Décembre-Février)",
    "events.winter.desc":
      "Vues sur les montagnes enneigées, soirées confortables au coin du feu et proximité de la station de ski d'Oukaimeden",
    "events.duration.halfday": "Demi-journée / Journée complète",
    "events.duration.2-4hours": "2-4 heures",
    "events.duration.fullday": "Journée complète",
    "events.duration.tuesday": "Mardis matin",
    "events.duration.3-4hours": "3-4 heures",
    "events.duration.flexible": "Flexible",
    "events.duration.evenings": "Soirées",
    "events.duration.2-3hours": "2-3 heures",

    // Gallery
    "gallery.title": "Galerie",
    "gallery.subtitle": "Découvrez Nos Beaux Espaces",

    // Contact
    "contact.title": "Contactez-Nous",
    "contact.subtitle": "Nous Serions Ravis de Vous Entendre",
    "contact.name": "Nom",
    "contact.email": "Email",
    "contact.phone": "Téléphone",
    "contact.message": "Message",
    "contact.send": "Envoyer le Message",
    "contact.info": "Informations de Contact",
    "contact.address": "Adresse",
    "contact.address.text": "Tahanaout, Marrakech, Maroc",
    "contact.location": "Notre Emplacement",
    "contact.form": "Envoyez-nous un Message",
    "contact.form.name": "Nom Complet *",
    "contact.form.email": "Adresse Email *",
    "contact.form.phone": "Numéro de Téléphone",
    "contact.form.message": "Message *",
    "contact.form.send": "Envoyer le Message",
    "contact.form.placeholder.name": "Votre nom",
    "contact.form.placeholder.email": "votre.email@exemple.com",
    "contact.form.placeholder.phone": "+212 XXX XXX XXX",
    "contact.form.placeholder.message": "Parlez-nous de votre demande ou de vos demandes spéciales...",
    "contact.info.address": "Adresse",
    "contact.info.address.line1": "Douar Ait Souka, Tahanaout",
    "contact.info.address.line2": "Marrakech-Safi, Maroc",
    "contact.info.phone": "Téléphone",
    "contact.info.phone.line1": "+212 524 48 XX XX",
    "contact.info.phone.line2": "+212 6XX XX XX XX",
    "contact.info.email": "Email",
    "contact.info.email.line1": "info@darlouka.com",
    "contact.info.email.line2": "reservations@darlouka.com",
    "contact.info.hours": "Heures de Réception",
    "contact.info.hours.line1": "Lundi - Dimanche: 8h00 - 22h00",
    "contact.info.hours.line2": "Contact d'Urgence 24/7 Disponible",
    "contact.location.description":
      "Situé au cœur de Tahanaout, à seulement 30 minutes de Marrakech, entouré par les majestueuses montagnes de l'Atlas",
    "contact.directions.airport": "Depuis l'Aéroport de Marrakech",
    "contact.directions.airport.time": "45 minutes en voiture (40 km)",
    "contact.directions.medina": "Depuis la Médina de Marrakech",
    "contact.directions.medina.time": "30 minutes en voiture (30 km)",
    "contact.directions.ourika": "Vers la Vallée de l'Ourika",
    "contact.directions.ourika.time": "20 minutes en voiture (15 km)",
    "contact.success": "Merci pour votre message! Nous vous répondrons bientôt.",

    // Call to Action
    "cta.title": "Prêt à Découvrir DAR LOUKA?",
    "cta.subtitle": "Réservez votre escapade marocaine authentique dès aujourd'hui",
    "cta.button": "Réserver Maintenant",

    // Footer
    "footer.tagline": "Découvrez l'hospitalité marocaine authentique",
    "footer.rights": "Tous droits réservés",
    "footer.quick": "Liens Rapides",
    "footer.follow": "Suivez-Nous",

    // Testimonials
    "testimonials.title": "Expériences des Invités",
    "testimonials.subtitle": "Ce que nos invités disent de leur séjour",
    "testimonials.sarah":
      "Une expérience absolument magique! L'architecture marocaine traditionnelle mélancée avec le confort moderne a rendu notre séjour inoubliable. Les vues sur les montagnes de l'Atlas sont à couper le souffle.",
    "testimonials.pierre":
      "L'hospitalité marocaine à son meilleur. Un endroit paisible et authentique, parfait pour se ressourcer. La cuisine locale est délicieuse!",
    "testimonials.ahmed":
      "Une expérience merveilleuse à DAR LOUKA. L'endroit est paisible et magnifique, et le service est excellent. Je le recommande vivement à ceux qui recherchent l'authenticité marocaine.",

    // Room amenities
    "amenities.wifi": "WiFi Gratuit",
    "amenities.breakfast": "Petit-déjeuner Inclus",
    "amenities.mountain-view": "Vue sur la Montagne",
    "amenities.garden-view": "Vue sur le Jardin",
    "amenities.courtyard-view": "Vue sur la Cour",
    "amenities.mountain-garden-view": "Vue Montagne & Jardin",
    "amenities.bathroom": "Chambre à Coucher Privée",
    "amenities.bathrooms": "Chambres à Coucher 2",

    // Loading messages
    "common.loading": "Chargement...",
    "loading.rooms": "Chargement des chambres...",
    "loading.gallery": "Chargement de la galerie...",
    "loading.events": "Chargement des événements...",
    "common.noData": "Aucune donnée disponible",

    // Admin Panel
    "admin.title": "Tableau de Bord Admin",
    "admin.welcome": "Bienvenue au Panneau Admin",
    "admin.rooms": "Chambres",
    "admin.bookings": "Réservations",
    "admin.gallery": "Galerie",
    "admin.events": "Événements",
    "admin.contacts": "Messages de Contact",
    "admin.logout": "Déconnexion",
    "admin.login": "Connexion Admin",
    "admin.email": "Email",
    "admin.password": "Mot de passe",
    "admin.signIn": "Se Connecter",
    "admin.signInError": "Identifiants invalides",
    "admin.loading": "Chargement...",

    // Rooms Manager
    "admin.rooms.title": "Gérer les Chambres",
    "admin.rooms.add": "Ajouter une Chambre",
    "admin.rooms.edit": "Modifier la Chambre",
    "admin.rooms.delete": "Supprimer la Chambre",
    "admin.rooms.save": "Enregistrer la Chambre",
    "admin.rooms.cancel": "Annuler",
    "admin.rooms.name": "Nom de la Chambre",
    "admin.rooms.description": "Description",
    "admin.rooms.price": "Prix (MAD)",
    "admin.rooms.capacity": "Capacité",
    "admin.rooms.amenities": "Équipements",
    "admin.rooms.images": "Images",
    "admin.rooms.confirmDelete": "Êtes-vous sûr de vouloir supprimer cette chambre?",
    "admin.rooms.deleteSuccess": "Chambre supprimée avec succès",
    "admin.rooms.savingSuccess": "Chambre enregistrée avec succès",
    "admin.rooms.error": "Erreur lors de l'enregistrement de la chambre",
    "admin.rooms.addAmenity": "Ajouter un Équipement",
    "admin.rooms.removeAmenity": "Supprimer",
    "admin.rooms.uploadImages": "Télécharger les Images",
    "admin.rooms.selectImages": "Sélectionner les images",
    "admin.rooms.icalToken": "Jeton iCal",
    "admin.rooms.icalImport": "URLs d'Importation iCal",
    "admin.rooms.copyToken": "Copier le Jeton",
    "admin.rooms.tokenCopied": "Jeton copié!",
    "admin.rooms.syncIcal": "Synchroniser iCal",
    "admin.rooms.syncSuccess": "Calendrier synchronisé avec succès",
    "admin.rooms.syncError": "Erreur lors de la synchronisation du calendrier",
    "admin.rooms.viewIcal": "Afficher iCal",
    "admin.rooms.noRooms": "Aucune chambre trouvée",

    // Bookings Manager
    "admin.bookings.title": "Gérer les Réservations",
    "admin.bookings.room": "Chambre",
    "admin.bookings.guest": "Nom de l'Invité",
    "admin.bookings.guests": "Invités",
    "admin.bookings.checkIn": "Arrivée",
    "admin.bookings.checkOut": "Départ",
    "admin.bookings.status": "Statut",
    "admin.bookings.email": "Email",
    "admin.bookings.phone": "Téléphone",
    "admin.bookings.contact": "Informations de Contact",
    "admin.bookings.specialRequests": "Demandes Spéciales",
    "admin.bookings.sendConfirmation": "Envoyer la Confirmation",
    "admin.bookings.updateStatus": "Mettre à Jour le Statut",
    "admin.bookings.pending": "En Attente",
    "admin.bookings.confirmed": "Confirmée",
    "admin.bookings.cancelled": "Annulée",
    "admin.bookings.statusUpdated": "Statut mis à jour",
    "admin.bookings.noBookings": "Aucune réservation trouvée",

    // Booking Confirmation
    "admin.confirmation.title": "Envoyer la Confirmation de Réservation",
    "admin.confirmation.method": "Méthode de Confirmation",
    "admin.confirmation.language": "Langue",
    "admin.confirmation.email": "Envoyer un Email",
    "admin.confirmation.whatsapp": "Envoyer WhatsApp",
    "admin.confirmation.phone": "Appel Téléphonique",
    "admin.confirmation.send": "Envoyer",
    "admin.confirmation.sending": "Envoi...",
    "admin.confirmation.success": "Confirmation envoyée avec succès!",
    "admin.confirmation.error": "Erreur lors de l'envoi de la confirmation",
    "admin.confirmation.preview": "Aperçu",
    "admin.confirmation.english": "English",
    "admin.confirmation.french": "Français",

    // Gallery Manager
    "admin.gallery.title": "Gérer la Galerie",
    "admin.gallery.add": "Ajouter une Image",
    "admin.gallery.addImage": "Ajouter une Image",
    "admin.gallery.edit": "Modifier l'Image",
    "admin.gallery.delete": "Supprimer l'Image",
    "admin.gallery.imageTitle": "Titre de l'Image",
    "admin.gallery.description": "Description",
    "admin.gallery.category": "Catégorie",
    "admin.gallery.uploadImage": "Télécharger l'Image",
    "admin.gallery.noImages": "Aucune image trouvée",
    "admin.gallery.deleteSuccess": "Image supprimée avec succès",
    "admin.gallery.fillRequired": "Veuillez remplir tous les champs obligatoires",
    "admin.gallery.uploadRequired": "Veuillez télécharger une image",
    "admin.gallery.saveFailed": "Échec de l'enregistrement de l'image",
    "admin.gallery.error": "Erreur lors de l'enregistrement de l'image",
    "admin.gallery.confirmDelete": "Êtes-vous sûr de vouloir supprimer cette image?",
    "admin.gallery.placeholder.title": "Ex: Cour Marocaine",
    "admin.gallery.placeholder.description": "Décrivez l'image...",
    "admin.gallery.placeholder.category": "Ex: Architecture, Paysage, Chambres",
    "admin.gallery.currentImage": "Image actuelle",
    "admin.gallery.newImageSelected": "Nouvelle image sélectionnée",
    "admin.gallery.imageInstructions": "Téléchargez une image (max 5 Mo). Formats supportés: JPG, PNG, GIF",
    "admin.gallery.fileTooLarge": "La taille du fichier doit être inférieure à 5 Mo",
    "admin.gallery.uploading": "Téléchargement...",
    "admin.gallery.saving": "Enregistrement...",
    "admin.gallery.update": "Mettre à Jour l'Image",
    "admin.gallery.list": "Images de la Galerie",

    // Events Manager
    "admin.events.title": "Gérer les Événements",
    "admin.events.add": "Ajouter un Événement",
    "admin.events.edit": "Modifier l'Événement",
    "admin.events.delete": "Supprimer l'Événement",
    "admin.events.eventTitle": "Titre de l'Événement",
    "admin.events.description": "Description",
    "admin.events.date": "Date",
    "admin.events.time": "Heure",
    "admin.events.location": "Lieu",
    "admin.events.category": "Catégorie",
    "admin.events.price": "Prix (MAD)",
    "admin.events.image": "Image de l'Événement",
    "admin.events.uploadImage": "Télécharger l'Image",
    "admin.events.noEvents": "Aucun événement trouvé",
    "admin.events.deleteSuccess": "Événement supprimé avec succès",
    "admin.events.fillRequired": "Veuillez remplir tous les champs obligatoires",
    "admin.events.uploadRequired": "Veuillez télécharger une image",
    "admin.events.saveFailed": "Échec de l'enregistrement de l'événement",
    "admin.events.error": "Erreur lors de l'enregistrement de l'événement",
    "admin.events.confirmDelete": "Êtes-vous sûr de vouloir supprimer cet événement?",
    "admin.events.placeholder.title": "Ex: Randonnée dans les Montagnes de l'Atlas",
    "admin.events.placeholder.description": "Décrivez l'événement...",
    "admin.events.placeholder.location": "Ex: Montagnes de l'Atlas",
    "admin.events.placeholder.category": "Ex: Aventure, Culturel",
    "admin.events.placeholder.price": "Optionnel",
    "admin.events.currentImage": "Image actuelle",
    "admin.events.newImageSelected": "Nouvelle image sélectionnée",
    "admin.events.imageInstructions": "Téléchargez une nouvelle image (max 5 Mo). Formats supportés: JPG, PNG, GIF",
    "admin.events.fileTooLarge": "La taille du fichier doit être inférieure à 5 Mo",
    "admin.events.uploading": "Téléchargement...",
    "admin.events.saving": "Enregistrement...",
    "admin.events.update": "Mettre à Jour l'Événement",
    "admin.events.create": "Créer l'Événement",
    "admin.events.list": "Liste des Événements",
    "admin.events.free": "Gratuit",

    // Contacts Manager
    "admin.contacts.title": "Messages de Contact",
    "admin.contacts.name": "Nom",
    "admin.contacts.email": "Email",
    "admin.contacts.phone": "Téléphone",
    "admin.contacts.subject": "Sujet",
    "admin.contacts.message": "Message",
    "admin.contacts.date": "Date",
    "admin.contacts.noMessages": "Aucun message trouvé",
    "admin.contacts.reply": "Répondre",

    // Currency
    "currency.mad": "MAD",
    "currency.dirham": "Dirham Marocain",
  },
}
