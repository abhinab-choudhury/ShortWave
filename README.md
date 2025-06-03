# ShortWave
This Project is to be made is pure react and must input include dashboard for interacting and managing the number of click for the url and 
and the QR generated for the shortener link and QR Code
this project will also be main  and use prisma for database scheme

Feature Idea: Let the user create a Page that will let them create a link page which will contain all the necessary links and help them to tract the clicks 
and know now many users clicked those links

## UI-Insperation and color-theme for dashboard and features to implement
https://www.styleglide.ai/themes?view=mainline - Citrus Theme
https://www.styleglide.ai/themes?view=dashboard-v4 - Citrus Theme
https://shadcnblocks-admin.vercel.app/

## This will be a Project focusing Both Freelancing and Portfolio

## Decision:

- Auth:  Auth with Passport.js - [ Google & Apple and Facebook Auth] 
    -  # Feature:
        - Light + Dark  Mode [ As Beautifull UI as Possible - Proper SAAS Landing Page ]
        - Use Cookies Pop-up
        - Messaging with Firebase Messages
- Database: MongoDB
- Payment Gateway with Strip

## Higlights:

- Skill which i have to show case is: Dashboard Design Skill
- OAuth Authentication Skill
- Beautifull UI with ShadCN + Acertinity UI + Tailwind CSS
- Add AI feature for Extra Attention for the Clients in Upwork and Other Freelancing Sight
- For Interview Prepare a System Articture Explaination for this Project
    This will showcase my skill in understanding for Skilling Product
    and System Design

    Deadline: 23-11-24 to 30-11-24 
    #### 7 Days to TOO much time for project like this do as quickly as Possible remember that Guy who got his freelance Gig in with in 7-days of Starting his Project


## Analytics:

### **1. Analytics Section for Links**
- **Total Links**: Already present, keep it.
- **Total Clicks**: Already present, keep it.
- **Total Active Links**: Already present, keep it.
- **Top Performing Link**:
  - e.g., "Top Link: `/about-us` (45 clicks)"
- **Click-through Rate (CTR)**:
  - Percentage of clicks relative to impressions for your links.
  - e.g., "Average CTR: 22%"


### **2. Device Usage Breakdown**
Keep the breakdown but expand:
- **New Suggestions**:
  - **Tablet**: Include tablet data if available.
  - **Others**: Include "Smart TVs" or "Wearables" if applicable.


### **3. Geographic Data**
If relevant to your app, add a geographical breakdown:
- **Top Countries**:
  - e.g., "USA: 40%, UK: 25%, India: 20%"
- **Top Cities**:
  - e.g., "New York: 15 clicks, London: 12 clicks."

### **4. User Engagement Stats**
Focus on engagement data:
- **Most Active Time**:
  - e.g., "Peak Engagement Time: 7 PM - 9 PM"
- **Returning Visitors**:
  - e.g., "Returning Visitors: 35%"
- **New Users**:
  - e.g., "New Users: 65%"

### **5. Actionable Insights**
Display data that encourages user action:
- **Broken Links**:
  - e.g., "Broken Links: 2 (Fix Now)"
- **Inactive Links**:
  - e.g., "Inactive Links: 5 (Revisit)"


# UI-Components: 

