# Shortwave — Backend Workflows

This document describes the main backend request and processing workflows. Diagrams use Mermaid.

## Express Request Pipeline
```mermaid
flowchart TD
  REQ[Incoming HTTP request] --> CORS[CORS middleware]
  CORS --> REDIR{Mounted redirect route?}
  REDIR -- "Yes (GET /:shortCode)" --> RH[handleRedirect]
  REDIR -- No --> BODY[express.json / urlencoded]
  BODY --> MORGAN[morgan logger]
  MORGAN --> SESSION[express-session + MongoStore]
  SESSION --> PASSPORT[passport.initialize / session]
  PASSPORT --> ROUTES[API routers]
  ROUTES --> ERR[globalErrorHandler]
```

## Authentication Workflows
```mermaid
flowchart TD
  subgraph OTP [Native OTP flow]
    OR[POST /api/v1/auth/otp/request] --> OU[Find or create user]
    OU --> OS["Store hashed OTP (10 min, 5 attempts)"]
    OS --> OE[Send OTP email]
    OE --> OV[POST /api/v1/auth/otp/verify]
    OV --> ODEL[Delete OTP record]
    ODEL --> OJWT[Return 7d JWT + user]
  end

  subgraph MAGIC [Web magic-link flow]
    MS[POST /api/v1/auth/signin] --> MU[Find or create user]
    MU --> MT[Sign 1h JWT]
    MT --> ME[Send sign-in email]
    ME --> MV[GET /api/v1/auth/verify?token]
    MV --> MSES[req.logIn + blockJWT + 7d JWT]
    MSES --> MREDIR[Redirect with token]
  end

  subgraph OAUTH [OAuth flow]
    OG[GET /api/v1/auth/google or /github] --> OP[passport.authenticate]
    OP --> OCB[OAuth callback]
    OCB --> OREDIR[Redirect with token]
  end
```

## Campaign & Short URL Creation Workflow
```mermaid
flowchart TD
  AUTH[isAuthenticated] --> CC[POST /api/v1/campaign]
  CC --> CV["Zod validation (name/description)"]
  CV --> CS[createCampaign]
  CS --> CM[(Campaign document)]

  AUTH --> CU[POST /api/v1/campaign/:campaignId/url]
  CU --> UV["Zod validation (url, dates)"]
  UV --> HASH["sha256(url+attempt) slice -6"]
  HASH --> COLL{Collision?}
  COLL -- Yes --> HASH
  COLL -- No --> CUC[createCampaignUrl]
  CUC --> UM[(URL document)]
```

## Redirect & Click Buffering Workflow
```mermaid
flowchart TD
  V[Visitor] -->|GET /:shortCode or /:campaign/:shortCode| RH[handleRedirect]
  RH --> GT[getRedirectTarget]
  GT --> ST{Status}
  ST -- not_found --> N404[404 Not Found]
  ST -- inactive/not_started/expired --> G410[410 Gone]
  ST -- ok --> R302[302 redirect]
  R302 --> B[recordClickInBuffer]
  B --> REDIS[(Redis url_stats + device_hit)]
```

## Analytics Aggregation Workflow
```mermaid
flowchart TD
  CLICKS[(Click documents per date)] --> AGG[Aggregate click_cnt by short_url/date]
  AGG --> STATS["Campaign stats (total_links, active_links, CGR)"]
  STATS --> DASH[Dashboard charts]
```

## Scheduled Analytics Sync Workflow
```mermaid
flowchart TD
  SCH[Scheduler] --> AUTH{Authorization: Bearer CRON_SECRET}
  AUTH -- mismatch --> U401[401 Unauthorized]
  AUTH -- ok --> FLUSH[flushBatches]
  FLUSH --> SCAN[SCAN url_stats:* and analytics_pending:*]
  SCAN --> CLAIM[Claim buffer via RENAME]
  CLAIM --> PERSIST[persistBatch]
  PERSIST --> TX[Mongo transaction: Click upsert + AnalyticsSyncRecord]
  TX --> DEL[Delete Redis batch]
  FLUSH --> RESP[200 processed / message]
```

## Error Handling Workflow
```mermaid
flowchart TD
  CTRL[Controller] --> TRY[Try block]
  TRY -- success --> APIR[ApiResponse 2xx]
  TRY -- ZodError --> VE[ApiError 400]
  TRY -- other error --> NE[normalizeError]
  NE --> AE[ApiError 5xx]
  VE --> GEH[globalErrorHandler]
  AE --> GEH
```