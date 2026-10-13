# Interview demonstration: five-minute run-through

## Recommended order, target timing

| Time | Screen | Message |
|---|---|---|
| 0:00–0:45 | Executive Overview | Why a Program Engineer needs one workflow rather than separate technical/commercial spreadsheets |
| 0:45–1:35 | Production Analytics | Show actual public source observations, units, change over time and data limitation |
| 1:35–2:35 | Work Program & Budget | Edit one hypothetical uplift/probability/budget and explain risk-adjusted sensitivity |
| 2:35–3:35 | Tender Evaluation | Show eligible vs ineligible vendors; HSE and technical criteria precede ranking |
| 3:35–4:20 | Contract Tracker & Risk | Toggle contract milestone; change one risk score, explain owner and mitigation |
| 4:20–5:00 | Risk & Reporting | Export briefing; connect to planning, coordination and decision quality |

## Bahasa Indonesia — main talking points

**Opening (~35 sec)**

> "Saya menyiapkan PRODOPS Intelligence sebagai portofolio independen untuk menggambarkan cara kerja Associate Program Engineer pada Production & Operations. Alurnya dimulai dari evaluasi kinerja produksi, kemudian screening potensi pekerjaan, penyusunan program dan anggaran, evaluasi pengadaan, monitoring pelaksanaan, sampai pelaporan manajemen. Saya menggunakan data produksi historis publik dari Norwegia, sedangkan aspek biaya, tender, kontrak dan risiko merupakan simulasi yang saya buat untuk menunjukkan metode analisis, bukan data internal Pertamina EP Cepu."

**At Production Analytics (~35 sec)**

> "Di modul ini saya gunakan 43 data bulanan lapangan 16/1-12 Troldhaugen dari Norwegian Offshore Directorate. Gross oil, gross gas, dan produced water memiliki satuan berbeda, sehingga saya lakukan konversi secara konsisten. Perubahan tren digunakan sebagai sinyal untuk investigasi. Saya tidak langsung menyimpulkan penyebabnya karena data ini agregat tingkat lapangan, belum data sumur atau event operasi."

**At Work Program & Budget (~35 sec)**

> "Misalnya ada peluang optimasi yang perlu dibuktikan. Saya menyusun alternatif pekerjaan beserta biaya, lama eksekusi, estimasi uplift, dan probabilitas keberhasilan yang semuanya masih asumsi. Dashboard menghitung indikator screening yang dapat berubah saat asumsi diubah. Untuk keputusan sesungguhnya harus ditambahkan verifikasi engineering, biaya operasi, WP&B/AFE dan otorisasi yang berlaku."

**At Tender Evaluation (~35 sec)**

> "Saya membuat matriks evaluasi konseptual untuk menunjukkan cara berpikir yang terstruktur. Vendor yang gagal pada persyaratan HSE atau kualifikasi tidak masuk ranking. Penilaian teknis dan komersial baru dilakukan setelah syarat kelayakan terpenuhi. Ketentuan sesungguhnya tentu harus merujuk pada pedoman pengadaan SKK Migas serta prosedur internal perusahaan, sehingga model ini bukan sistem tender resmi."

**Close (~25 sec)**

> "Nilai tambah yang ingin saya tunjukkan adalah kemampuan saya menghubungkan data engineering dengan perencanaan pekerjaan, evaluasi risiko, koordinasi lintas fungsi, dan pelaporan yang jelas. Pendekatan ini sejalan dengan pengalaman saya di data validation, well screening, dan engineering dashboard sebelumnya."

## English — compact backup

> "I built PRODOPS Intelligence as an independent portfolio demonstration of the Production & Operations program engineering workflow. It connects observed field performance to opportunity screening, illustrative work program and budget scenarios, conceptual bid evaluation, contract milestone tracking, and management reporting. The production observations are real public Norwegian offshore data, while costs, vendor bids, and risks are clearly labeled hypothetical assumptions. The emphasis is on traceability, engineering judgment and cross-functional decision support, rather than presenting the prototype as an actual Pertamina EP Cepu system."

