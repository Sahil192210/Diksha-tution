# How to Install & Convert into an Android App (.apk / PWA)

Your Tuition Record app is now fully configured as a **Mobile Progressive Web App (PWA)** and ready to be compiled into an **Android APK**.

---

## Method 1: Instant Install on Android Phone (No Coding / 1-Minute PWA)

1. Run the app on your computer:
   ```bash
   npm run dev
   ```
2. Find your computer's local IP address (in PowerShell run `ipconfig`, look for IPv4 like `192.168.1.X`).
3. On your Android phone (connected to same Wi-Fi), open Chrome and enter:
   `http://<your-ip>:3000`
4. Tap the **Three Dots (⋮) Menu** in Chrome.
5. Tap **"Install app"** or **"Add to Home Screen"**.
6. The app will install directly with an app icon on your phone's home screen and open full-screen just like an Android app from Google Play Store!

---

## Method 2: Generate Real Android .APK file using Capacitor

If you want an actual `.apk` file to share or upload to Google Play Store:

### Step 1: Install Capacitor in this folder
Run in PowerShell:
```powershell
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Diksha Tuition" "com.dikshatuition.app" --web-dir .
```

### Step 2: Add Android Platform
```powershell
npx cap add android
```

### Step 3: Open in Android Studio & Build APK
```powershell
npx cap open android
```
In Android Studio:
1. Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Transfer the `.apk` file to any Android phone and install!

---

## Method 3: Use PWABuilder (Online 1-Click APK Generator)
If you deploy your app to free hosting (like Netlify, Vercel, or GitHub Pages):
1. Go to **[https://www.pwabuilder.com](https://www.pwabuilder.com)**.
2. Enter your app's URL.
3. Click **"Package for Android"** > **Download APK**.
