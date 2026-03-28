# Process Implementation

This document records the implementation process for Phase 1 and the reason behind each action.

## Objective

Build a production-quality backend baseline for the Nepal transparency platform so we can ship early and scale safely.

## Action Plan With Reasons

1. Create project structure
- Action: Created folders for `config`, `core`, `domain`, `routes`, `observability`, `types`, `test`, and `docs`.
- Why: Separation of concerns makes the codebase easier to maintain and easier for teams to work in parallel.

2. Initialize Node + TypeScript project
- Action: Added `package.json`, TypeScript configs, and Vitest config.
- Why: Strict typing and repeatable tooling reduce regressions as the project grows.

3. Add environment configuration and validation
- Action: Implemented `src/config/env.ts` with `dotenv` and `zod`.
- Why: Fail-fast config validation prevents runtime surprises and improves deployment safety.

4. Add core request handling primitives
- Action: Added request ID middleware, centralized error handling, and admin API key middleware.
- Why: Request traceability, consistent error responses, and minimal access control are baseline production requirements.

5. Define domain models
- Action: Created typed models for ministries, projects, notices, and complaints.
- Why: A stable domain model keeps API contracts predictable and prepares for DB migration.

6. Implement initial data store
- Action: Added an in-memory store with Nepal-oriented seed data and CRUD-like complaint flow.
- Why: Fast iteration for MVP while keeping interfaces ready for PostgreSQL replacement.

7. Build API routes
- Action: Added REST routes for ministries, projects, notices, and complaint submission/tracking/status update.
- Why: This gives immediate product value and enables frontend integration in the first phase.

8. Add validation and sanitization
- Action: Added `zod` validation for route payloads and text sanitization for complaint fields.
- Why: Protects API boundaries and improves input safety.

9. Add observability
- Action: Implemented `/healthz`, `/readyz`, `/metrics`, Prometheus counters/histograms, request logs, and OpenTelemetry bootstrap.
- Why: Reliability work starts in phase 1, not after incidents.

10. Add tests and verification
- Action: Added integration tests for health, list endpoints, complaint creation/tracking, validation, and not-found behavior.
- Why: Tests lock in behavior and reduce accidental breakage during rapid iteration.

11. Run quality gates and fix issues
- Action: Ran `typecheck`, `build`, and `test`; fixed TypeScript strictness issues and route parameter safety.
- Why: Passing checks are required before claiming production readiness.

12. Document implementation and operations
- Action: Updated `README.md`, added process and logging docs.
- Why: Clear documentation improves onboarding, review quality, and execution speed.

13. Execute runtime verification command
- Action: Ran `npm run dev` and confirmed active listener on port `4000`.
- Why: Confirms the application starts successfully in development mode.

14. Re-check live runtime status on request
- Action: Verified active `src/server.ts` process and TCP listener on port `4000` using `ps` and `lsof`.
- Why: Confirms service continuity without restarting unnecessary processes.

15. Add root route usability fix
- Action: Implemented `GET /` to return service overview and key endpoint paths; added an integration test for this route.
- Why: Prevents confusion from `ROUTE_NOT_FOUND` when opening the server root in browser or Postman.

16. Re-run quality gates after root route change
- Action: Executed `npm run typecheck`, `npm run build`, and `npm test` (now 6 tests).
- Why: Confirms behavior change is safe and no regressions were introduced.

17. Scaffold frontend application
- Action: Created `frontend/` React + TypeScript + Vite project structure and configuration.
- Why: Provides a maintainable UI layer decoupled from backend runtime.

18. Implement phase-1 frontend modules
- Action: Built ministry dashboard, complaint submission form, and ticket tracking form in `frontend/src/App.tsx` with API client wiring.
- Why: Delivers immediate user-facing value for transparency and citizen interaction.

19. Frontend quality validation
- Action: Ran frontend dependency install and production build (`cd frontend && npm run build`) and fixed strict TypeScript issue for safe state initialization.
- Why: Ensures frontend is compile-safe before release.

20. Update project documentation for frontend
- Action: Updated `README.md` with frontend stack, run commands, and quality checks.
- Why: Keeps onboarding and execution instructions accurate.

21. Run frontend development server
- Action: Started frontend with `npm run dev -- --host 0.0.0.0 --port 5173` and confirmed TCP listener on `5173`.
- Why: Confirms UI is available for immediate interactive testing.

22. Redesign frontend information architecture
- Action: Rebuilt homepage as an information-first portal layout (gov banner, structured navigation, snapshot metrics, ministry directory table, project portfolio, notices, and citizen services).
- Why: Aligns product presentation with institutional/public-sector expectations instead of MVP-demo styling.

23. Improve data visibility on homepage
- Action: Added aggregated loading for ministries/projects/notices and source-linked records with refresh metadata.
- Why: Ensures users see meaningful information immediately without drilling into hidden views.

24. Validate redesigned frontend build
- Action: Executed `cd frontend && npm run build` after redesign and data client updates.
- Why: Confirms compile safety and prevents regressions before review.

25. Realign IA to USA government reference patterns
- Action: Reworked homepage structure to include official strip, utility/header navigation, search-first bar, “How do I...” action block, open-data metrics section, government structure section, records section, and citizen services section.
- Why: Aligns the information architecture with mature public-sector portal patterns similar to `usa.gov`, `data.gov`, and White House government pages.

26. Increase first-view information density
- Action: Added direct reads for projects and notices into the main homepage summary and searchable records.
- Why: Ensures users see substantial information immediately rather than sparse dashboard placeholders.

27. Rebuild after IA overhaul
- Action: Ran `cd frontend && npm run build` after full layout and style replacement.
- Why: Verifies strict TypeScript and production bundling remain healthy after major UI changes.

28. Add Render multi-service deployment blueprint
- Action: Added root `render.yaml` with two services (`central-system-api` as Node web service and `central-system-frontend` as static site), health check path, SPA rewrite, and cross-service environment variable wiring.
- Why: Enables one-click deployment of both backend and frontend from the same repository with production-safe defaults.

29. Add frontend environment template for local and hosted parity
- Action: Added `frontend/.env.example` with `VITE_API_BASE_URL` default.
- Why: Prevents missing-env confusion and documents required frontend runtime configuration.

30. Document Render deployment workflow
- Action: Updated `README.md` with Blueprint deployment steps, automatic env mappings, and free-tier behavior notes.
- Why: Makes deployment repeatable for contributors and removes manual setup ambiguity.

31. Add government-wide source registry dataset
- Action: Added `data/source-registry.yaml` with categorized public sources (federal ministries, constitutional bodies, regulators, judiciary, security, disaster, parliament, provinces), including polling metadata and scraper hints.
- Why: Centralizes official-source configuration and creates a single truth source for future ingestion automation.

32. Expose source registry through API and frontend
- Action: Added backend source-registry loader, new routes under `/api/v1/sources`, and a frontend “Sources” page with category summaries and searchable source cards.
- Why: Makes the source catalog directly usable in the platform, not only stored as static configuration.

## Current Constraints

- Data persistence is currently in-memory.
- Integration tests require a local test server bind.
- Production auth model is currently API-key based for admin-only status updates.

## Next Implementation Steps

1. Replace in-memory store with PostgreSQL and migrations.
2. Add ingestion pipeline for Nepal official sources.
3. Add admin audit logs and role-based access control.
4. Add CI pipeline with test, typecheck, and build gates.
