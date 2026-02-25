# Nine Delights

Track your daily implementation of the nine delights: Walking Around, Fellowship, Deliciousness, Transcendence, Goofing, Amelioration, Coitus, Enthrallment, and Wildcard.

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
2. In row 1, add these headers: `date`, `delight`, `description`, `wildcardName`, `created_at`
3. Share the sheet with the `client_email` from your `key.json` file — give it **Editor** access
4. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### 3. Environment Variables

Create a `.env.local` file:

```
GOOGLE_SHEET_ID=your-sheet-id
EDIT_PASSWORD=your-chosen-password
```

For local dev, the app reads `key.json` directly from the project root. For production (Vercel), also set:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Run

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Add all four env vars (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `EDIT_PASSWORD`) in the Vercel project settings
4. Deploy

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons
- **Charts**: Recharts
- **Backend**: Google Sheets API
