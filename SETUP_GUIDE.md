# DAR LOUKA Website - Setup Guide

## Quick Start with Sample Data

Follow these steps to get the website running with example data:

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Setup Database

#### Option A: Using PostgreSQL (Recommended)
\`\`\`bash
# Create a PostgreSQL database
createdb dar_louka

# Update .env.local with your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/dar_louka"
\`\`\`

#### Option B: Using SQLite (Quick Testing)
\`\`\`bash
# Update .env.local
DATABASE_URL="file:./prisma/dev.db"
\`\`\`

### 3. Run Database Migrations
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

### 4. Seed Database with Example Data
\`\`\`bash
npm run seed
\`\`\`

This will populate your database with:
- **4 Sample Rooms** with descriptions, prices, and amenities
- **6 Sample Events** with dates, locations, and prices
- **9 Gallery Images** organized by category
- **2 Sample Bookings** with different statuses
- **2 Contact Submissions** for reference
- **Admin User** (email: admin@darlouka.com, password: admin123)

### 5. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the website with sample data.

## Admin Dashboard Access

1. Go to `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@darlouka.com`
   - Password: `admin123`
3. Manage rooms, events, gallery, and bookings from the dashboard

## Environment Variables

Create a `.env.local` file with:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dar_louka"

# Admin
ADMIN_SECRET="your-secret-key-here"

# Booking Platforms (Optional)
BOOKING_COM_API_KEY="your-booking-com-key"
BOOKING_COM_PROPERTY_ID="your-property-id"
AIRBNB_API_KEY="your-airbnb-key"
AIRBNB_LISTING_ID="your-listing-id"
TRIPADVISOR_API_KEY="your-tripadvisor-key"
TRIPADVISOR_LOCATION_ID="your-location-id"
\`\`\`

## Database Schema

The database includes the following models:

- **Room**: Guesthouse rooms with amenities and pricing
- **Event**: Activities and experiences available
- **GalleryImage**: Photo gallery organized by category
- **Booking**: Guest bookings with external platform tracking
- **ContactSubmission**: Contact form submissions
- **AdminUser**: Admin accounts for dashboard access

## Useful Commands

\`\`\`bash
# View database in Prisma Studio
npm run prisma:studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
\`\`\`

## Features Included

✅ Multilingual support (English, French, Arabic with RTL)
✅ SEO optimization with sitemap and structured data
✅ Image carousel with auto-scrolling
✅ Admin dashboard with authentication
✅ Booking system with external platform integration
✅ Contact form and gallery
✅ Responsive design with Moroccan aesthetic
✅ Framer Motion animations

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Verify database exists

### Seed Script Fails
- Run `npx prisma migrate dev` first
- Check that bcryptjs is installed: `npm install bcryptjs`
- Ensure ts-node is installed: `npm install -D ts-node`

### Admin Login Not Working
- Clear browser cookies
- Check admin user exists: `npx prisma studio`
- Verify password is correct (default: admin123)

## Next Steps

1. Replace placeholder images with real photos
2. Update room descriptions and pricing
3. Add your booking platform API credentials
4. Customize events and activities
5. Deploy to Vercel or your hosting provider
