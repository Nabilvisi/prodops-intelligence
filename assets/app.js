(() => {
'use strict';
const DATA = window.PRODOPS_DATA;
if (!DATA || !Array.isArray(DATA.production)) {
  document.body.textContent = 'Data manifest unavailable';
  return;
}
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const fmt = (v, d = 1) => Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const round = (v, d = 1) => Number.isFinite(v) ? fmt(v, d) : 'n/a';
const sm3tobbl = 6.28981077;

const defaultPlans = JSON.parse(JSON.stringify(DATA.programs));
const defaultVendors = JSON.parse(JSON.stringify(DATA.vendors));
const initialRisks = [
  { id: 'R-01', title: 'Operational execution delay', likelihood: 3, impact: 3, owner: 'Operations', mitigation: 'Verify workpack readiness, materials and coordination before schedule commitment.' },
  { id: 'R-02', title: 'Uncertain intervention response', likelihood: 4, impact: 4, owner: 'Production Engineering', mitigation: 'Request well-level diagnostics and sensitivity analysis before AFE submission.' },
  { id: 'R-03', title: 'Contractor HSE non-conformance', likelihood: 2, impact: 5, owner: 'HSE / Supply Chain', mitigation: 'Verify qualifications and HSE gates, then apply approved assurance process.' },
  { id: 'R-04', title: 'Budget scope growth', likelihood: 3, impact: 4, owner: 'Program Management', mitigation: 'Document assumptions, change controls and delegated approvals.' }
];

const deep = (x) => JSON.parse(JSON.stringify(x));
const safeStore = (k, v) => { try { localStorage.setItem('prodops_' + k, JSON.stringify(v)); } catch (e) {} };
const safeLoad = (k, f) => { try { const v = JSON.parse(localStorage.getItem('prodops_' + k)); return v ?? deep(f); } catch (e) { return deep(f); } };

let plans = safeLoad('plans', defaultPlans);
let vendors = safeLoad('vendors', defaultVendors);
let risks = safeLoad('risks', initialRisks);
let milestones = safeLoad('milestones', [false, false, false, false]);

let state = { page: 'overview', startYear: 2023, series: 'oil', currentPlan: 0, currentRisk: 0 };
let toastTimer;

function toast(t) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = t;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2700);
}

function download(name, content, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}

