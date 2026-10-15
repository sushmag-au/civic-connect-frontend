# CivicConnect UI — Next.js 14 Decoupled Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![WCAG](https://img.shields.io/badge/WCAG%202.1-AA-0057A8?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

A reference **Next.js 14 App Router** frontend for a decoupled Drupal 11 CMS. Demonstrates server-side rendering, incremental static regeneration (ISR), and WCAG 2.1 AA accessible design patterns for civic and government web portals.

> Pairs with [civic-connect-drupal](https://github.com/sushmag-au/civic-connect-drupal) — a headless Drupal 11 JSON:API backend.

## Architecture

```
Drupal 11 (JSON:API) ──────► Next.js 14 App Router ──────► Browser
   Port 8080                     Port 3000
   /jsonapi/node/service          /services
   /jsonapi/node/news_article     /news
   /jsonapi/node/event            /events
```

## Features

- **Next.js 14 App Router** — Server Components, layouts, loading states
- **ISR** — Incremental Static Regeneration with 60-second revalidation
- **Drupal JSON:API client** — Typed fetch helpers with graceful mock fallback
- **WCAG 2.1 AA** — Skip navigation, focus management, aria labels, reduced motion
- **Design system** — CSS custom properties, responsive grid, accessible components
- **SEO** — Metadata API driven by Drupal Metatag module
- **TypeScript** — Full type coverage across API responses and components

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | CSS Modules + custom properties |
| CMS | Drupal 11 via JSON:API |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, services grid, news, events |
| `/services` | Services listing with category filter |
| `/services/[slug]` | Dynamic service detail page |
| `/news` | News article listing |
| `/news/[slug]` | Dynamic news article detail |
| `/events` | Upcoming events listing |
| `/contact` | Contact form |

## Quick Start

### With Drupal backend
```bash
git clone https://github.com/sushmag-au/civic-connect-frontend.git
cd civic-connect-frontend
npm install
cp .env.local.example .env.local
# Set DRUPAL_BASE_URL to your Drupal instance
npm run dev
```

### Standalone (mock data)
```bash
npm install && npm run dev
# Runs on http://localhost:3000 with built-in mock data — no Drupal needed
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DRUPAL_BASE_URL` | `http://localhost:8080` | Drupal backend URL |
| `NEXT_PUBLIC_SITE_NAME` | `CivicConnect` | Site display name |

## API Integration

The `src/lib/drupal.ts` client fetches from Drupal JSON:API with ISR:
```typescript
const services = await getServices() // tries Drupal, falls back to mock data
```

All fetch functions implement graceful fallback — the frontend works standalone without a running Drupal instance, making local development and demos straightforward.

## CI/CD

GitHub Actions runs on every push:
- ESLint — code quality checks
- `next build` — production build verification

## Developer

**Sushma Gogula** — [github.com/sushmag-au](https://github.com/sushmag-au) · [linkedin.com/in/gsushma-au](https://linkedin.com/in/gsushma-au)
