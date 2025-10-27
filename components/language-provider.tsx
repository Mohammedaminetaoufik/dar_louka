"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "fr" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang) {
      setLanguage(savedLang)
    }

    // Set HTML dir attribute for RTL
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", language)
  }, [language])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", lang)
  }

  const t = (key: string) => {
    return translations[language][key] || key
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
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.rooms": "Rooms & Booking",
    "nav.events": "Events",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",

    // Hero
    "hero.title": "Welcome to DAR LOUKA",
    "hero.subtitle": "Experience Authentic Moroccan Hospitality",
    "hero.description":
      "Nestled in the heart of Tahanaout, near Marrakech, discover a peaceful retreat where traditional architecture meets modern comfort",
    "hero.cta": "Book Your Stay",
    "hero.explore": "Explore",

    // Features
    "features.title": "Why Choose DAR LOUKA",
    "features.authentic.title": "Authentic Experience",
    "features.authentic.desc": "Immerse yourself in traditional Moroccan architecture and hospitality",
    "features.nature.title": "Surrounded by Nature",
    "features.nature.desc": "Enjoy breathtaking views of the Atlas Mountains and lush gardens",
    "features.comfort.title": "Modern Comfort",
    "features.comfort.desc": "Experience the perfect blend of traditional charm and contemporary amenities",
    "features.location.title": "Perfect Location",
    "features.location.desc": "Just 30 minutes from Marrakech, in the peaceful village of Tahanaout",

    // About
    "about.title": "About DAR LOUKA",
    "about.subtitle": "A Story of Tradition and Hospitality",
    "about.description":
      "DAR LOUKA is more than just a guesthouse. It is a celebration of Moroccan culture, architecture, and the warm hospitality that defines our heritage. Located in Tahanaout, at the foothills of the Atlas Mountains, our guesthouse offers a unique escape from the bustling city of Marrakech.",
    "about.story": "Our Story",
    "about.story.text":
      "Built with love and respect for traditional Moroccan architecture, DAR LOUKA features authentic design elements including hand-carved woodwork, colorful zellige tiles, and peaceful courtyards. Every corner tells a story of craftsmanship and cultural heritage.",
    "about.values": "Our Values",
    "about.values.text":
      "We believe in sustainable tourism, supporting local communities, and preserving the natural beauty of our region. Our team is dedicated to providing personalized service that makes every guest feel at home.",
    "about.location": "Our Location",
    "about.location.text":
      "Tahanaout is a charming village at the gateway to the High Atlas Mountains, offering the perfect balance between accessibility and tranquility. Just 30 minutes from Marrakech's vibrant medina, yet worlds away in atmosphere.",
    "about.values.hospitality.title": "Authentic Hospitality",
    "about.values.hospitality.desc":
      "We welcome every guest as family, sharing the warmth and generosity of Moroccan culture",
    "about.values.community.title": "Community Support",
    "about.values.community.desc": "We work with local artisans and businesses, supporting the Tahanaout community",
    "about.values.sustainable.title": "Sustainable Tourism",
    "about.values.sustainable.desc": "We protect our natural environment and preserve traditional building methods",
    "about.values.quality.title": "Quality Service",
    "about.values.quality.desc": "We maintain the highest standards while respecting our cultural heritage",
    "about.location.discover": "Discover Tahanaout",
    "about.location.tahanaout":
      "Tahanaout is a charming Berber village located at the foothills of the High Atlas Mountains, just 30 kilometers south of Marrakech. Known for its weekly souk (market) and as a gateway to mountain adventures, the village offers an authentic glimpse into rural Moroccan life.",
    "about.location.activities":
      "The area is perfect for hiking, mountain biking, and exploring traditional Berber villages. The famous Toubkal National Park is easily accessible, making DAR LOUKA an ideal base for both relaxation and adventure.",

    // Rooms
    "rooms.title": "Our Rooms",
    "rooms.subtitle": "Comfort Meets Tradition",
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
      "A peaceful room overlooking our lush gardens and traditional courtyard. Perfect for couples seeking tranquility and authentic Moroccan ambiance.",
    "rooms.family-suite.desc":
      "Spacious suite ideal for families, featuring separate sleeping areas and two bathrooms. Combines comfort with traditional Moroccan elegance.",
    "rooms.deluxe-room.desc":
      "Elegantly appointed room featuring authentic Moroccan design elements and modern amenities. Overlooks our beautiful traditional courtyard.",
    "rooms.features": "Room Features:",
    "rooms.external.text": "You can also book your stay through our trusted partner platforms",

    // Booking
    "booking.title": "Book Your Stay",
    "booking.checkin": "Check-in",
    "booking.checkout": "Check-out",
    "booking.guests": "Guests",
    "booking.room": "Select Room",
    "booking.submit": "Check Availability",
    "booking.external": "Also available on",

    // Events
    "events.title": "Events & Activities",
    "events.subtitle": "Discover the Magic of Morocco",
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
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.about": "À Propos",
    "nav.rooms": "Chambres & Réservation",
    "nav.events": "Événements",
    "nav.gallery": "Galerie",
    "nav.contact": "Contact",

    // Hero
    "hero.title": "Bienvenue à DAR LOUKA",
    "hero.subtitle": "Découvrez l'Hospitalité Marocaine Authentique",
    "hero.description":
      "Niché au cœur de Tahanaout, près de Marrakech, découvrez une retraite paisible où l'architecture traditionnelle rencontre le confort moderne",
    "hero.cta": "Réserver Votre Séjour",
    "hero.explore": "Explorer",

    // Features
    "features.title": "Pourquoi Choisir DAR LOUKA",
    "features.authentic.title": "Expérience Authentique",
    "features.authentic.desc": "Plongez dans l'architecture et l'hospitalité marocaines traditionnelles",
    "features.nature.title": "Entouré par la Nature",
    "features.nature.desc": "Profitez de vues imprenables sur l'Atlas et des jardins luxuriants",
    "features.comfort.title": "Confort Moderne",
    "features.comfort.desc": "Découvrez le mélange parfait de charme traditionnel et d'équipements contemporains",
    "features.location.title": "Emplacement Parfait",
    "features.location.desc": "À seulement 30 minutes de Marrakech, dans le village paisible de Tahanaout",

    // About
    "about.title": "À Propos de DAR LOUKA",
    "about.subtitle": "Une Histoire de Tradition et d'Hospitalité",
    "about.description":
      "DAR LOUKA est plus qu'une simple maison d'hôtes. C'est une célébration de la culture, de l'architecture et de la chaleureuse hospitalité marocaines qui définissent notre patrimoine. Située à Tahanaout, au pied de l'Atlas, notre maison d'hôtes offre une évasion unique de l'agitation de Marrakech.",
    "about.story": "Notre Histoire",
    "about.story.text":
      "Construite avec amour et respect pour l'architecture marocaine traditionnelle, DAR LOUKA présente des éléments de design authentiques, notamment des boiseries sculptées à la main, des carreaux de zellige colorés et des cours paisibles. Chaque coin raconte une histoire d'artisanat et de patrimoine cultural.",
    "about.values": "Nos Valeurs",
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
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.rooms": "الغرف والحجز",
    "nav.events": "الفعاليات",
    "nav.gallery": "المعرض",
    "nav.contact": "اتصل بنا",

    // Hero
    "hero.title": "مرحباً بكم في دار لوكا",
    "hero.subtitle": "اختبر الضيافة المغربية الأصيلة",
    "hero.description":
      "تقع في قلب تحناوت، بالقرب من مراكش، اكتشف ملاذاً هادئاً حيث تلتقي العمارة التقليدية بالراحة الحديثة",
    "hero.cta": "احجز إقامتك",
    "hero.explore": "استكشف",

    // Features
    "features.title": "لماذا تختار دار لوكا",
    "features.authentic.title": "تجربة أصيلة",
    "features.authentic.desc": "انغمس في العمارة والضيافة المغربية التقليدية",
    "features.nature.title": "محاط بالطبيعة",
    "features.nature.desc": "استمتع بإطلالات خلابة على جبال الأطلس والحدائق الخضراء",
    "features.comfort.title": "راحة عصرية",
    "features.comfort.desc": "اختبر المزيج المثالي من السحر التقليدي والمرافق المعاصرة",
    "features.location.title": "موقع مثالي",
    "features.location.desc": "على بعد 30 دقيقة فقط من مراكش، في قرية تحناوت الهادئة",

    // About
    "about.title": "عن دار لوكا",
    "about.subtitle": "قصة من التقاليد والضيافة",
    "about.description":
      "دار لوكا هو أكثر من مجرد دار ضيافة. إنه احتفال بالثقافة المغربية والعمارة والضيافة الدافئة التي تحدد تراثنا. يقع في تحناوت، عند سفوح جبال الأطلس، ويوفر دار ضيافتنا ملاذاً فريداً من صخب مدينة مراكش.",
    "about.story": "قصتنا",
    "about.story.text":
      "بُني بحب واحترام للعمارة المغربية التقليدية، يتميز دار لوكا بعناصر تصميم أصيلة بما في ذلك الأعمال الخشبية المنحوتة يدوياً، وبلاط الزليج الملون، والساحات الهادئة. كل ركن يحكي قصة من الحرفية والتراث الثقافي.",
    "about.values": "قيمنا",
    "about.values.text":
      "نؤمن بالسياحة المستدامة، ودعم المجتمعات المحلية، والحفاظ على الجمال الطبيعي لمنطقتنا. فريقنا مكرس لتقديم خدمة شخصية تجعل كل ضيف يشعر وكأنه في بيته.",
    "about.location": "موقعنا",
    "about.location.text":
      "تحناوت قرية ساحرة عند بوابة جبال الأطلس الكبير، تقدم التوازن المثالي بين سهولة الوصول والهدوء. على بعد 30 دقيقة فقط من المدينة القديمة النابضة بالحياة في مراكش، ولكن في عالم مختلف تماماً.",
    "about.values.hospitality.title": "ضيافة أصيلة",
    "about.values.hospitality.desc": "نرحب بكل ضيف كعائلة، نشارك دفء وكرم الثقافة المغربية",
    "about.values.community.title": "دعم المجتمع",
    "about.values.community.desc": "نعمل مع الحرفيين والشركات المحلية، ندعم مجتمع تحناوت",
    "about.values.sustainable.title": "سياحة مستدامة",
    "about.values.sustainable.desc": "نحمي بيئتنا الطبيعية ونحافظ على طرق البناء التقليدية",
    "about.values.quality.title": "خدمة عالية الجودة",
    "about.values.quality.desc": "نحافظ على أعلى المعايير مع احترام تراثنا الثقافي",
    "about.location.discover": "اكتشف تحناوت",
    "about.location.tahanaout":
      "تحناوت قرية بربرية ساحرة تقع عند سفوح جبال الأطلس الكبير، على بعد 30 كيلومتراً فقط جنوب مراكش. معروفة بسوقها الأسبوعي وكبوابة لمغامرات الجبال، تقدم القرية لمحة أصيلة عن الحياة الريفية المغربية.",
    "about.location.activities":
      "المنطقة مثالية للمشي وركوب الدراجات الجبلية واستكشاف القرى البربرية التقليدية. حديقة توبقال الوطنية الشهيرة يسهل الوصول إليها، مما يجعل دار لوكا قاعدة مثالية للاسترخاء والمغامرة.",

    // Rooms
    "rooms.title": "غرفنا",
    "rooms.subtitle": "الراحة تلتقي بالتقاليد",
    "rooms.book": "احجز الآن",
    "rooms.from": "ابتداءً من",
    "rooms.night": "في الليلة",
    "rooms.availability": "تحقق من التوفر",
    "rooms.atlas-suite": "جناح الأطلس",
    "rooms.garden-room": "غرفة الحديقة",
    "rooms.family-suite": "جناح العائلة",
    "rooms.deluxe-room": "غرفة ديلوكس",
    "rooms.atlas-suite.desc":
      "جناحنا المميز الذي يوفر إطلالات خلابة على جبال الأطلس. مزين بالحرفية المغربية التقليدية بما في ذلك خشب الأرز المنحوت يدوياً وبلاط الزليج الملون.",
    "rooms.garden-room.desc":
      "غرفة هادئة تطل على حدائقنا الخضراء وفناءنا التقليدي. مثالية للأزواج الذين يبحثون عن الهدوء والأجواء المغربية الأصيلة.",
    "rooms.family-suite.desc":
      "جناح واسع مثالي للعائلات، يتميز بمناطق نوم منفصلة وحمامين. يجمع بين الراحة والأناقة المغربية التقليدية.",
    "rooms.deluxe-room.desc":
      "غرفة مفروشة بأناقة تتميز بعناصر التصميم المغربي الأصيل ووسائل الراحة الحديثة. تطل على فناءنا التقليدي الجميل.",
    "rooms.features": "مميزات الغرفة:",
    "rooms.external.text": "يمكنك أيضاً حجز إقامتك من خلال منصات شركائنا الموثوقة",

    // Booking
    "booking.title": "احجز إقامتك",
    "booking.checkin": "تسجيل الوصول",
    "booking.checkout": "تسجيل المغادرة",
    "booking.guests": "الضيوف",
    "booking.room": "اختر الغرفة",
    "booking.submit": "تحقق من التوفر",
    "booking.external": "متاح أيضاً على",

    // Events
    "events.title": "الفعاليات والأنشطة",
    "events.subtitle": "اكتشف سحر المغرب",
    "events.local": "التجارب المحلية",
    "events.activities": "الأنشطة",
    "events.activities.intro": "من مغامرات الجبال إلى التجارب الثقافية، اكتشف الأنشطة العديدة المتاحة في دار لوكا",
    "events.local.intro": "استكشف المنطقة المحيطة برحلات يومية منظمة",
    "events.seasonal": "أبرز الأحداث الموسمية",
    "events.seasonal.intro": "اختبر التقويم الثقافي الغني للمغرب على مدار العام",
    "events.hiking": "المشي في جبال الأطلس",
    "events.hiking.desc": "استكشف المسارات الخلابة مع إطلالات خلابة على جبال الأطلس الكبير والقرى البربرية التقليدية",
    "events.biking": "ركوب الدراجات الجبلية",
    "events.biking.desc": "اركب عبر الوديان ومسارات الجبال، واختبر المناظر الطبيعية المتنوعة للمنطقة",
    "events.toubkal": "حديقة توبقال الوطنية",
    "events.toubkal.desc": "قم بزيارة أعلى قمة في شمال أفريقيا واستكشف الحديقة الوطنية المذهلة مع جولات إرشادية",
    "events.souk": "سوق تحناوت",
    "events.souk.desc": "اختبر السوق الأسبوعي الأصيل حيث يتاجر السكان المحليون بالسلع والتوابل والحرف التقليدية",
    "events.cooking": "دروس الطبخ المغربي",
    "events.cooking.desc": "تعلم إعداد الأطباق التقليدية مثل الطاجين والكسكس بالمكونات المحلية",
    "events.photography": "جولات التصوير الفوتوغرافي",
    "events.photography.desc": "التقط جمال المناظر الطبيعية والعمارة والحياة اليومية المغربية مع إرشادات الخبراء",
    "events.music": "أمسيات الموسيقى التقليدية",
    "events.music.desc": "استمتع بعروض الموسيقى المغربية الأصيلة تحت النجوم في فناءنا",
    "events.workshops": "ورش العمل الثقافية",
    "events.workshops.desc": "شارك في ورش عمل الفخار أو النسيج أو الخط مع الحرفيين المحليين",
    "events.marrakech": "رحلة يومية إلى مراكش",
    "events.marrakech.desc": "استكشف الأسواق النابضة بالحياة والقصور التاريخية وساحة جامع الفنا المزدحمة",
    "events.berber": "زيارة قرية بربرية",
    "events.berber.desc": "اختبر الضيافة البربرية الأصيلة وتعلم عن الحياة الجبلية التقليدية",
    "events.ourika": "رحلة وادي أوريكا",
    "events.ourika.desc": "اكتشف الشلالات الجميلة والوديان الخضراء في هذه المنطقة الطبيعية المذهلة",
    "events.spring": "الربيع (مارس-مايو)",
    "events.spring.desc": "طقس مثالي للمشي، أزهار اللوز في الوديان، ومهرجان الورود في قلعة مكونة القريبة",
    "events.summer": "الصيف (يونيو-أغسطس)",
    "events.summer.desc": "اهرب من حرارة مراكش، واستمتع بنسيم الجبال البارد، واختبر المهرجانات البربرية التقليدية",
    "events.autumn": "الخريف (سبتمبر-نوفمبر)",
    "events.autumn.desc": "موسم الحصاد، قطف الزعفران، وظروف مثالية للمشي في الجبال والتصوير الفوتوغرافي",
    "events.winter": "الشتاء (ديسمبر-فبراير)",
    "events.winter.desc": "إطلالات على الجبال المغطاة بالثلوج، أمسيات دافئة بجانب النار، وقرب من منتجع أوكايمدن للتزلج",
    "events.duration.halfday": "نصف يوم / يوم كامل",
    "events.duration.2-4hours": "2-4 ساعات",
    "events.duration.fullday": "يوم كامل",
    "events.duration.tuesday": "صباح الثلاثاء",
    "events.duration.3-4hours": "3-4 ساعات",
    "events.duration.flexible": "مرن",
    "events.duration.evenings": "المساء",
    "events.duration.2-3hours": "2-3 ساعات",

    // Gallery
    "gallery.title": "المعرض",
    "gallery.subtitle": "اكتشف مساحاتنا الجميلة",

    // Contact
    "contact.title": "اتصل بنا",
    "contact.subtitle": "نحب أن نسمع منك",
    "contact.name": "الاسم",
    "contact.email": "البريد الإلكتروني",
    "contact.phone": "الهاتف",
    "contact.message": "الرسالة",
    "contact.send": "إرسال الرسالة",
    "contact.info": "معلومات الاتصال",
    "contact.address": "العنوان",
    "contact.address.text": "تحناوت، مراكش، المغرب",
    "contact.location": "موقعنا",
    "contact.form": "أرسل لنا رسالة",
    "contact.form.name": "الاسم الكامل *",
    "contact.form.email": "عنوان البريد الإلكتروني *",
    "contact.form.phone": "رقم الهاتف",
    "contact.form.message": "الرسالة *",
    "contact.form.send": "إرسال الرسالة",
    "contact.form.placeholder.name": "اسمك",
    "contact.form.placeholder.email": "your.email@example.com",
    "contact.form.placeholder.phone": "+212 XXX XXX XXX",
    "contact.form.placeholder.message": "أخبرنا عن استفسارك أو طلباتك الخاصة...",
    "contact.info.address": "العنوان",
    "contact.info.address.line1": "دوار آيت سوكة، تحناوت",
    "contact.info.address.line2": "مراكش-آسفي، المغرب",
    "contact.info.phone": "الهاتف",
    "contact.info.phone.line1": "+212 524 48 XX XX",
    "contact.info.phone.line2": "+212 6XX XX XX XX",
    "contact.info.email": "البريد الإلكتروني",
    "contact.info.email.line1": "info@darlouka.com",
    "contact.info.email.line2": "reservations@darlouka.com",
    "contact.info.hours": "ساعات الاستقبال",
    "contact.info.hours.line1": "الاثنين - الأحد: 8:00 صباحاً - 10:00 مساءً",
    "contact.info.hours.line2": "اتصال طوارئ متاح على مدار الساعة",
    "contact.location.description": "يقع في قلب تحناوت، على بعد 30 دقيقة فقط من مراكش، محاطاً بجبال الأطلس المهيبة",
    "contact.directions.airport": "من مطار مراكش",
    "contact.directions.airport.time": "45 دقيقة بالسيارة (40 كم)",
    "contact.directions.medina": "من المدينة القديمة مراكش",
    "contact.directions.medina.time": "30 دقيقة بالسيارة (30 كم)",
    "contact.directions.ourika": "إلى وادي أوريكا",
    "contact.directions.ourika.time": "20 دقيقة بالسيارة (15 كم)",
    "contact.success": "شكراً لرسالتك! سنعود إليك قريباً.",

    // Footer
    "footer.tagline": "اختبر الضيافة المغربية الأصيلة",
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.quick": "روابط سريعة",
    "footer.follow": "تابعنا",

    // Testimonials
    "testimonials.title": "تجارب الضيوف",
    "testimonials.subtitle": "ما يقوله ضيوفنا عن إقامتهم",
    "testimonials.sarah":
      "تجربة سحرية تماماً! العمارة المغربية التقليدية المدمجة مع الراحة الحديثة جعلت إقامتنا لا تُنسى. إطلالات جبال الأطلس خلابة.",
    "testimonials.pierre":
      "الضيافة المغربية في أفضل حالاتها. مكان هادئ وأصيل، مثالي لإعادة شحن الطاقة. المطبخ المحلي لذيذ!",
    "testimonials.ahmed":
      "تجربة رائعة في دار لوكا. المكان هادئ وجميل، والخدمة ممتازة. أنصح به بشدة لمن يبحث عن الأصالة المغربية.",

    // Room amenities
    "amenities.wifi": "واي فاي مجاني",
    "amenities.breakfast": "الإفطار مشمول",
    "amenities.mountain-view": "إطلالة على الجبل",
    "amenities.garden-view": "إطلالة على الحديقة",
    "amenities.courtyard-view": "إطلالة على الفناء",
    "amenities.mountain-garden-view": "إطلالة على الجبل والحديقة",
    "amenities.bathroom": "حمام خاص",
    "amenities.bathrooms": "حمامان",
  },
}
