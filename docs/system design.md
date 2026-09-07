# URL Shortener — System Design

### Features
1. **Authentication (Auth):** OAuth (Google, GitHub) + magic-link email. **Hybrid: session (web) + JWT Bearer (native/Capacitor).**
2. **URL Shortening:** Convert long URLs into short 6-char slugs (e.g., `abc123`), fast 302 redirect.
3. **Analytics:** Per-link clicks, geolocation, device/browser/OS, daily counts; responsive Recharts dashboards (mobile/tablet/desktop).
4. **Cross-Platform:** Web/desktop (Vite) + Android (Capacitor 8) from same `dist`.

## Scale Assumptions
100M DAU → ~1B reads/day → ~10k RPS. Target 5B total URLs. ~1 KB/record → 1–5 TB. Optimize for **redirect latency** + **availability**.

## Auth — Hybrid Session + JWT

**Web (browser):** `express-session` + `connect-mongo` (MongoStore, 14d TTL), cookie `connect.sid` (7d, `httpOnly`, `sameSite:none`, `secure` in prod, `trust proxy 1`). CORS `origin: CLIENT_URL`, `credentials:true`. Passport serialize `user._id`, deserialize via `getUserById`.

**Native (Capacitor Android `capacitor://localhost`):** Cookies don't persist in WebView → **JWT Bearer** (`jsonwebtoken`, 7d, `JWT_SECRET`). Client stores in `localStorage["authToken"]` + `@capacitor/preferences` (survives WebView reset), sends `Authorization: Bearer <token>` + `X-Native-Platform: capacitor` on every `axios` request (`withCredentials:false` on native).

**Middleware `isAuthenticated`:** tries `req.isAuthenticated()` (session); falls back to `Authorization: Bearer` → `jwt.verify` → `getUserById` → `req.user`.

**Flows:**
- Magic link: `POST /api/v1/auth/signin` → email `jwt (1h, blockJWT)` → `GET /verify?token=` → `req.logIn` + `blockJWT` + `generateAuthToken (7d)` → redirect `CLIENT_URL/dashboard?token=` or `capacitor://localhost/dashboard?token=` (if `platform=native` / `origin: capacitor://`).
- OAuth: `GET /google`, `GET /github` → `passport.authenticate` → callback `GET /google/callback`, `GET /github/callback` → same redirect logic. Native opens via `@capacitor/browser`, captures deep-link via `App.addListener('appUrlOpen')`.
- Me: `GET /me` (protected) returns `{user, token}` and refreshes JWT.
- Logout: `POST /logout` → `req.session.destroy` + `clearCookie` **and** `blockJWT(Bearer)` for native.

## Backend Routes
- `[POST,GET,PUT,DELETE] /api/v1/auth` — `POST /signin` (email), `GET /verify?token=`, `GET /me` (auth), `POST /logout`, `GET /google`, `GET /google/callback`, `GET /github`, `GET /github/callback`.
- `[POST] /api/v1/url` / `[GET|DELETE] /api/v1/campaign`, `/api/v1/user`, cron `GET /cron/flush`.
- `[GET] /:shorturl` / `/:campaign/:shorturl` — 302 redirect: `res.redirect(originalUrl)`. Use 302 (not 301) so browser doesn't cache and every hit reaches backend for analytics.

## URL Shortening
Base62 (`[0-9A-Za-z]` = 62 chars), 6 chars → 62⁶ ≈ 52B URLs, human-readable. Generation: random/hash (nanoid / MD5/sha256 slice) + collision retry. Index `short_url` for 10k RPS; scale via vertical + Redis cache, consider read replicas/sharding only if needed.

## Data & Caching
NoSQL (MongoDB) for speed. Latency: index `short_url`, front with Redis (higher throughput than read replicas). Don't write analytics synchronously per redirect (hurts read path) → buffer counters in Redis, cron `flushRedishStatsToMongo` every minute bulk-writes to Mongo.

Analytics per date: avoid unbounded `click_logs` subdocuments (poor date filtering). Current: separate `click` docs per `{date, country, device, browser, os, click_cnt}` aggregated by Redis; flush aggregates.

```json
click_logs: [{ "date": "2026-09-07", "count": 42 }]
```

## Build & Run — All Devices (pnpm 11)

### Prerequisites
Node 20+, pnpm 11.5.1, Docker, Android Studio (SDK 34, JDK 17, ANDROID_HOME), env files.

```bash
pnpm install
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
# edit JWT_SECRET, SESSION_SECRET, GOOGLE_*/GITHUB_*, EMAIL, CLIENT_URL, SERVER_URL, MONGODB_*, REDIS_URL, VITE_SERVER_URL
docker-compose up -d  # Mongo + Redis
```

### Web / Desktop
```bash
pnpm run dev              # client http://localhost:5173 + server http://localhost:8080
pnpm --filter client run build && pnpm --filter server run build
```

### Android (Capacitor)
```bash
pnpm --filter client run build        # Vite dist
pnpm --filter client exec cap sync android  # -> android/app/src/main/assets/public
pnpm --filter client run cap:android  # opens Android Studio → Run ▶
# release
cd apps/client/android && ./gradlew assembleDebug  # APK
./gradlew bundleRelease                             # AAB
```
- Config `apps/client/capacitor.config.ts`: `appId com.shortwave.app`, `webDir dist`, `server.androidScheme https`, `allowMixedContent true`, `CapacitorHttp enabled`.
- App icon/splash from `public/shortwave_logo.png` (640×640) → `mipmap-*/ic_launcher*.png` (48/72/96/144/192) + `drawable*/splash.png` (land/port per density).
- Native entry `/` → `Capacitor.isNativePlatform()` → `/signin` (JWT flow), web → `/home`. OAuth native uses `@capacitor/browser` + `App.appUrlOpen` deep-link `capacitor://localhost/dashboard?token=`.
- CORS server allows `capacitor://localhost`, `http://localhost`, `CLIENT_URL`.
