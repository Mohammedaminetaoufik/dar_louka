const ADMIN_EMAIL = "ataoufik031@gmail.com"

// Send email using Resend API (free tier available)
// Alternative: Use your preferred email service (SendGrid, Mailgun, etc.)
export async function sendConfirmationEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    // Using Resend API - you can get free tier at resend.com
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
    // Fallback: log for manual review
    console.log(`[EMAIL BACKUP LOG] To: ${to}, Subject: ${subject}`)
    return false
  }
}

export { ADMIN_EMAIL }