## Questions you should expect

**"Apakah ini aplikasi yang sudah pernah digunakan di Pertamina?"**  
"Tidak. Ini portofolio independen yang saya kembangkan untuk mendemonstrasikan pendekatan sistematis yang relevan dengan kebutuhan posisi. Saya tidak menggunakan informasi internal atau data sensitif perusahaan."

**"Kenapa datanya dari Norwegia?"**  
"Karena dataset publik yang memiliki asal-usul jelas bisa dipakai secara aman dan dapat direproduksi. Struktur prosesnya bisa ditransfer ke kasus hulu migas Indonesia, tetapi penerapan riil memerlukan integrasi data dan prosedur yang disetujui pemilik aset."

**"Kalau produksi turun, apakah perlu workover?"**  
"Belum tentu. Penurunan produksi tingkat lapangan hanya indikator. Saya perlu memilah allocation, downtime, choke changes, artificial lift, pressure, water/gas changes dan event logs di level sumur sebelum mengusulkan intervensi tertentu."

**"Ini menghitung NPV?"**  
"Belum. Angka payout hanya indikator gross screening dari asumsi, belum OPEX, profile decline, fiscal term, discounting, CAPEX phasing, probability model dan price sensitivity yang menyeluruh."

**"Apakah sudah sesuai PTK-007?"**  
"Saya menggunakannya sebagai referensi konteks pengadaan migas Indonesia, tetapi belum memodelkan persyaratan prosedural dan dokumen versi operator. Karena itu saya secara eksplisit menyebut matriks ini konseptual, bukan evaluasi tender yang sah atau final."

**"Apa kekuatan Anda untuk Associate Program Engineer?"**  
"Latar belakang saya di petroleum engineering, pengolahan data, validasi dan dashboard membuat saya terbiasa menganalisis data secara teliti dan menyajikan informasi untuk keputusan. Saya juga memahami bahwa posisi ini mencakup proses bisnis, anggaran, koordinasi dan pengadaan, sehingga saya membangun proyek ini untuk memperlihatkan kemampuan menyatukan aspek tersebut."

## Pre-interview QA checklist

- Open `index.html` in two browser tabs; keep one on Executive Overview and the other on Work Program.
- Do not depend on deploying a link tonight; carry the ZIP and a laptop local copy.
- Click through all 6 modules, confirm source badges and no blank screens.
- Verify simulated inputs reset before presentation.
- Avoid describing 3D illustration as a real field digital twin.
- If reporting export needed, run browser Print / Save as PDF, or CSV download.

---

## Version 2: CV-aligned rapid interview story (3-4 minutes)

1. **Rokan Reactivation Case (45 seconds)** - state that 101, 21 and ~13 MMBO appear in the submitted CV and must be explained by you if queried. Open fictional screening table and explain rating weights, integrity gate, and why hypothetical values are not actual Rokan data.
2. **Work Program & AFE (60 seconds)** - show quantity x unit cost, direct cost, 12% contingency, total cost and variance to the program planning assumption. Distinguish workpack estimate from approved AFE. Mention cost review and approval dependencies.
3. **Tender & TBE (60 seconds)** - show SOW/TOR sections, four weighted technical criteria, HSE pass/fail, and separate technical-commercial scoring. Demonstrate how Vendor Gamma can have a high technical score but fail the HSE eligibility gate. Never claim an actual tender award or PTK-007 compliance.
4. **Risk / Executive (30 seconds)** - identify risk owners, uncertainty, and formal review gates; conclude that analytical tools support, not substitute, proper engineering and management approval.

Suggested close (Bahasa Indonesia): "Portofolio ini merupakan simulasi independen. Pengalaman yang saya tulis dalam CV menjadi alasan saya menyusun alur tersebut, namun saya tidak menggunakan data rahasia ataupun mengklaim dokumen ini sebagai AFE, TOR, atau tender resmi operator."
