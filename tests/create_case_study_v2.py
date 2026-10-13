from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
import json
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/PRODOPS_Portfolio_Case_Study_v2.pdf'
W,H=A4
BG=HexColor('#0a1320');PANEL=HexColor('#102439');BORDER=HexColor('#2a4557');TEAL=HexColor('#56ddcc');WHITE=HexColor('#edf8ff');MUTED=HexColor('#a0b8c8');AMBER=HexColor('#e5bd80');LIGHT=HexColor('#d1e6f2')
c=canvas.Canvas(str(OUT),pagesize=A4,pageCompression=1)
c.setTitle('PRODOPS Intelligence - CV Aligned Interview Case Study v2')
def rect(x,y,w,h,color=PANEL,rad=9):c.setFillColor(color);c.roundRect(x,y,w,h,rad,fill=1,stroke=0)
def t(x,y,s,sz=10,col=WHITE,b=False):c.setFont('Helvetica-Bold' if b else 'Helvetica',sz);c.setFillColor(col);c.drawString(x,y,str(s))
def line(x,y,to,stroke=BORDER):c.setStrokeColor(stroke);c.setLineWidth(.7);c.line(x,y,to,y)
def para(x,y,texts,sz=9,lead=14,color=LIGHT,b=False):
 for i,s in enumerate(texts):t(x,y-lead*i,s,sz,color,b)
def base(page,title,kicker):
 c.setFillColor(BG);c.rect(0,0,W,H,fill=1,stroke=0)
 rect(0,H-105,W,105,HexColor('#102637'),0)
 t(36,H-35,'PRODOPS',20,TEAL,True);t(164,H-32,'INTELLIGENCE  /  CASE STUDY v2',8,WHITE,True)
 t(36,H-70,kicker,8,TEAL,True);t(36,H-93,title,19,WHITE,True)
 line(36,43,W-36)
 t(36,28,'INDEPENDENT PORTFOLIO  |  CV CLAIMS + FICTIONAL CASE + PUBLIC FIELD DATA',7,MUTED,True)
 t(W-66,28,f'{page} / 2',8,MUTED)
def labelbox(x,y,w,h,lbl,val,note):
 rect(x,y,w,h)
 t(x+10,y+h-20,lbl,7.6,TEAL,True);t(x+10,y+h-45,val,18,WHITE,True);t(x+10,y+12,note,7,MUTED)
# page1
base(1,'Rokan screening -> intervention concept','01 / CV CLAIMS VS REPRODUCIBLE EXAMPLES')
t(36,712,'SCOPE: WHAT THE SUBMITTED CV STATES',11,WHITE,True)
for i,a in enumerate([
('SCREENED','101 wells','Candidate CV statement'),('PRIORITY','21 wells','Candidate CV statement'),('POTENTIAL','~13 MMBO','CV reserve potential'),('DEMO SAMPLE','8 fictional','Not a subset of 101')]):
 labelbox(36+i*132,621,125,76,*a)
rect(36,551,W-72,58,HexColor('#3d342c'))
t(49,588,'EVIDENCE BOUNDARY',9,AMBER,True)
para(49,572,['Original well-by-well records, reserves classes and supporting volumetrics were not supplied.',
               'The case below demonstrates a method; it does NOT reproduce actual Rokan outcomes.'],8.2,13,WHITE)
t(36,528,'ILLUSTRATIVE WELL REACTIVATION SCREENING',10,WHITE,True)
rokan=json.loads((ROOT/'data/rokan_cv_case_illustrative.json').read_text())['example_candidates']
cols=[(48,'CANDIDATE'),(150,'WATER CUT'),(241,'POTENTIAL'),(341,'SCORE'),(420,'SCREENING')]
rect(36,484,W-72,27,HexColor('#173046'))
for x,text in cols:t(x,493,text,7.7,TEAL,True)
for i,w in enumerate(rokan):
 y=459-i*30
 score=100*(.2*w['data_quality']+.25*w['integrity']+.25*w['feasibility']+.2*w['potential_rating']+.1*w['water_tolerance_rating'])/5
 eligible=score>=70 and w['integrity']>=3 and w['feasibility']>=3
 if i%2==0:rect(36,y-8,W-72,29,HexColor('#11283b'),3)
 t(48,y+1,w['id'],8,WHITE,True);t(150,y+1,f"{w['water_cut_pct']}%",8,LIGHT)
 t(241,y+1,f"{w['uplift_bopd']} bopd",8,LIGHT)
 t(341,y+1,f'{score:.1f}/100',8,LIGHT)
 t(420,y+1,'PRIORITY' if eligible else 'HOLD / REVIEW',8,TEAL if eligible else AMBER,True)
