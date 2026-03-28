# Centralized Government Transparency Platform (Phase 1)

Backend and frontend foundation for a Nepal-focused transparency platform that centralizes ministry data, project updates, notices, and citizen complaints.

## What We Are Implementing

- A secure and typed API layer for ministries, projects, notices, and complaint tracking
- A React frontend dashboard connected to the API for public browsing and citizen reporting
- A reliability-first backend baseline with validation, rate limiting, and admin protection
- Observability primitives for production operations (health, readiness, metrics, structured logs, tracing hooks)
- An integration-ready structure so we can move from seed/in-memory data to PostgreSQL + ingestion workers

## Current Implementation

- Backend stack: `Node.js`, `Express`, `TypeScript`, `Zod`, `Vitest`
- Frontend stack: `React`, `TypeScript`, `Vite`
- Core API modules:
  - `GET /api/v1/ministries`
  - `GET /api/v1/ministries/:slug`
  - `GET /api/v1/projects`
  - `GET /api/v1/notices`
  - `GET /api/v1/sources`
  - `GET /api/v1/sources/:category`
  - `GET /api/v1/sources/raw`
  - `POST /api/v1/complaints`
  - `GET /api/v1/complaints/:ticketId`
  - `PATCH /api/v1/complaints/:ticketId/status` (requires `x-admin-api-key`)
- Platform endpoints:
  - `GET /`
  - `GET /healthz`
  - `GET /readyz`
  - `GET /metrics`
- Safety:
  - schema validation via `zod`
  - complaint payload sanitization
  - global and complaint-specific rate limiting
  - admin API key middleware for status updates
- Observability:
  - structured request logging with request IDs
  - Prometheus-compatible metrics
  - OpenTelemetry bootstrap via OTLP endpoint configuration
- Frontend modules (`frontend/`):
  - Multi-page application with routing (Home, Administration, Issues, Briefing Room, The White House, Get Involved, Contact)
  - Home dashboard with metrics, government structure, and public records
  - Administration page listing all ministries
  - Issues page showing government projects with filtering
  - Briefing Room for latest notices and announcements
  - The White House page with platform information
  - Get Involved page for complaint submission and tracking
  - Contact page for support information
  - Sources registry page for ministries, constitutional/regulatory bodies, judiciary, security, disaster, parliament, and provinces
  - API base configured via `VITE_API_BASE_URL`

## Process And Logs

- Process implementation details: [`docs/process-implementation.md`](docs/process-implementation.md)
- Logging implementation and action log: [`docs/logging.md`](docs/logging.md)
- Phase roadmap: [`docs/phase-1-roadmap.md`](docs/phase-1-roadmap.md)

## Local Run

Backend:

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Deploy On Render (Frontend + Backend)

This repository now includes a Render Blueprint file at [`render.yaml`](render.yaml) that provisions:

- `central-system-api` (Node web service)
- `central-system-frontend` (static site)

### One-time setup

1. Push this repository to GitHub.
2. In Render dashboard, click **New** -> **Blueprint**.
3. Connect the repository and select the default `render.yaml`.
4. Apply and create services.

### What gets configured automatically

- Backend health check: `GET /healthz`
- Frontend SPA rewrite: `/* -> /index.html`
- `VITE_API_BASE_URL` on frontend from backend `RENDER_EXTERNAL_URL`
- Backend `CORS_ORIGINS` from frontend `RENDER_EXTERNAL_URL`
- Random `ADMIN_API_KEY` generated on first deploy

### Notes

- Free plan services can spin down on inactivity, so first request may be slower.
- Backend defaults to `PORT=10000` on Render (already set in blueprint).
- If you later add a custom domain, also update `CORS_ORIGINS` to include it.

## Quality Checks

Backend:

```bash
npm run typecheck
npm test
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```
