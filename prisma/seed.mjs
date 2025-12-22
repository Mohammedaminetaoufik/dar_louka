import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing data
  await prisma.booking.deleteMany()
  await prisma.room.deleteMany()
  await prisma.event.deleteMany()
  await prisma.galleryImage.deleteMany()
  await prisma.contactSubmission.deleteMany()
  await prisma.adminUser.deleteMany()

  // Create Admin Users for testing
  const adminUsers = await prisma.adminUser.createMany({
    data: [
      {
        email: "admin@darlouka.com",
        password: "admin123",
        name: "Admin",
      },
      {
        email: "test@darlouka.com",
        password: "test123",
        name: "Test Admin",
      },
      {
        email: "manager@darlouka.com",
        password: "manager123",
        name: "Manager",
      },
    ],
  })
  console.log("✅ Admin users created")

  // Create Rooms
  const rooms = await prisma.room.createMany({
    data: [
      {
        nameEn: "Deluxe Room",
        nameFr: "Chambre Deluxe",
        descriptionEn:
          "Experience luxury in our Deluxe Room, featuring traditional Moroccan décor with modern amenities. This spacious room overlooks the Atlas Mountains and includes a private balcony with stunning views. Perfect for couples seeking an intimate getaway.",
        descriptionFr:
          "Découvrez le luxe de notre Chambre Deluxe, avec une décoration marocaine traditionnelle et des équipements modernes. Cette chambre spacieuse offre une vue sur les montagnes de l'Atlas et comprend un balcon privé avec des vues spectaculaires. Parfaite pour les couples cherchant une escapade intime.",
        price: 150,
        capacity: 2,
        amenities: JSON.stringify([
          "King Bed",
          "Private Balcony",
          "Mountain View",
          "Air Conditioning",
          "Free WiFi",
          "Marble Bathroom",
          "Heated Shower",
        ]),
        image: "/moroccan-deluxe-room.jpg",
        images: JSON.stringify(["/moroccan-deluxe-room-1.jpg", "/moroccan-deluxe-room-2.jpg", "/moroccan-deluxe-room-3.jpg"]),
      },
      {
        nameEn: "Garden Room",
        nameFr: "Chambre Jardin",
        descriptionEn:
          "Nestled in our lush gardens, the Garden Room offers a serene retreat surrounded by olive trees and traditional Moroccan plants. This charming room features authentic zellige tilework and direct access to the garden courtyard.",
        descriptionFr:
          "Nichée dans nos jardins luxuriants, la Chambre Jardin offre une retraite sereine entourée d'oliviers et de plantes marocaines traditionnelles. Cette chambre charmante présente des carreaux de zellige authentiques et un accès direct à la cour du jardin.",
        price: 120,
        capacity: 2,
        amenities: JSON.stringify([
          "Queen Bed",
          "Garden Access",
          "Courtyard View",
          "Air Conditioning",
          "Free WiFi",
          "Ensuite Bathroom",
          "Outdoor Shower",
        ]),
        image: "/moroccan-garden-room.jpg",
        images: JSON.stringify(["/moroccan-garden-room-1.jpg", "/moroccan-garden-room-2.jpg", "/moroccan-garden-room-3.jpg"]),
      },
      {
        nameEn: "Family Suite",
        nameFr: "Suite Familiale",
        descriptionEn:
          "Our spacious Family Suite is ideal for families or groups. With two bedrooms and a shared living area, it provides comfort and flexibility. The suite features traditional Moroccan architecture with all modern conveniences.",
        descriptionFr:
          "Notre spacieuse Suite Familiale est idéale pour les familles ou les groupes. Avec deux chambres et un salon partagé, elle offre confort et flexibilité. La suite présente une architecture marocaine traditionnelle avec toutes les commodités modernes.",
        price: 200,
        capacity: 4,
        amenities: JSON.stringify([
          "2 Bedrooms",
          "Living Area",
          "Mountain View",
          "Air Conditioning",
          "Free WiFi",
          "2 Bathrooms",
          "Kitchen Access",
        ]),
        image: "/moroccan-family-suite.jpg",
        images: JSON.stringify(["/moroccan-family-suite-1.jpg", "/moroccan-family-suite-2.jpg", "/moroccan-family-suite-3.jpg"]),
      },
      {
        nameEn: "Riad Room",
        nameFr: "Chambre Riad",
        descriptionEn:
          "Traditional Riad Room with authentic Moroccan design. This intimate room features a private courtyard entrance, traditional zellige tiles, and carved cedar details. Experience authentic Moroccan hospitality.",
        descriptionFr:
          "Chambre Riad traditionnelle avec un design marocain authentique. Cette chambre intime présente une entrée de cour privée, des carreaux de zellige traditionnels et des détails en cèdre sculpté. Vivez l'hospitalité marocaine authentique.",
        price: 100,
        capacity: 2,
        amenities: JSON.stringify([
          "Double Bed",
          "Courtyard Entrance",
          "Traditional Design",
          "Air Conditioning",
          "Free WiFi",
          "Bathroom",
          "Terrace Access",
        ]),
        image: "/moroccan-riad-room.jpg",
        images: JSON.stringify(["/moroccan-riad-room-1.jpg", "/moroccan-riad-room-2.jpg", "/moroccan-riad-room-3.jpg"]),
      },
    ],
  })
  console.log(`✅ ${rooms.count} rooms created`)

  // Create Events
  const events = await prisma.event.createMany({
    data: [
      {
        titleEn: "3-Night Package at Dar Louka",
        titleFr: "Forfait 3 Nuits à Dar Louka",
        descriptionEn: "Silence and Shiatsu Escape 40km from Marrakech. Transfer from Marrakech included.",
        descriptionFr: "L'Évasion Silence et Shiatsu à 40km de Marrakech. Transfert de marrakech inclus.",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2025-01-18"),
        type: "THREE_DAYS",
        programEn: "Day 1 (Anchoring): Arrival, immersion, settling into tranquility and softness then Dinner\nDay 2 (Repair): Breakfast (light), followed by your Expert Shiatsu Session (1h30 min), including 20 min of infrared sauna beforehand, then at the end of the day a gentle hike to discover the Hinterland.\nDay 3 (Integration): Body Awakening (Yoga/Gentle Movements), \"Vitality\" Lunch, with a green juice among others then Self-Care Workshop (Reflexology Techniques) for the return. In the afternoon discovery of Imlil with a small hike\nDay 4 (Departure and Intention): Departure according to flight, equipped with some tips to maintain the benefits",
        programFr: "Jour 1 (Ancrage) : Arrivée, immersion, installation dans la tranquillité et la douceur puis Dîner\nJour 2 (Réparation) : Petit-déjeuner (légér, suivi de votre Séance Shiatsu Expert  (1h30 min),inclue au préalable du soin un 20 mn de sauna infra rouge puis en fin de journée une randonnée douce pour la Découverte de l'Arrière-Pays.\nJour 3 (Intégration) : Éveil Corporel (Yoga/Mouvements Doux), Déjeuner »Vitalité », avec un jus vert  entre autre  puis Atelier d'Auto-Soin (Techniques de Réflexologie) pour le retour. En après midi découverte d’imlil avec petite randonnée\nJour 4 (Départ et Intention : Départ en fonction du vol , muni de quelques conseils pour maintenir les bénéfices",
        maxParticipants: 4,
        image: "/placeholder.svg?height=400&width=600",
        price: 590,
      },
      {
        titleEn: "1-Day Retreat at Dar Louka",
        titleFr: "Forfait 1 jour retraite à Dar Louka",
        descriptionEn: "Silence and Shiatsu Escape 40km from Marrakech. Transfer from Marrakech included.",
        descriptionFr: "L'Évasion Silence et Shiatsu à 40km de Marrakech. Transfert de marrakech inclus.",
        startDate: new Date("2025-01-20"),
        type: "ONE_DAY",
        programEn: "10:00 - 10:30 Private Transfer and Arrival: The client leaves the noise of the city.\n10:30 - 11:00 Welcome & Silencing Anchoring: Welcome tea and discovery of the place. Invitation to leave the phone aside\n11:00 - 12:30 The Expert Care Energy Repair: Complete Shiatsu and Reflexology session (60 min).\n12:30 - 13:30 Free Resourcing Integration: Free access to the pool, gardens and reading corners. The client takes advantage of the silence to integrate the benefits of the care.\n13:30 - 14:30 Detox Lunch Nourish and Cleanse: Light and healthy lunch (Balanced Detox Cuisine), ideal not to weigh down the body after the care.\n14:30 - 15:30 Pause and Disconnection Closing: Last moment of calm before the return.\n15:30 - 16:00 Departure and Private Return: The client leaves rested, realigned, joyful.",
        programFr: "10h00 - 10h30 Transfert Privé et Arrivée : Le client quitte le bruit de la ville.\n10h30 - 11h00 Accueil & Mise en Silence Ancrage : Thé de bienvenue et découverte du lieu. Invitation à laisser le téléphone de côté\n11h00 - 12h30 Le Soin Expert Réparation Énergétique : Séance complète de Shiatsu et  Réflexologie (60 min).\n12h30 - 13h30 Ressourcement Libre Intégration : Accès libre à la piscine, aux jardins et aux coins de lecture. Le client profite du silence pour intégrer les bénéfices du soin.\n13h30 - 14h30 Déjeuner Détox Nourrir et Nettoyer : Déjeuner léger et sain (Cuisine Équilibrée Détox), idéal pour ne pas alourdir le corps après le soin.\n14h30 - 15h30 Pause et Déconnexion Clôture : Dernier moment de calme avant le retour.\n15h30 - 16h00 Départ et Retour Privé : Le client repart reposé, réaligné, joyeux.",
        maxParticipants: 2,
        image: "/placeholder.svg?height=400&width=600",
        price: 125,
      },
    ],
  })
  console.log(`✅ ${events.count} events created`)

  // Create Gallery Images
  const galleryImages = await prisma.galleryImage.createMany({
    data: [
      {
        titleEn: "Moroccan Courtyard",
        titleFr: "Cour Marocaine",
        descriptionEn: "Beautiful traditional Moroccan courtyard with zellige tiles and fountain",
        descriptionFr: "Belle cour marocaine traditionnelle avec carreaux de zellige et fontaine",
        image: "/placeholder.svg?height=400&width=600",
        category: "Architecture",
      },
      {
        titleEn: "Atlas Mountains View",
        titleFr: "Vue sur les Montagnes de l'Atlas",
        descriptionEn: "Stunning panoramic view of the Atlas Mountains from our terrace",
        descriptionFr: "Vue panoramique époustouflante des Montagnes de l'Atlas depuis notre terrasse",
        image: "/placeholder.svg?height=400&width=600",
        category: "Landscape",
      },
      {
        titleEn: "Traditional Riad",
        titleFr: "Riad Traditionnel",
        descriptionEn: "Authentic Moroccan riad with traditional design elements",
        descriptionFr: "Riad marocain authentique avec éléments de design traditionnel",
        image: "/placeholder.svg?height=400&width=600",
        category: "Architecture",
      },
      {
        titleEn: "Garden Oasis",
        titleFr: "Oasis de Jardin",
        descriptionEn: "Lush garden with olive trees and traditional Moroccan plants",
        descriptionFr: "Jardin luxuriant avec oliviers et plantes marocaines traditionnelles",
        image: "/placeholder.svg?height=400&width=600",
        category: "Garden",
      },
      {
        titleEn: "Sunset Over Tahanaout",
        titleFr: "Coucher du Soleil sur Tahanaout",
        descriptionEn: "Golden sunset over the Tahanaout valley",
        descriptionFr: "Coucher de soleil doré sur la vallée de Tahanaout",
        image: "/placeholder.svg?height=400&width=600",
        category: "Landscape",
      },
      {
        titleEn: "Berber Hospitality",
        titleFr: "Hospitalité Berbère",
        descriptionEn: "Traditional Moroccan tea service with local hosts",
        descriptionFr: "Service de thé marocain traditionnel avec hôtes locaux",
        image: "/placeholder.svg?height=400&width=600",
        category: "Culture",
      },
      {
        titleEn: "Bedroom Comfort",
        titleFr: "Confort de Chambre",
        descriptionEn: "Luxurious bedroom with traditional Moroccan décor",
        descriptionFr: "Chambre luxueuse avec décoration marocaine traditionnelle",
        image: "/placeholder.svg?height=400&width=600",
        category: "Rooms",
      },
      {
        titleEn: "Dining Experience",
        titleFr: "Expérience Culinaire",
        descriptionEn: "Traditional Moroccan dining setup with authentic cuisine",
        descriptionFr: "Installation de restauration marocaine traditionnelle avec cuisine authentique",
        image: "/placeholder.svg?height=400&width=600",
        category: "Dining",
      },
      {
        titleEn: "Terrace Relaxation",
        titleFr: "Relaxation en Terrasse",
        descriptionEn: "Peaceful terrace overlooking the mountains",
        descriptionFr: "Terrasse paisible surplombant les montagnes",
        image: "/placeholder.svg?height=400&width=600",
        category: "Spaces",
      },
    ],
  })
  console.log(`✅ ${galleryImages.count} gallery images created`)

  // Create Sample Bookings
  const room1 = await prisma.room.findFirst()
  if (room1) {
    const bookings = await prisma.booking.createMany({
      data: [
        {
          roomId: room1.id,
          checkIn: new Date("2024-12-20"),
          checkOut: new Date("2024-12-23"),
          guests: 2,
          name: "John Smith",
          email: "john@example.com",
          phone: "+1234567890",
          specialRequests: "Early check-in if possible",
          status: "confirmed",
          bookingComId: "BC123456",
        },
        {
          roomId: room1.id,
          checkIn: new Date("2024-12-25"),
          checkOut: new Date("2024-12-28"),
          guests: 2,
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "+1987654321",
          specialRequests: "Honeymoon suite decoration",
          status: "pending",
          airbnbId: "AB789012",
        },
      ],
    })
    console.log(`✅ ${bookings.count} sample bookings created`)
  }

  // Create Sample Contact Submissions
  const contacts = await prisma.contactSubmission.createMany({
    data: [
      {
        name: "Emma Wilson",
        email: "emma@example.com",
        phone: "+33123456789",
        subject: "Group Booking Inquiry",
        message:
          "We are interested in booking your guesthouse for a group of 8 people for a week in January. Could you provide information about group rates?",
      },
      {
        name: "Marco Rossi",
        email: "marco@example.com",
        phone: "+39987654321",
        subject: "Event Customization",
        message:
          "We would like to organize a private event at your property. Can you provide details about event hosting and catering options?",
      },
    ],
  })
  console.log(`✅ ${contacts.count} sample contact submissions created`)

  console.log("✨ Database seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