t(36,210,'SCREENING LOGIC / EXAMPLE ONLY',10,WHITE,True)
rect(36,112,W-72,87)
para(50,179,['Weighted score = 20% data quality + 25% integrity + 25% feasibility',
             '+ 20% potential rating + 10% water tolerance, all rated 1 to 5.',
             'Priority gate: score >= 70/100, integrity >= 3, feasibility >= 3.',
             'Actual decisions require well history QC, integrity, feasibility and economics.'],8.7,17,WHITE)
para(36,92,['INFORMATION CLASSIFICATION  /  CV claim != verified field outcome != hypothetical example.'],8.1,12,AMBER,True)
c.showPage()
# page 2
base(2,'Program cost, procurement and technical assurance','02 / ILLUSTRATIVE WORK PACKAGE / NO OPERATOR APPROVAL')
t(36,714,'DRAFT AFE WORK PACKAGE  /  FICTIONAL IDR MILLIONS',10,WHITE,True)
boq=json.loads((ROOT/'data/afe_boq_illustrative.json').read_text());d=boq['cost_lines'];subtotal=sum(row['quantity']*row['unit_rate_midr'] for row in d);cont=subtotal*.12;total=subtotal+cont
rect(36,486,W-72,216)
rect(48,661,W-96,24,HexColor('#193448'))
for x,s in [(61,'DRAFT COST ELEMENT'),(364,'QTY X UNIT RATE'),(484,'IDR M')]:t(x,669,s,7.7,TEAL,True)
for i,row in enumerate(d):
 y=643-i*21
 t(61,y,row['description'][:51],8,LIGHT)
 t(365,y,f"{row['quantity']} x {row['unit_rate_midr']:.0f}",8,MUTED)
 t(486,y,f"{row['quantity']*row['unit_rate_midr']:,.1f}",8,WHITE)
line(49,492,W-50)
labelbox(36,396,169,79,'DIRECT',f'IDR {subtotal:,.0f} M','All cost lines invented')
labelbox(214,396,169,79,'CONTINGENCY 12%',f'IDR {cont:,.1f} M','Simple draft allowance')
labelbox(392,396,167,79,'TOTAL ESTIMATE',f'IDR {total:,.1f} M','Unapproved, illustrative')
t(36,373,'DRAFT SOW / TOR - WHAT WOULD BE DOCUMENTED',10,WHITE,True)
rect(36,282,W-72,79)
para(50,339,['Scope: well history review, readiness check, permitted diagnostic acquisition and QC.',
             'Requirements: calibrated equipment, competent crew, method statement, HSE plan.',
             'Acceptance: daily reports, QC logs, interpretation summary and closeout.',
             'Excluded: production uplift guarantees, approval, access rights and well integrity assurance.'],8.3,16,WHITE)
t(36,258,'TECHNICAL BID EVALUATION / FICTIONAL THREE-BID EXAMPLE',10,WHITE,True)
rect(36,148,W-72,97)
t(49,225,'VENDOR',8,TEAL,True);t(260,225,'TECH',8,TEAL,True);t(337,225,'HSE',8,TEAL,True);t(421,225,'ELIGIBILITY',8,TEAL,True)
vendors=json.loads((ROOT/'data/vendor_scenarios_illustrative.json').read_text())
for i,v in enumerate(vendors):
 y=204-i*24;score=.35*v['criteria']['method']+.3*v['criteria']['resources']+.2*v['criteria']['quality']+.15*v['criteria']['mobilization'];gate=v['hse_pass'] and v['qualified'] and score>=75
 t(49,y,v['name'],8.2,LIGHT);t(260,y,f'{score:.2f}',8.2,WHITE);t(337,y,'PASS' if v['hse_pass'] else 'FAIL',8.2,TEAL if v['hse_pass'] else AMBER,True);t(421,y,'DEMO ELIGIBLE' if gate else 'NOT ELIGIBLE',7.8,TEAL if gate else AMBER,True)
para(36,126,['TBE criteria: execution method 35%, resources 30%, quality 20%, mobilization 15%.',
             'HSE and qualification are mandatory gates; high technical score alone does not override failure.'],8.1,12,LIGHT)
para(36,88,['No source wells, actual AFE, authorized tender, award, vendor proposal or PTK-007',
            'conformity are represented. Reference documents and algorithms are in the website ZIP.'],7.5,12,AMBER)
c.save();print(OUT)
