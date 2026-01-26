# PWA Setup Guide - Homeland Union

## ✅ Implemented Features

### 1. **Error Boundaries** ✅
- **Location:** `src/components/ErrorBoundary.jsx`
- **Features:**
  - Catches React errors and displays user-friendly error page
  - Shows error details in development mode
  - Provides "Reload" and "Go Home" buttons
  - Wraps entire app in `main.jsx`

### 2. **Dark/Light Mode Toggle** ✅
- **Location:** `src/contexts/ThemeContext.jsx`
- **Features:**
  - Full dark/light mode support
  - Persists preference in localStorage
  - Respects system preference on first load
  - Toggle button in MainLayout navbar
  - Complete MUI theme customization for both modes

### 3. **Offline Fallback Page** ✅
- **Location:** `src/pages/Offline.jsx`
- **Route:** `/offline`
- **Features:**
  - User-friendly offline message
  - Retry connection button
  - Integrated with service worker

### 4. **PWA Install Prompt** ✅
- **Location:** `src/components/PWAInstallPrompt.jsx`
- **Features:**
  - Automatic install prompt when app is installable
  - Dismissible with 7-day cooldown
  - Detects if already installed
  - Bottom snackbar notification

### 5. **Enhanced PWA Configuration** ✅
- **Location:** `vite.config.js`
- **Features:**
  - Multiple icon sizes (64x64, 192x192, 512x512)
  - Maskable icons for Android
  - Runtime caching for API calls
  - Image caching
  - Offline fallback routing
  - Auto-update service worker

### 6. **Apple PWA Support** ✅
- **Location:** `index.html`
- **Features:**
  - Apple touch icons (multiple sizes)
  - Apple splash screens (iPhone 5-14 Pro Max)
  - Apple-specific meta tags
  - Status bar styling

## 📋 Required Icon Files

You need to create the following icon files in the `public` folder:

### PWA Icons
- `pwa-64x64.png` (64x64 pixels)
- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)

### Apple Touch Icons
- `apple-touch-icon-57x57.png`
- `apple-touch-icon-60x60.png`
- `apple-touch-icon-72x72.png`
- `apple-touch-icon-76x76.png`
- `apple-touch-icon-114x114.png`
- `apple-touch-icon-120x120.png`
- `apple-touch-icon-144x144.png`
- `apple-touch-icon-152x152.png`
- `apple-touch-icon-180x180.png` (most important)

### Apple Splash Screens
- `apple-splash-640x1136.png` (iPhone 5/SE)
- `apple-splash-750x1334.png` (iPhone 6/7/8)
- `apple-splash-1242x2208.png` (iPhone 6+/7+/8+)
- `apple-splash-1125x2436.png` (iPhone X/XS)
- `apple-splash-1170x2532.png` (iPhone 12/13)
- `apple-splash-1284x2778.png` (iPhone 14 Pro Max)

### Favicons
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon.ico`

## 🎨 Icon Design Guidelines

1. **PWA Icons:**
   - Use your app logo/branding
   - Ensure good contrast
   - Test on both light and dark backgrounds
   - Maskable icon should have safe zone (padding)

2. **Apple Touch Icons:**
   - 180x180 is the most important (iOS 7+)
   - Should be square with rounded corners (iOS will add)
   - Use transparent background or solid color
   - Avoid text that's too small

3. **Splash Screens:**
   - Match your app's theme color
   - Can include logo centered
   - Use solid background color
   - Dimensions are exact (no padding needed)

## 🛠️ How to Generate Icons

### Option 1: Online Tools
1. **PWA Asset Generator:** https://www.pwabuilder.com/imageGenerator
2. **RealFaviconGenerator:** https://realfavicongenerator.net/
3. **App Icon Generator:** https://www.appicon.co/

### Option 2: Manual Creation
1. Create a master icon at 1024x1024 pixels
2. Use image editing software to resize:
   - For PWA: 64x64, 192x192, 512x512
   - For Apple: All required sizes
   - For splash screens: Exact dimensions

### Option 3: Using Node.js Tools
```bash
npm install -g pwa-asset-generator
# Then run in your project root
pwa-asset-generator logo.png public --icon-only
```

## 🚀 Testing PWA Features

### 1. Test Install Prompt
1. Build the app: `npm run build`
2. Serve with HTTPS (required for PWA):
   ```bash
   npx serve -s dist
   ```
3. Open in Chrome/Edge
4. Look for install prompt in address bar or bottom snackbar

### 2. Test Offline Mode
1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. Navigate around the app
4. Should see offline fallback page when needed

### 3. Test Service Worker
1. Open DevTools → Application tab
2. Check "Service Workers" section
3. Verify service worker is registered
4. Check "Cache Storage" for cached resources

### 4. Test Dark Mode
1. Click the theme toggle in navbar
2. Should switch between light/dark instantly
3. Refresh page - preference should persist

### 5. Test Error Boundary
1. In development, trigger an error
2. Should see error boundary page instead of white screen
3. Error details shown in dev mode only

## 📱 Mobile Testing

### iOS (Safari)
1. Open app in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Test splash screen and icons

### Android (Chrome)
1. Open app in Chrome
2. Tap menu (3 dots)
3. Tap "Install app" or "Add to Home screen"
4. Test install prompt and icons

## 🔧 Configuration Files

### vite.config.js
- PWA plugin configuration
- Manifest settings
- Service worker settings
- Cache strategies

### index.html
- Apple-specific meta tags
- Icon links
- Splash screen links
- Theme color

## 📝 Notes

1. **HTTPS Required:** PWAs require HTTPS in production (localhost is OK for development)

2. **Service Worker:** Automatically generated by `vite-plugin-pwa` on build

3. **Cache Strategy:**
   - API calls: NetworkFirst (tries network, falls back to cache)
   - Images: CacheFirst (uses cache, updates in background)

4. **Theme Persistence:** Dark/light mode preference saved in localStorage

5. **Install Prompt:** Only shows when:
   - App is installable
   - Not already installed
   - Not dismissed in last 7 days

## 🎯 Next Steps

1. **Create Icon Files:** Generate all required icon sizes
2. **Test on Devices:** Test on real iOS and Android devices
3. **Customize Splash Screens:** Create branded splash screens
4. **Optimize Caching:** Adjust cache strategies as needed
5. **Add More Shortcuts:** Add more app shortcuts in manifest

## ✨ Summary

All PWA features are now implemented! You just need to:
1. Create the icon files (use tools mentioned above)
2. Place them in the `public` folder
3. Build and test

The app is now a fully functional Progressive Web App with:
- ✅ Offline support
- ✅ Install capability
- ✅ Dark/light mode
- ✅ Error handling
- ✅ Mobile optimization
- ✅ Apple PWA support
