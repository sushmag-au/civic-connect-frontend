# CivicConnect — Next.js 14 Frontend

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG%202.1-AA%20Compliant-065F46?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Drupal 11](https://img.shields.io/badge/Drupal-11%20JSON%3AAPI-0077C0?style=flat-square&logo=drupal)](https://www.drupal.org/)

**CivicConnect** is a decoupled, modern frontend web application designed for municipal local government. It consumes a **Drupal 11 JSON:API backend** running at `http://localhost:8080`, providing citizens across the **City of Greater Geelong, Australia** with fast, resilient, and accessible civic services.

This project was architected as a demonstration portfolio piece for a **Senior Drupal Developer (Band 7 Local Government role)** at the City of Greater Geelong.

---

## 🏛️ Architecture Overview

The application utilizes a decoupled / headless architecture where Drupal 11 serves as the structured content repository and editorial backend, while Next.js 14 delivers an edge-ready, accessible citizen portal using the React Server Components paradigm and Incremental Static Regeneration (ISR).

```
+-----------------------------------------------------------------------------------+
|                           CITIZEN BROWSER / ASSISTIVE TECH                       |
|                          (Desktop, Mobile, Screen Readers)                        |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │  HTML / CSS / React Hydration
                                         ▼
+-----------------------------------------------------------------------------------+
|                        CIVICCONNECT NEXT.JS 14 FRONTEND                          |
|                        (Port 3000 / App Router / TypeScript)                      |
|                                                                                   |
|  +--------------------+   +-----------------------+   +------------------------+  |
|  | Server Components  |   | Incremental Static    |   | Client Interactivity   |  |
|  | (Layout, Homepage, |   | Regeneration (ISR 60s)|   | (Search, Filters,      |  |
|  | Detail Pages)      |   | (Background Fetch)    |   | Contact Form)          |  |
|  +--------------------+   +-----------------------+   +------------------------+  |
|                                         ▲                                         |
|                                         │ fetch() with ISR cache                  |
|  +-----------------------------------------------------------------------------+  |
|  |                      DRUPAL CLIENT LIBRARY (src/lib/drupal.ts)              |  |
|  |  * Typed JSON:API normalizer     * Auto-mock fallback for standalone demo  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │  JSON:API (application/vnd.api+json)
                                         ▼
+-----------------------------------------------------------------------------------+
|                             DRUPAL 11 HEADLESS BACKEND                            |
|                            (Port 8080 / JSON:API Core)                            |
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  | Node: Service          |  | Node: News Article     |  | Node: Event         |  |
|  | (Waste, Permits, Rates)|  | (Announcements)        |  | (Civic Events)      |  |
|  +------------------------+  +------------------------+  +---------------------+  |
|  +------------------------+  +------------------------+  +---------------------+  |
|  | Taxonomy: Categories   |  | Path Aliases (Pathauto)|  | Metatag / JSON:API  |  |
|  +------------------------+  +------------------------+  +---------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## ✨ Key Features

- **Next.js 14 App Router & Server Components:** Zero-bundle-overhead server rendering for fast initial load times and high SEO indexability.
- **Incremental Static Regeneration (ISR):** Pages statically generate at build time and revalidate in the background every 60 seconds (`next: { revalidate: 60 }`), offering CDN-speed performance with dynamic Drupal content freshness.
- **Resilient Fallback Mode:** When Drupal is offline or during offline portfolio presentations, the client automatically falls back to comprehensive mock datasets for the City of Greater Geelong without throwing errors.
- **WCAG 2.1 Level AA Accessibility:**
  - High contrast 3px focus-visible rings with generous offset.
  - Skip navigation link (`.skip-link`) jumping straight to `#main-content`.
  - Accessible landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<aside>`).
  - Semantic HTML headings hierarchy (`h1` &rarr; `h2` &rarr; `h3`).
  - Screen-reader text alternatives and ARIA states (`aria-expanded`, `aria-current`, `aria-label`).
  - Respects `@media (prefers-reduced-motion: reduce)`.
- **Government Design Aesthetic:** Strict civic styling using City of Greater Geelong navy (`#1B3A6B`), council blue (`#0057A8`), and accessible amber gold accents (`#D98200`).
- **Interactive Directory:** Client-side instant filtering across service categories with instant keyword search.
- **Full Route Hierarchy:** Dedicated detail pages for every service and news release with metadata generation for search engines and social cards.

---

## 🔌 API Integration Details

The client communicates with Drupal 11's core `jsonapi` module located at `DRUPAL_BASE_URL`.

### Consumed Endpoints

| Resource | Drupal JSON:API Endpoint | Query Parameters |
| :--- | :--- | :--- |
| **Services** | `/jsonapi/node/service` | `?include=field_service_category&sort=-changed` |
| **Service Detail** | `/jsonapi/node/service` | `?filter[alias-filter][condition][path]=path.alias&filter[alias-filter][condition][value]=/services/:slug&include=field_service_category` |
| **News Articles** | `/jsonapi/node/news` | `?include=field_news_category&sort=-created` |
| **News Detail** | `/jsonapi/node/news` | `?filter[alias-filter][condition][path]=path.alias&filter[alias-filter][condition][value]=/news/:slug&include=field_news_category` |
| **Events** | `/jsonapi/node/event` | `?include=field_event_category&sort=field_event_date` |

### Typed JSON:API Transformation

Drupal JSON:API responses return raw entity relationships. `src/lib/drupal.ts` normalizes these into clean, strongly typed TypeScript entities (`DrupalService`, `DrupalNewsArticle`, `DrupalEvent`).

```typescript
// Sample ISR request in src/lib/drupal.ts
const response = await fetch(`${DRUPAL_BASE_URL}/jsonapi/node/service`, {
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
  },
  next: { revalidate: 60 } // Incremental Static Regeneration
})
```

---

## 🗺️ Application Routes

| Route | Type | Description |
| :--- | :--- | :--- |
| `/` | Server Component | Homepage featuring Hero, 6 Services, 3 News, 3 Events, Stats & CTA Banner |
| `/services` | Server + Client | Full searchable & filterable directory of all council services |
| `/services/[slug]` | ISR Dynamic Page | Detailed council service overview, steps, department details & related services |
| `/news` | Server Component | Comprehensive listing of municipal media releases and announcements |
| `/news/[slug]` | ISR Dynamic Page | Full editorial news release article with publication metadata |
| `/events` | Server Component | Chronological community events calendar with date pills and locations |
| `/contact` | Server + Client | Civic administration address, emergency dispatch info & interactive contact form |

---

## 🛠️ Local Development

### Option 1: Standalone Mode (With Built-in Mock Data)

The application includes complete mock data mirroring City of Greater Geelong services. You do **not** need a running Drupal instance to inspect or run this project:

```bash
# 1. Navigate to the project directory
cd /Users/Sushma/.gemini/antigravity/scratch/drupal-portfolio/civic-connect-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Connected to Drupal 11 Backend

1. Ensure Drupal 11 is running at `http://localhost:8080`.
2. Copy the sample environment file:
   ```bash
   cp .env.local.example .env.local
   ```
3. Verify `DRUPAL_BASE_URL` in `.env.local`:
   ```env
   DRUPAL_BASE_URL=http://localhost:8080
   NEXT_PUBLIC_SITE_NAME=CivicConnect
   ```
4. Start Next.js:
   ```bash
   npm run dev
   ```

### Option 3: Docker Compose

To run the containerized frontend alongside Drupal:
```bash
docker compose up -d --build
```

---

## ⚙️ Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DRUPAL_BASE_URL` | `http://localhost:8080` | URL of the Drupal 11 JSON:API backend |
| `NEXT_PUBLIC_SITE_NAME` | `CivicConnect` | Branding title displayed in metadata |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Canonical base URL for OpenGraph metadata |

---

## 🚀 CI/CD Pipeline

A GitHub Actions workflow is preconfigured in `.github/workflows/ci.yml`. On every `push` and `pull_request` to `main`, the pipeline automatically executes:
1. Environment checkout on `ubuntu-latest` with Node.js 20.
2. Clean dependency installation (`npm ci`).
3. ESLint verification (`npm run lint`).
4. Production production build (`npm run build`) to ensure type safety and error-free static generation.

---

## 👤 Developer Profile

- **Author:** Sushma Gogula
- **Email:** gsushma511@gmail.com
- **Role:** Senior Drupal & Full-Stack Developer
- **Target Position:** Band 7 Senior Drupal Developer, City of Greater Geelong
