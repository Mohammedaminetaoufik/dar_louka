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
        titleEn: "Atlas Mountains Hiking",
        titleFr: "Randonnée dans les Montagnes de l'Atlas",
        descriptionEn:
          "Join us for an unforgettable hiking adventure in the Atlas Mountains. Our experienced guides will lead you through scenic trails with breathtaking views of the surrounding valleys and Berber villages. Perfect for nature lovers and adventure seekers.",
        descriptionFr:
          "Rejoignez-nous pour une aventure de randonnée inoubliable dans les Montagnes de l'Atlas. Nos guides expérimentés vous feront découvrir des sentiers pittoresques avec des vues à couper le souffle sur les vallées environnantes et les villages berbères. Parfait pour les amoureux de la nature et les amateurs d'aventure.",
        date: new Date("2024-12-15"),
        time: "08:00 AM",
        location: "Atlas Mountains",
        category: "Adventure",
        image: "/placeholder.svg?height=400&width=600",
        price: 45,
      },
      {
        titleEn: "Traditional Moroccan Cooking Class",
        titleFr: "Cours de Cuisine Marocaine Traditionnelle",
        descriptionEn:
          "Learn to prepare authentic Moroccan dishes from our experienced chef. This hands-on cooking class covers traditional recipes, spice blending, and cooking techniques passed down through generations. Includes a delicious meal at the end.",
        descriptionFr:
          "Apprenez à préparer des plats marocains authentiques avec notre chef expérimenté. Ce cours de cuisine pratique couvre les recettes traditionnelles, le mélange d'épices et les techniques culinaires transmises de génération en génération. Comprend un délicieux repas à la fin.",
        date: new Date("2024-12-16"),
        time: "10:00 AM",
        location: "DAR LOUKA Kitchen",
        category: "Cultural",
        image: "/placeholder.svg?height=400&width=600",
        price: 55,
      },
      {
        titleEn: "Sunset Camel Trekking",
        titleFr: "Balade en Chameau au Coucher du Soleil",
        descriptionEn:
          "Experience the magic of the Moroccan landscape on a camel trek at sunset. Ride through the foothills of the Atlas Mountains as the sun paints the sky in golden hues. A truly memorable experience.",
        descriptionFr:
          "Découvrez la magie du paysage marocain lors d'une randonnée en chameau au coucher du soleil. Chevauchez les contreforts des Montagnes de l'Atlas alors que le soleil peint le ciel de teintes dorées. Une expérience vraiment mémorable.",
        date: new Date("2024-12-17"),
        time: "04:00 PM",
        location: "Tahanaout Valley",
        category: "Adventure",
        image: "/placeholder.svg?height=400&width=600",
        price: 50,
      },
      {
        titleEn: "Berber Village Tour",
        titleFr: "Visite de Villages Berbères",
        descriptionEn:
          "Visit authentic Berber villages and experience traditional Moroccan culture. Meet local families, learn about their customs, and enjoy traditional tea and hospitality. A cultural immersion experience.",
        descriptionFr:
          "Visitez des villages berbères authentiques et découvrez la culture marocaine traditionnelle. Rencontrez les familles locales, apprenez leurs coutumes et profitez du thé traditionnel et de l'hospitalité. Une expérience d'immersion culturelle.",
        date: new Date("2024-12-18"),
        time: "09:00 AM",
        location: "Berber Villages",
        category: "Cultural",
        image: "/placeholder.svg?height=400&width=600",
        price: 40,
      },
      {
        titleEn: "Marrakech Medina Exploration",
        titleFr: "Exploration de la Médina de Marrakech",
        descriptionEn:
          "Explore the vibrant Marrakech Medina with its bustling souks, historic palaces, and stunning architecture. Our knowledgeable guide will take you through the winding streets and share fascinating stories about this ancient city.",
        descriptionFr:
          "Explorez la vibrante Médina de Marrakech avec ses souks animés, ses palais historiques et son architecture époustouflante. Notre guide expérimenté vous emmènera dans les ruelles sinueuses et partagera des histoires fascinantes sur cette ville ancienne.",
        date: new Date("2024-12-19"),
        time: "02:00 PM",
        location: "Marrakech Medina",
        category: "Cultural",
        image: "/placeholder.svg?height=400&width=600",
        price: 35,
      },
      {
        titleEn: "Ourika Valley Waterfall Trek",
        titleFr: "Randonnée aux Cascades de la Vallée d'Ourika",
        descriptionEn:
          "Hike to the beautiful Ourika Valley waterfalls surrounded by lush greenery and mountain streams. This moderate trek offers refreshing swimming opportunities and stunning natural scenery.",
        descriptionFr:
          "Randonnez jusqu'aux belles cascades de la Vallée d'Ourika entourées de verdure luxuriante et de ruisseaux de montagne. Cette randonnée modérée offre des opportunités de baignade rafraîchissantes et des paysages naturels époustouflants.",
        date: new Date("2024-12-20"),
        time: "08:30 AM",
        location: "Ourika Valley",
        category: "Adventure",
        image: "/placeholder.svg?height=400&width=600",
        price: 48,
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
