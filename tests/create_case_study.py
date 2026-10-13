from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from pathlib import Path
import csv

root=Path(__file__).resolve().parents[1]
out=root / 'docs' / 'PRODOPS_Portfolio_Case_Study.pdf'
records=list(csv.DictReader((root/'data/troldhaugen_monthly_gross_2023_2026.csv').open()))
w,h=A4
NAVY=HexColor('#0b1726'); PANEL=HexColor('#11273a'); TEAL=HexColor('#50e2d2'); MUTED=HexColor('#7891a7'); WHITE=HexColor('#eef7fd'); AMBER=HexColor('#edbf73'); LINE=HexColor('#29475c'); SKY=HexColor('#83bdd7')
c=canvas.Canvas(str(out),pagesize=A4,pageCompression=1); c.setTitle('PRODOPS Intelligence — Independent Portfolio Case Study')

def txt(x,y,s,size=10,color=WHITE,font='Helvetica'):
    c.setFont(font,size);c.setFillColor(color);c.drawString(x,y,s)
def rr(x,y,width,height,fill=PANEL,r=10):
    c.setFillColor(fill);c.roundRect(x,y,width,height,r,fill=1,stroke=0)
def rule(x1,y,x2,col=LINE):
    c.setStrokeColor(col);c.setLineWidth(.7);c.line(x1,y,x2,y)
def boxline(x,y,wid,hei,stroke=LINE):
    c.setStrokeColor(stroke);c.roundRect(x,y,wid,hei,9,stroke=1,fill=0)
def multiline(x,y,lines,size=9,leading=13,col=WHITE,bold=False):
    for i,s in enumerate(lines):txt(x,y-leading*i,s,size,col,'Helvetica-Bold' if bold else 'Helvetica')
def page_footer(n):
    rule(36,41,w-36)
    txt(36,25,'INDEPENDENT PORTFOLIO  |  PUBLIC DATA + HYPOTHETICAL SCENARIOS',7,MUTED,'Helvetica-Bold')
    txt(w-63,25,f'{n} / 2',8,SKY)

def background(kicker,title,subtitle):
    c.setFillColor(NAVY);c.rect(0,0,w,h,stroke=0,fill=1)
    c.setFillColor(HexColor('#164351'));c.circle(555,825,180,stroke=0,fill=1)
    txt(36,805,'PRODOPS',19,TEAL,'Helvetica-Bold')
    txt(155,809,'INTELLIGENCE  /  ENGINEERING PORTFOLIO',8,WHITE,'Helvetica-Bold')
    rule(36,789,w-36)
    txt(36,755,kicker.upper(),8,TEAL,'Helvetica-Bold')
    txt(36,713,title,27,WHITE,'Helvetica-Bold')
    txt(36,686,subtitle,9,SKY)

# PAGE 1
background('Associate Program Engineer | Production & Operations','From performance to decision','Integrated engineering + operational planning + commercial evaluation')
rr(36,581,w-72,79)
multiline(53,638,['THE PROBLEM'],10,12,TEAL,True)
multiline(53,614,['Production trends alone are insufficient for work-program decisions.','Engineering, budget, procurement, execution risk, and reporting must connect.'],10,16,WHITE)
txt(36,550,'SIX INTERCONNECTED MODULES',11,WHITE,'Helvetica-Bold')
modules=[('01','EXECUTIVE OVERVIEW','Observed signals and decision context'),('02','PRODUCTION ANALYTICS','43 real monthly source observations'),('03','WORK PROGRAM & BUDGET','Editable hypothetical screening cases'),('04','TENDER EVALUATION','Eligibility before weighted comparison'),('05','CONTRACT TRACKER','Weighted illustrative deliverable progress'),('06','RISK & REPORTING','5x5 matrix and briefing exports')]
for i,(num,name,desc) in enumerate(modules):
    col=i%2;row=i//2;x=36+col*266;y=462-row*93;rr(x,y,257,80);txt(x+15,y+54,num,18,TEAL,'Helvetica-Bold');txt(x+57,y+54,name,9,WHITE,'Helvetica-Bold');txt(x+57,y+33,desc,8,MUTED)
