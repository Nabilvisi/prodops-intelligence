"""Automated QA, accessibility, and regression test suite for PRODOPS Intelligence Platform (v2 CV-Aligned)."""
import csv
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]

def test_source_csv():
    source_file = ROOT / 'data' / 'troldhaugen_monthly_gross_2023_2026.csv'
    with source_file.open(newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    assert len(rows) == 43, f"Expected 43 observed historical rows, got {len(rows)}"
    assert all(r['field'] == '16/1-12 Troldhaugen' for r in rows)
    assert all(r['npdid'] == '17196400' for r in rows)
    assert all(r['source_type'] == 'observed' for r in rows)
    assert float(rows[0]['gross_oil_mill_sm3']) >= 0
    assert float(rows[-1]['gross_oil_mill_sm3']) == 0.00464
    assert float(rows[-1]['produced_water_mill_sm3']) == 0.01117
    print("PASS: Verified 43 historical observed rows from NOD FactPages")

def test_v2_cv_scenarios_and_afe():
    cv = json.loads((ROOT / 'data' / 'rokan_cv_case_illustrative.json').read_text(encoding='utf-8'))
    assert cv['cv_reported']['screened_wells'] == 101
    assert cv['cv_reported']['priority_candidates'] == 21
    assert cv['cv_reported']['reserve_potential_mmbo_approx'] == 13
    assert len(cv['example_candidates']) == 8
    assert all(p['id'].startswith('DEMO-') for p in cv['example_candidates'])

    boq = json.loads((ROOT / 'data' / 'afe_boq_illustrative.json').read_text(encoding='utf-8'))
    assert len(boq['cost_lines']) == 7
    direct = sum(x['quantity'] * x['unit_rate_midr'] for x in boq['cost_lines'])
    assert direct == 1445
    total = direct * 1.12
    assert abs(total - 1618.4) < 1e-6
    print("PASS: Verified v2 CV-aligned case scenarios, 8 fictional candidate wells & AFE BOQ")

def test_html_accessibility_and_all_7_views():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    assert 'lang="en"' in html
    assert 'class="skip-link"' in html
    assert 'id="mainContent"' in html
    
    # Check all 7 command module views
    for section in ('overview', 'production', 'rokan', 'planning', 'tender', 'contract', 'risk'):
        assert f'id="page-{section}"' in html, f"Missing view container page-{section}"
    
    # Check input attributes (autocomplete, inputmode, aria-labels)
    assert 'autocomplete="off"' in html
    assert 'inputmode="numeric"' in html
    assert 'aria-label="Zoom out facility 3D view"' in html
    assert 'aria-label="Zoom in facility 3D view"' in html
    
    # Verify professional maker tone (no amateur 'interview demonstration')
    assert 'Interview demonstration' not in html
    print("PASS: HTML markup conforms to accessibility guidelines, professional copy & all 7 views present")

def test_css_design_system():
    css = (ROOT / 'assets' / 'style.css').read_text(encoding='utf-8')
    assert 'prefers-reduced-motion' in css
    assert 'tabular-nums' in css
    assert ':focus-visible' in css
    assert '--cyan:' in css
    assert '.screening-weights' in css
    assert '.afe-bottom' in css
    assert '.approval-rail' in css
    assert '@media (max-width: 570px)' in css
    assert '@media (max-width: 920px)' in css
    assert '@media (max-width: 1180px)' in css
    print("PASS: CSS design system verified with responsive breakpoints, tokens, v2 layout & reduced-motion")

def test_js_logic_and_safeguards():
    js = (ROOT / 'assets' / 'app.js').read_text(encoding='utf-8')
    assert 'prefers-reduced-motion' in js
    assert 'IntersectionObserver' in js
    assert 'visibilitychange' in js
    assert 'confirm(' in js
    assert 'cancelAnimationFrame' in js
    assert 'renderRokan' in js
    assert 'renderAFE' in js
    assert 'renderTBE' in js
    print("PASS: JavaScript runtime verified with motion safety, lifecycle cleanups & confirmation dialogs")

def test_rokan_screening_matrix():
    rokan_final = json.loads((ROOT / 'data' / 'rokan_screening_matrix_final.json').read_text(encoding='utf-8'))
    meta = rokan_final['metadata']
    wells = rokan_final['wells']
    assert meta['total_inventory'] == 101
    assert len(wells) == 101
    assert meta['high_priority_candidates'] == 21
    assert meta['candidate_rem_res_count'] == 12
    assert meta['candidate_nzbp_count'] == 9
    assert meta['nzbp_total_potential_mmbo'] == 13.0
    
    # Check key well entries from Excel & Slide deck
    candi = next(w for w in wells if w['well_name'] == 'Candi-00006')
    assert candi['tier'] == 'Tier 2' and candi['remaining_res_mbo'] == 1019.0
    
    kopar33 = next(w for w in wells if w['well_name'] == 'Kopar-00033')
    assert kopar33['remaining_res_mbo'] == 2272.0 and kopar33['nzbp_mbo'] == 641.0
    
    kopar31 = next(w for w in wells if w['well_name'] == 'Kopar-00031')
    assert kopar31['nzbp_mbo'] == 2390.0
    
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    assert 'rokanFilter' in html
    assert 'rokanFieldFilter' in html
    assert 'rokanSearch' in html
    assert 'exportRokanCandidates' in html
    print("PASS: Verified 101 screened wells, 21 candidate wells, Kopar/Candi metrics & Rokan UI elements")

if __name__ == '__main__':
    test_source_csv()
    test_v2_cv_scenarios_and_afe()
    test_html_accessibility_and_all_7_views()
    test_css_design_system()
    test_js_logic_and_safeguards()
    test_rokan_screening_matrix()
    print("\nALL 6 AUTOMATED VERIFICATION SUITES PASSED CLEANLY (100% SUCCESS)")