function csv(rows) {
  return rows.map(row => row.map(val => {
    const s = String(val ?? '');
    return /[",\r\n]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s;
  }).join(',')).join('\r\n') + '\r\n';
}

function switchPage(p, changeHash = true) {
  if (!$('#page-' + p)) return;
  state.page = p;
  $$('.page').forEach(el => el.classList.toggle('visible', el.id === 'page-' + p));
  $$('.nav-link').forEach(el => el.classList.toggle('active', el.dataset.page === p));
  const titles = {
    'overview': 'EXECUTIVE OVERVIEW',
    'production': 'PRODUCTION ANALYTICS',
    'rokan': 'ROKAN IDLE WELL SCREENING',
    'planning': 'WORK PROGRAM & AFE',
    'tender': 'TENDER & TBE',
    'contract': 'CONTRACT TRACKER',
    'risk': 'RISK & REPORTING'
  };
  $('#breadcrumb').textContent = titles[p] || 'EXECUTIVE OVERVIEW';
  $('#sidebar').classList.remove('open');
  const sourceContext = {
    'overview': 'PUBLIC DATA + SIMULATIONS',
    'production': 'OBSERVED / NOT LIVE',
    'rokan': 'ROKAN SCREENING / VERIFIED MATRIX',
    'planning': 'ILLUSTRATIVE / NOT APPROVED',
    'tender': 'FICTIONAL BIDS / NOT AWARDED',
    'contract': 'ILLUSTRATIVE / NOT LIVE',
    'risk': 'DEMO RISK / NOT APPROVED'
  };
  const pill = $('.source-pill');
  if (pill) {
    pill.innerHTML = '<span class="tiny-dot ' + (p === 'production' || p === 'rokan' ? 'teal' : 'amber') + '"></span> ' + (sourceContext[p] || 'DATA GOVERNANCE');
  }
  if (changeHash) history.replaceState(null, '', '#' + p);
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (p === 'risk') renderRisks();
}

function observed() {
  return DATA.production.filter(p => p.year >= state.startYear);
}

function latest() {
  return DATA.production[DATA.production.length - 1];
}

function toOilK(p) {
  return p.gross_oil_mill_sm3 * 1000;
}

function volume(p, key) {
  return key === 'oil' ? p.gross_oil_mill_sm3 * 1000 :
         key === 'water' ? p.produced_water_mill_sm3 * 1000 :
         p.gross_gas_bill_sm3 * 1000;
}

const seriesDef = {
  oil: { color: '#50e2d2', title: 'Gross oil', units: 'thousand Sm³/month' },
  water: { color: '#58aaff', title: 'Produced water', units: 'thousand Sm³/month' },
  gas: { color: '#a78bfa', title: 'Gross gas', units: 'million Sm³/month' }
};

function metric(label, value, detail, symbol = '↗') {
  return `<div class="metric"><div class="metric-label"><span>${label}</span><span class="metric-symbol" aria-hidden="true">${symbol}</span></div><div class="metric-value">${value}</div><div class="metric-detail">${detail}</div></div>`;
}

function renderKPIs() {
  const records = observed(), last = latest();
  const totalOil = records.reduce((s, r) => s + toOilK(r), 0);
  const totalWater = records.reduce((s, r) => s + r.produced_water_mill_sm3 * 1000, 0);
  const totalGas = records.reduce((s, r) => s + r.gross_gas_bill_sm3 * 1000, 0);
  const days = new Date(last.year, last.month, 0).getDate();
  const rate = last.gross_oil_mill_sm3 * 1e6 * sm3tobbl / days;

  $('#overviewKPIs').innerHTML =
    metric('LATEST GROSS OIL', `${fmt(rate, 0)} bopd`, 'Jul 2026 · monthly average · calculated', '⌁') +
    metric('LATEST OIL VOLUME', `${fmt(toOilK(last), 2)} kSm³`, 'Observed Jul 2026 · gross volume', '◈') +
    metric('LATEST WATER VOLUME', `${fmt(last.produced_water_mill_sm3 * 1000, 2)} kSm³`, 'Observed Jul 2026 · field water', '◌') +
    metric('DATA COVERAGE', `${DATA.production.length} months`, 'Jan 2023 – Jul 2026 · historical series', '▥');

  $('#prodKPIs').innerHTML =
    metric('PERIOD OIL VOLUME', `${fmt(totalOil, 2)} kSm³`, `${state.startYear}–2026 · cumulative gross oil`, '◈') +
    metric('PERIOD GAS VOLUME', `${fmt(totalGas, 2)} MMSm³`, `${state.startYear}–2026 · gross gas`, '⌁') +
    metric('PERIOD WATER VOLUME', `${fmt(totalWater, 2)} kSm³`, `${state.startYear}–2026 · produced water`, '◌') +
    metric('MONTHS IN PERIOD', `${records.length}`, 'Monthly public records', '▥');
}

function monthLabel(r) {
  return new Date(r.year, r.month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function svgLine(records, key, large = false) {
  if (!records.length) return '<div>No observations available</div>';
  const width = 880, h = large ? 330 : 235, left = 55, right = 18, top = 18, bottom = 38;
  const w = width - left - right, hh = h - top - bottom;
  const vals = records.map(r => volume(r, key)), max = Math.max(1, ...vals) * 1.12, min = 0;
  const stroke = seriesDef[key].color;

  const x = i => left + (records.length === 1 ? 0.5 : i / (records.length - 1)) * w;
  const y = v => top + hh - (v - min) / (max - min) * hh;

  let grid = '';
  for (let i = 0; i < 5; i++) {
    const vy = max * (4 - i) / 4, py = top + hh * i / 4;
    grid += `<line x1="${left}" x2="${width - right}" y1="${py.toFixed(1)}" y2="${py.toFixed(1)}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3 6"/><text x="${left - 12}" y="${(py + 4).toFixed(1)}" fill="#94a3b8" text-anchor="end" font-size="11" font-family="monospace">${fmt(vy, 1)}</text>`;
  }

  const path = vals.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(2) + ' ' + y(v).toFixed(2)).join(' ');
  const area = path + ` L${x(records.length - 1).toFixed(2)} ${top + hh} L${x(0).toFixed(2)} ${top + hh} Z`;

  let labels = '', markers = '';
  const tick = Math.max(1, Math.ceil(records.length / 7));
  records.forEach((r, i) => {
    if (i % tick === 0 || i === records.length - 1) {
      labels += `<text x="${x(i).toFixed(1)}" y="${h - 10}" fill="#94a3b8" text-anchor="middle" font-size="11">${monthLabel(r)}</text>`;
    }
    markers += `<circle cx="${x(i).toFixed(1)}" cy="${y(vals[i]).toFixed(1)}" r="${large ? 3.5 : 2.5}" fill="${stroke}" stroke="#0b111a" stroke-width="1.8"><title>${monthLabel(r)}: ${fmt(vals[i], 2)} ${seriesDef[key].units}</title></circle>`;
  });

  return `<svg viewBox="0 0 ${width} ${h}" role="img" aria-label="${seriesDef[key].title} trend chart"><defs><linearGradient id="fade-${key}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${stroke}" stop-opacity=".28"/><stop offset="1" stop-color="${stroke}" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${area}" fill="url(#fade-${key})"/><path d="${path}" fill="none" stroke="${stroke}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>${markers}${labels}</svg>`;
}

function renderProduction() {
  renderKPIs();
  $('#overviewChart').innerHTML = svgLine(DATA.production.slice(-18), 'oil');
  $('#productionChart').innerHTML = svgLine(observed(), state.series, true);
  const def = seriesDef[state.series];
  $('#seriesLegend').innerHTML = `<i class="legend-color ${state.series}"></i>${def.title} · ${def.units}`;
  $('#monthlyRows').innerHTML = observed().slice().reverse().map(r => `<tr><td>${monthLabel(r)}</td><td>${fmt(r.gross_oil_mill_sm3 * 1000, 2)}</td><td>${fmt(r.gross_gas_bill_sm3 * 1000, 2)}</td><td>${fmt(r.produced_water_mill_sm3 * 1000, 2)}</td></tr>`).join('');
}

function renderWork() {
  const budget = plans.reduce((s, p) => s + p.budget_midr, 0);
  const uplift = plans.reduce((s, p) => s + p.uplift_bopd * p.probability, 0);

  $('#budgetKPIs').innerHTML =
    metric('TOTAL PROPOSED BUDGET', `IDR ${fmt(budget, 0)} M`, 'Illustrative screening total', '▤') +
    metric('PROGRAM COUNT', `${plans.length}`, 'Engineering work packages', '▦') +
    metric('RISK-WEIGHTED UPLIFT', `${fmt(uplift, 1)} bopd`, 'Probability-adjusted screening', '⌁') +
    metric('HIGH PRIORITY', `${plans.filter(p => p.priority === 'High').length} packages`, 'Screened for schedule focus', '◇');

  $('#workRows').innerHTML = plans.map(p => `<tr><td><strong>${p.id}</strong><small>${p.title}</small></td><td>${fmt(p.budget_midr, 0)}</td><td>${fmt(p.probability * 100, 0)}%</td><td><span class="state-badge ${p.priority === 'High' ? 'review' : ''}">${p.priority}</span></td></tr>`).join('');

  const e = $('#planSelect');
  e.innerHTML = plans.map((p, i) => `<option value="${i}">${p.id} / ${p.title}</option>`).join('');
  e.value = state.currentPlan;
  renderPlanDetail();
}

function renderPlanDetail() {
  const p = plans[state.currentPlan];
  const fields = [
    ['planBudget', 'budget_midr'],
    ['planUplift', 'uplift_bopd'],
    ['planDuration', 'duration_days']
  ];
  for (const [id, key] of fields) $('#' + id).value = p[key];
  $('#planProb').value = +(p.probability * 100).toFixed(1);
  renderPlanMath();
}

function renderPlanMath() {
  const p = plans[state.currentPlan];
  const price = +$('#oilPrice').value || 0;
  const fx = +$('#fxRate').value || 0;
  const expected = p.uplift_bopd * p.probability * price * fx;
  const payoff = expected > 0 ? (p.budget_midr * 1e6) / expected : Infinity;
  const e = $('#planResult');
  e.innerHTML = `<small>EXPECTED GROSS INCREMENTAL VALUE / DAY</small><strong>IDR ${round(expected / 1e6, 3)} M</strong><small>Indicative simple gross payout: <b>${Number.isFinite(payoff) ? fmt(payoff, 0) + ' producing days' : 'n/a'}</b> · excludes operating costs, decline, fiscal terms, taxes & downtime.</small>`;
}

function updatePlan() {
  const p = plans[state.currentPlan];
  p.budget_midr = Math.max(0, +$('#planBudget').value || 0);
  p.uplift_bopd = Math.max(0, +$('#planUplift').value || 0);
  p.duration_days = Math.max(1, +$('#planDuration').value || 1);
  p.probability = Math.min(100, Math.max(0, +$('#planProb').value || 0)) / 100;
  safeStore('plans', plans);
  const b = $('#planSelect').value;
  renderWork();
  $('#planSelect').value = b;
  renderAFETotal();
}

function scoreVendors() {
  const weight = +$('#techWeight').value / 100;
  const threshold = +$('#minTechnical').value || 75;
  const approved = vendors.filter(v => v.hse_pass && v.qualified && technicalScore(v) >= threshold && v.price_midr > 0);
  const minPrice = approved.length ? Math.min(...approved.map(v => v.price_midr)) : NaN;
  return vendors.map(v => {
    const eligible = approved.includes(v);
    const commercial = eligible ? (100 * minPrice / v.price_midr) : 0;
    return {
      ...v,
      eligible,
      comScore: commercial,
      technical_score: technicalScore(v),
      total: eligible ? (weight * technicalScore(v) + (1 - weight) * commercial) : NaN
    };
  }).sort((a, b) => Number(b.eligible) - Number(a.eligible) || ((b.total || 0) - (a.total || 0)));
}

function renderTender() {
  const w = +$('#techWeight').value;
  $('#techWeightLabel').textContent = `${w}% technical / ${100 - w}% commercial`;
  const scored = scoreVendors();
  let rank = 0;
  $('#vendorRows').innerHTML = scored.map(v => {
    if (v.eligible) rank++;
    return `<tr><td><strong>${v.name}</strong><small>${v.id}</small></td><td>${fmt(v.technical_score, 2)}</td><td>${fmt(v.price_midr, 0)}</td><td>${v.hse_pass ? 'Pass' : 'Fail'}</td><td>${v.qualified ? 'Yes' : 'No'}</td><td>${v.eligible ? fmt(v.total, 1) : '—'}</td><td><span class="state-badge ${v.eligible ? '' : 'fail'}">${v.eligible ? 'Rank ' + rank : 'Not eligible'}</span></td></tr>`;
  }).join('');
}

const contractMilestones = [
  { title: 'Kick-off and approved scope', weight: 15, description: 'Scope, deliverables and HSE controls agreed' },
  { title: 'Mobilization readiness', weight: 25, description: 'Mobilization plan and resources validated' },
  { title: 'Field diagnostics delivered', weight: 40, description: 'Technical report and evidence submitted' },
  { title: 'Final acceptance and closeout', weight: 20, description: 'Deliverables reviewed and formally closed' }
];

function renderContract() {
  const total = contractMilestones.reduce((s, m, i) => s + (milestones[i] ? m.weight : 0), 0);
  $('#contractPct').textContent = total + '%';
  $('#contractProgress').firstElementChild.style.width = total + '%';
  $('#contractMilestones').innerHTML = contractMilestones.map((m, i) => `<label class="milestone"><input type="checkbox" data-mile="${i}" ${milestones[i] ? 'checked': ''}/><span><strong>${m.title}</strong><small>${m.description}</small></span><span class="milestone-weight">${m.weight}%</span></label>`).join('');
  $$('[data-mile]').forEach(e => e.addEventListener('change', () => {
    milestones[+e.dataset.mile] = e.checked;
    safeStore('milestones', milestones);
    renderContract();
  }));
}

function riskLevel(v) {
  return v <= 4 ? 'low' : v <= 9 ? 'moderate' : v <= 16 ? 'high' : 'critical';
}

function renderRisks() {
  const cur = risks[state.currentRisk];
  $('#riskSelect').innerHTML = risks.map((r, i) => `<option value="${i}">${r.id} — ${r.title}</option>`).join('');
  $('#riskSelect').value = state.currentRisk;
  $('#riskL').value = cur.likelihood;
  $('#riskI').value = cur.impact;

  let matrix = '';
  for (let l = 5; l >= 1; l--) {
    for (let i = 1; i <= 5; i++) {
      const n = l * i, items = risks.filter(r => r.likelihood === l && r.impact === i);
      const sel = cur.likelihood === l && cur.impact === i;
      matrix += `<div class="risk-cell ${riskLevel(n)} ${sel ? 'selected' : ''}" title="Likelihood ${l}, Impact ${i}"><span>${n}</span><small>${items.length ? items.map(r => r.id).join(' · ') : 'L' + l + ' / I' + i}</small></div>`;
    }
  }
  $('#riskMatrix').innerHTML = matrix;
  $('#riskResult').innerHTML = `<small>INHERENT RISK / EVALUATION</small><strong>${cur.likelihood} × ${cur.impact} = ${cur.likelihood * cur.impact} / ${riskLevel(cur.likelihood * cur.impact).toUpperCase()}</strong><small>Evaluation metric for operational planning and mitigation priority.</small>`;
  $('#riskDetails').innerHTML = `<div class="method-notes"><div><strong>Accountable function</strong><p>${cur.owner}</p></div><div><strong>Mitigation consideration</strong><p>${cur.mitigation}</p></div></div>`;
  renderBrief();
}

function renderBrief() {
  const last = latest(), budget = plans.reduce((s, p) => s + p.budget_midr, 0);
  const eligible = scoreVendors().filter(v => v.eligible);
  const contractPct = contractMilestones.reduce((s, m, i) => s + (milestones[i] ? m.weight : 0), 0);
  $('#briefContent').innerHTML = `
    <div class="brief-item"><small>Last public observation</small><strong>Jul 2026</strong><p>Gross oil ${fmt(last.gross_oil_mill_sm3 * 1000, 2)} kSm³ · Troldhaugen observed series</p></div>
    <div class="brief-item"><small>Program budget (screened)</small><strong>IDR ${fmt(budget, 0)} M</strong><p>${plans.length} proposed work packages</p></div>
    <div class="brief-item"><small>Vendor screening</small><strong>${eligible.length} eligible</strong><p>Screened against technical score &amp; HSE gates</p></div>
    <div class="brief-item"><small>Contract progress</small><strong>${contractPct}%</strong><p>Weighted milestone completion</p></div>
    <div class="brief-item"><small>Critical risk items</small><strong>${risks.filter(r => r.likelihood * r.impact >= 10).length} high+</strong><p>Score ≥10 on operational 5×5 matrix</p></div>
    <div class="brief-item"><small>Governance &amp; controls</small><strong>Engineering + SCM</strong><p>Asset workpacks, vendor qualifications and delegated authorizations</p></div>
  `;
}

function exportProduction() {
  const rows = [
    ['field', 'year', 'month', 'gross_oil_mill_sm3', 'gross_gas_bill_sm3', 'produced_water_mill_sm3', 'npdid', 'source_type'],
    ...DATA.production.map(x => [x.field, x.year, x.month, x.gross_oil_mill_sm3, x.gross_gas_bill_sm3, x.produced_water_mill_sm3, x.npdid, x.source_type])
  ];
  download('troldhaugen_observed_monthly_2023_2026.csv', csv(rows));
  toast('Historical production CSV exported');
}

function exportBrief() {
  const last = latest(), budget = plans.reduce((s, p) => s + p.budget_midr, 0);
  const rows = [
    ['metric', 'value', 'classification'],
    ['field', DATA.field, 'observed'],
    ['latest_period', `${last.year}-${String(last.month).padStart(2, '0')}`, 'observed'],
    ['latest_gross_oil_mill_sm3', last.gross_oil_mill_sm3, 'observed'],
    ['total_program_budget_IDR_M', budget, 'illustrative'],
    ['expected_uplift_bopd', plans.reduce((s, p) => s + p.probability * p.uplift_bopd, 0), 'illustrative'],
    ['eligible_supplier_count', scoreVendors().filter(x => x.eligible).length, 'illustrative'],
    ['contract_weighted_progress_pct', contractMilestones.reduce((s, m, i) => s + (milestones[i] ? m.weight : 0), 0), 'illustrative'],
    ['source_url', DATA.source, 'reference']
  ];
  download('PRODOPS_management_brief.csv', csv(rows));
  toast('Management briefing CSV exported');
}

// ----------------------------------------------------------------------
// CV-aligned additions (v2): Rokan well reactivation, AFE BOQ, SOW & TBE
// ----------------------------------------------------------------------
const CV = DATA.cv_provenance;
const hypotheticalWells = [
  { id: 'DEMO-W01', wc: 30, uplift: 150, q: 5, i: 4, f: 5, p: 5, w: 4 },
  { id: 'DEMO-W02', wc: 57, uplift: 95, q: 4, i: 4, f: 4, p: 4, w: 3 },
  { id: 'DEMO-W03', wc: 88, uplift: 18, q: 4, i: 3, f: 2, p: 1, w: 1 },
  { id: 'DEMO-W04', wc: 23, uplift: 185, q: 3, i: 2, f: 4, p: 5, w: 5 },
  { id: 'DEMO-W05', wc: 42, uplift: 115, q: 4, i: 5, f: 4, p: 4, w: 4 },
  { id: 'DEMO-W06', wc: 73, uplift: 45, q: 3, i: 4, f: 3, p: 2, w: 2 },
  { id: 'DEMO-W07', wc: 35, uplift: 125, q: 5, i: 3, f: 4, p: 4, w: 4 },
  { id: 'DEMO-W08', wc: 65, uplift: 65, q: 2, i: 2, f: 2, p: 3, w: 2 }
];

const originalAFE = [
  { id: 'BOQ-01', desc: 'Well history verification & program design', unit: 'lot', qty: 1, rate: 85 },
  { id: 'BOQ-02', desc: 'Site access and HSE readiness', unit: 'lot', qty: 1, rate: 220 },
  { id: 'BOQ-03', desc: 'Rigless unit, crew & equipment', unit: 'day', qty: 4, rate: 120 },
  { id: 'BOQ-04', desc: 'Well logging / diagnostic services', unit: 'run', qty: 2, rate: 130 },
  { id: 'BOQ-05', desc: 'Completion consumables & spare parts', unit: 'lot', qty: 1, rate: 140 },
  { id: 'BOQ-06', desc: 'Backup pressure-control equipment package', unit: 'lot', qty: 1, rate: 200 },
  { id: 'BOQ-07', desc: 'Final QC reporting and close-out', unit: 'lot', qty: 1, rate: 60 }
];

let afeLines = safeLoad('afe_v2', originalAFE);
let afeCont = Number(safeLoad('afecont_v2', 12));
let afeTarget = Number(safeLoad('afetarget_v2', 3));
const tbeCriteria = [
  { key: 'method', label: 'Method / execution plan', weight: 0.35 },
  { key: 'resources', label: 'Equipment & crew competency', weight: 0.30 },
  { key: 'quality', label: 'QA/QC & deliverables', weight: 0.20 },
  { key: 'mobilization', label: 'Mobilization readiness', weight: 0.15 }
];
let tbeSelected = 'V-A';

// ----------------------------------------------------------------------
// Rokan 101 Idle Well Screening & Candidate Selection (v2 Real Data)
// ----------------------------------------------------------------------
const rokanData = DATA.rokan_matrix || { metadata: {}, wells: [] };
const rokanWells = rokanData.wells || [];
const rokanWeights = rokanData.metadata?.screening_weights || [
  { id: 1, name: 'Expected oil gain (BOPD)', dimension: 'Economics', weight: 10.0 },
  { id: 2, name: 'Remaining reserve (Mbbl)', dimension: 'Subsurface & Reservoir', weight: 15.0 },
  { id: 3, name: 'Reservoir pressure', dimension: 'Subsurface & Reservoir', weight: 5.0 },
  { id: 4, name: 'Water cut (%)', dimension: 'Subsurface & Reservoir', weight: 5.0 },
  { id: 5, name: 'Integrity risk', dimension: 'Well Integrity', weight: 15.0, knockout: true },
  { id: 6, name: 'Intervention cost (USD)', dimension: 'Economics', weight: 10.0 },
  { id: 7, name: 'Accessibility', dimension: 'Operations & Facility', weight: 5.0 },
  { id: 8, name: 'Workover complexity', dimension: 'Operations & Facility', weight: 10.0 },
  { id: 9, name: 'PI (current vs original)', dimension: 'Subsurface & Reservoir', weight: 10.0 },
  { id: 10, name: 'Data completeness', dimension: 'Data Governance', weight: 5.0 },
  { id: 11, name: 'Artificial lift readiness', dimension: 'Operations & Facility', weight: 5.0 },
  { id: 12, name: 'Compartmentalization risk', dimension: 'Subsurface & Reservoir', weight: 5.0 }
];

let selectedWellId = null;

function populateRokanFieldFilter() {
  const select = $('#rokanFieldFilter');
  if (!select) return;
  const fields = Array.from(new Set(rokanWells.map(w => w.field))).filter(Boolean).sort();
  select.innerHTML = '<option value="all">All Fields (' + fields.length + ' fields)</option>' +
    fields.map(f => `<option value="${f}">${f}</option>`).join('');
}

function renderRokanWeights() {
  const container = $('#rokanWeightsList');
  if (!container) return;
  container.innerHTML = rokanWeights.map(w =>
    `<div><b>#${w.id} ${w.name} ${w.knockout ? '<span style="color:var(--amber);font-size:9px">[Hard KO]</span>' : ''}</b><span>${w.weight}%</span></div>`
  ).join('');
}

function renderRokan() {
  const totalWells = rokanWells.length;
  const t2Count = rokanWells.filter(w => w.tier === 'Tier 2').length;
  const t3Count = rokanWells.filter(w => w.tier === 'Tier 3').length;
  const candCount = rokanWells.filter(w => w.candidate_type).length;
  const totalNzbp = rokanWells.reduce((s, w) => s + (w.nzbp_mbo || 0), 0);
  const totalRemRes = rokanWells.reduce((s, w) => s + (w.remaining_res_mbo || 0), 0);

  // Render 4 top-level KPIs
  $('#rokanKPIs').innerHTML =
    metric('INVENTORY SCREENED', `${totalWells} Wells`, '100% evaluated across 26 CSB fields', '◎') +
    metric('TIER 2 (RE-ENTRY)', `${t2Count} Wells`, 'Score 55–74 · CT / acid / reperforating', '◇') +
    metric('TIER 3 (RIG WO)', `${t3Count} Wells`, 'Score 35–54 · Sidetrack / HWOU / casing repair', '◈') +
    metric('PRIORITY CANDIDATES', `${candCount} Wells`, `12 Rem. Reserves · 9 Behind-Pipe (NZBP)`, '★');

  renderRokanWeights();

  const filter = $('#rokanFilter')?.value || 'candidates';
  const fieldFilter = $('#rokanFieldFilter')?.value || 'all';
  const query = ($('#rokanSearch')?.value || '').toLowerCase().trim();

  let visible = rokanWells.filter(w => {
    // Tier / Category filter
    if (filter === 'candidates' && !w.candidate_type) return false;
    if (filter === 'tier2' && w.tier !== 'Tier 2') return false;
    if (filter === 'tier3' && w.tier !== 'Tier 3') return false;
    if (filter === 'excluded' && w.tier !== 'Excluded' && w.tier !== 'Defer / Abandon') return false;

    // Field filter
    if (fieldFilter !== 'all' && w.field !== fieldFilter) return false;

    // Search query
    if (query) {
      const matchName = w.well_name.toLowerCase().includes(query);
      const matchField = w.field.toLowerCase().includes(query);
      const matchFm = (w.formation || '').toLowerCase().includes(query);
      const matchSand = (w.perforations || '').toLowerCase().includes(query);
      if (!matchName && !matchField && !matchFm && !matchSand) return false;
    }
    return true;
  });

  // Sort visible: Candidates first, then descending score
  visible.sort((a, b) => {
    if (a.candidate_type && !b.candidate_type) return -1;
    if (!a.candidate_type && b.candidate_type) return 1;
    return b.weighted_score - a.weighted_score;
  });

  const countLabel = $('#rokanTableCount');
  if (countLabel) {
    countLabel.textContent = `Displaying ${visible.length} of ${totalWells} screened wells (${candCount} high-grade candidates). Source: Halliburton Consulting Phase 1 Final.`;
  }

  $('#rokanRows').innerHTML = visible.map(w => {
    const tierClass = w.tier === 'Tier 1' ? 't1' :
                      w.tier === 'Tier 2' ? 't2' :
                      w.tier === 'Tier 3' ? 't3' : 'excluded';

    const candBadge = w.candidate_type === 'Remaining Reserves Candidate'
      ? `<span class="candidate-badge reserve">★ Rem. Reserves</span>`
      : w.candidate_type === 'NZBP Upside Candidate'
      ? `<span class="candidate-badge nzbp">★ NZBP Upside</span>`
      : `<span class="candidate-badge none">—</span>`;

    const resDisplay = w.remaining_res_mbo > 0 ? fmt(w.remaining_res_mbo, 0) : '<span class="muted">0</span>';
    const nzbpDisplay = w.nzbp_mbo > 0 ? fmt(w.nzbp_mbo, 0) : '<span class="muted">0</span>';

    return `<tr>
      <td><strong>${w.well_name}</strong><br><small class="muted">#${w.no}</small></td>
      <td>${w.field}</td>
      <td><small>${w.formation || 'N/A'}<br>${w.perforations || 'N/A'}</small></td>
      <td>${w.idle_years ? w.idle_years + ' yrs idle' : 'Active'}</td>
      <td>${fmt(w.last_oil_bopd, 1)}</td>
      <td>${fmt(w.last_water_cut, 1)}%</td>
      <td>${resDisplay}</td>
      <td>${nzbpDisplay}</td>
      <td><strong>${fmt(w.weighted_score, 1)}</strong></td>
      <td><span class="tier-badge ${tierClass}">${w.tier}</span></td>
      <td>${candBadge}</td>
      <td><button class="action-btn-sm" data-rokan-view="${w.no}" aria-label="View technical dossier for ${w.well_name}">Dossier ↗</button></td>
    </tr>`;
  }).join('');
}

function showWellDetail(wellNo) {
  const w = rokanWells.find(x => x.no === Number(wellNo));
  if (!w) return;
  selectedWellId = w.no;

  const detailPanel = $('#rokanWellDetail');
  const title = $('#rokanDetailTitle');
  const content = $('#rokanDetailContent');
  if (!detailPanel || !title || !content) return;

  title.textContent = `${w.well_name} · ${w.field} (${w.tier})`;

  const paramNames = rokanWeights.map(x => x.name);
  const pScoresHtml = (w.param_scores || []).map((score, i) =>
    `<div class="score-pill-sm">${paramNames[i] || 'P' + (i+1)}: <b>${score}/5</b></div>`
  ).join('');

  content.innerHTML = `
    <div class="dossier-grid">
      <div class="dossier-card">
        <small>Operator &amp; Trajectory</small>
        <strong>${w.operator}</strong>
        <p class="body-copy-sm">${w.trajectory} · ${w.well_class || 'Oil Producer'}</p>
      </div>
      <div class="dossier-card">
        <small>Reservoir Interval</small>
        <strong>${w.formation || 'Formations N/A'}</strong>
        <p class="body-copy-sm">Perforated: ${w.perforations || 'None'}</p>
      </div>
      <div class="dossier-card">
        <small>Primary Remaining Reserves</small>
        <strong style="color:var(--cyan);">${fmt(w.remaining_res_mbo, 1)} MBO</strong>
        <p class="body-copy-sm">Behind-Pipe (NZBP): ${fmt(w.nzbp_mbo, 1)} MBO</p>
      </div>
      <div class="dossier-card">
        <small>Last Production / Water Cut</small>
        <strong>${fmt(w.last_oil_bopd, 1)} BOPD @ ${fmt(w.last_water_cut, 1)}% WC</strong>
        <p class="body-copy-sm">Idle since: ${w.last_prod_date || 'N/A'} (${w.idle_years} yrs)</p>
      </div>
      <div class="dossier-card">
        <small>Artificial Lift &amp; Completion</small>
        <strong>${w.artificial_lift || 'Not recorded'}</strong>
        <p class="body-copy-sm">${w.completion_type || 'Standard casing'}</p>
      </div>
      <div class="dossier-card">
        <small>Wellbore Integrity Status</small>
        <strong>${w.integrity_status || 'Pending survey'}</strong>
        <p class="body-copy-sm">WBI Aspect Score: ${w.wbi_aspect_score || 'N/A'}/15</p>
      </div>
      <div class="dossier-card">
        <small>Location &amp; Facility Access</small>
        <strong>${w.access || 'Road access'}</strong>
        <p class="body-copy-sm">${w.facility || 'Gathering system available'}</p>
      </div>
      <div class="dossier-card">
        <small>Screening Recommendation</small>
        <strong style="color:var(--amber);">${w.recommendation || w.tier}</strong>
        <p class="body-copy-sm">Total Weighted Score: ${fmt(w.weighted_score, 1)} / 100</p>
      </div>
    </div>

    <div class="dossier-narrative">
      <h4>Engineering Finding &amp; Reactivation Feasibility</h4>
      <p>${w.key_finding || 'Screening evaluated against Halliburton Consulting Phase 1 methodology. Well exhibits viable technical parameters for Phase 2 detailed workover program design.'}</p>
      <div style="margin-top:10px;">
        <small style="color:var(--cyan);font-weight:700;text-transform:uppercase;font-size:9px;">12-Parameter Rubric Breakdown (1-5 Scale):</small>
        <div class="scores-row">${pScoresHtml}</div>
      </div>
    </div>
  `;

  detailPanel.style.display = 'block';
  detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function exportRokan(exportCandidatesOnly = false) {
  const targetWells = exportCandidatesOnly
    ? rokanWells.filter(w => w.candidate_type)
    : rokanWells;

  const rows = [
    ['no', 'well_name', 'operator', 'field', 'formation', 'perforations', 'remaining_res_mbo', 'nzbp_mbo', 'total_res_mbo', 'trajectory', 'last_prod_date', 'idle_years', 'last_oil_bopd', 'last_water_cut_pct', 'artificial_lift', 'integrity_status', 'weighted_score_100', 'tier', 'candidate_type', 'recommendation'],
    ...targetWells.map(w => [
      w.no,
      w.well_name,
      w.operator,
      w.field,
      w.formation,
      w.perforations,
      w.remaining_res_mbo,
      w.nzbp_mbo,
      w.total_res_mbo,
      w.trajectory,
      w.last_prod_date,
      w.idle_years,
      w.last_oil_bopd,
      w.last_water_cut,
      w.artificial_lift,
      w.integrity_status,
      w.weighted_score,
      w.tier,
      w.candidate_type || 'None',
      w.recommendation
    ])
  ];

  const filename = exportCandidatesOnly
    ? 'PRODOPS_rokan_21_priority_candidates.csv'
    : 'PRODOPS_rokan_101_well_screening_matrix.csv';

  download(filename, csv(rows));
  toast(exportCandidatesOnly ? '21 High-Grade Candidates Exported' : 'Full 101 Well Screening Matrix Exported');
}


function afeMath() {
  const direct = afeLines.reduce((sum, l) => sum + l.qty * l.rate, 0);
  const cont = direct * afeCont / 100;
  const total = direct + cont;
  const target = plans[afeTarget]?.budget_midr ?? 0;
  return { direct, cont, total, target, delta: target - total };
}

function renderAFE() {
  $('#afeRows').innerHTML = afeLines.map((l, i) => `<tr><td><strong>${l.desc}</strong><small>${l.id} · fictional rate</small></td><td>${l.unit}</td><td><input type="number" min="0" step="1" inputmode="numeric" autocomplete="off" data-afe-row="${i}" data-afe-field="qty" value="${l.qty}" aria-label="Quantity ${l.id}" /></td><td><input type="number" min="0" step="1" inputmode="numeric" autocomplete="off" data-afe-row="${i}" data-afe-field="rate" value="${l.rate}" aria-label="Unit rate ${l.id}" /></td><td id="afeExtended${i}">${fmt(l.qty * l.rate, 1)}</td></tr>`).join('');
  $('#afeCont').value = afeCont;
  $('#afeBudgetTarget').innerHTML = plans.map((p, i) => `<option value="${i}">${p.id} — ${p.title}</option>`).join('');
  $('#afeBudgetTarget').value = afeTarget;
  renderAFETotal();
}

function renderAFETotal() {
  const m = afeMath();
  afeLines.forEach((l, i) => {
    const cell = $('#afeExtended' + i);
    if (cell) cell.textContent = fmt(l.qty * l.rate, 1);
  });
  $('#afeSummary').innerHTML = `<small>ILLUSTRATIVE DIRECT COST</small><strong>IDR ${fmt(m.direct, 1)} M</strong><small>Contingency (${fmt(afeCont, 0)}%): IDR ${fmt(m.cont, 1)} M</small><div class="separator"></div><small>ESTIMATED TOTAL (NOT APPROVED)</small><strong>IDR ${fmt(m.total, 1)} M</strong><small>Against ${plans[afeTarget].id} budget assumption (IDR ${fmt(m.target, 0)} M): <b>${m.delta >= 0 ? 'Headroom' : 'Overrun'} IDR ${fmt(Math.abs(m.delta), 1)} M</b></small>`;
}

function exportAFE() {
  const m = afeMath();
  let rows = [
    ['Document', 'PRODOPS DRAFT AFE / ILLUSTRATIVE'],
    ['Cost basis', 'Fictional inputs; not an authorization'],
    ['line_id', 'description', 'unit', 'qty', 'unit_rate_IDR_million', 'amount_IDR_million'],
    ...afeLines.map(l => [l.id, l.desc, l.unit, l.qty, l.rate, l.qty * l.rate]),
    ['direct_cost_IDR_million', m.direct],
    ['contingency_percent', afeCont],
    ['contingency_IDR_million', m.cont],
    ['total_estimated_IDR_million', m.total],
    ['comparison_work_package', plans[afeTarget].id],
    ['comparison_budget_IDR_million', m.target],
    ['variance_budget_minus_AFE_IDR_million', m.delta],
    ['status', 'Draft / not approved']
  ];
  download('PRODOPS_DRAFT_AFE_BoQ_illustrative.csv', csv(rows));
  toast('Draft AFE BOQ exported');
}

function technicalScore(v) {
  return tbeCriteria.reduce((s, c) => s + (v.criteria?.[c.key] ?? 0) * c.weight, 0);
}

function normalizeVendors() {
  vendors = defaultVendors.map(d => {
    const old = vendors.find(x => x.id === d.id) || {};
    return { ...d, criteria: { ...d.criteria, ...(old.criteria || {}) } };
  });
}

function renderTBE() {
  const sel = $('#tbeVendor');
  sel.innerHTML = vendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('');
  sel.value = tbeSelected;
  const v = vendors.find(x => x.id === tbeSelected) || vendors[0];

  $('#tbeCriteria').innerHTML = tbeCriteria.map(c => `<tr><td>${c.label}</td><td>${fmt(100 * c.weight, 0)}%</td><td><input type="number" min="0" max="100" step="1" inputmode="numeric" autocomplete="off" data-tbe-field="${c.key}" value="${v.criteria[c.key]}" aria-label="${c.label}" /></td><td>${fmt(v.criteria[c.key] * c.weight, 2)}</td></tr>`).join('');

  const eligible = v.qualified && v.hse_pass && technicalScore(v) >= (+$('#minTechnical').value || 75);
  $('#tbeResult').innerHTML = `<small>WEIGHTED TECHNICAL SCORE / ILLUSTRATIVE</small><strong>${fmt(technicalScore(v), 2)} / 100</strong><small>HSE: <b>${v.hse_pass ? 'PASS' : 'FAIL'}</b> · Company qualification: <b>${v.qualified ? 'YES' : 'NO'}</b> · Technical threshold: ${$('#minTechnical').value}/100 · <b>${eligible ? 'Eligible for demo commercial scoring' : 'Not eligible'}</b></small>`;
}

function exportTBE() {
  let rows = [
    ['Vendor ID', 'Vendor', 'Method 35%', 'Resources 30%', 'QA QC 20%', 'Mobilization 15%', 'Technical score', 'HSE pass', 'Qualified', 'Eligible', 'Price IDR M', 'Combined score', 'Provenance'],
    ...scoreVendors().map(v => [v.id, v.name, v.criteria.method, v.criteria.resources, v.criteria.quality, v.criteria.mobilization, technicalScore(v), v.hse_pass, v.qualified, v.eligible, v.price_midr, v.eligible ? v.total : 'n/a', 'FICTIONAL'])
  ];
  download('PRODOPS_fictional_TBE_matrix.csv', csv(rows));
  toast('TBE evaluation matrix exported');
}

function exportSOW() {
  const text = `# Illustrative SOW / TOR: Rigless Well Diagnostics Support\n\nStatus: DRAFT / NOT APPROVED / FICTIONAL CASE\nCase: PRODOPS demonstration work package; no operator or real well is referenced.\n\n## Objective\nProvide well diagnostic and readiness services to support an engineering decision on a potential rigless intervention.\n\n## Scope of Work\n1. Review available well and production history and confirm data gaps.\n2. Prepare method statement, HSE readiness, personnel and equipment plan.\n3. Conduct approved diagnostics only after required technical and operational permissions.\n4. Submit calibrated logs and well-level QC, with interpretation notes.\n\n## Required technical qualifications\nQualified personnel; documented equipment calibration and availability; mobilization readiness; HSE and contingency controls.\n\n## Deliverables and acceptance criteria\nPre-job program and technical method, HSE risk pack, daily operations reports, QC-compliant logs with agreed depth references, final technical report, punch-list closure.\n\n## Exclusions\nNo guaranteed uplift, reserves classification, intervention approval, barrier validation, access rights or award recommendation.\n\n## Commercial and governance notes\nPricing and supplier qualification are covered separately by approved contracting procedure. PTK-007 should be reviewed by designated SCM specialists; this file makes no claim of compliance.\n`;
  download('PRODOPS_illustrative_SOW_TOR.md', text, 'text/markdown;charset=utf-8');
  toast('SOW/TOR draft exported');
}

function initUI() {
  const navPage = decodeURIComponent(location.hash.slice(1));
  if (navPage) switchPage(navPage, false);
  $$('.nav-link').forEach(el => el.addEventListener('click', () => switchPage(el.dataset.page)));
  $$('[data-go]').forEach(el => el.addEventListener('click', () => switchPage(el.dataset.go)));
  $('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  window.addEventListener('hashchange', () => switchPage(location.hash.slice(1), false));
  $('#clock').textContent = 'PORTFOLIO / OCT 2026';
  $('#exportDataBtn').addEventListener('click', exportProduction);
  $('#downloadProd').addEventListener('click', exportProduction);
  $('#downloadBrief').addEventListener('click', exportBrief);
  $('#printBrief').addEventListener('click', () => { renderBrief(); window.print(); });
  $('#startYear').addEventListener('change', e => { state.startYear = +e.target.value; renderProduction(); });
  $$('[data-series]').forEach(el => el.addEventListener('click', () => {
    state.series = el.dataset.series;
    $$('[data-series]').forEach(e => e.classList.toggle('active', e === el));
    renderProduction();
  }));
  $('#planSelect').addEventListener('change', e => { state.currentPlan = +e.target.value; renderPlanDetail(); });
  ['planBudget', 'planUplift', 'planProb', 'planDuration'].forEach(id => $('#' + id).addEventListener('input', updatePlan));
  ['oilPrice', 'fxRate'].forEach(id => $('#' + id).addEventListener('input', renderPlanMath));
  $('#resetPlans').addEventListener('click', () => {
    if (confirm('Reset all work program planning scenarios to baseline values?')) {
      plans = deep(defaultPlans);
      safeStore('plans', plans);
      state.currentPlan = 0;
      renderWork();
      renderAFETotal();
      renderBrief();
      toast('Planning scenarios reset to default');
    }
  });
  ['techWeight', 'minTechnical'].forEach(id => $('#' + id).addEventListener('input', () => { renderTender(); renderTBE(); renderBrief(); }));
  $('#resetVendors').addEventListener('click', () => {
    if (confirm('Reset vendor bid scoring parameters to default?')) {
      $('#techWeight').value = 70;
      $('#minTechnical').value = 75;
      vendors = deep(defaultVendors);
      tbeSelected = 'V-A';
      safeStore('vendors', vendors);
      renderTender();
      renderTBE();
      renderBrief();
      toast('Vendor scenario reset to default');
    }
  });
  $('#resetContract').addEventListener('click', () => {
    if (confirm('Reset contract milestone completion progress?')) {
      milestones = [false, false, false, false];
      safeStore('milestones', milestones);
      renderContract();
      renderBrief();
      toast('Milestones reset to 0%');
    }
  });
  $('#rokanFilter')?.addEventListener('change', renderRokan);
  $('#rokanFieldFilter')?.addEventListener('change', renderRokan);
  $('#rokanSearch')?.addEventListener('input', renderRokan);
  $('#exportRokan')?.addEventListener('click', () => exportRokan(false));
  $('#exportRokanCandidates')?.addEventListener('click', () => exportRokan(true));
  $('#rokanCloseDetail')?.addEventListener('click', () => {
    const p = $('#rokanWellDetail');
    if (p) p.style.display = 'none';
  });
  $('#rokanRows')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-rokan-view]');
    if (btn) {
      showWellDetail(btn.dataset.rokanView);
    }
  });
  $('#rokanToAFE')?.addEventListener('click', () => {
    afeTarget = 3;
    safeStore('afetarget_v2', afeTarget);
    state.currentPlan = 3;
    renderWork();
    renderAFE();
    switchPage('planning');
  });
  $('#afeRows').addEventListener('input', e => {
    const t = e.target;
    if (!t.dataset.afeField) return;
    const index = +t.dataset.afeRow;
    const field = t.dataset.afeField;
    afeLines[index][field] = Math.max(0, Number(t.value) || 0);
    safeStore('afe_v2', afeLines);
    renderAFETotal();
  });
  $('#afeCont').addEventListener('input', e => {
    afeCont = Math.min(50, Math.max(0, Number(e.target.value) || 0));
    safeStore('afecont_v2', afeCont);
    renderAFETotal();
  });
  $('#afeBudgetTarget').addEventListener('change', e => {
    afeTarget = +e.target.value;
    safeStore('afetarget_v2', afeTarget);
    renderAFETotal();
  });
  $('#resetAFE').addEventListener('click', () => {
    if (confirm('Reset intervention AFE Bill of Quantities to default values?')) {
      afeLines = deep(originalAFE);
      afeCont = 12;
      afeTarget = 3;
      safeStore('afe_v2', afeLines);
      safeStore('afecont_v2', afeCont);
      safeStore('afetarget_v2', afeTarget);
      renderAFE();
      toast('AFE BOQ restored to default');
    }
  });
  $('#exportAFE').addEventListener('click', exportAFE);
  $('#exportSOW').addEventListener('click', exportSOW);
  $('#exportTBE').addEventListener('click', exportTBE);
  $('#tbeVendor').addEventListener('change', e => {
    tbeSelected = e.target.value;
    renderTBE();
  });
  $('#tbeCriteria').addEventListener('input', e => {
    const key = e.target.dataset.tbeField;
    if (!key) return;
    const v = vendors.find(v => v.id === tbeSelected);
    if (!v) return;
    v.criteria[key] = Math.min(100, Math.max(0, Number(e.target.value) || 0));
    safeStore('vendors', vendors);
    renderTender();
    renderBrief();
    const rows = $$('#tbeCriteria tr');
    rows.forEach((row, i) => {
      const c = tbeCriteria[i];
      row.querySelector('td:last-child').textContent = fmt(v.criteria[c.key] * c.weight, 2);
    });
    const eligible = v.qualified && v.hse_pass && technicalScore(v) >= (+$('#minTechnical').value || 75);
    $('#tbeResult').innerHTML = `<small>WEIGHTED TECHNICAL SCORE</small><strong>${fmt(technicalScore(v), 2)} / 100</strong><small>${eligible ? 'Eligible' : 'Not eligible'} under illustrative HSE, qualification and technical gates</small>`;
  });
  $('#riskSelect').addEventListener('change', e => { state.currentRisk = +e.target.value; renderRisks(); });
  ['riskL', 'riskI'].forEach(id => $('#' + id).addEventListener('input', () => {
    const r = risks[state.currentRisk];
    r.likelihood = +$('#riskL').value;
    r.impact = +$('#riskI').value;
    safeStore('risks', risks);
    renderRisks();
  }));
}

// Interactive 3D facility with prefers-reduced-motion support, IntersectionObserver and tab visibility pause
function init3D() {
  const canvas = $('#asset3d');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let yaw = -0.58, elev = 0.5, zoom = 1.25, drag = false, px = 0;
  let animId = null;
  let isVisible = true;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;

  motionQuery.addEventListener('change', e => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      if (animId) cancelAnimationFrame(animId);
      render(0);
    } else {
      startLoop();
    }
  });

  function project(p, cx, cy) {
    const a = yaw, b = elev;
    const xr = p[0] * Math.cos(a) - p[1] * Math.sin(a);
    const yr = p[0] * Math.sin(a) + p[1] * Math.cos(a);
    return [cx + xr * 15 * zoom, cy + (yr * Math.sin(b) - p[2] * Math.cos(b)) * 15 * zoom];
  }

  function line(a, b, col, w = 1, cx = 0, cy = 0) {
    const pa = project(a, cx, cy), pb = project(b, cx, cy);
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(...pa);
    ctx.lineTo(...pb);
    ctx.stroke();
  }

  function polygon(pts, fill, stroke, cx, cy) {
    ctx.beginPath();
    pts.map(p => project(p, cx, cy)).forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  function box(x, y, z, dx, dy, dz, cx, cy, co = '#235566') {
    const a = [x, y, z], b = [x + dx, y, z], c = [x + dx, y + dy, z], d = [x, y + dy, z];
    const A = [x, y, z + dz], B = [x + dx, y, z + dz], C = [x + dx, y + dy, z + dz], D = [x, y + dy, z + dz];
    polygon([a, b, B, A], co, '#32788b', cx, cy);
    polygon([b, c, C, B], '#153b4c', '#2e6674', cx, cy);
    polygon([d, c, C, D], '#1b4251', '#296b79', cx, cy);
    polygon([A, B, C, D], '#4e8190', '#66a1a9', cx, cy);
  }

  function pipe(a, b, cx, cy, col = '#4de3cf') {
    line(a, b, '#09232d', 5.5, cx, cy);
    line(a, b, col, 2.3, cx, cy);
  }

  function render(t = 0) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (canvas.width !== Math.ceil(cw * dpr) || canvas.height !== Math.ceil(ch * dpr)) {
      canvas.width = Math.ceil(cw * dpr);
      canvas.height = Math.ceil(ch * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    const cx = cw / 2, cy = ch * 0.6;
    ctx.fillStyle = '#0c23312a';
    ctx.fillRect(0, 0, cw, ch);

    for (let i = -8; i <= 8; i++) {
      line([i, -7, 0], [i, 7, 0], '#35617430', 0.8, cx, cy);
      line([-8, i, 0], [8, i, 0], '#35617430', 0.8, cx, cy);
    }
    box(-6, -4, 0.1, 12, 8, 0.35, cx, cy, '#29495a');
    for (const x of [-5.6, 5.4]) for (const y of [-3.6, 3.6]) box(x, y, -2, 0.4, 0.4, 2.1, cx, cy, '#386075');

    // main manifold + separators
    box(-4.6, -2.9, 0.5, 4, 2, 1, cx, cy, '#2d5a6d');
    box(-0.4, -3, 0.5, 2.8, 1.25, 1, cx, cy, '#2a6977');
    box(3.2, -3, 0.5, 1.8, 1.8, 2.8, cx, cy, '#2d5b6e');
    for (const yy of [-1.5, 0.3, 2.2]) {
      box(-3.5, yy, 0.5, 3.7, 1.0, 0.9, cx, cy, '#1e6472');
      box(-3.3, yy, 1.4, 0.2, 1, 0.35, cx, cy, '#467e8c');
    }
    for (const xx of [1.2, 2.6]) {
      box(xx, 0.5, 0.5, 0.9, 1.6, 2.1, cx, cy, '#2d5768');
      box(xx + 0.13, 0.65, 2.6, 0.65, 1.3, 0.2, cx, cy, '#69a4a8');
    }

    // pipes
    pipe([-5, -0.2, 1.65], [-1.2, -0.2, 1.65], cx, cy);
    pipe([-1.2, -0.2, 1.65], [1, -0.2, 1.65], cx, cy);
    pipe([1, -0.2, 1.65], [3.6, -1.2, 1.65], cx, cy);
    pipe([-3, 2.6, 1.8], [0.1, 2.6, 1.8], cx, cy, '#dcba71');
    pipe([0.1, 2.6, 1.8], [2.7, 2.6, 1.8], cx, cy, '#dcba71');
    for (const xx of [-5.1, 5.2]) for (const yy of [-3.5, 3.2]) box(xx, yy, 0.5, 0.2, 0.2, 2.5, cx, cy, '#3b7180');
    for (const xx of [-4.9, 4.9]) line([xx, -3.35, 2.7], [xx, 3.35, 2.7], '#4b8e97', 1, cx, cy);

    // tower and flare
    box(5, -1.5, 0.5, 0.34, 0.34, 5.6, cx, cy, '#7f7770');
    box(4.8, -1.7, 6.1, 0.8, 0.8, 0.25, cx, cy, '#bea078');

    const glow = prefersReducedMotion ? 0.5 : (Math.sin(t * 0.002) + 1) / 2;
    const flame = project([5.2, -1.3, 6.65 + glow * 0.2], cx, cy);
    ctx.beginPath();
    ctx.arc(...flame, 3.5 + glow * 2, 0, Math.PI * 2);
    ctx.fillStyle = '#f4b979';
    ctx.shadowColor = '#f9b464';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (!prefersReducedMotion) {
      for (let k = 0; k < 5; k++) {
        const alpha = (t * 0.00028 + k / 5) % 1;
        const p = project([-5 + alpha * 7, -0.2, 1.65], cx, cy);
        ctx.beginPath();
        ctx.arc(...p, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#a5fff1';
        ctx.shadowColor = '#52dcca';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (isVisible && document.visibilityState !== 'hidden') {
        animId = requestAnimationFrame(render);
      }
    }
  }

  function startLoop() {
    if (prefersReducedMotion) {
      render(0);
      return;
    }
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(render);
  }

  // Pointer drag controls
  canvas.addEventListener('pointerdown', e => {
    drag = true;
    px = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointerup', () => { drag = false; });
  canvas.addEventListener('pointercancel', () => { drag = false; });
  canvas.addEventListener('pointermove', e => {
    if (drag) {
      yaw += (e.clientX - px) * 0.009;
      px = e.clientX;
      if (prefersReducedMotion) render(0);
    }
  });

  // Zoom controls
  $('#zoomIn').addEventListener('click', () => {
    zoom = Math.min(2.1, zoom + 0.12);
    if (prefersReducedMotion) render(0);
  });
  $('#zoomOut').addEventListener('click', () => {
    zoom = Math.max(0.65, zoom - 0.12);
    if (prefersReducedMotion) render(0);
  });

  // IntersectionObserver to pause when offscreen
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else if (animId) {
          cancelAnimationFrame(animId);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(canvas);
  }

  // Tab visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isVisible) {
      startLoop();
    } else if (animId) {
      cancelAnimationFrame(animId);
    }
  });

  startLoop();
}

normalizeVendors();
initUI();
populateRokanFieldFilter();
renderProduction();
renderRokan();
renderWork();
renderAFE();
renderTender();
renderTBE();
renderContract();
renderRisks();
init3D();
})();
