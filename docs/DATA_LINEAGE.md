# Dataset provenance, transcription, and safeguards

## 1. Official source (observed)

**Publisher:** Norwegian Offshore Directorate (Sokkeldirektoratet).  
**Product:** FactPages, Field → Production → Sum wellbores → Monthly – by field.  
**URL:** https://factpages.sodir.no/en/field/TableView/Production/SumWellbores/Monthly  
**Field:** `16/1-12 Troldhaugen`  
**Identifier:** `17196400`  
**Observation granularity:** month  
**Embedded subset:** January 2023 – July 2026, 43 months.  
**Collection date for this exercise:** 12 October 2026.  
**License reference:** https://www.sodir.no/en/facts/data-and-analyses/open-data/ (NLOD open government data, attribution required).

The official page lists **Gross – oil [mill Sm³]**, **Gross – gas [bill Sm³]**, and **Produced water in field [mill Sm³]**. The `data/troldhaugen_monthly_gross_2023_2026.csv` file is a manually transcribed excerpt from those field-level rows, not a complete exported dataset. The observed values are not synthetic.

Data quality notes:
- No rows added outside the public table.
- Zero volumes are preserved, not imputed or labeled as a particular operational event.
- There is no individual well, facility sensor, shutdown log, production allocation, uptime, price or contract data in this subset.
- Apparent changes in a published field series are not conclusive diagnoses.
- The latest embedded row is July 2026, not a current-day measurement.

## 2. Transformations

| Source column | Stored column | Display conversion |
|---|---|---|
| Field (Discovery) | `field` | Unchanged |
| Year, Month | `year`, `month` | Display `MMM YY` |
| Gross – oil [mill Sm³] | `gross_oil_mill_sm3` | Multiply by 1,000 → kSm³ |
| Gross – gas [bill Sm³] | `gross_gas_bill_sm3` | Multiply by 1,000 → MMSm³ |
| Produced water in field [mill Sm³] | `produced_water_mill_sm3` | Multiply by 1,000 → kSm³ |
| NPDID information carrier | `npdid` | Unchanged |
| Derived `source_type` | `source_type` | Constant `observed`, for labeling only |

Oil calendar-day mean is derived using `6.28981077 barrels / Sm³` (standard conversion); it must not be called a measured producing-day rate. Gas oil ratio and field water cut are intentionally **not calculated**, to avoid incorrect assumptions about net/gross accounting and measurement bases.

## 3. Illustrative inputs and separation

All cost amounts are authored for demonstration in **IDR million** and all technical uplift assumptions are invented. These data are **not linked to the Norwegian field**. Vendor A/B/C are anonymous fictional entities, not actual legal companies. This practice is intentional to demonstrate the role's end-to-end decision process without implying real company knowledge.

- `data/work_program_scenarios_illustrative.json` → hypothetical interventions.
- `data/vendor_scenarios_illustrative.json` → fictitious bids.
- `assets/app.js` → risk register and hypothetical contract milestones.

## 4. Fair use and reporting

Reusers should comply with the data publisher's applicable NLOD licensing and attribution requirements. Include the official link and date accessed in slides and the live app. Clarify the observations are from a Norwegian offshore field and that the financial/procurement workflow was designed independently for an Indonesia-oriented portfolio.

## 5. Recommended next evidence upgrade

For a well-level problem identification, source Equinor Volve daily/monthly per-well production records with source license, validate schema and data quality, then evaluate time-series diagnostics against event logs. The public field-level monthlies used here are appropriate for a field performance illustration, **not well-level workover selection**.


## Version 2 - CV claims and separate simulation provenance

The submitted two-page role-targeted CV is the sole source for the Rokan project summary: 101 candidate wells, 21 priority idle wells and approximately 13 MMBO reserve potential. Those claims were **not independently verified** and do not imply access to the original source dataset or reserves classification.

`data/rokan_cv_case_illustrative.json` contains eight newly invented, anonymous DEMO-Wxx candidate profiles to communicate screening mechanics. It is not a subset of 101 wells. `data/afe_boq_illustrative.json` lists seven invented cost items and a fictional 12% contingency. Vendor TBE criteria were invented separately in `data/vendor_scenarios_illustrative.json`. Never commingle these figures with the real Norwegian field-level time series in analysis or publication.
