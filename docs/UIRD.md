# USER INTERFACE REQUIREMENTS DOCUMENT (UIRD)

**Product:** PRODOPS Intelligence  
**Design approach:** Modern, dark, high-density but legible operations command center.  
**Design objective:** Convey the end-to-end Production & Operations engineering workflow to both engineers and operations managers.

## 1. Design principles

1. **Evidence first:** Historical measured production never visually blends with simulated commercial data.
2. **High trust:** Every number exposes unit, temporal coverage and classification where relevant.
3. **Decision workflow:** Information hierarchy follows observe → evaluate → plan → source → execute → report.
4. **Motion with purpose:** Light entry transitions, plotting, and illustrative 3D; avoid animation obscuring data.
5. **Enterprise usability:** Interactions are clear to a hiring manager in a five-minute live walkthrough.
6. **Progressive disclosure:** Primary KPI above technical tables, caveats close to relevant calculations.

## 2. Design tokens

| Token | Value | Intended use |
|---|---|---|
| Background | `#070d17` | Application canvas |
| Sidebar | `#0a1220` | Persistent navigation |
| Surface | `#101c2b` | Panels and charts |
| Surface elevated | `#142235` | Active controls |
| Border | `#24374c` | Soft structural separators |
| Main text | `#e9f2fa` | Titles and data |
| Muted text | `#8c9db2` | Secondary context |
| Teal accent | `#50e2d2` | Primary actions / observed state |
| Amber | `#edbf73` | Illustrative data warning |
| Blue | `#58aaff` | Supportive information |
| Danger | `#fa8585` | Ineligible/risk indications |
| Heading type | Inter Display / Segoe UI / system | Local font fallback |
| Body type | Inter / Segoe UI / system | Local font fallback |

Spacing scales: 4, 8, 12, 16, 24, 32, 40 pixels. Radius: 6–14 pixels. Transitions: 160–400 milliseconds. Layout: max-width 1610 px; left nav ~256 px desktop.

## 3. Information architecture

```text
Executive Overview
├── Field disclosure / hero / generic 3D facility
├── Snapshot KPI and real historical trend
├── Decision pathway
└── Evidence boundaries

Production Analytics
├── Field reference and observation time
├── Start-year filter and CSV export
├── Oil / gas / water observed series
├── Readable source observation table
└── Interpretation limitations

Work Program & Budget
├── Hypothetical program KPIs
├── Program comparison
├── Scenario editor
└── Economic assumptions and exclusions

Tender Evaluation
├── Hypothetical procurement disclosure
├── Weight and threshold controls
├── Eligibility / ranking table
└── Procurement procedural references

Contract Tracker
├── Hypothetical contract metadata
└── Weighted completion milestone checklist

Risk & Reporting
├── Hypothetical 5×5 risk matrix
├── Likelihood / impact editor
├── Mitigation and owner
└── Exportable management snapshot
```

## 4. Page components and behavior

### Overview
- Topbar: breadcrumb, fixed "DATA: HISTORICAL · NOT LIVE" label, CSV shortcut.
- Hero: two-column display with purposeful visual hierarchy, call-to-action to Production and Planning.
- Interactive 3D: generic facility model on Canvas mathematical perspective. Horizontal drag rotates the scene; buttons zoom. Clearly marked **ILLUSTRATIVE**.
- KPIs: most recent Jul 2026 production, last month oil/water volumes, embedded coverage.
- Trend: graphical gross oil volume in kSm³, time axis and exact-point tooltips in SVG title elements.
- Footer: independent/non-affiliated portfolio attribution.

### Production
- Start-year select: updates filtered monthly series and derived totals.
- 3 series switches: oil and water in kSm³/month, gas in MMSm³/month.
- Graph and data table update simultaneously.
- CSV action exports original observations, including source class metadata.
- Interpretive notes avoid asserting zero production is a verified equipment shutdown.

### Planning
- Program table lists ID, project name, hypothetical IDR M, probability, priority.
- Editable inputs: budget, expected bopd uplift, probability, duration, oil price and FX.
- Changes update budget KPI and payback panel without reload.
- Reset restores the original scenarios. Values persist locally in the user's browser when localStorage is available.
- Caveat appears immediately above calculated scenario output.

### Tender
- Technical weight 50–90%, passing score 1–100.
- Ranking respects HSE and qualification gates; a vendor failing gates must display "Not eligible".
- Price comparison normalized to lowest qualified price among eligible offers.
- Refer to SKK Migas CIVD as a context link, not as confirmation of operator compliance.

### Contract
- Four milestones, each checkbox interactive.
- Progress bar is always the sum of completed milestone weights, total 100%.
- Reset clears milestone completion.

### Risk & reporting
- Risk heatmap uses categorical scale and numeric score. Avoid relying only on color.
- Editing likelihood/impact updates the risk position and label.
- Summary cards separate observed production reference from hypothetical business and risk figures.
- CSV export and print buttons have the intended actions.

## 5. Responsive behavior

- >=1181 px: persistent 256 px sidebar, four-column KPI grid, two-column content panels and side-by-side hero/3D.
- 921–1180 px: 216 px sidebar; tighter metrics and layout.
- 571–920 px: off-canvas sidebar opened by menu toggle, stacked panels, two-column KPIs, stacked hero.
- <=570 px: one-column forms, reduced paddings, responsive charts, horizontally scrollable engineering tables.

## 6. Accessibility expectations

- Visible keyboard focus rings on buttons, form controls, and links.
- Native form inputs with labels, button semantics and ARIA label on the generic facility canvas.
- No critical data shown only in 3D or color: a text table and notes carry exact observations.
- Don't require drag interaction to use app. Zoom buttons optional.
- For future production release: test WCAG 2.2 AA contrast, screen reader, full keyboard order and reduced-motion preferences.

## 7. Content and terminology rules

Use: *observed*, *historical*, *assumed*, *illustrative*, *indicative*, *screening*, *proposed*, *requires validation*. Avoid: *actual EP Cepu production*, *live asset monitoring*, *official tender result*, *validated vendor ranking*, *approved AFE*, *measured incremental oil*, *certified financial return*, *digital twin of field*.

## 8. UX acceptance scenarios

1. A non-technical interviewer sees within 10 seconds what the project does and why real vs illustrative data differ.
2. Engineer can trace the latest displayed oil volume to the table and source, with correct units.
3. User changes a program's probability and sees related calculation respond.
4. User changes technical weight, but a vendor failing HSE stays excluded.
5. Contract completion updates from 0% to 15% when first milestone checked.
6. User can print management snapshot with scenario caveats.
7. No external accounts or setup required during interview.

## Addendum - interview demonstration v2

- Add navigation item `Rokan Reactivation Case`, between production and planning. Re-index 7 total sections.
- New CV evidence metrics show provenance badges `CV CLAIM` and a conspicuous advisory explaining no actual well-level data are present.
- Anonymous candidate matrix has an All / Priority / Hold filter and CSV export; decision logic and gate definitions are placed immediately below the matrix.
- Work Program page includes an editable draft AFE BOQ grid and financial summary with a distinct program budget comparison. Never show a "Approved" state.
- Tender page contains a static, downloadable fictional SOW/TOR followed by editable TBE breakdown with explicit HSE gate. Responsive layouts wrap the BOQ and approval rail on mobile.
- All new cards match existing dark enterprise visual hierarchy and respond to smaller screens.
