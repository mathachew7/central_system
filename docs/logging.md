# Logging

This file contains:
- runtime logging behavior implemented in the service
- a concise execution log of implementation work completed

## Runtime Logging Implementation

## Request Logging

- File: `src/app.ts`
- Behavior:
  - Generates or propagates `x-request-id` via `src/core/request-context.ts`
  - Logs one structured entry per completed HTTP request
  - Captures `requestId`, `method`, `path`, `statusCode`, and `durationMs`

Why this:
- Gives traceability for debugging and incident analysis.
- Connects user reports to exact backend requests.

## Application Logger

- File: `src/core/logger.ts`
- Behavior:
  - Uses `pino` with configurable `LOG_LEVEL`
  - Uses redaction rules for sensitive headers and fields

Why this:
- Structured logs are machine-queryable.
- Redaction helps prevent accidental sensitive data exposure.

## Error Logging

- File: `src/core/errors.ts`
- Behavior:
  - Standardized API errors for validation, app errors, and unknown failures
  - Unknown/unhandled errors are logged before returning HTTP 500

Why this:
- Consistent API behavior for clients.
- Unhandled exceptions remain visible for operators.

## Metrics Logging Companion

- File: `src/observability/metrics.ts`
- Behavior:
  - Captures request totals and latency histogram labels by method/route/status

Why this:
- Complements logs with time-series trends for performance and reliability.

## Implementation Action Log

Date context: `2026-03-28` local workspace session.

1. Project scaffolded with TypeScript, tests, and strict compile settings.
2. Core middleware added for request IDs, auth guard, and centralized errors.
3. Domain models and in-memory store implemented for ministries/projects/notices/complaints.
4. API routes implemented and versioned under `/api/v1`.
5. Safety controls added: validation, sanitization, and rate limits.
6. Observability added: health, readiness, Prometheus metrics, OTEL bootstrap.
7. Integration tests created for critical API flows.
8. Build and typecheck failures fixed.
9. Integration tests executed successfully after allowing local port binding.
10. Documentation updated (`README.md`, process implementation, logging).
11. Development server run command executed (`npm run dev`) and process confirmed listening on port `4000`.
12. Re-verified runtime status: process `src/server.ts` is active and port `4000` is listening (`lsof` + `ps`).
13. Added `GET /` root endpoint to return service overview and endpoint map; added matching integration test.
14. Post-change verification completed: `typecheck`, `build`, and `test` passed (`6/6` tests).
15. Frontend scaffolded in `frontend/` using React + TypeScript + Vite.
16. Frontend UI implemented for ministry dashboard, complaint submission, and ticket tracking.
17. Frontend build verification completed successfully (`cd frontend && npm run build`).
18. `README.md` updated to include frontend run/build instructions.
19. Frontend dev server started and verified listening on port `5173`.
20. Frontend homepage redesigned to institutional information architecture with structured sections and source-linked tables/cards.
21. Added frontend API reads for `/api/v1/projects` and `/api/v1/notices` so information density is visible on first load.
22. Re-verified frontend build after redesign (`cd frontend && npm run build` passed).
23. Reworked IA again to match reference public portals (`usa.gov`, `data.gov`, `whitehouse.gov/government`) with official-strip header, search-first controls, “How do I” actions, and structure/data sections.
24. Replaced stylesheet and page composition to a stricter institutional presentation style.
25. Re-verified frontend build after reference-aligned overhaul (`cd frontend && npm run build` passed).
26. Frontend restructured to multi-page application with White House-inspired navigation (Home, Administration, Issues, Briefing Room, The White House, Get Involved, Contact).
27. Added React Router for client-side navigation between sections.
28. Created dedicated page components for each section with appropriate data fetching and filtering.
29. Updated CSS styles to support new components and active navigation states.
30. Fixed TypeScript errors related to Notice interface properties.
31. Verified frontend build and backend tests pass after restructuring.
32. Added Render Blueprint file (`render.yaml`) to deploy backend + frontend services from one repository.
33. Wired cross-service environment variables for API base URL and CORS origin using Render default URLs.
34. Added `frontend/.env.example` and updated `README.md` with full Render deployment instructions.
35. Added `data/source-registry.yaml` containing a categorized national source registry with polling metadata.
36. Implemented backend source registry APIs (`/api/v1/sources`, `/api/v1/sources/:category`, `/api/v1/sources/raw`).
37. Implemented frontend `Sources` page and navigation wiring to browse/search registry entries in the live UI.
## Verification Snapshot

- `npm run typecheck`: passed
- `npm run build`: passed
- `npm test`: passed (`6/6`)
- `cd frontend && npm run build`: passed
