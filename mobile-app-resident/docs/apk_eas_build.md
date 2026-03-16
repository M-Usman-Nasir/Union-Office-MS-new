# EAS Android build (APK/AAB)

## Build command

From project root (or from `mobile-app-resident`):

```bash
npm run build:android
```

Or directly with EAS CLI:

```bash
cd mobile-app-resident
eas build --platform android --profile preview
```

The `preview` profile is configured to produce an **APK** (not AAB) for internal distribution.

## Building from GitHub (Expo GitHub App)

The app lives in the **subdirectory** `mobile-app-resident`. When you trigger a build from GitHub, EAS runs from the **repository root**, so it can fail with:

**"Failed to read '/mobile-app-resident/package.json'"**

**Fix:** Set the **Base directory** in Expo so EAS uses the app folder as the project root.

1. Open [Expo Dashboard](https://expo.dev) → your project (**Union Resident** / `homeland-union-office-management`).
2. Go to **GitHub** (project settings).
3. Under **Configure your repository settings**, set **Base directory** to:  
   `mobile-app-resident`
4. Save. Then trigger a build again from the dashboard or from a PR label.

You can also set the base directory when starting a one-off build from the website (“Build from GitHub” → choose branch → set base directory for that build).

## Using the same backend/DB as portals (Render)

The app uses `EXPO_PUBLIC_API_URL` for the backend. For **EAS builds** (e.g. from GitHub), set this to your **Render backend** URL so the built app talks to the same API/DB as the web app.

1. **EAS project secrets** (recommended):  
   [Expo Dashboard](https://expo.dev) → your project → **Secrets**.  
   Add:
   - **Name:** `EXPO_PUBLIC_API_URL`  
   - **Value:** `https://YOUR-BACKEND.onrender.com/api`  
   (Use your real Render backend URL; it must end with `/api`, no trailing slash.)

2. The value is injected at **build time**, so every EAS build (including from GitHub) will use this URL.

3. For **local development**, keep using `.env` in `mobile-app-resident` (e.g. `EXPO_PUBLIC_API_URL=http://localhost:3000/api`). EAS Secrets override only on EAS servers; they do not affect your local `.env`.

## If the build fails at the Prebuild phase

**Symptom:** Build fails with “Unknown error. See logs of the Prebuild build phase”.

**Cause:** Prebuild runs `expo prebuild` and processes your app icon and adaptive icon. If `assets/icon.png` or `assets/adaptive-icon.png` are missing, corrupt, or not valid PNGs, image processing (e.g. jimp) can fail with a CRC or parse error.

**Fix:**

1. **Check icons locally:**
   ```bash
   npx expo prebuild --platform android --clean
   ```
   If this fails, the error message will point to the bad asset.

2. **Use valid PNGs:**
   - Replace `assets/icon.png` and `assets/adaptive-icon.png` with valid PNG files.
   - Recommended size: **1024×1024 px** for both (see [Expo – Splash screen and app icon](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/)).
   - For the adaptive icon, keep the important content inside the center “safe” circle so it isn’t cropped on different devices.

3. **Inspect EAS logs:**  
   Open the build URL from the terminal (e.g. `https://expo.dev/accounts/.../builds/...`) and expand the **Prebuild** phase to see the exact error.