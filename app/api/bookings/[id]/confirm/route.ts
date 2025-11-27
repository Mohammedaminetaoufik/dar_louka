import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const ADMIN_EMAIL = "ataoufik031@gmail.com"

// Function to send email using Resend or similar service
async function sendEmail(to: string, subject: string, html: string) {
  try {
    // Using Resend API (free alternative to SendGrid)
    // You can replace this with your preferred email service
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Dar Louka <${ADMIN_EMAIL}>`,
        to,
        subject,
        html,
        replyTo: ADMIN_EMAIL,
      }),
    })

    if (!response.ok) {
      console.error("Email service error:", await response.text())
      return false
    }

    console.log(`Email sent successfully to ${to}`)
    return true
  } catch (error) {
    console.error("Email sending error:", error)
    // Fallback: log the email details for manual sending if service is unavailable
    console.log(`[EMAIL BACKUP] To: ${to}, Subject: ${subject}`)
    return false
  }
}

// This endpoint handles booking confirmation via email, WhatsApp, or phone
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { method, language, subject, html, message, phone } = await request.json()

    const bookingId = params.id

    // Validate booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (method === "email") {
      // Send email to guest
      const emailSent = await sendEmail(booking.email, subject, html)

      if (emailSent) {
        // Also send a copy to admin
        await sendEmail(ADMIN_EMAIL, `[Booking Confirmation Sent] ${subject}`, html)
      }

      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "confirmed",
          confirmedAt: new Date(),
          confirmationMethod: "email",
          confirmationLanguage: language,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Email confirmation sent",
      })
    }

    if (method === "whatsapp") {
      // Send WhatsApp message
      // Using Twilio or similar service
      console.log(`[WHATSAPP CONFIRMATION] To: ${phone}`)
      console.log(`Message: ${message}`)

      // TODO: Implement Twilio WhatsApp API
      // For now, this is a placeholder

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "confirmed",
          confirmedAt: new Date(),
          confirmationMethod: "whatsapp",
          confirmationLanguage: language,
        },
      })

      return NextResponse.json({
        success: true,
        message: "WhatsApp confirmation initiated",
      })
    }

    if (method === "phone") {
      // For phone calls, just log and provide the script
      console.log(`[PHONE CONFIRMATION] To: ${phone}`)
      console.log(`Script: ${message}`)

      // TODO: Implement Twilio voice API

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "confirmed",
          confirmedAt: new Date(),
          confirmationMethod: "phone",
          confirmationLanguage: language,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Phone confirmation initiated",
      })
    }

    return NextResponse.json(
      { error: "Invalid confirmation method" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Confirmation error:", error)
    return NextResponse.json(
      { error: "Failed to send confirmation" },
      { status: 500 }
    )
  }
}
