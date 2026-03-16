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