# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Product:** PRODOPS Intelligence  
**Version:** 1.0 interview MVP + phase-2 specification  
**Date:** 12 October 2026  
**Target narrative:** Associate Program Engineer (Production & Operations) — PT Pertamina EP Cepu  
**Status:** Independent portfolio concept; not an internal EP Cepu product.

## 1. Problem statement

Upstream Production & Operations programs must connect historical performance, opportunities, work programs, financial requests, procurement procedures, contractor execution, operational risk, and management reporting. Disconnected spreadsheets make assumptions and approval status hard to trace. A portfolio prototype should demonstrate **structured, evidence-based reasoning**, not assert suitability for deployment at a KKKS.

## 2. Goals and non-goals

### Goals
- Demonstrate a coherent progression **observed production → engineering screening → work program/budget → vendor evaluation → execution controls → management decision record**.
- Make data provenance, assumptions, units and calculation limitations visible on every screen.
- Support live interview interactions without requiring external services.
- Demonstrate reporting and quantitative judgment using a reliable audit-friendly example.
- Establish clear functional specifications for a future production-grade version.

### Non-goals
- Reconstruct or disclose EP Cepu assets or operational figures.
- Claim actual well intervention diagnoses, production uplift or reserve additions based on field-level monthly data alone.
- Implement an official SKK Migas tender compliance engine, approve bid awards or impersonate contracts.
- Replace an integrated petroleum engineering subsurface suite, SCADA/DCS, ERP, EAM, or HSE assurance system.
- Present historical 2023–July 2026 records as 'today's production.'

## 3. User personas

1. **Associate Program Engineer** — surveillance support, workpack tracking, assumptions, risk log and reporting.
2. **Production Engineering Lead** — review opportunities, constraints, interventions, documentation.
3. **Operations & Facilities** — feasibility, shutdown windows, readiness and execution.
4. **Planning & Cost Control** — budget estimates, KPI and variance discussions.
5. **Supply Chain Management (SCM)** — controls for tender process and procurement documentation.
6. **Management** — review alternatives, evidence quality and decisions.

## 4. Mapping to the provided vacancy

| Vacancy criterion in supplied poster | Product demonstration | Evidence/qualification |
|---|---|---|
| (a) ≥2 years upstream oil & gas experience | Candidate discusses actual professional background in interview, not fabricated by app | Platform cannot prove years of experience |
| (b) Engineering degree | Engineering rationale, production metrics, scenario analysis | Academic qualification proven separately by CV |
| (c) Production operations and proposing work plan & budget | Production Analysis; Work Program & Budget | Observations are real; proposals illustrative |
| (d) Tender package, tender process and bid evaluation | Tender Evaluation | Screening logic is illustrative; operator procedures necessary |
| (e) Design/draft cooperation agreements | Contract Tracker; phase-2 contract scope builder | MVP is **not** an agreement drafting system |
| (f) Coordination, problem-solving, analytical thinking, risk | Decision workflow, stakeholder roles, risk 5×5 | Scenario is an exercise, not operating control |
| (g) Reporting in Word, spreadsheets, PowerPoint | CSV export, print-to-PDF browser output; phase-2 DOCX/PPTX | Current MVP does not yet generate DOCX/PPTX |

## 5. MVP functional requirements and acceptance criteria

### F01 — Executive Overview
- Display data source, field identity, latest observation, four KPIs and trend.
- Display a generic animated, drag-to-rotate facility model clearly labeled illustrative.
- Link to analytics and program screens.
- **Accept:** KPI output uses known conversion factors; no 'live' status in labels.

### F02 — Production Surveillance
- Browse 43 months of field-level public historical gross oil, gross gas, produced-water volumes.
- Filter by start year, switch observed series, inspect tabular readings, export original observation CSV.
- **Accept:** Each shown value is reproduced from the embedded CSV; gas and oil chart units are correctly distinguished.
- **Explicit limitation:** Field-level monthly totals cannot identify a well's specific mechanical problem.

