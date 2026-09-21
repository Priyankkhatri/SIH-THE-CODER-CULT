<div align="center">

# AI Tourist Companion

### AI-Powered Intelligent Tourist Companion — Smart India Hackathon 2026
**Problem Statement SIH26204**

[TypeScript](https://www.typescriptlang.org/) · [Expo / React Native](https://expo.dev/) · [Express](https://expressjs.com/) · [Prisma](https://www.prisma.io/) · [PostgreSQL](https://www.postgresql.org/) · [OpenAI](https://openai.com/)

<p align="center">
  <img src="docs/images/logo.svg" alt="AI Tourist Companion" width="96" height="96" />
</p>

<p align="center">
  <img src="docs/images/banner.svg" alt="AI Tourist Companion — hero banner" width="100%" />
</p>

</div>

---

## Table of Contents

- [About](#about)
- [🌟 Complete Feature Specification (docs/FEATURES.md)](docs/FEATURES.md)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Run the Backend Server](#2-run-the-backend-server)
  - [3. Run the Mobile App](#3-run-the-mobile-app)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Datasets & Research](#datasets--research)
- [Demo Flow](#demo-flow)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## About

**AI Tourist Companion** is an end-to-end platform that turns any heritage site into a living, interactive experience. Built for **Smart India Hackathon 2026 (SIH26204)**, it pairs a **React Native mobile app** (Expo) with a **Node.js/Express backend** to deliver:

- **Guided exploration** of heritage places via an interactive map, search, and category filters
- **An AI Heritage Guide** that answers questions about any monument
- **Photo-based artifact identification** (computer vision) with on-site cultural context
- **Personalized multi-day itineraries** generated from traveler preferences
- **Trilingual content** (English, Hindi, Gujarati) with text-to-speech audio guidance

The demo experience is centered on the **heritage of Vadodara, Gujarat** — Laxmi Vilas Palace, Baroda Museum, EME Temple, Champaner UNESCO sites, and more — backed by a national heritage dataset of **3,696 ASI monuments** and state-level heritage atlases.

> **No database required for the demo.** The server ships with a seeded in-memory Vadodara catalogue that automatically serves all routes when PostgreSQL is not reachable.

---

## Key Features

### Mobile App (`mobile/`)
- **Onboarding flow** — 4-step personalization: language → interests → travel style → visit duration
- **Home** — top attractions, category filter, and full-text search
- **Explore** — interactive map (`react-native-maps` / Leaflet on web) with nearby heritage sites
- **AI Guide chat** — ask questions about any monument, with modes: *short, detailed, child, narrative* and text-to-speech playback
- **Vision ID & AI Scanner** — photograph an artifact or monument; processed by a 5-tier vision pipeline: Google Vision API (Google Gemini Multimodal / Cloud Vision) with fallback to in-house MobileNetV3 ONNX (128 classes), local VLM (Qwen2-VL), catalog labels, and on-site GPS radar
- **Plan** — generate, review, save, and reload personalized itineraries with walk/drive routing, visit times, and per-stop reasons
- **Place detail pages** — hero image, trivia, history, architecture, key facts, timeline, sources, and read-aloud
- **Dark heritage-gold theme** — trilingual UI (English, हिन्दी, ગુજરાતી)
- **Offline resilience** — built-in demo fallback catalog so the app keeps working without a server

### Backend (`server/`)
- **Dual-database architecture** — Prisma/PostgreSQL with automatic transparent fallback to a seeded in-memory dataset (1.5 s connect timeout)
- **REST API** covering auth, places, heritage, AI, vision, itinerary, and translation
- **JWT auth** — guest tokens (7 days) and registered-user tokens (30 days)
- **AI Q&A & suggestions** — 3-tier hybrid LLM architecture: Local LM Studio (offline `llama-3.2-3b-instruct`), Groq Cloud LLM (`llama-3.3-70b-versatile` at ~300 tokens/sec), and static heritage RAG intent synthesizer
- **Itinerary engine** — greedy nearest-neighbor planner scoring places by interests, rating, and proximity
- **Trilingual heritage content** — localized short stories, history, and names served by `?lang`
- **Secure by default** — `helmet`, `cors`, centralized error handling, zod-validated inputs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TypeScript (monorepo: `mobile/` + `server/`) |
| Mobile | Expo SDK 57, React Native 0.86, React 19, expo-router (file-based routing), zustand, AsyncStorage |
| Mobile UI | react-native-maps, expo-camera, expo-location, expo-speech (TTS), expo-image, @expo/vector-icons |
| Backend | Express 5, Prisma 6 ORM, PostgreSQL |
| Auth | jsonwebtoken (JWT) |
| AI & Vision | Google Gemini Multimodal Vision, Groq Cloud LLM (Llama 3.3 70B), LM Studio (Local LLM / VLM), MobileNetV3-Small ONNX (128 classes) |
| Validation | zod |
| Data assets | CSV / JSON / HTML (National Heritage Matrix viewer) + Python vision pipelines (SigLIP / DINOv2 / MobileNetV4 / Google Landmarks v2) |

---

## Project Structure

```
SIH-THE-CODER-CULT/
├── mobile/                        # Expo React Native app (TypeScript)
│   ├── app.json                   # Expo config (icons, permissions, splash)
│   └── src/
│       ├── app/                   # expo-router screens
│       │   ├── index.tsx          # Redirect: onboarding or home
│       │   ├── onboarding.tsx     # 4-step personalization flow
│       │   ├── camera.tsx         # Vision / artifact identification
│       │   ├── place/[id].tsx     # Place detail (hero, trivia, sources, read-aloud)
│       │   └── (tabs)/            # Bottom tabs
│       │       ├── index.tsx      # Home (attractions, filters, search)
│       │       ├── explore.tsx    # Map + list view
│       │       ├── ai.tsx         # AI guide chat with TTS
│       │       ├── plan.tsx       # Itinerary build/edit/timeline
│       │       └── profile.tsx    # User preferences
│       ├── components/            # PlaceCard, CategoryFilter, ChatBubble,
│       │                          # TimelineItem, SourceCard, HeritageMapView
│       ├── constants/             # theme.ts (design system), translations.ts
│       ├── hooks/                 # useTranslation, useSpeech, useLocation
│       ├── services/              # api.ts (axios clients + demo fallbacks)
│       └── stores/                # zustand stores (user, places, chat)
│
├── server/                        # Express + Prisma backend (TypeScript)
│   ├── .env                       # Environment variables (copy to .env.example)
│   ├── prisma/schema.prisma       # PostgreSQL schema
│   └── src/
│       ├── server.ts              # Entry point
│       ├── app.ts                 # Express app + route mounting
│       ├── config/                # config, database, inMemoryDb
│       ├── middleware/            # errorHandler
│       ├── modules/
│       │   ├── auth/              # guest/register/preferences
│       │   ├── places/            # nearby/search/detail
│       │   ├── heritage/          # chronicle + sources
│       │   ├── ai/                # ask/suggest
│       │   ├── vision/            # identify/catalog
│       │   ├── itinerary/         # generate/save/list
│       │   └── translate/         # translate/tts/languages
│       └── seed/                  # SIH demo seed data (Vadodara catalogue)
│
└── datasets/                      # Research assets
    ├── *.csv / *.json             # ASI registry (3,696), Gujarat atlas, national heritage
    ├── index.html                 # "National Heritage Matrix" web viewer
    ├── docs/                      # SIH2026_HERITAGE_RESEARCH_REPORT.md
    └── pipelines/                 # Python CV/vector pipelines (SigLIP, DINOv2, Google Landmarks)
```

---

## Getting Started

### 1. Prerequisites

- **Node.js** 18+
- **npm** (or yarn / pnpm)
- **PostgreSQL** *(optional — the app runs fully with the in-memory fallback)*
- **Expo Go** app on your phone, or an Android/iOS/web environment to run Expo
- *(Optional)* **OpenAI API key** for AI generation

### 2. Run the Backend Server

```bash
cd server

# Install dependencies
npm install

# (Optional) Set up PostgreSQL database
cp .env .env.local        # edit your DATABASE_URL etc.
npx prisma db push        # create tables
npm run db:generate       # generate Prisma client
npm run seed              # load demo heritage data

# Start the server (dev mode with hot-reload)
npm run dev
```

The server starts on **http://localhost:3000** — verify with:

```bash
curl http://localhost:3000/health
# {"status":"ok","timestamp":"...","version":"1.0.0"}
```

Other scripts:

| Command | Purpose |
|---|---|
| `npm run dev` | Run with `tsx watch` (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled build (`node dist/server.js`) |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | Open Prisma Studio |
| `npm run seed` | Seed demo data |

### 3. Run the Mobile App

```bash
cd mobile

# Install dependencies
npm install

# Start Expo
npx expo start
```

Then press **`a`** for Android, **`i`** for iOS, or **`w`** for web — or scan the QR code with **Expo Go**.

> **API base URL** is auto-selected from `mobile/src/constants/theme.ts`:
> - Android emulator → `http://10.0.2.2:3000`
> - Web / iOS simulator → `http://localhost:3000`
> - **Physical device** → edit `API_BASE_URL` in `mobile/src/constants/theme.ts` to your computer's LAN IP (e.g. `http://192.168.1.X:3000`).

---

## Environment Variables

Server variables (`server/.env`):

| Variable | Description | Default / Sample |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `NODE_ENV` | Runtime environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/tourist_companion?schema=public` |
| `JWT_SECRET` | Secret for signing JWTs | `hackathon-secret-key-sih26204` |
| `OPENAI_API_KEY` | OpenAI key (AI Q&A/suggestions) | `your-openai-api-key-here` |
| `GOOGLE_MAPS_API_KEY` | Google Maps (future directions) | `your-google-maps-api-key-here` |
| `GOOGLE_VISION_API_KEY` | Google Vision (optional — catalog fallback) | *(empty)* |
| `GOOGLE_TRANSLATE_API_KEY` | Google Translate (optional — preset translations) | *(empty)* |

> All keys are optional. Without OpenAI, translation, or vision keys, the server transparently uses built-in catalog & dictionary fallbacks. Never commit real keys.

---

## API Reference

Base URL: `http://localhost:3000` · All endpoints return JSON.

### Health & Auth

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Liveness check (`status`, `timestamp`, `version`) |
| POST | `/auth/guest` | Create guest user → JWT (7-day expiry) |
| POST | `/auth/register` | Register user (`name`, `email`, `language`) → JWT (30-day) |
| POST | `/auth/preferences` | Save user travel preferences (upsert) |

### Places

| Method | Endpoint | Description |
|---|---|---|
| GET | `/places/nearby` | Places within radius — `?lat&lng&radius&category&lang` (Haversine filter) |
| GET | `/places/search` | Name/description search — `?q=` |
| GET | `/places/categories/list` | Distinct place categories |
| GET | `/places/:id` | Place detail incl. heritage record, sources & artifacts |

### Heritage

| Method | Endpoint | Description |
|---|---|---|
| GET | `/heritage/:placeId` | Full chronicle with localized fields — `?lang=en\|hi\|gu` |
| GET | `/heritage/:placeId/sources` | Source citations for a heritage record |

### AI

| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/ask` | Ask the AI Heritage Guide — `{ question, placeId, mode, language }` |
| POST | `/ai/suggest` | Suggested questions for a place — `{ placeId }` |

### Vision

| Method | Endpoint | Description |
|---|---|---|
| POST | `/vision/identify` | Identify artifact — `{ latitude, longitude, labels }` (label-score matching + GPS proximity fallback) |
| GET | `/vision/catalog` | List supported demo artifacts |

### Itinerary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/itinerary/generate` | Generate plan — `{ latitude, longitude, interests, duration, travelStyle }` |
| POST | `/itinerary/save` | Persist a generated itinerary |
| GET | `/itinerary/user/:userId` | List a user's saved itineraries |

### Translation

| Method | Endpoint | Description |
|---|---|---|
| POST | `/translate` | Translate text — `{ text, targetLanguage }` (preset dictionary + passthrough) |
| POST | `/translate/tts` | TTS voice configuration — `{ text, language }` |
| GET | `/translate/languages` | Supported languages (`en`, `hi`, `gu`) |

---

## Database Schema

8 models, PostgreSQL via Prisma (all tables `@@map` to `snake_case`):

```
User ─┬─ Preference (1:1)
      ├─ Favorite (N:M with Place)
      └─ Itinerary ── ItineraryItem (1:N)

Place ── HeritageRecord (1:1) ── Source (1:N)
  └── Artifact (1:N)
```

| Model | Key fields |
|---|---|
| **User** | name, email, language, isGuest |
| **Preference** | interests[], travelStyle, duration, accessibility[] |
| **Place** | name, nameHi, nameGu, lat/lng, category, imageUrl, openingHours, rating |
| **HeritageRecord** | shortStory (hi/gu), history (hi/gu), significance, architecture, keyFacts[], period |
| **Source** | sourceName, sourceUrl, referenceText |
| **Artifact** | name (hi/gu), description (hi/gu), visionLabel, imageUrl |
| **Favorite** | userId + placeId (unique) |
| **Itinerary / ItineraryItem** | title, duration, totalTime, items with order, visitDuration, travelTime, travelMode, reason |

> The in-memory fallback mirrors this schema, so the API contract is identical with or without PostgreSQL.

---

## Datasets & Research

Production-grade research assets live in `datasets/`:

| Asset | Content |
|---|---|
| `asi_national_heritage_registry_3696.csv/.json` | **3,696 ASI monuments** with coordinates, district, images |
| `gujarat_heritage_atlas_exhaustive.csv/.json` | Exhaustive Gujarat heritage atlas |
| `indian_heritage_dataset.csv/.json` | National heritage dataset (~295 KB) with dossiers & photos |
| `national_heritage_lakhs_census.csv` | State-wise heritage census (UP 257k, TN 226k, Gujarat 136k…) |
| `index.html` | Self-contained **"National Heritage Matrix"** web viewer — tables, photo gallery, dossiers, UNESCO/Gujarat/tier badges |
| `docs/SIH2026_HERITAGE_RESEARCH_REPORT.md` | Data sufficiency audit (Tiers 1–4) for SIH26204 |
| `pipelines/prototype_vector_pipeline.py` | SigLIP / DINOv2 / MobileNetV4 embedding pipeline |
| `pipelines/google_landmarks_v2_india_bridge.py` | Google Landmarks v2 India bridge for monument retrieval |
| `dataset/cv_training_augmentation_spec.json` | CV augmentation spec (RandomPerspective, ColorJitter, RandomErasing, GaussianBlur, ISO noise) |

---

## Demo Flow

1. **Onboarding** — choose language (English / हिन्दी / ગુજરાતી), interests, travel style, duration.
2. **Home** — browse top Vadodara attractions, filter by category, search.
3. **Explore** — open the map, tap a pin to view heritage details.
4. **Place detail** — read the story, history, architecture, key facts, sources; press ▶ to hear it read aloud in your language (`?lang`).
5. **AI Guide** — ask the AI anything about the monument (modes: short/detailed/child/narrative).
6. **Vision ID** — point the camera at the palace facade, temple dome, or museum statue and get instant identification with context.
7. **Plan** — generate a personalized 30-min → full-day route optimized for your interests, save it, and reload it from your profile.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| App can't reach the server | Update `API_BASE_URL` in `mobile/src/constants/theme.ts` (physical device → LAN IP) |
| Postgres not running | No problem — the server auto-falls back to the in-memory demo catalogue |
| Missing `mobile/assets/` warning | Expo falls back to default icon/splash; add assets to silence the warning |
| OpenAI calls failing | Set a valid `OPENAI_API_KEY`; server still works with fallback content |
| Port already in use | Change `PORT` in `server/.env` and update the app's `API_BASE_URL` |

---

## License

Educational / hackathon prototype for **Smart India Hackathon 2026 — Problem SIH26204**. Images referenced from public sources (e.g., Wikimedia Commons). API keys are not required to run the full demo experience.