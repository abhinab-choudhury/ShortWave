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
- 📈 **Interactive Analytics Dashboard** – Visualize link performance dynamically.  
- 🎨 **Minimal & Intuitive Design** – Clean, distraction-free UI.  
- 📱 **QR Code Integration** – Generate scannable QR codes automatically.  
- ⚡ **High Performance & Scalability** – Optimized backend with caching for speed.  
- 🔒 **Secure by Design** – Safe for personal and production use.  

---

## 🚀 Live Demo

Try it here:  
👉 [Shortwave Demo](https://short-wave.vercel.app)


## 🛠️ Tech Stack

- **Frontend**: React.js + TypeScript + ShadCN UI  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB  
- **Cache**: Redis  
- **Analytics**: Charting libraries for interactive dashboards  

Got it 👍 here’s the improved snippet with **Docker Compose info** included:

Here’s the updated snippet with a **linter command** added:

````markdown
## 🔧 Development

Run the frontend, backend, and supporting services easily.

```bash
# Start both frontend (apps/client) and backend (apps/server)
yarn run dev
````

Available scripts:

```bash
yarn run start:frontend   # Start only the frontend (apps/client)
yarn run start:backend    # Start only the backend (apps/server)
yarn run dev              # Start both frontend & backend concurrently
yarn run lint             # Run linting across the project
```

### 🐳 Running Databases with Docker Compose

This project includes a `docker-compose.yml` to start the required databases:

```bash
# Start MongoDB and Redis
docker-compose up -d
```

This will spin up **MongoDB** and **Redis** containers, which the backend connects to automatically.
