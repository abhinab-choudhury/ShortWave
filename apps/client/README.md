# Shortwave Client

The web + mobile client for **Shortwave**, a URL shortener with real-time analytics. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS 4**, **ShadCN UI**, and **Recharts**, wrapped with **Capacitor 8** for native Android.

## Prerequisites

- **Node.js** 20+ and **pnpm** 11.5.1
- For Android: **Android Studio**, **JDK 17**, and `ANDROID_HOME` set
- A running **Shortwave API server** (see the root `README.md` — requires MongoDB + Redis via Docker)

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `pnpm run dev` | Start Vite dev server (http://localhost:5173) |
| `build` | `pnpm run build` | Type-check + build web assets to `dist/` |
| `mobile:build` | `pnpm run mobile:build` | Build with `.env.android` + `cap sync` (for Android) |
| `cap:sync` | `pnpm run cap:sync` | Sync web assets + plugins to the native android project |
| `cap:android` | `pnpm run cap:android` | Open the android project in Android Studio |
| `lint` | `pnpm run lint` | Run ESLint |
| `format` | `pnpm run format` | Run Prettier |

## Environment

The only client env var is `VITE_SERVER_URL`, pointing at the Shortwave API server (default port `8080`).

- **Web dev:** `apps/client/.env` → `VITE_SERVER_URL="http://localhost:8080"`
- **Android emulator:** `apps/client/.env.android` → `VITE_SERVER_URL="http://10.0.2.2:8080"` (`10.0.2.2` is the emulator's alias for the host's loopback)
- **Physical device:** replace `10.0.2.2` in `.env.android` with your machine's LAN IP (e.g. `http://192.168.1.20:8080`) and allow inbound TCP 8080 in your firewall

See `.env.example` for the full explanations.

## Web Development

```bash
pnpm install
cp .env.example .env          # or set VITE_SERVER_URL manually
pnpm run dev                  # http://localhost:5173
```

## Android Setup & Build (Capacitor)

Capacitor bundles the Vite build output into a native WebView. On Android the app authenticates with **JWT only** (no session cookies), and sign-in uses **email OTP**.

### 1. Generate the Android project (first time only)

```bash
npx cap add android
```

This creates the `android/` folder (native Gradle project). It is normally committed, so this step is only needed when starting from a fresh checkout without it.

### 2. Build the web assets

```bash
pnpm run mobile:build
```

This runs `tsc -b && vite build --mode android && cap sync`:
- type-checks and builds the web app as `dist/` using `.env.android`
- `cap sync` copies `dist/` + plugins into `android/app/src/main/assets/public` and updates native plugin references
- If you only changed web assets and already have the native project set up, `pnpm run cap:sync` is enough

### 3. Open and run in Android Studio

```bash
pnpm run cap:android
```

In Android Studio, wait for Gradle sync to finish, then click **Run ▶** on an emulator or connected device (USB debugging enabled). The app starts at `capacitor://localhost/` and redirects to **sign in**.

> **Live reload (optional):** in `capacitor.config.ts` uncomment `server.url` with your machine's LAN IP (e.g. `http://192.168.1.5:5173`), then run `pnpm run cap:sync` and launch. The WebView loads from the Vite dev server for instant refresh.

### 4. Build the release APK / AAB (CLI)

```bash
pnpm run mobile:build
cd android
./gradlew assembleDebug         # APK → android/app/build/outputs/apk/debug/app-debug.apk
./gradlew bundleRelease         # Signed AAB → android/app/build/outputs/bundle/release/app-release.aab
```

Notes:
- **minSdk** 24 · **compileSdk/targetSdk** 36 (see `android/variables.gradle`)
- App ID / name come from `capacitor.config.ts` (`com.shortwave.app` / `Shortwave`)
- App icon & splash are generated from `public/shortwave_logo.png` during `cap sync`

## Project Structure

```
apps/client
├── android/            # Native Capacitor Android project (Gradle)
├── public/             # Static assets (icon/splash, favicon)
├── src/
│   ├── components/     # Reusable UI (ShadCN + custom)
│   ├── pages/          # Home, Dashboard, Analytics, Settings, Signin, ...
│   ├── hooks/          # Shared React hooks
│   ├── lib/            # Utilities (axios/fetcher, helpers)
│   ├── providers/      # React context/query providers
│   ├── App.tsx         # Routing
│   └── main.tsx        # Entry
├── capacitor.config.ts # Capacitor config (appId, webDir, plugins)
├── .env.example        # Web env template
└── .env.android        # Android build env (emulator/device API URL)
```