- [Month wise Grpah](https://www.creative-tim.com/twcomponents/component/free-tailwind-css-graph-component)
- [Pricing Plan](https://www.creative-tim.com/twcomponents/component/popular-pricing-section)
- [FAQs](https://www.creative-tim.com/twcomponents/component/tailwind-css-faq-page)
- [Cookie Banner](https://www.creative-tim.com/twcomponents/component/cookie-consent-notification-bar)
- [capsule](https://www.creative-tim.com/twcomponents/component/tailwind-css-chips-dismissible-by-material-tailwind)
- [Create Link Form with popovers the screen](https://www.creative-tim.com/twcomponents/component/shadcn-ui-settings-card-component-horizon-ai-boilerplate)


That's a really cool project idea, Mari! 🎯 If you're building **Shortwave** as a URL shortener with **public API access** via **API keys**, you can totally structure your backend to handle:

1. **Your own app’s URL shortening functionality** (for internal/frontend use)
2. **An external public-facing API** (for devs who request an API key)

Let’s break it down into manageable pieces:

---

### 🔧 Your Backend Architecture

You’ll need:
- **A User Auth system** (optional if only API users are external)
- **An API Key model**
- **Rate limiting** (to avoid abuse)
- **Scoped access** (if needed for tiers or permissions)
- Routes for:
  - Creating short links
  - Getting analytics (optional)
  - Managing user-created URLs

---

### 📁 Suggested Folder Structure (Node.js + Express Example)

```bash
shortwave-backend/
├── routes/
│   ├── internalRoutes.js  # for your frontend
│   └── apiRoutes.js       # for external users via API key
├── middleware/
│   ├── verifyApiKey.js    # for API key validation
│   └── rateLimiter.js
├── models/
│   ├── Url.js
│   └── ApiKey.js
├── controllers/
├── utils/
├── server.js
```

---

### 🔐 API Key System

**1. Create API Key model**

```js
// models/ApiKey.js
const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  key: String,
  owner: String, // email or userId
  createdAt: { type: Date, default: Date.now },
  usageCount: { type: Number, default: 0 },
  lastUsed: Date
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
```

**2. Middleware to verify key**

```js
// middleware/verifyApiKey.js
const ApiKey = require('../models/ApiKey');

const verifyApiKey = async (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key) return res.status(401).json({ error: 'API key required' });

  const apiKey = await ApiKey.findOne({ key });
  if (!apiKey) return res.status(403).json({ error: 'Invalid API key' });

  // optional: track usage
  apiKey.usageCount += 1;
  apiKey.lastUsed = new Date();
  await apiKey.save();

  req.apiKey = apiKey;
  next();
};

module.exports = verifyApiKey;
```

---

### 🌐 External API Route Example

```js
// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const verifyApiKey = require('../middleware/verifyApiKey');
const { createShortUrl } = require('../controllers/urlController');

router.post('/shorten', verifyApiKey, createShortUrl);

module.exports = router;
```

---

### 🖥 Internal Route Example (for your frontend)

```js
// routes/internalRoutes.js
const express = require('express');
const router = express.Router();
const { createShortUrl, getUserUrls } = require('../controllers/urlController');

// no API key needed here
router.post('/shorten', createShortUrl);
router.get('/my-urls', getUserUrls);

module.exports = router;
```

---

### 🧩 Integrate Both into `server.js`

```js
const express = require('express');
const app = express();
const internalRoutes = require('./routes/internalRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use(express.json());

app.use('/api/v1', apiRoutes);        // Public API access with API key
app.use('/app', internalRoutes);      // Internal use for your own frontend

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
```

---

### 🔐 Optional Add-ons

- **Dashboard to generate/manage API keys**
- **Rate limiting per key (e.g., 100 reqs/hour)** using packages like `express-rate-limit`
- **Email verification** before key issuing
- **Expiration on keys**
- **Analytics endpoint** per key or user

---

### ⚙️ Tech Stack Suggestion
You can build this using:
- **Node.js + Express** (what I used above)
- **MongoDB** with **Mongoose**
- Auth with **JWT** (optional if you allow anonymous public access)
- Host on **Render**, **Vercel functions**, or **Railway**

---

Would you like a ready-to-run boilerplate for this or maybe a Postman collection for testing it? Or are you building it with a specific backend tech (like Django, Spring Boot, etc.)?


Sure thing, Mari! 🙌 Turning **Shortwave** into a professional-grade project (especially if you're aiming for open-source + API as a service) means focusing not just on code, but on *developer experience*, *reliability*, *security*, and *presentation*.

Here’s a **step-by-step guideline** to make **Shortwave** stand out like a real production-level product:

---

## 🚀 1. **Plan the Core Features**

### ✅ Minimum Viable Product (MVP)
- [ ] Create Short URL (`/shorten`)
- [ ] Redirect using short URL (`/:slug`)
- [ ] View URL stats (clicks, country, date)
- [ ] Generate and manage API Keys
- [ ] Protect API routes with API key auth
- [ ] Rate limiting

### 🌟 Optional Add-ons
- [ ] Custom aliases (`shortwave.to/mari`)
- [ ] Expiration dates for links
- [ ] Password-protected links
- [ ] Admin dashboard (to manage links & keys)
- [ ] Public analytics

---

## 🛠 2. **Backend Architecture**

Use **Modular Clean Code** principles:

```
/controllers
/models
/routes
/middleware
/utils
```

### Suggested Stack:
- Node.js + Express (or Fastify for speed)
- MongoDB (with Mongoose)
- Redis (for caching + rate limits)
- JWT (if adding user login)
- Express-rate-limit (or Redis-backed limiter)
- dotenv, Helmet, CORS

---

## 🧪 3. **Testing & Validation**

- [ ] Unit tests (e.g., Jest)
- [ ] Postman collection (for API docs + testing)
- [ ] Input validation using `zod` or `joi`
- [ ] Use tools like `express-validator` to sanitize input
- [ ] Test edge cases (e.g., invalid URLs, expired slugs)

---

## 🔐 4. **Security Must-Haves**

- [ ] Validate + sanitize every input (prevent injection)
- [ ] Use `helmet` to set secure headers
- [ ] API rate limiting (prevent abuse)
- [ ] Add HTTPS support
- [ ] Rotate or revoke API keys
- [ ] Protect from brute-force attempts (e.g., with express-brute or rate-limit)

---

## 📦 5. **API as a Service**

- [ ] Create `/api` namespace
- [ ] Add middleware to check API keys
- [ ] Create a Developer Portal or `/docs` with Swagger / Redoc
- [ ] Allow rate-limited access
- [ ] Allow API key regeneration
- [ ] Track usage stats per key

---

## 🖥 6. **Frontend (Optional)**

- [ ] Dashboard (React or Next.js)
  - Create short links
  - View analytics
  - Manage API keys
- [ ] TailwindCSS or Shadcn UI
- [ ] Add light animations (Framer Motion, GSAP)

---

## 📄 7. **Professional README.md**

Include:
- ✨ What is Shortwave?
- 💻 How to use (with API example)
- 🔐 API key instructions
- 📦 How to self-host
- 🛠 Tech stack
- 🙋‍♀️ Contributing guidelines
- 📈 Roadmap
- 📜 License

---

## 📚 8. **API Documentation**

Use:
- [Swagger](https://swagger.io/) or [Redoc](https://github.com/Redocly/redoc)
- Include example requests and responses
- Make it available at `/api/docs` or `/docs`

---

## 📊 9. **Analytics & Monitoring**

- [ ] Track API usage by key (store count, timestamp)
- [ ] Track URL clicks (per link)
- [ ] Use tools like:
  - Sentry (error tracking)
  - LogRocket or self-logging
  - Prometheus + Grafana (if scaling)

---

## ☁️ 10. **Deployment**

Choose stack based on complexity:

| Component        | Tool                 |
|------------------|----------------------|
| Backend API      | Railway / Render / Vercel Functions |
| Database         | MongoDB Atlas        |
| Frontend         | Vercel / Netlify     |
| File/Link preview | Redis / Local caching |
| Domain           | Custom (shortwave.to) or Vercel subdomain |

---

## 🌍 11. **Open Source Presentation**

- Use a clean GitHub repo:
  - `main` branch only
  - descriptive commit messages
  - GitHub Actions CI
- Add:
  - `.gitignore`
  - `LICENSE` (MIT preferred)
  - Badges (GitHub stars, CI, CodeCov, etc.)

---

## 💡 12. **Bonus: Go Beyond**

- [ ] Allow custom domains for users
- [ ] Offer tiered rate limits per key (Free vs Pro)
- [ ] CLI tool to shorten links
- [ ] Email alert if a link exceeds click threshold
- [ ] Webhooks (on click events)

---

## 📎 TL;DR Checklist

| Area            | Done? | Notes |
|------------------|-------|-------|
| URL shortening   | ✅ / ❌ | Basic + redirect |
| API Key support  | ✅ / ❌ | With rate limit |
| Swagger docs     | ✅ / ❌ | `/docs` route |
| Professional README | ✅ / ❌ | Clear structure |
| Deploy backend   | ✅ / ❌ | On Render/Railway |
| Security practices | ✅ / ❌ | Helmet, validation |
| Analytics        | ✅ / ❌ | Click + API usage |
| Open source ready | ✅ / ❌ | Good repo hygiene |
| Frontend (optional) | ✅ / ❌ | Dashboard |

---

Wanna turn this into a GitHub template or a boilerplate you can easily extend? I can help scaffold that too 👀
