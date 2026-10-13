# TECHNICAL REQUIREMENTS DOCUMENT (TRD)

**Version:** MVP 1.0 / target system v2.0

## 1. Architecture decision

MVP uses a **static single-page browser application** to minimize the risk of technical failure during a next-day interview. It requires no bundler, node install, Python server, third-party script, authentication or live network.

```text
User Browser
  ├── index.html (6 view containers)
  ├── assets/style.css (responsive design system)
  ├── assets/data.js (historical observations + explicit simulation inputs)
  └── assets/app.js
       ├── SVG analytics + KPIs
       ├── Canvas 2D projection of generic 3D scene
       ├── Budget & risk calculations
       ├── Bid screening gates and scoring
       ├── localStorage (browser-only illustrative state)
       └── Blob CSV export / browser print
```

### Platform/runtime
- Browser with support for Canvas 2D, SVG, ES2019+, `Blob`, `URL.createObjectURL`, `localStorage` (optional).
- No backend in MVP; no real data writes, remote calls or confidential user data.
- Minimal external dependency: Google Fonts CSS only, with robust system font fallback.
- Browser opening `index.html` from file system is supported because JSON is embedded as an executable data manifest.

## 2. Data contract

### Real dataset schema (source excerpt)

Table: `historical_field_monthly`  
Key: `(field, year, month)`.

| Column | Type | Unit | Purpose |
|---|---|---|---|
| `field` | text | — | `16/1-12 Troldhaugen` |
| `year` | int | year | Monthly observation year |
| `month` | int | 1–12 | Monthly observation month |
| `gross_oil_mill_sm3` | number | million Sm³ | Gross oil volume |
| `gross_gas_bill_sm3` | number | billion Sm³ | Gross gas volume |
| `produced_water_mill_sm3` | number | million Sm³ | Produced water in field |
| `npdid` | int | — | 17196400 |
| `source_type` | enum | `observed` | Explicit provenance class |

All records from January 2023 to July 2026 are direct published observations at monthly granularity. The field name, source, NPDID and period must be displayed. No infill, interpolation, smoothing, live refresh or attribution of root cause.

### Illustrative scenario schemas

`work_program`: ID, title, category, budget_midr, uplift_bopd, probability, duration_days, priority, status, owner.

`vendor`: ID, name, price_midr, technical_score, hse_pass, qualified, lead_days.

`contract_milestone`: title, weight_pct, completion_boolean, description. Weights must sum to 100.

`risk`: ID, title, likelihood (1–5), impact (1–5), owner, mitigation.

### Provenance classes

- `OBSERVED` source-backed. Never silently generate or backfill records.
- `ILLUSTRATIVE` authored for a case study. Always visible in commercial, contract or risk screens.
- `DERIVED` calculated values; render formula, units, assumptions and limitations.

## 3. Calculation contracts

### Production
- `oil_kSm3 = gross_oil_mill_sm3 × 1000`.
- `gas_MMSm3 = gross_gas_bill_sm3 × 1000`.
- `water_kSm3 = produced_water_mill_sm3 × 1000`.
- `monthly_average_bopd = gross_oil_mill_sm3 × 1,000,000 × 6.28981077 / days_in_month`.
- Period totals are sums of source records, **not actual production rates**.
- No measured uptime or well-level resolution in the monthly excerpt.

### Program economics (screening only)
- `portfolio_budget_IDR_M = Σ budget_midr`.
- `risk_weighted_uplift_bopd = Σ uplift_bopd × probability`.
- `expected_gross_daily_IDR = uplift_bopd × probability × oil_price_USD_per_bbl × FX_IDR_per_USD`.
- `simple_gross_payout_days = budget_midr × 10^6 / expected_gross_daily_IDR` when denominator positive.
- All rates and financials are hypothetical, and uplift probability is subjectively assigned.

### Tender evaluation (not PTK-007 implementation)
1. `eligible = qualified && hse_pass && technical_score >= passing_score && price_midr > 0`.
2. `lowest_eligible_bid = min(price_midr among eligible vendors)`.
3. `commercial_score = 100 × lowest_eligible_bid / vendor_bid`.
4. `total_score = (tech_weight × technical_score) + (1 - tech_weight) × commercial_score`.
5. Sort eligible vendors by descending total score; fail-gated vendors never ranked.
6. Weight range 50–90%, threshold adjustable. Explicitly illustrative criteria with no regulatory compliance claim.

### Risk and contract
- `risk_score = likelihood × impact` (ordinal screening, not quantitative risk probability).
- Demo classifications: low 1–4, moderate 5–9, high 10–16, critical 17–25.
- `milestone_completion = Σ weight_of_checked_milestones`.

## 4. Application state and handling

- Navigation via URL hash and selected page CSS class.
- Filter state held in-memory; work package, risk values, contract checkboxes cached in `localStorage` if available.
- Reset actions restore the original illustrative data.
- Download uses Blob and temporary object URLs. No data exfiltration.
- No network requests for data, telemetry or interaction tracking.

## 5. UI engineering and non-functional requirements

