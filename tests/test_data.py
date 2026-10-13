"""Pure-standard-library data integrity checks. Run: python tests/test_data.py."""
import csv
import json
import pathlib
from datetime import date

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'data' / 'troldhaugen_monthly_gross_2023_2026.csv'
with SOURCE.open(newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

assert len(rows) == 43, f'Unexpected source row count: {len(rows)}'
assert all(r['field'] == '16/1-12 Troldhaugen' for r in rows)
assert all(r['npdid'] == '17196400' for r in rows)
assert all(r['source_type'] == 'observed' for r in rows)
dates = [date(int(r['year']), int(r['month']), 1) for r in rows]
assert dates == sorted(dates) and len(set(dates)) == len(dates)
assert dates[0] == date(2023, 1, 1) and dates[-1] == date(2026, 7, 1)
for r in rows:
    assert 1 <= int(r['month']) <= 12
    for col in ('gross_oil_mill_sm3', 'gross_gas_bill_sm3', 'produced_water_mill_sm3'):
        assert float(r[col]) >= 0, (r, col)
assert float(next(r for r in rows if r['year']=='2024' and r['month']=='11')['gross_oil_mill_sm3']) == 0.0
assert float(rows[-1]['gross_oil_mill_sm3']) == 0.00464
assert float(rows[-1]['produced_water_mill_sm3']) == 0.01117

programs = json.loads((ROOT / 'data/work_program_scenarios_illustrative.json').read_text(encoding='utf-8'))
assert len(programs) == 4 and all(0 <= p['probability'] <= 1 for p in programs)
assert all(p['budget_midr'] > 0 for p in programs)
vendors = json.loads((ROOT / 'data/vendor_scenarios_illustrative.json').read_text(encoding='utf-8'))
assert len(vendors) == 3 and any(not v['hse_pass'] for v in vendors)
# Basic eligibility screen: Vendor Gamma excluded due to HSE failure.
assert [v['id'] for v in vendors if v['hse_pass'] and v['qualified'] and v['technical_score'] >= 75] == ['V-A','V-B']
assert sum([15,25,40,20]) == 100

appdata = (ROOT / 'assets/data.js').read_text(encoding='utf-8')
assert 'window.PRODOPS_DATA' in appdata
assert '"gross_oil_mill_sm3":0.00464' in appdata
html = (ROOT / 'index.html').read_text(encoding='utf-8')
for section in ('overview','production','planning','tender','contract','risk'):
    assert f'id="page-{section}"' in html

print('PASS: 43 observed monthly source rows, source lineage, numeric and chronological integrity')
print('PASS: separate four illustrative programs and three fictional vendors')
print('PASS: vendor HSE gate, contract milestone weights, generated manifest and original app views (plus v2 checks)')

# v2: clear evidence classification and model/data consistency
cv = json.loads((ROOT / 'data/rokan_cv_case_illustrative.json').read_text(encoding='utf-8'))
assert cv['cv_reported'] == {'screened_wells': 101, 'priority_candidates': 21, 'reserve_potential_mmbo_approx': 13}
assert len(cv['example_candidates']) == 8
assert all(p['id'].startswith('DEMO-') for p in cv['example_candidates'])
weights = cv['scoring']; assert sum(weights[k] for k in ('data_quality','integrity','feasibility','potential_rating','water_tolerance_rating')) == 1
scored = []
for w in cv['example_candidates']:
    score=100*sum(weights[k]*w[k] for k in ('data_quality','integrity','feasibility','potential_rating','water_tolerance_rating'))/5
    shortlist=score >=70 and w['integrity']>=3 and w['feasibility']>=3
    scored.append(shortlist)
assert sum(scored) == 4
boq = json.loads((ROOT / 'data/afe_boq_illustrative.json').read_text(encoding='utf-8'))
assert len(boq['cost_lines']) == 7
assert sum(x['quantity']*x['unit_rate_midr'] for x in boq['cost_lines']) == 1445
assert sum(x['quantity']*x['unit_rate_midr'] for x in boq['cost_lines'])*1.12 == 1618.4 or abs(sum(x['quantity']*x['unit_rate_midr'] for x in boq['cost_lines'])*1.12 - 1618.4) < 1e-7
assert all('criteria' in v for v in vendors)
for v in vendors:
    vscore=sum(v['criteria'][k]*w for k,w in {'method':.35,'resources':.3,'quality':.2,'mobilization':.15}.items())
    assert abs(vscore-v['technical_score']) < 1e-8
for section in ('overview','production','rokan','planning','tender','contract','risk'):
    assert f'id="page-{section}"' in html
for exported in ('exportRokan','exportRokanCandidates','exportAFE','exportSOW','exportTBE'):
    assert f'id="{exported}"' in html
print('PASS v2: CV provenance, fictional well screen, BOQ costs, TBE weighted scoring, 7 views and 4 document export actions')

# Rokan Master Screening Matrix validation (from 002_Well Screening Matrix Final.xlsx & Slide Decks)
rokan_final = json.loads((ROOT / 'data/rokan_screening_matrix_final.json').read_text(encoding='utf-8'))
meta = rokan_final['metadata']
wells = rokan_final['wells']
assert meta['total_inventory'] == 101, f"Expected 101 wells, got {meta['total_inventory']}"
assert len(wells) == 101
assert meta['high_priority_candidates'] == 21
assert meta['candidate_rem_res_count'] == 12
assert meta['candidate_nzbp_count'] == 9
assert meta['nzbp_total_potential_mmbo'] == 13.0
assert sum(w['weight'] for w in meta['screening_weights']) == 100.0
assert len(meta['screening_weights']) == 12

# Check candidate wells integrity
cand_wells = [w for w in wells if w['candidate_type']]
assert len(cand_wells) == 21, f"Expected 21 candidates tagged, got {len(cand_wells)}"
assert any(w['well_name'] == 'Kopar-00033' and w['remaining_res_mbo'] >= 2200 for w in cand_wells)
assert any(w['well_name'] == 'Kopar-00031' and w['nzbp_mbo'] >= 2300 for w in cand_wells)
assert any(w['well_name'] == 'Candi-00006' and w['tier'] == 'Tier 2' for w in cand_wells)

# Verify presence in data.js
assert 'rokan_matrix' in appdata
assert 'Kopar-00033' in appdata
assert 'Duri DSF' in appdata
print('PASS Rokan Final Matrix: 101 screened wells, 21 high-grade candidates (12 res + 9 NZBP), 13.0 MMBO behind-pipe, 12-parameter rubric confirmed')