rr(36,143,w-72,101,HexColor('#18303c'))
txt(53,221,'ENGINEERING DECISION PATHWAY',10,TEAL,'Helvetica-Bold')
steps=['OBSERVE','SCREEN','BUDGET','EVALUATE','EXECUTE','REPORT']
for i,s in enumerate(steps):
    x=52+i*82
    c.setFillColor(HexColor('#284c59'));c.roundRect(x,163,71,33,6,stroke=0,fill=1)
    txt(x+6,175,s,8,WHITE,'Helvetica-Bold')
    if i<5:txt(x+72,176,'>',10,TEAL,'Helvetica-Bold')
multiline(36,120,['Data integrity first: observed field volumes are REAL; work packages, costs,','vendors, contract milestones, risks, and intervention uplifts are ILLUSTRATIVE.'],9,13,AMBER)
page_footer(1);c.showPage()

# PAGE 2
background('Evidence / methodology / interview','Demonstrable engineering judgment','Field: 16/1-12 Troldhaugen | NPDID 17196400 | Latest: July 2026')
last=records[-1];oil=float(last['gross_oil_mill_sm3'])*1000;water=float(last['produced_water_mill_sm3'])*1000
for i,(lab,val,extra) in enumerate([('GROSS OIL',f'{oil:.2f} kSm3','Jul 2026, observed'),('PRODUCED WATER',f'{water:.2f} kSm3','Jul 2026, observed'),('DATA COVERAGE','43 months','Jan 2023 - Jul 2026')]):
    x=36+i*178;rr(x,595,171,69);txt(x+12,641,lab,8,SKY,'Helvetica-Bold');txt(x+12,620,val,16,WHITE,'Helvetica-Bold');txt(x+12,605,extra,7,MUTED)
txt(36,565,'OBSERVED GROSS OIL PRODUCTION',11,WHITE,'Helvetica-Bold')
rr(36,358,w-72,192)
vals=[float(r['gross_oil_mill_sm3'])*1000 for r in records]
maxv=max(vals)*1.13;xx0=68;yy0=383;chartw=w-136;charth=142
for g in range(4):
    yy=yy0+g*(charth/3);rule(xx0,yy,xx0+chartw,HexColor('#30495d'))
    txt(43,yy-2,f'{maxv*g/3:.1f}',7,MUTED)
c.setStrokeColor(TEAL);c.setLineWidth(2)
p=c.beginPath()
for i,val in enumerate(vals):
    x=xx0+i/(len(vals)-1)*chartw;y=yy0+(val/maxv)*charth
    if i==0:p.moveTo(x,y)
    else:p.lineTo(x,y)
c.drawPath(p)
for i in [0,12,24,36,42]:
    r=records[i];txt(xx0+i/(len(vals)-1)*chartw-11,369,f"{r['year']}-{int(r['month']):02d}",7,MUTED)
txt(68,540,'Gross oil, thousand standard cubic meters / month',8,SKY)
txt(36,329,'BUSINESS SCENARIOS — STRICTLY ILLUSTRATIVE',11,WHITE,'Helvetica-Bold')
rr(36,229,w-72,85)
multiline(50,291,['Work program: assumed costs, durations, uplift and success probabilities.','Tender: fictional vendors, HSE/qualification gates and demonstrative scoring.','Contract/risk: proposed milestones, owners, likelihood and impact ratings.'],9,19,WHITE)
txt(36,206,'INTERVIEW MESSAGE',10,TEAL,'Helvetica-Bold')
multiline(36,187,['"I connect evidence-based petroleum engineering with the operational processes','needed to develop work programs, evaluate risks, and support management decisions."'],10,15,WHITE)
rule(36,144,w-36)
multiline(36,127,['SOURCE: Norwegian Offshore Directorate FactPages, Production > Sum wellbores > Monthly by field.','https://factpages.sodir.no/en/field/TableView/Production/SumWellbores/Monthly'],7.5,12,MUTED)
multiline(36,94,['NOT a Pertamina EP Cepu operational system. No proprietary production, approved budget,','real vendor bids, verified intervention outcomes, or official tender compliance claims.'],7.7,12,AMBER)
page_footer(2);c.save()
print(out)
