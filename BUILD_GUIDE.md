# Mamut CPHS - Build & Deployment Guide

## Overview
Mamut CPHS is a modular web application for managing investigations (Investigaciones). Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Features
✅ Modular architecture with reusable components
✅ "Investigaciones" tab with form inputs (Nombre, Edad, Área, Antigüedad, Fecha, Declaración de Accidente)
✅ Auto-generated unique IDs (format: INV-timestamp-random)
✅ Date picker for Fecha field
✅ CSV export functionality (downloads on save)
✅ LocalStorage persistence
✅ Search modal ("Consultar Folio") with fuzzy search by ID or Nombre
✅ Tab navigation system (extensible for future modules)
✅ PWA configuration for Android deployment
✅ Responsive design with Tailwind CSS

## Architecture

### Modular Structure
```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with PWA configuration
│   └── page.tsx           # Main page with tab system
├── components/            # Reusable components
│   ├── Tabs.tsx          # Tab navigation component
│   ├── InvestigacionesForm.tsx  # Main form component
│   └── SearchModal.tsx   # Search/consultation modal
├── lib/                  # Business logic
│   └── storage.ts       # LocalStorage service with CSV export
└── types/               # TypeScript definitions
    └── investigacion.ts # Type definitions
```

## Building for Production

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Application
```bash
npm run build
```

This creates a static export in the `out/` directory.

### 3. Test the Build Locally
```bash
npx serve out
```

## Converting to Android APK

### Option 1: Using PWA Builder (Recommended)
1. Build your app: `npm run build`
2. Deploy the `out/` folder to a web server (Netlify, Vercel, GitHub Pages, etc.)
3. Visit https://www.pwabuilder.com/
4. Enter your deployed URL
5. Click "Build My PWA" → Select "Android"
6. Download the generated APK

### Option 2: Using Capacitor
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor
npx cap init "Mamut CPHS" "com.mamut.cphs"

# Add Android platform
npx cap add android

# Build and copy assets
npm run build
npx cap copy
npx cap sync

# Open in Android Studio
npx cap open android
```

Then build the APK in Android Studio (Build → Build Bundle(s) / APK(s) → Build APK(s))

### Option 3: Using Bubblewrap (CLI)
```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Initialize
bubblewrap init --manifest https://your-deployed-url.com/manifest.json

# Build APK
bubblewrap build
```

## Testing on Android Device

### Via Browser (No APK needed)
1. Deploy to any hosting service
2. Open Chrome on your Android 12 device
3. Navigate to your URL
4. Tap menu → "Add to Home Screen"
5. The PWA will install as an app

### Via APK
1. Enable "Install from Unknown Sources" on your device
2. Transfer the APK to your phone
3. Open and install
4. Launch from app drawer

## Development

The app uses localStorage for data persistence. Each investigacion is:
- Saved to localStorage
- Exported as CSV file on "Grabar"
- Searchable via "Consultar Folio" modal (fuzzy search)

### Adding New Tabs
Edit `src/app/page.tsx` and add to the tabs array:
```typescript
const tabs = [
  {
    id: 'investigaciones',
    label: 'Investigaciones',
    component: <InvestigacionesForm />
  },
  {
    id: 'your-new-tab',
    label: 'Your Tab Name',
    component: <YourNewComponent />
  }
];
```

### Search Functionality
The search uses `.includes()` for fuzzy matching, searching within strings rather than requiring exact matches. This allows partial name or ID searches.

## Icons
You need to create two PWA icons:
- `/public/icon-192.png` (192x192px)
- `/public/icon-512.png` (512x512px)

See `ICONS_README.md` for generation instructions.

## Tech Stack
- **Framework**: Next.js 15.5.4
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack
- **PWA**: Service Worker + Web Manifest

## Important Notes
- Data is stored in browser localStorage (not server-side)
- CSV files are downloaded to device storage
- The app works offline once installed as PWA
- Compatible with Android 12+
- No backend required - fully static export
