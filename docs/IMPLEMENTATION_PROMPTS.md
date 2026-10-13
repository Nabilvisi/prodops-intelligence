# Claude Code / Codex implementation handoff

The ZIP is already a runnable interview MVP. The prompts below focus on **QA and engineering hardening**, then **phase-2 expansion**. Use either coding assistant. Don't ask the assistant to hallucinate unverified datasets or company procedures.

## PROMPT 1 — Verify and polish interview MVP

```text
You are a principal full-stack software engineer, production engineer,
technical product manager, and UX quality reviewer.

INPUT: Unzip PRODOPS_Intelligence_MVP.zip. Treat docs/PRD.md,
docs/TRD.md, docs/UIRD.md, docs/DATA_LINEAGE.md and this repo as
binding specification. Review job-role mapping in docs/PRD.md.

GOAL: Produce a polished, credible, 100%-runnable NEXT-DAY INTERVIEW
PORTFOLIO, using this existing code as baseline. Do not replace the
project with a skeleton or marketing-only mockup.

NON-NEGOTIABLE:
- Preserve all 43 VERIFIED OBSERVED historical rows from the NOD
  16/1-12 Troldhaugen monthly production table.
- Preserve original units and all observed/illustrative classification.
- Distinguish source observations from illustrative interventions,
  vendors, budgets, legal/commercial cases and contracts.
- No private or fabricated PT Pertamina EP Cepu production values,
  tender records, approval status or operational assets.
- No unsupported production-cause claims, AFE/NPV claims or PTK-007
  compliance assertions.
- Generic 3D facility is an illustration, not a field digital twin.

DO NOW:
1) Inspect and run the existing offline index.html; test every module.
2) Test responsive widths 390px, 768px, 1440px; fix any overflow.
3) Test navigation, historical chart/filter, work package edits,
   economics, HSE vendor gating, technical scoring, milestone weights,
   risk heatmap, print/CSV exports and reset controls.
4) Add automated test coverage where practical without introducing a
   runtime CDN dependency. Fix any bugs and make data inputs robust.
5) Refine spacing, visual hierarchy, legibility, focus states, reduced
   motion behavior, empty/error states, tooltip and mobile navigation.
6) Verify source URLs and update source/data lineage only when verified.
7) Preserve a local offline entry point and create a production-ready
   GitHub Pages / Vercel STATIC deploy option with no secrets.
8) Add screenshots and a short RELEASE_NOTES.md with tests/results.

DELIVERABLES:
- Fully working and verified application, not pseudocode.
- Updated PRD/TRD/UIRD aligned with actual implementation.
- README with one-click local run, deployment, and exact live-demo script.
- A concise list of what is REAL, what is ILLUSTRATIVE, and what is FUTURE.
- No silent assumptions; mark missing inputs as blockers instead of
  inventing production, vendor, or contractual evidence.

Run tests/build and report exact commands plus results. Do not claim a
successful deployment unless a live URL was actually verified.
```

## PROMPT 2 — Expand into flagship engineering platform

```text
Act as a senior product owner and staff software engineer with upstream
production engineering, procurement governance, and petroleum economics
experience.

INPUT: Existing PRODOPS Intelligence MVP code and docs/PRD.md, TRD.md,
UIRD.md, DATA_LINEAGE.md and PHASE_2_ROADMAP.md.

OBJECTIVE: Evolve the current runnable interview prototype into a
professionally architected, interactive, responsive full-stack portfolio.
Retain the operational decision workflow and visible data source labels.

BUILD:
A. Next.js App Router / TypeScript / Tailwind / shadcn UI frontend.
B. Motion with Framer Motion and 3D illustrative scene with Three.js /
   React Three Fiber, lazy-loading, fallback and reduced-motion support.
C. ECharts/Plotly graphics and traceable engineering calculations.
D. FastAPI backend, PostgreSQL data store, data dictionaries, source
   ingestion with lineage versioning, validation and audit logs.
E. Optional approved Volve well-level dataset integration if license and
   real files are verified. Never substitute generated production values.
F. Typed domain models for Work Program, Budget/AFE screening, Tender,
   Contract, Contractor Performance, Risk and Management Reporting.
G. Excel/Word/PowerPoint/PDF export formats with provenance footers.
H. A scenario sandbox explicitly segregated from observed production.
I. Real automated tests, performance review, accessibility QA, secure
   config and deployment docs.

ENGINEERING CORRECTNESS:
- Do not infer intervention uplift from field-level production totals.
- Do not present a simple gross payback as NPV/IRR or approved economics.
- Show rate/volume units, account for gross-vs-net accounting, time
  bases and missing values; verify data quality before interpretation.
- Keep commercial scenarios fictional unless authorized primary data
  and an operator-approved tender rule set are supplied.
- Cite and version regulatory references; do not claim PTK-007
  compliance without a formal procedures review.
- Never use proprietary company or personal interview files publicly.

WORKFLOW:
1) Audit existing repo; map current coverage to each PRD criterion.
2) Propose a short, implementation-ready task breakdown with dependencies.
3) Build iteratively and run tests after every milestone.
4) Update PRD/TRD/UIRD and validation evidence as features are completed.
5) Produce a polished README, Docker/dev instructions, and clean Git
   commit history. Request explicit permission before pushing/deploying.
6) Only deliver a URL when the deployed app is tested.

SUCCESS CRITERION: Real data + transparent analyses + professional
operational planning UX, not animation-only styling and not a fake
enterprise dataset.
```

## After unzipping

- Claude Code: copy Prompt 1 into Claude Code at repo root.
- Codex: copy Prompt 1 into Codex at repo root.
- After validated MVP, optionally use Prompt 2 to plan the full-stack expansion.
- For next-day interviews, prefer keeping the working static version rather than attempting an untested overnight migration.
