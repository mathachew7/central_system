# Phase 1 Roadmap (Execution-Ready)

## Scope

- Build trustworthy read APIs for pilot ministries
- Launch complaint submission + ticket tracking
- Add observability and reliability guardrails from day one

## Delivery milestones

1. Backend baseline (completed)
- typed API contracts
- validation and secure defaults
- metrics/logging/tracing hooks
- integration tests

2. Data ingestion layer (next)
- source registry for Nepal portals
- pullers for notices/projects/procurement lists
- normalized record pipeline with confidence labels

3. Storage and admin controls
- PostgreSQL schema and migrations
- admin auth with role-based permissions
- ingestion job dashboard + run audit logs

4. Production readiness
- SLOs and alerts in Grafana/Prometheus
- incident playbooks and retrospective template
- deployment pipeline and rollback checks

## Engineering process

- Design reviews for major API and data-model changes
- RFCs for schema migrations and ingestion strategy
- Incident retrospectives for ingestion failures and data quality events
- Cross-functional demo every sprint with product/data stakeholders

## Near-term technical decisions

- Keep API contracts stable while replacing in-memory store with PostgreSQL
- Introduce OpenAPI spec generation for frontend/consumer alignment
- Add OpenTelemetry collector sidecar in staging/prod
- Define SLI metrics:
  - API availability
  - p95 latency
  - ingestion success rate
  - data freshness lag
