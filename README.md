# Nine Delights

Track your daily implementation of the nine delights: **Frolicking**, **Fellowship**, **Deliciousness**, **Transcendence**, **Goofing**, **Amelioration**, **Decadence**, **Enthrallment**, and **Wildcard**.

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

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons
- **Charts**: Recharts
- **Backend**: Google Sheets API
- **Image Storage**: Vercel Blob
- **Fonts**: Instrument Serif, General Sans (via Fontshare)
