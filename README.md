# Nine Delights

Track your daily implementation of the nine delights: **Walking Around**, **Fellowship**, **Deliciousness**, **Transcendence**, **Goofing**, **Amelioration**, **Decadence**, **Enthrallment**, and **Wildcard**.

Inspired by [@i_zzzzzz on Twitter](https://twitter.com/i_zzzzzz).

## Screenshot

![Nine Delights App](./screenshot.png)

## Features

### Core Functionality
- **Public read-only access** with password-protected editing
- **Inline add/edit/delete** delights with descriptions
- **Image uploads** via Vercel Blob storage
- **Wildcard delight** with custom naming (e.g., "Wildcard: Pottery")
- **Google Sheets backend** for simple data management

### Views
- **Days View**: Horizontal scrollable 14-day strip with snap-to-today
  - 280px cards on desktop, 220px on mobile
  - Add multiple delights per day
  - Click images to expand in modal
- **Month View**: Compact calendar grid with colored dots
  - Click any day to jump to Days view
  - Visual overview of delight distribution
- **Stats Dashboard**: 
  - Frequency charts for each delight type
  - Radar chart showing balance across all delights
  - Streak tracking
  - Time range filters (7/30/90 days, all time)
- **About Page**: Explains the nine delights concept

### UI/UX
- **Custom fonts**: Instrument Serif (display), General Sans (body)
- **Vivid pastel colors** for each delight type
- **Framer Motion animations** with spring easing
- **Responsive design** optimized for mobile and desktop
- **Image modal** with expand icon for full-screen viewing

## Setup

### 1. Google Cloud — Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. **Enable the Google Sheets API**: Go to *APIs & Services → Library*, search "Google Sheets API", click **Enable**
4. **Create a Service Account**: Go to *APIs & Services → Credentials → Create Credentials → Service Account*
   - Give it any name (e.g. "nine-delights")
   - Skip optional permissions, click **Done**
5. **Create a key**: Click into the service account → *Keys → Add Key → Create New Key → JSON*
   - Save the downloaded file as `key.json` in the project root

### 2. Google Sheet

1. Create a new Google Sheet
2. In row 1, add these headers: `date`, `delight`, `description`, `wildcardName`, `imageUrl`, `created_at`
3. Share the sheet with the `client_email` from your `key.json` file — give it **Editor** access
4. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### 3. Vercel Blob Storage (for images)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project → Storage → Create Database → Blob
3. Copy the `BLOB_READ_WRITE_TOKEN` from the `.env.local` tab

### 4. Environment Variables

Create a `.env.local` file:

```
GOOGLE_SHEET_ID=your-sheet-id
EDIT_PASSWORD=your-chosen-password
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

For local dev, the app reads `key.json` directly from the project root. For production (Vercel), also set:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 5. Run

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Create a Blob storage database in your Vercel project
4. Add all environment variables in the Vercel project settings:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`
   - `EDIT_PASSWORD`
   - `BLOB_READ_WRITE_TOKEN` (auto-populated when you create Blob storage)
5. Deploy

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons
- **Charts**: Recharts
- **Backend**: Google Sheets API
- **Image Storage**: Vercel Blob
- **Fonts**: Instrument Serif, General Sans (via Fontshare)
