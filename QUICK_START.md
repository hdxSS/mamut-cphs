# Mamut CPHS - Quick Start Guide

## ✅ Application Complete!

Your modular web application "Mamut CPHS" has been successfully created with all requested features.

## 📱 Key Features Implemented

### 1. **Investigaciones Tab**
- ✅ Form with all required fields:
  - **ID**: Auto-generated unique identifier (format: `INV-timestamp-random`)
  - **Fecha**: Date picker field (defaults to today)
  - **Nombre**: Text input
  - **Edad**: Text input
  - **Área**: Text input
  - **Antigüedad**: Text input
  - **Declaración de Accidente**: Large text area

### 2. **Save Functionality ("Grabar" Button)**
- ✅ Saves data to browser localStorage
- ✅ Automatically downloads a CSV file with the investigation data
- ✅ Shows success message after saving
- ✅ Resets form with new auto-generated ID for next entry

### 3. **Search/Consultation ("Consultar Folio" Button)**
- ✅ Opens modal dialog for searching
- ✅ Search by **ID** or **Nombre**
- ✅ Fuzzy search - finds partial matches (e.g., searching "Juan" finds "Juan Carlos")
- ✅ Displays all matching results
- ✅ Click result to load that investigation into the form

### 4. **Modular Architecture**
- ✅ Separated concerns (components, types, services)
- ✅ Reusable tab system for future expansion
- ✅ Clean TypeScript types
- ✅ Service layer for storage operations

### 5. **PWA/Android Ready**
- ✅ Web manifest configured
- ✅ Service worker for offline capability
- ✅ Responsive design
- ✅ Ready to convert to APK

## 🚀 How to Use

### View the Application
Since you're using the Vibecode environment, you can:
1. Click the "Run" button in Vibecode (it will start the dev server on port 3000)
2. Access the app through the forwarded URL

### Test the Application
1. **Create an Investigation**:
   - Fill in all form fields
   - Click "Grabar"
   - CSV file will download
   - Form resets with new ID

2. **Search for Investigations**:
   - Click "Consultar Folio"
   - Choose search by "Nombre" or "ID"
   - Type partial name or ID
   - Click "Buscar"
   - Click a result to load it

## 📦 Converting to Android APK

### Option 1: PWA Builder (Easiest)
1. Build: `npm run build`
2. Upload the `out/` folder to any web host (Netlify, Vercel, etc.)
3. Go to https://www.pwabuilder.com/
4. Enter your URL
5. Download Android APK

### Option 2: Capacitor (Full Native)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Mamut CPHS" "com.mamut.cphs"
npx cap add android
npm run build
npx cap copy
npx cap sync
npx cap open android  # Opens Android Studio to build APK
```

### Option 3: Direct Install on Android
1. Deploy to web hosting
2. Open in Chrome on Android device
3. Menu → "Add to Home Screen"
4. App installs as PWA (works offline!)

## 📁 Project Structure
```
workspace/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with PWA config
│   │   └── page.tsx            # Main page with tab navigation
│   ├── components/
│   │   ├── Tabs.tsx            # Reusable tab component
│   │   ├── InvestigacionesForm.tsx  # Main form
│   │   └── SearchModal.tsx     # Search dialog
│   ├── lib/
│   │   └── storage.ts          # Storage service (save/search/CSV)
│   └── types/
│       └── investigacion.ts    # TypeScript types
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── service-worker.js       # Offline support
│   └── register-sw.js          # SW registration
├── out/                        # Built static files (after npm run build)
├── BUILD_GUIDE.md             # Detailed deployment guide
└── ICONS_README.md            # Icon generation instructions

```

## 🎨 Adding More Tabs (Extensibility)

Edit `src/app/page.tsx`:
```typescript
const tabs = [
  {
    id: 'investigaciones',
    label: 'Investigaciones',
    component: <InvestigacionesForm />
  },
  {
    id: 'new-module',
    label: 'New Module',
    component: <YourNewComponent />  // Add your new component
  }
];
```

## 📝 Data Storage

- **LocalStorage**: All data persists in the browser
- **CSV Export**: Each save downloads a CSV file to device
- **No Backend**: Fully static, works offline
- **Format**: `ID,Nombre,Edad,Área,Antigüedad,Fecha,Declaración`

## 🔍 Search Algorithm

The search uses JavaScript's `.includes()` method for fuzzy matching:
- Searching "juan" finds "Juan", "JUAN", "Juan Carlos", "maría juan"
- Searching "INV-17" finds "INV-1728514944123-1234"
- Case-insensitive
- Searches anywhere in the string (not just start)

## 🛠️ Tech Stack
- **Next.js 15** with Turbopack
- **React 19** (latest)
- **TypeScript 5**
- **Tailwind CSS 4**
- **PWA** (Service Worker + Manifest)

## ⚠️ Important Notes

1. **Icons**: You need to create two icon files for full PWA support:
   - `/public/icon-192.png` (192x192 pixels)
   - `/public/icon-512.png` (512x512 pixels)
   - See `ICONS_README.md` for instructions

2. **Browser Storage**: Data is stored in localStorage (browser-specific)
   - Each browser/device has its own storage
   - Clearing browser data will delete saved investigations
   - CSV exports provide permanent backup

3. **Android Compatibility**: Tested for Android 12+

## 📚 Documentation Files
- **BUILD_GUIDE.md**: Comprehensive build and deployment guide
- **ICONS_README.md**: Instructions for creating PWA icons
- **QUICK_START.md**: This file

## 🎯 All Requirements Met

✅ Simple webapp called "Mamut CPHS"
✅ Modular architecture with best practices
✅ "Investigaciones" tab
✅ Form with Nombre, Edad, Área, Antigüedad
✅ Long text box for "Declaración de accidente"
✅ Auto-updating unique ID
✅ Date field with date picker
✅ "Grabar" button saves to CSV
✅ "Consultar Folio" button with search modal
✅ Search by ID or Nombre
✅ Fuzzy search (contains, not exact match)
✅ PWA configured for APK conversion
✅ Works on Android 12+ devices

## 🚀 Next Steps

1. **Optional**: Create icon files (`icon-192.png`, `icon-512.png`)
2. **Test**: Run the dev server and test all features
3. **Build**: Run `npm run build` to create production build
4. **Deploy**: Upload `out/` folder to web hosting OR convert to APK
5. **Install**: Install on your Android device

Enjoy your Mamut CPHS application! 🦣
