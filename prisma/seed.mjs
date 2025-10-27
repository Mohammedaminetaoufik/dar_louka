import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

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

  // Create Admin User
  const adminUser = await prisma.adminUser.create({
    data: {
      email: "admin@darlouka.com",
      password: "admin123",
      name: "Admin",
    },
  })
  console.log("✅ Admin user created:", adminUser.email)

  // Create Rooms
  const rooms = await prisma.room.createMany({
    data: [
      {
        name: "Deluxe Room",
        description:
          "Experience luxury in our Deluxe Room, featuring traditional Moroccan décor with modern amenities. This spacious room overlooks the Atlas Mountains and includes a private balcony with stunning views. Perfect for couples seeking an intimate getaway.",
        price: 150,
        capacity: 2,
        amenities: [
          "King Bed",
          "Private Balcony",
          "Mountain View",
          "Air Conditioning",
          "Free WiFi",
          "Marble Bathroom",
          "Heated Shower",
        ],
        image: "/moroccan-deluxe-room.jpg",
        images: ["/moroccan-deluxe-room-1.jpg", "/moroccan-deluxe-room-2.jpg", "/moroccan-deluxe-room-3.jpg"],
      },
      {
        name: "Garden Room",
        description:
          "Nestled in our lush gardens, the Garden Room offers a serene retreat surrounded by olive trees and traditional Moroccan plants. This charming room features authentic zellige tilework and direct access to the garden courtyard.",
        price: 120,
        capacity: 2,
        amenities: [
          "Queen Bed",
          "Garden Access",
          "Courtyard View",
          "Air Conditioning",
          "Free WiFi",
          "Ensuite Bathroom",
          "Outdoor Shower",
        ],
        image: "/moroccan-garden-room.jpg",
        images: ["/moroccan-garden-room-1.jpg", "/moroccan-garden-room-2.jpg", "/moroccan-garden-room-3.jpg"],
      },
      {
        name: "Family Suite",
        description:
          "Our spacious Family Suite is ideal for families or groups. With two bedrooms and a shared living area, it provides comfort and flexibility. The suite features traditional Moroccan architecture with all modern conveniences.",
        price: 200,
        capacity: 4,
        amenities: [
          "2 Bedrooms",
          "Living Area",
          "Mountain View",
          "Air Conditioning",
          "Free WiFi",
          "2 Bathrooms",
          "Kitchen Access",
        ],
        image: "/moroccan-family-suite.jpg",
        images: ["/moroccan-family-suite-1.jpg", "/moroccan-family-suite-2.jpg", "/moroccan-family-suite-3.jpg"],
      },
      {
        name: "Riad Room",
        description:
          "Traditional Riad Room with authentic Moroccan design. This intimate room features a private courtyard entrance, traditional zellige tiles, and carved cedar details. Experience authentic Moroccan hospitality.",
        price: 100,
        capacity: 2,
        amenities: [
          "Double Bed",
          "Courtyard Entrance",
          "Traditional Design",
          "Air Conditioning",
          "Free WiFi",
          "Bathroom",
          "Terrace Access",
        ],
        image: "/moroccan-riad-room.jpg",
        images: ["/moroccan-riad-room-1.jpg", "/moroccan-riad-room-2.jpg", "/placeholder.svg?height=400&width=600"],
      },
    ],
  })
  console.log(`✅ ${rooms.count} rooms created`)

  // Create Events
  const events = await prisma.event.createMany({
    data: [
      {
        title: "Atlas Mountains Hiking",
        description:
          "Join us for an unforgettable hiking adventure in the Atlas Mountains. Our experienced guides will lead you through scenic trails with breathtaking views of the surrounding valleys and Berber villages. Perfect for nature lovers and adventure seekers.",
        date: new Date("2024-12-15"),
        time: "08:00 AM",
        location: "Atlas Mountains",
        category: "Adventure",
        image: "/placeholder.svg?height=400&width=600",
        price: 45,
      },
      {
        title: "Traditional Moroccan Cooking Class",
        description:
          "Learn to prepare authentic Moroccan dishes from our experienced chef. This hands-on cooking class covers traditional recipes, spice blending, and cooking techniques passed down through generations. Includes a delicious meal at the end.",
        date: new Date("2024-12-16"),
        time: "10:00 AM",
        location: "DAR LOUKA Kitchen",
        category: "Cultural",
        image: "/placeholder.svg?height=400&width=600",
        price: 55,
      },
      {
        title: "Sunset Camel Trekking",
        description:
          "Experience the magic of the Moroccan landscape on a camel trek at sunset. Ride through the foothills of the Atlas Mountains as the sun paints the sky in golden hues. A truly memorable experience.",
        date: new Date("2024-12-17"),
        time: "04:00 PM",
        location: "Tahanaout Valley",
        category: "Adventure",
        image: "/placeholder.svg?height=400&width=600",
        price: 50,
      },
      {
        title: "Berber Village Tour",
        description:
          "Visit authentic Berber villages and experience traditional Moroccan culture. Meet local families, learn about their customs, and enjoy traditional tea and hospitality. A cultural immersion experience.",
        date: new Date("2024-12-18"),
        time: "09:00 AM",
        location: "Berber Villages",
        category: "Cultural",
        image: "/placeholder.svg?height=400&width=600",
        price: 40,
      },
      {
        title: "Marrakech Medina Exploration",
        description:
          "Explore the vibrant Marrakech Medina with its bustling souks, historic palaces, and stunning architecture. Our knowledgeable guide will take you through the winding streets and share fascinating stories about this ancient city.",
        date: new Date("2024-12-19"),
        time: "02:00 PM",
        location: "Marrakech Medina",
        category: "Cultural",
        image: "/placeholder.svg?height=400&width=600",
        price: 35,
      },
      {
        title: "Ourika Valley Waterfall Trek",
        description:
          "Hike to the beautiful Ourika Valley waterfalls surrounded by lush greenery and mountain streams. This moderate trek offers refreshing swimming opportunities and stunning natural scenery.",
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
        title: "Moroccan Courtyard",
        description: "Beautiful traditional Moroccan courtyard with zellige tiles and fountain",
        image: "/placeholder.svg?height=400&width=600",
        category: "Architecture",
      },
      {
        title: "Atlas Mountains View",
        description: "Stunning panoramic view of the Atlas Mountains from our terrace",
        image: "/placeholder.svg?height=400&width=600",
        category: "Landscape",
      },
      {
        title: "Traditional Riad",
        description: "Authentic Moroccan riad with traditional design elements",
        image: "/placeholder.svg?height=400&width=600",
        category: "Architecture",
      },
      {
        title: "Garden Oasis",
        description: "Lush garden with olive trees and traditional Moroccan plants",
        image: "/placeholder.svg?height=400&width=600",
        category: "Garden",
      },
      {
        title: "Sunset Over Tahanaout",
        description: "Golden sunset over the Tahanaout valley",
        image: "/placeholder.svg?height=400&width=600",
        category: "Landscape",
      },
      {
        title: "Berber Hospitality",
        description: "Traditional Moroccan tea service with local hosts",
        image: "/placeholder.svg?height=400&width=600",
        category: "Culture",
      },
      {
        title: "Bedroom Comfort",
        description: "Luxurious bedroom with traditional Moroccan décor",
        image: "/placeholder.svg?height=400&width=600",
        category: "Rooms",
      },
      {
        title: "Dining Experience",
        description: "Traditional Moroccan dining setup with authentic cuisine",
        image: "/placeholder.svg?height=400&width=600",
        category: "Dining",
      },
      {
        title: "Terrace Relaxation",
        description: "Peaceful terrace overlooking the mountains",
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
