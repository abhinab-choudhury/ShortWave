<p align="center">
  <img src="https://short-wave.vercel.app/shortwave_logo.png" alt="Shortwave Logo" width="100" />
  <h1 align="center">
    Shortwave
  </h1>
</p>


<p align="center">
  ⚡ Lightning-fast URL shortener with real-time analytics and interactive dashboards ⚡
</p>

<p align="center">
  <a href="https://github.com/yourusername/shortwave/actions/workflows/main.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/yourusername/shortwave/main.yml?label=build&style=flat-square&color=brightgreen" alt="build passing" />
  </a>
  <img src="https://img.shields.io/npm/dw/shortwave?style=flat-square&color=brightgreen" alt="downloads/week" />
  <img src="https://img.shields.io/npm/v/shortwave?style=flat-square&color=blue" alt="npm version" />
</p>

**Shortwave** is a modern **URL shortener** with **built-in tracking** and **rich analytics**.  
Designed for simplicity and speed, it allows you to **shorten, manage, and analyze links** effortlessly.

## ✨ Features

- 🔗 **Instant URL Shortening** – Generate short links instantly.  
- 📊 **Advanced Tracking** – Monitor clicks, referrers, devices, and geolocation.  
- 📈 **Interactive Analytics Dashboard** – Responsive charts (mobile/tablet/desktop).  
- 🎨 **Minimal & Intuitive Design** – Clean, distraction-free UI.  
- 📱 **QR Code Integration** – Generate scannable QR codes automatically.  
- ⚡ **High Performance & Scalability** – Optimized backend with caching for speed.  
- 🔒 **Hybrid Auth (Session + JWT)** – Cookies for web, Bearer JWT for native/Capacitor.  
- 🤖 **Cross-Platform** – Web, desktop (PWA) & Android (Capacitor).  

---

## 🚀 Live Demo

