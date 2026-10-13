# PRODOPS Intelligence — Interview MVP

**Independent petroleum engineering portfolio** for an **Associate Program Engineer (Production & Operations)** interview. This project is **not owned by, affiliated with, approved by, or based on confidential records of PT Pertamina EP Cepu**.

![Release status](https://img.shields.io/badge/release-interview%20MVP-36b8ad)

## What is included

A polished, **zero-build, dependency-free** responsive web dashboard with (original modules plus three CV-aligned additions; see Version 2 below):

1. Executive overview and an interactive, rotatable 3D **illustration** of a generic production facility (not a particular field asset).
2. Production analytics using **43 real monthly observations** from **16/1-12 Troldhaugen**, January 2023 – July 2026, with original units and a source link.
3. CV-aligned **Rokan Reactivation Case** showing CV-reported 101/21/~13 MMBO metrics separately from an invented, eight-row candidate screening matrix.
4. Editable work program and budget **simulations** plus a draft **AFE BOQ**, with itemized costs, contingency and budget variance.
5. Vendor bid screening, fictional **SOW/TOR** and explainable **TBE criterion scoring**, including HSE/qualification gates.
6. Contract deliverables and milestone **simulation**, using weighted progress calculations.
7. Editable 5×5 risk register **simulation** and a management briefing / CSV export.

**Full engineering specifications:** [`docs/PRD.md`](docs/PRD.md), [`docs/TRD.md`](docs/TRD.md), [`docs/UIRD.md`](docs/UIRD.md). 

## Run it now

Fastest: open `index.html` directly in Chrome, Edge, or Firefox. The application bundles its own observed data and illustration; **no account, server, internet connection or installation is necessary**. If online, Google Fonts will enhance the typography; system fonts work offline.

Alternatively:

```bash
cd PRODOPS_Intelligence_MVP
python -m http.server 8080
# navigate to http://localhost:8080
```

## Five-minute interview demonstration

See [`docs/INTERVIEW_DEMO.md`](docs/INTERVIEW_DEMO.md) for a bilingual narrative and defensible responses to sensitive questions. **Version 2:** Rokan Case → Work Program / AFE → Tender / TBE → Risk. Public Production Analytics remains separate. Avoid stating that hypothetical interventions are justified by observed field production alone.

## Data traceability (important)

| Dataset | Classification | Provenance | Units |
| --- | --- | --- | --- |
| `data/troldhaugen_monthly_gross_2023_2026.csv` | **Observed / real / historical** | Norwegian Offshore Directorate, [FactPages Production: Sum Wellbores, Monthly by Field](https://factpages.sodir.no/en/field/TableView/Production/SumWellbores/Monthly), field NPDID 17196400 | Gross oil: million Sm³; gross gas: billion Sm³; field produced water: million Sm³ |
| `data/work_program_scenarios_illustrative.json` | **Illustrative / invented inputs** | Authored solely as a portfolio exercise | IDR million, bopd, days, probability |
| `data/vendor_scenarios_illustrative.json` | **Illustrative / invented inputs** | Authored solely as a portfolio exercise | IDR million, technical score |
| Risk register, milestones | **Illustrative / invented inputs** | Authored solely as a portfolio exercise | Ordinal 1–5, completion % |
| `data/rokan_cv_case_illustrative.json` | **CV statement + separate fictional sample** | Candidate-submitted CV 2-page PDF + eight invented DEMO wells | 101/21/~13 MMBO: CV claim; DEMO rows entirely fictional |
| `data/afe_boq_illustrative.json` | **Illustrative / invented costs** | Authored solely as a portfolio exercise | IDR million per cost item, fictional quantities and rates |

The observed CSV is a **verified, hand-transcribed 43-row excerpt** from the public field-level table. It is **not a full dump** of the official database. No values were synthesized or interpolated. The website has no live feed. Last embedded observation: **July 2026**. See [`docs/DATA_LINEAGE.md`](docs/DATA_LINEAGE.md).

### Units and derived calculations

- `kSm³`: thousand standard cubic meters. Multiply `gross_oil_mill_sm3` and `produced_water_mill_sm3` by `1,000`.
- `MMSm³`: million standard cubic meters. Multiply `gross_gas_bill_sm3` by `1,000`.
- Approximate average oil rate over a calendar month in **bopd** = `gross_oil_mill_sm3 × 1,000,000 × 6.28981077 / calendar_days`. This is a calendar-day average, **not uptime-adjusted well productivity**.
- The work program's `expected gross uplift value/day` = `assumed uplift bopd × probability of success × assumed USD/bbl × assumed IDR/USD`.
- `simple gross payout days` = `assumed investment in IDR / expected gross uplift value/day`. Excludes OPEX, decline, recovery, production constraints, fiscal terms, taxes, time value, commodity differentials and downtime; does not constitute an investment decision or NPV.
- Vendor technical-commercial comparison applies **only to eligible illustrative vendors** and has **no claim of PTK-007 compliance**.

## Source references

- Norwegian Offshore Directorate FactPages — https://factpages.sodir.no/en/field/TableView/Production/SumWellbores/Monthly
- Norwegian Offshore Directorate open data and license — https://www.sodir.no/en/facts/data-and-analyses/open-data/
- SKK Migas CIVD / current publications — https://civd.skkmigas.go.id/
- Job poster supplied by the candidate: **Associate Program Engineer (Production & Operations)**, contractual third-party role. Mapped in `docs/PRD.md`.

## Technologies

**HTML5, CSS3, vanilla JavaScript, native SVG, Canvas 2D mathematical 3D projection, browser localStorage, Blob/CSV export.** No external runtime libraries required. This approach optimizes for guaranteed offline demonstration and transferability. Production architecture for Phase 2: Next.js + TypeScript + Three.js + FastAPI + PostgreSQL (see `docs/TRD.md`).

## Files

```text
index.html
assets/
  app.js      # all UI, calculations, interactive controls and 3D rendering
  data.js     # embeddable data for file:// offline mode
  style.css   # responsive enterprise design system
data/
  rokan_cv_case_illustrative.json
  afe_boq_illustrative.json
  troldhaugen_monthly_gross_2023_2026.csv
  work_program_scenarios_illustrative.json
  vendor_scenarios_illustrative.json
docs/
  PRD.md
  TRD.md
  UIRD.md
  DATA_LINEAGE.md
  CV_ALIGNMENT_UPGRADE.md
  INTERVIEW_DEMO.md
  IMPLEMENTATION_PROMPTS.md
  PHASE_2_ROADMAP.md
tests/
  test_data.py
```

## Safety, compliance and scope limits

- No EP Cepu operational, budget, contractual or vendor data are present.
- No production cause, reserve addition, intervention uplift or vendor capability is claimed without evidence.
- The platform is a **portfolio demonstrator**, not an authorized field operations or procurement application.
- The 3D facility is generic and deliberately does not claim to show Troldhaugen or EP Cepu infrastructure.
- Users are responsible for observing the Norwegian Offshore Directorate's [NLOD open-data license](https://www.sodir.no/en/facts/data-and-analyses/open-data/) and attribution conditions when republishing source data.
- LocalStorage persists illustrative form entries on the user's own browser. Use Reset buttons to restore defaults.

## Next steps

Review the acceptance criteria, then implement real data ingestion with source versioning and richer validation, dedicated well-level datasets, realistic work-pack approval workflows, procurement compliance review by an SCM SME, authentication and audit logging, a proper risk matrix definition, PDF/PPTX exports, production-grade 3D, and CI/CD. See `docs/PHASE_2_ROADMAP.md`.

## Version 2 CV-alignment enhancement (13 October 2026 interview)

Three concrete additions directly address the candidate-submitted CV:

1. **Rokan Reactivation Case** tab: CV-reported 101 screened wells / 21 candidates / approximately 13 MMBO reserve potential (not independently verified); reproducible **eight-row entirely hypothetical** well screening, a transparent weighted rule and integrity/feasibility holds. Download fictional screening CSV.
2. **Work Program & AFE** tab: separate, editable draft **rigless intervention BOQ** with line-item quantities, unit rates, contingency, total estimate, comparison to illustrative program budget, and CSV export. No approval is inferred.
3. **Tender & TBE** tab: exportable fictional SOW/TOR Markdown example; editable four-criterion technical bid scorecard with HSE/qualification eligibility gates and combined commercial scoring. Export fiction-only TBE CSV.

**Start your demo from `#rokan`, not just the public Norwegian production dataset.** This version is meant to show *how* skills stated in the CV could be applied; it does not reconstruct or verify confidential engineering work or procurement evidence. See [`docs/CV_ALIGNMENT_UPGRADE.md`](docs/CV_ALIGNMENT_UPGRADE.md) for precise distinctions, formulas and interview narrative.

Added documentation datasets: `data/rokan_cv_case_illustrative.json`, `data/afe_boq_illustrative.json`. They provide human-readable definitions of the embedded offline examples. All example data used by the interactive file:// website are also bundled in `assets/app.js`.
