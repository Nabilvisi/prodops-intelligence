# PRODOPS Intelligence v2 — QA report

Validated on 12 October 2026 against updated offline bundle (desktop Chromium 1440x900; mobile Chromium 390x844).

## Automated validations passed

- Python tests: 43 public source monthly observations, chronological data, distinct program and vendor scenario data, CV summary source numbers, eight DEMO candidates, scored priorities, AFE BOQ, TBE criteria weights, seven tabs.
- `node --check assets/app.js`: JavaScript syntax valid.
- Headless Chromium with bundled HTML/CSS/JS injected into a document: **zero uncaught JavaScript exceptions**.
- Seven-page application: checked Overview, Rokan, Production, Work Program & AFE, Tender & TBE, and Risk, plus existing Contract rendering.
- Screening table: eight invented candidates; four meet demonstration priority gate; filter changes row count.
- AFE: seven cost lines, subtotal IDR 1,445 million, contingency IDR 173.4 million, total IDR 1,618.4 million. Editing quantity changes rendered summary.
- TBE: four weighted technical criteria, passing technical score 88.55 for Vendor Alpha; Gamma technical 89.55 but **HSE fails**. Editing/selection and composite scoring render without script errors.
- Downloads triggered for screening CSV, AFE BOQ CSV, fictional SOW/TOR Markdown and TBE CSV.
- Mobile navigation renders the Rokan tab; no document-level horizontal overflow at 390 px.

## Testing limitation

Headless Chromium inside this execution environment returned `ERR_BLOCKED_BY_ADMINISTRATOR` for both `file://` and loopback HTTP URL navigation. We therefore tested the **same bundled HTML/CSS/JavaScript injected** via `page.set_content()`. This verifies client-side rendering and interactions, but is **not** an end-to-end verification of a user's own browser file loading or external deployment. Manual open test in the candidate's own browser is still recommended before the interview.

## Technical / factual limits

- Candidate CV metrics are statements from the submitted CV. No independent verification or field-level source material was available.
- Eight well candidates, BOQ costs, SOW/TOR, tender technical scoring, vendors and prices are invented demonstration fixtures, not field / procurement records.
- Real historical Norwegian production is field-level only and not linked to any Rokan operation or hypothetical intervention uplift.