### F03 — Work Program & Budget
- Provide 4 hypothetical, editable work packages and their budget, probability of success, estimated uplift and duration.
- Calculate portfolio sum, probability-weighted uplift and simplified gross payout using editable oil price and FX.
- **Accept:** Changing a value updates summary immediately. All related figures and outputs show simulation caveat.
- **Not covered:** cost classification CAPEX/OPEX, formal WP&B/AFE, operating expenditures, NPV, fiscal framework or budget approvals.

### F04 — Tender Evaluation
- Show 3 anonymous fictitious vendors; a bid price, technical score, HSE gate and qualification gate.
- Configurable technical weight and score threshold; only eligible vendors ranked.
- Normalize commercial score relative to lowest eligible bid price.
- **Accept:** Failing eligibility excludes supplier from scoring/ranking; scores reproducible.
- **Not covered:** PTK-007-defined actual evaluation criteria or procurement approvals.

### F05 — Contract Tracker
- Show a mock contract summary and four deliverable milestones, weights totaling 100%.
- Support checking milestones and calculating weighted completion.
- **Accept:** 15/25/40/20 weighted percentages and reset button work.
- **Not covered:** contract legal drafting, signature management, amendments, variations or payable certification.

### F06 — Risk & Reporting
- Provide 4 hypothetical risks with a configurable likelihood and impact each (1–5), status category and mitigation.
- Show 5×5 visual risk matrix, latest observed production reference, hypothetical program budget, vendor eligibility and illustrative milestone completion.
- Export CSV management brief; support browser print to PDF.
- **Accept:** editing risk updates matrix and report; report labels observed vs illustrative.

## 6. Core demonstration workflow

1. Read the field identity and caveat; explain that the recorded values are Norwegian offshore historical data.
2. Review gross oil and water trend and observation metadata.
3. State that diagnosing causes requires additional well/facility records.
4. Enter one hypothetical intervention into planner and quantify probability-weighted economic sensitivity.
5. Compare anonymous vendors after technical/HSE gates, emphasizing that results are *not contract award decisions*.
6. Inspect risk and generate management brief.

## 7. Success criteria

- All six menu modules can be opened offline and are responsive at 390px, 768px, 1440px widths.
- The app remains readable without web fonts or network/CDN dependencies.
- `python tests/test_data.py` passes schema, date, provenance metadata, numeric range and scenario tests.
- CSV downloads have correctly scoped headers and clear scenario labels.
- Interface never mixes observed figures with fictional costs without explicit labels.
- The full pitch can be completed in <=5 minutes.

## 8. Stakeholder review dependencies for real implementation

Before adaptation for company use, obtain asset ownership confirmation, information security classification, reliable data system interfaces, authoritative unit dictionary, engineer-verified diagnostic models, WP&B/AFE control framework, SKK Migas procurement procedure interpretation by SCM/legal specialists, role-based approvals, document retention rules, and auditability requirements.

## 9. Prioritization

**P0 (interview):** independent real-data surveillance, understandable engineering decision pathway, transparent simulated budget and vendor scoring, risk, exports.  
**P1:** validated Volve well-level production, testable baseline/target logic, approved templates, real source metadata, DOCX/XLSX/PPTX reporting.  
**P2:** authenticated multi-user service, integrations, sophisticated economic models, tender compliance framework, production-grade 3D facilities model, activity/event time series.

## Addendum - CV-aligned interview MVP v2

**Priority user journey:** candidate opens `#rokan` to distinguish the 101/21/~13 MMBO claims as sourced ONLY from the submitted CV; opens an 8-row completely fictional scoring exercise; demonstrates hard hold gates and ranking; uses `#planning` to show a fictional, separate line-item AFE BOQ and contingency; uses `#tender` to show a fictional SOW/TOR and traceable four-criterion TBE with HSE/qualification gates. All components have clearly visible source boundaries and live calculations.

**Functional acceptance:** show provenance on every relevant screen; filter eight invented candidates; export matrix; adjust BOQ quantities/rates and contingency; compare against distinct program budget; export cost build-up; export SOW/TOR; adjust TBE criterion ratings to update rank; disqualify HSE-failed bidder irrespective of high technical score; all flows operable without external API. Do not present actual well IDs or contracts.