Try it here:  
👉 [Shortwave Demo](https://short-wave.vercel.app)


## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind + ShadCN UI, Recharts  
- **Backend**: Node.js + Express 4 + Passport (Google/GitHub) + JWT + express-session + MongoStore  
- **Database**: MongoDB + Mongoose  
- **Cache**: Redis (click analytics buffer + cron flush)  
- **Mobile**: Capacitor 8 (Android, Preferences/Browser/App plugins)  
- **Package Manager**: pnpm 11 (workspaces `apps/*`)

---

## ✅ Prerequisites

- **Node.js** 20+ · **pnpm** 11.5.1 (`npm i -g pnpm`)
- **Docker & Docker Compose** (for MongoDB + Redis)
- For Android builds: **Android Studio** + SDK 34 + JDK 17 + `ANDROID_HOME` set
- Env files: `apps/server/.env` and `apps/client/.env` (see `.env.example`)

---

## 🔧 Development — All Devices

### 1. Install & Env

```bash
pnpm install

# server env
cp apps/server/.env.example apps/server/.env
# client env
cp apps/client/.env.example apps/client/.env
```

**`apps/server/.env`**

```
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:8080
MONGODB_BASE_URI=mongodb://localhost:27017
DATABASE_NAME=mydatabase
REDIS_URL=redis://localhost:6379
SESSION_SECRET=your_session_secret_32+chars
JWT_SECRET=your_jwt_secret_32+chars
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
EMAIL=...
EMAIL_PASSWORD=...
```

**`apps/client/.env`**

```
VITE_SERVER_URL=http://localhost:8080
```

### 2. Databases (Docker)

```bash
docker-compose up -d        # MongoDB + Redis
docker-compose logs -f      # verify
```

### 3. Run Web (Desktop & Mobile Web)

```bash
pnpm run dev                # both client + server concurrently
# or separately
pnpm run dev:client         # Vite http://localhost:5173
pnpm run dev:server         # Express http://localhost:8080
```

Open `http://localhost:5173` → web lands on `/home`, auth via **session cookies** (sameSite none/secure in prod) + **JWT** (`Authorization: Bearer`).

### 4. Run Android (Capacitor)

Capacitor bundles the Vite `dist` into a native WebView. Auth is **JWT-only** (no cookies) — token stored in `Preferences` + `localStorage`, sent as `Bearer`.

```bash
# 1. Build web assets
pnpm --filter client run build

# 2. Sync to Android (copies dist + plugins)
pnpm --filter client run cap:sync
# or pnpm --filter client run mobile:build  # build + sync

# 3. Open in Android Studio
pnpm --filter client run cap:android
# In Android Studio: Run ▶ on emulator / device
```

**Native routing:** `capacitor://localhost/` → `Capacitor.isNativePlatform()` → redirects `/` → `/signin` (not `/home`), so the app always starts at **login/signup**. On native, sign-in uses **email OTP** (`POST /api/v1/auth/otp/request` → 6-digit code → `POST /api/v1/auth/otp/verify` → JWT) so the user never leaves the app. Web keeps magic-link + OAuth. OAuth/magic-link deep links (`capacitor://localhost/...?token=`) are still captured via `App.addListener('appUrlOpen', ...)` and persisted via `@capacitor/preferences`.

**Live reload on device (optional)** in `apps/client/capacitor.config.ts`:

```ts
server: { url: 'http://192.168.1.5:5173', cleartext: true }
```

then `pnpm --filter client run cap:sync` + `npx cap run android`.

### 5. Production Builds

```bash
# Web + API
pnpm run build              # builds client (dist) + server (dist)

# Android release
pnpm --filter client run build
pnpm --filter client exec cap sync android
cd apps/client/android && ./gradlew assembleDebug   # APK: app/build/outputs/apk/debug/app-debug.apk
# Release signed AAB
./gradlew bundleRelease
```

Capacitor app icon & splash now use `public/shortwave_logo.png` (640×640) — auto-generated into `android/app/src/main/res/mipmap-*` and `drawable*/splash.png` via `cap sync`.

---

## 🔐 Auth — Web vs Native

| Platform | Mechanism | Storage | Notes |
|----------|-----------|---------|-------|
| Web | `express-session` + `connect-mongo` (cookie `connect.sid`, 7d) **and** JWT | Cookie (httpOnly) + `localStorage["authToken"]` | CORS `origin: CLIENT_URL`, `credentials:true` |
| Android | **JWT only** (`Bearer 7d`) | `Preferences` + `localStorage` | `withCredentials:false`, header `X-Native-Platform: capacitor`, CORS allows `capacitor://localhost` |

`GET /api/v1/auth/me` accepts either session or `Authorization: Bearer`. **Android sign-in uses email OTP** — `POST /api/v1/auth/otp/request` (emails a 6-digit code, hashed at rest, 10 min expiry, 5 attempts) then `POST /api/v1/auth/otp/verify` returns `{ token, user }` which the app stores and sends as `Bearer`. This replaces OAuth on native (no browser hop, no `capacitor://` redirect registration). Web still uses magic-link `GET /verify?token=` and OAuth callbacks `GET /google/callback`, `GET /github/callback`, which detect `platform=native` / `X-Native-Platform` and redirect to `capacitor://localhost/dashboard?token=...` for deep-link capture; otherwise to `${CLIENT_URL}/dashboard?token=...`.

Logout `POST /auth/logout` destroys session **and** blocks JWT (`blockJWT`).

---

## 📱 Supported Devices

- **Web / Desktop:** Chrome/Firefox/Safari/Edge (responsive `320px → 1920px`, PWA-ready). `pnpm run dev:client` or `pnpm run build` + static host.
- **Android:** Capacitor 8, `androidScheme: https`, minSdk 22, targetSdk 34. Build via Android Studio or `./gradlew`. Icon/splash from web logo.

---

## 🧹 Lint & Format

```bash
pnpm --filter client run lint        # eslint
pnpm --filter server run lint
pnpm --filter client run format      # prettier
```

---

## 🗂️ Project Structure

```
apps/client  # Vite + React + Capacitor (dist → android/app/src/main/assets/public)
apps/server  # Express + Mongo + Redis
docker-compose.yml # MongoDB + Redis
pnpm-workspace.yaml
```

See `docs/system design.md` for deep-dive on shortening, analytics (Redis → cron flush), and hybrid auth flow.
