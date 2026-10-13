# Phase-2 roadmap and acceptance gates

## Phase 0 — Interview readiness (completed in package)

- Six-view responsive offline prototype with linked engineering-to-business workflow.
- Public production data + explicit demonstration scenarios.
- Calculations, charts, risk matrix, 3D illustration and CSV export.
- PRD/TRD/UIRD/data lineage and five-minute demonstration.

## Phase 1 — Technically defensible analytics

1. Load the full authorized well-level Volve daily/monthly workbook under applicable Equinor license; attach source URI, checksum, acquisition date and field dictionary.
2. Build a deterministic validation layer: dates, nulls, volume units, zero/negative correction rules, producer/injector categories, well IDs and data completeness indicators.
3. Compare field totals to reported field-level/monthly values only after understanding accounting and allocation differences.
4. Replace simplistic field trend screening with per-well diagnostics supported by real well/event histories.
5. Introduce targets only with a documented planning baseline and data source. Do not invent an 'approved target.'
6. Provide uncertainty and well test context for interventions; do not auto-generate unsupported uplift forecasts.

**Acceptance:** validated reproducible pipeline, test coverage, clear oil/gas/water definitions and source-time freshness display.

## Phase 2 — Operational planning and cost control

1. Build a real workpack entity with evidence, scope, HSSE, responsible department, approver and gate status.
2. Include budget estimates as versioned line items and CAPEX/OPEX classification according to relevant company standards.
3. Add milestones, Gantt dependencies, maintenance/shutdown coordination and cost variance logic.
4. Implement governed sensitivity analysis, decline-based production profiles, NPV/IRR/EMV and scenario audit trail only after finance/engineering signoff.
5. Support export to agreed WP&B or AFE templates.

**Acceptance:** every decision links to an assumption set, engineering justification and review gate.

## Phase 3 — Procurement and contract management

1. Obtain the most applicable SKK Migas PTK-007 consolidated text, 2025 amendments and any operator-issued procedures.
2. Perform a gap analysis with qualified SCM/legal reviewers: approved criteria, procurement method, technical prequalification, commercial evaluation, TKDN where applicable, conflict-of-interest controls, required approvals, amendments and document retention.
3. Add versioned tender packages, bidder clarifications, sealed submission handling, immutable score explanations and role segregation.
4. Add contract deliverable tracking, SLA evidence, invoice/payment milestones, deviations, change orders and notices.

**Acceptance:** no procurement rules are enabled without written SCM/legal approval; demo vendors remain quarantined from genuine commercial records.

## Phase 4 — Enterprise UI, 3D and infrastructure

- Migrate to Next.js + TypeScript, Tailwind, ECharts, R3F/Three.js with lazy-loaded WebGL.
- Create a properly referenced 3D facility model with accurate coordinates only if asset model access permits it.
- Add Supabase/PostgreSQL, FastAPI, role-based access, object storage, versioned exports and audit logging.
- CI/CD, data contracts, automated test suites, monitoring, secrets management and disaster recovery.
- Introduce export formats DOCX/XLSX/PPTX/PDF with traceable provenance.

**Acceptance:** security assessment, proper owner authorization, accessibility checks, performance profile and operational handover.

## Scope caveat

The interview MVP should not be deployed to production or used in an actual tender or operator budget process. A real implementation requires access permission, risk acceptance and operator-approved controls.
