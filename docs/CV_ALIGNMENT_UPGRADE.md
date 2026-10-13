# Version 2 - CV-aligned case study and defensible engineering work program

**Purpose:** Align the candidate's independent PRODOPS Intelligence interview portfolio to statements from the exact PDF CV submitted for Associate Program Engineer (Production & Operations), TAD/PT Pertamina EP Cepu.

## Source-of-truth boundaries

1. **Candidate-submitted CV, page 1:** states well evaluation across **101 Rokan candidate wells**, **21 high-potential idle wells** selected, **~13 MMBO in reserve potential**; describes supporting WP&B / AFE, drafting engineering SOW/TOR and co-leading TBE; also mentions contractor-related SLAs. These are **candidate claims, not independently verified public statistics**. Actual well IDs, well-level data, documents, methods and reserves classification were not supplied. Never present ~13 MMBO as proven reserves or as reserves booked by an operator.
2. **Troldhaugen historical public series:** Separate real observed monthly volumes are retained on the Production Analytics tab, sourced from the Norwegian Offshore Directorate. No real Indonesian well data are presented.
3. **Illustrative data:** Eight invented `DEMO-Wxx` candidates are an engineering teaching exercise and **NOT** actual Rokan wells or a sample from the 101 screened wells. All scoring ratings, individual rates, water cuts and decisions are fictional. No confidential data were reconstructed.
4. **Illustrative work package:** AFE rates/quantities are fictional, listed in IDR million, and must not be treated as estimates for a real project, authorized spending or operator cost norms.
5. **Illustrative tender:** Fictional vendors Alpha/Beta/Gamma, fictional SOW/TOR, technical evaluation ratings, weighting and bid prices. This is not a formal evaluation, procurement compliance judgment or authorized award.

## New end-to-end interview narrative

1. Rokan screening: CV-reported scale of effort, then transparent, reproducible invented example scoring; independent integrity and feasibility hold gates.
2. Convert suitable hypothetical candidate to an intervention concept, subject to field validation and approvals.
3. AFE work package: illustrate how budget components are assembled, contingency applied and estimated work package compared against the **separate** program cost assumption.
4. Draft SOW/TOR: define objective, scope, crew/equipment, HSE controls, QC deliverables and acceptance criteria, exclusions.
5. TBE: demonstrate technical weighted score (method 35%, resources 30%, QC 20%, mobilization 15%), HSE/qualification gates, and composite technical-commercial model.
6. Explain exceptions, approval gates, evidence needs and risk mitigations. This is a **decision-support exercise**, not an asset proposal.

## Screening calculation (8 hypothetical rows only)

\[
Score_{100}=100\,\frac{0.20Q+0.25I+0.25F+0.20P+0.10W}{5}
\]

Ratings Q,I,F,P,W are integers 1-5; priority if `Score >=70 AND integrity >=3 AND feasibility >=3`. Water cut and potential bopd are fictional inputs and **not used directly** in score beyond the independently assigned demonstration ratings; the narrative must not imply a calibrated petroleum screening model or reservoir forecast.

## AFE math

- `extended_IDR_M = quantity * rate_IDR_M`
- `direct = sum(extended_IDR_M)`
- `contingency = direct * contingency_pct / 100`
- `total = direct + contingency`
- `budget_headroom = illustrative_program_budget - AFE_total`

Assumptions exclude taxes and costs not in the BOQ, and include no real contract quotation.

## Bid evaluation calculations

- Technical = `0.35*method + 0.30*resources + 0.20*quality + 0.15*mobilization` (each criterion 0-100).
- Eligible if qualified, HSE pass, technical score >= adjustable demo threshold, and price > 0.
- `commercial = 100 * minimum_eligible_bid / bidder_price`.
- `total = technical_weight * technical_score + (1 - technical_weight) * commercial_score`.

The TBE and commercial scoring are **not** validated to meet PTK-007 / internal SCM procedure; all bidder inputs are fictional.

## Where to find it

- Navigation -> Rokan Reactivation Case: CV summary, hypothetical screening, source disclosure, screening export.
- Navigation -> Work Program & AFE: editable draft BOQ, cost summary, reset and CSV export, proposed review gates.
- Navigation -> Tender & TBE: draft SOW/TOR, editable TBE criterion ratings, traceable HSE gates, Markdown & CSV exports.

## Defensible interview statement

> "Dalam CV saya, saya mencantumkan pengalaman screening 101 sumur dan shortlist 21 kandidat, serta potensi sekitar 13 MMBO. Saya tidak memasukkan data sumur perusahaan ke portofolio ini. Sebagai gantinya, saya membangun contoh screening delapan kandidat fiktif untuk menunjukkan prinsip metode, kemudian menghubungkannya ke contoh AFE, SOW/TOR, dan TBE. Angka biaya dan vendor seluruhnya simulasi, bukan dokumen resmi atau data Pertamina EP Cepu."

## Questions the candidate must personally validate

- What exactly did you do versus your team in the Rokan screening, AFE/TBE/SOW and contract workflows?
- Which definition, source and reserves classification supports the "~13 MMBO reserve potential" claim?
- How are the Halliburton dates and role title in the submitted CV reconciled with supporting employment records?
- Are all listed certifications accurate and verified?

Never edit the candidate's experience history based on hypothetical example rows.