- Mobile first CSS breakpoints: <=570px, <=920px, <=1180px.
- Font fallbacks, robust tab sizes, visible focus outlines and semantic form labels.
- SVG trends carry titles/ARIA and data tables supply exact numeric values.
- Pointer-driven Canvas rotation with zoom controls and accessible textual explanation.
- Zero dependency failure mode: open `index.html` offline and navigate all modules.
- Load target: page <1 MB uncompressed excluding optional web font retrieval.
- Browser-only app is **not an access-controlled enterprise system**.

## 6. Recommended v2.0 production architecture

```text
Next.js / TypeScript / Tailwind / ECharts / React Three Fiber
                  │ HTTPS + OIDC/JWT
             FastAPI domain layer
    ├── data ingestion and schema validation
    ├── engineering metrics and unit library
    ├── WP&B/AFE workflows and versioned assumptions
    ├── controlled procurement evaluation module
    ├── contract, deliverable, SLA and risk services
    └── exports / background queue
            │                  │
      PostgreSQL         S3 object storage
        │                    │
 audit trail, RBAC     source extracts, templates
            │
     Observability / CI / governance
```

### Proposed normalized tables
- `asset`, `well`, `production_observation`, `data_source`, `data_ingestion_run`, `data_quality_flag`.
- `work_program`, `work_program_version`, `budget_line`, `economic_assumption`, `technical_opportunity`.
- `tender_package`, `tender_criterion`, `bid`, `bid_score`, `procurement_exception`, `approval`.
- `contract`, `contract_milestone`, `contract_variation`, `contract_deliverable`.
- `risk_item`, `risk_assessment_version`, `mitigation_action`, `management_decision`, `document_export`, `audit_event`.

### Example API signatures (future)
- `GET /api/v1/fields/{field_id}/production?from=2023-01&to=2026-07`.
- `GET /api/v1/ingestions/{run_id}/quality-summary`.
- `POST /api/v1/work-programs/{id}/scenarios` (immutable version IDs).
- `POST /api/v1/tender-packages/{id}/evaluate` (rules version persisted).
- `PATCH /api/v1/contracts/{id}/milestones/{id}` (RBAC and audit required).
- `GET /api/v1/reports/management?period=...`.

### Quality, security and operations gates
- Schema validation, provenance records, mandatory units, duplicate-date checks, robust handling of negative correction entries if additional sources are ingested.
- Contract-aware authorization, full audit logs, secret management, review-before-publication, procurement role segregation.
- Technical domain sign-off for economic models and field-specific assumptions.
- Integration and end-to-end tests; no release without QA signoff.
- Never hardcode confidential vendor values or use public deployment for proprietary data.

## 7. Automated verification checklist

- `tests/test_data.py` validates count (43), no duplicates, date range, identifiers, missing values, expected zero observation, scenario provenance and contract weight sum.
- `node --check assets/app.js` for syntax.
- Manual browser smoke test at desktop/tablet/mobile viewports: navigation, year filter, 3 series, planner edits, vendor exclusions, risk edits, contract checkboxes, CSV exports, 3D pointer/zoom, print preview.

## 8. Known gaps and technical debt

1. HTML, CSS, JS are maintained as one deployable prototype; version 2 should modularize.
2. No server-side access control or data ingestion scheduler.
3. No validation of source freshness beyond explicit `asof` metadata.
4. No official workflow/contract integration; commercial values are fictional.
5. Print uses browser CSS, not a designed, signed official report template.
6. 3D generic facility uses Canvas mathematical projection, not physically validated digital twin geometry.

## Addendum - CV-aligned demonstration v2 technical logic

- `data/rokan_cv_case_illustrative.json` and `data/afe_boq_illustrative.json` are readable source documentation of example inputs; `assets/app.js` embeds equivalent fixtures for local-file execution. The four program scenarios and three vendors are also maintained in JSON, with vendor technical criteria duplicated in `assets/data.js` to preserve file:// support.
- Screening score: `100*(.20*quality + .25*integrity + .25*feasibility + .20*potential + .10*water_tolerance)/5`, rated 1..5. Priority only if score >=70, integrity >=3, feasibility >=3. No scale is calibrated against real reservoir data.
- AFE draft calculation: extended = quantity * unit rate; direct = sum(extended); contingency = direct * contingency percentage; total = direct + contingency. Unit is IDR million. Program budget comparison is a separately simulated independent estimate.
- Technical TBE: criteria weights 35/30/20/15%, normalized score in 0..100; eligible iff qualification + HSE pass + minimum technical + positive price. Composite score follows the existing bounded adjustable tech-commercial model and is an illustration, NOT a procurement-compliant specification.
- LocalStorage keys added: `afe_v2`, `afecont_v2`, `afetarget_v2`, and `vendors`; user can reset draft BOQ and vendor scores.
- Downloads: `PRODOPS_rokan_fictional_screening.csv`, `PRODOPS_DRAFT_AFE_BoQ_illustrative.csv`, `PRODOPS_illustrative_SOW_TOR.md`, and `PRODOPS_fictional_TBE_matrix.csv`.
- Testing: static data integrity + headless Chromium generated from bundled markup/styles/scripts + responsive viewport; note that a direct `file://` or localhost navigation was blocked by the test browser's policy, so headless tests inject identical offline HTML, CSS and JS as a document.
