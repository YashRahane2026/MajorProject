# CrimeTrack AI — Official Data Sources, Provenance & Ethical Architecture

This document records the authoritative data sources, exact figures, reporting jurisdictions, known public data limitations, and the strict two-layer data architecture implemented in **CrimeTrack AI** (Nagpur Jurisdiction).

---

## 1. Strict Two-Layer Data Separation Architecture

To satisfy academic rigor, legal compliance, and privacy standards, CrimeTrack AI enforces a strict physical, schema-level, and UI-level boundary between two layers:

| Layer | Purpose | Storage & Files | Provenance Enforcement |
| :--- | :--- | :--- | :--- |
| **Layer A — Verified Official Government Statistics** | Powers all city-level and railway-district crime KPIs, time-series charts, category breakdowns, and detection rates across the Admin, Police, Court, and Custodial dashboards. | `data/official/nagpur_city_official_reported_stats.csv` (24 rows)<br>`data/official/nagpur_railway_police_official_stats.csv` (15 rows)<br>`data/official/sources.csv`<br>`src/lib/data/official-stats.ts`<br>Table: `official_crime_statistics` (`CHECK (is_synthetic = FALSE)`) | Every record includes `source_id`, `source_name`, `source_url`, `publication_year`, `table_or_section`, `jurisdiction`, and `is_synthetic: false`. |
| **Layer B — Synthetic Individual Demo Profiles** | Powers individual-level workflows: Suspect Directory (5,000 profiles), Biometric Face Matching (ArcFace 512-D simulation), NLP Case Linking (SBERT 768-D simulation), FIR narratives, and Court/Custody lifecycle tracking. | `data/demo/synthetic_nagpur_suspects_5000.csv`<br>`data/demo/synthetic_nagpur_suspects_5000.json`<br>`data/demo/synthetic_nagpur_suspects_preview_25.csv`<br>`public/images/portrait_001.jpg`–`portrait_032.jpg` | Every record carries `isSynthetic: true`, ID prefix `SYN-NGP-00001` to `SYN-NGP-05000`, and an explicit badge: **`SYNTHETIC DEMO — NOT A REAL PERSON OR CASE`**. |

> **Zero Cross-Contamination Rule:** Synthetic suspect records (`SYN-NGP-*`) are blocked at both the TypeScript validation layer (`validateOfficialStatistics`) and the PostgreSQL check constraint (`chk_official_stats_never_synthetic`) from entering official statistical aggregations.

---

## 2. Official Government Sources Inspected & Integrated

### 2.1 Imported Official Dataset Sources (`data/official/sources.csv`)

| Source ID | Source Title | Publishing Authority | Coverage / Jurisdiction | Official URL |
| :--- | :--- | :--- | :--- | :--- |
| `SRC-01` | Crime in India 2022 — Volume I (Table 1A.5: IPC + SLL Cognizable Crimes in Metropolitan Cities) | National Crime Records Bureau (NCRB), Ministry of Home Affairs, Govt. of India | Nagpur City (Metropolitan), 2020–2022 | https://www.ncrb.gov.in/crime-in-india-year-wise.html |
| `SRC-02` | Crime in India 2023 — Volume I (Table 1B.1 & Metropolitan City Violent Crime & Selected IPC Heads) | National Crime Records Bureau (NCRB), Ministry of Home Affairs, Govt. of India | Nagpur City (Metropolitan), 2021–2023 | https://www.ncrb.gov.in/crime-in-india-year-wise.html |
| `SRC-03` | Crime in India 2023 — Metropolitan City Tables (Crimes Against Women & Senior Citizens 60+) | National Crime Records Bureau (NCRB), Ministry of Home Affairs, Govt. of India | Nagpur City (Metropolitan), 2021–2023 | https://www.ncrb.gov.in/crime-in-india-year-wise.html |
| `SRC-04` | Nagpur Railway Police (GRP) Official Crime Statistics Dashboard (2023–2025) | Maharashtra State Railway Police — Nagpur Railway Police District | Nagpur Railway Police District, 2023–2025 | https://nagpurrailwaypolice.mahapolice.gov.in/ |
| `SRC-05` | Synthetic Nagpur Suspect Demo Dataset Generator (`SYN-NGP-00001` to `SYN-NGP-05000`) | CrimeTrack AI Engineering Team (Fictional Demo Sandbox) | Synthetic Demo Only | Local Archive (`data/demo/synthetic_nagpur_suspects_5000.csv`) |
| `SRC-06` | Nagpur City Police Official Portal | Office of the Commissioner of Police, Nagpur City | Nagpur City Police Commissionerate | https://nagpurpolice.gov.in/ |
| `SRC-07` | Nagpur City Police Analytics Dashboard | Nagpur City Police | Nagpur City Police Commissionerate | https://dashboard.nagpurpolice.in/ |
| `SRC-08` | Open Government Data (OGD) Platform India | National Informatics Centre (NIC), MeitY, Govt. of India | India / Maharashtra / Metropolitan Cities | https://www.data.gov.in/ |
| `SRC-09` | Official eCourts Services Portal | eCommittee, Supreme Court of India | District & Sessions Court, Nagpur | https://services.ecourts.gov.in/ecourtindia_v6/ |

---

## 3. Exact Verified Official Figures Imported

### 3.1 Nagpur City (Metropolitan) — NCRB *Crime in India* (`nagpur_city_official_reported_stats.csv`, 24 Rows)

1. **All Cognizable Offences (IPC + SLL Total):**
   - **2020:** `19,250` registered cases
   - **2021:** `22,302` registered cases
   - **2022:** `19,167` registered cases
2. **Total Violent Crimes (NCRB Metropolitan Table):**
   - **2021:** `1,409` cases
   - **2022:** `1,278` cases
   - **2023:** `1,468` cases (Violent Crime Rate: **`58.8` per 1,00,000 population**; Chargesheeting Rate: **`78.6%`**)
3. **Murder (IPC Section 302):**
   - **2021:** `95` cases
   - **2022:** `65` cases
   - **2023:** `79` cases
4. **Selected Violent & Major IPC Heads in Nagpur City (2023, plus 2022 Rape comparison):**
   - **Kidnapping & Abduction (Total):** `520` cases (2023)
   - **Grievous Hurt:** `237` cases (2023)
   - **Rape (IPC Section 376):** `115` cases (2022) → `132` cases (2023)
   - **Attempt to Commit Murder (IPC Section 307):** `121` cases (2023)
   - **Culpable Homicide not Amounting to Murder:** `13` cases (2023)
   - **Arson:** `1` case (2023)
   - **Dacoity:** `1` case (2023)
   - **Infanticide:** `0` cases (2023)
   - **Foeticide:** `0` cases (2023)
5. **Special Vulnerable Group Offences in Nagpur City (2021–2023):**
   - **Crimes Against Women:** `1,156` (2021) → `1,259` (2022) → `1,556` (2023)
   - **Crimes Against Senior Citizens (60+ years):** `250` (2021) → `167` (2022) → `231` (2023)

> **Non-Double-Counting Rule:** `Total Violent Crimes (1,468)` and `All Cognizable Offences (19,167)` are marked `isSummaryRow = true`. Individual heads (`Murder`, `Rape`, `Kidnapping`, etc.) are never added on top of `Total Violent Crimes`.

---

### 3.2 Nagpur Railway Police District (GRP) — Official Dashboard (`nagpur_railway_police_official_stats.csv`, 15 Rows)

> **Jurisdiction Boundary Rule:** Nagpur Railway Police (GRP) covers railway premises and trains within the Nagpur Railway Police District. It is **never added to or merged with** Nagpur City Police Commissionerate figures.

1. **Annual Summary Totals (2023–2025):**
   - **2023 Total:** `1,562` Registered | `637` Detected | **`40.78%`** Detection Rate
   - **2024 Total:** `1,499` Registered | `537` Detected | **`35.82%`** Detection Rate
   - **2025 Total:** `1,359` Registered | `258` Detected | **`18.98%`** Detection Rate
2. **2025 Category-Wise Breakdown (12 Categories — Exact Sum = `1,359` Registered, `258` Detected):**

| Category | 2025 Registered | 2025 Detected | Detection Rate (%) |
| :--- | ---: | ---: | ---: |
| Theft | 1,278 | 213 | 16.67% |
| Snatching | 27 | 5 | 18.52% |
| Hurt | 16 | 14 | 87.50% |
| Other IPC | 10 | 7 | 70.00% |
| Kidnapping | 8 | 5 | 62.50% |
| Molestation | 6 | 6 | 100.00% |
| Assault | 5 | 2 | 40.00% |
| Robbery | 4 | 2 | 50.00% |
| Rape | 3 | 2 | 66.67% |
| Murder | 1 | 1 | 100.00% |
| Dacoity | 1 | 1 | 100.00% |
| Attempt murder | 0 | 0 | 0.00% |
| **Reconciled Sum (12 Categories)** | **1,359** | **258** | **18.98%** |

---

## 4. Documented Public Data Limitations (`"Not publicly available"`)

CrimeTrack AI **never fabricates, extrapolates, or randomly generates missing government statistics**. The following metrics are explicitly marked `"Not publicly available"` in the UI:

1. **Individual Accused / Suspect PII & Arrest Photographs:** Protected under privacy laws and ongoing trial confidentiality; CCTNS (Crime and Criminal Tracking Network & Systems) is restricted to authorized law-enforcement intranets.
2. **Nagpur City Police Station-Wise Daily/Monthly Live FIR Counts:** `https://dashboard.nagpurpolice.in/` requires departmental authentication or does not expose an open machine-readable bulk CSV API.
3. **NCRB *Crime in India* 2024 & 2025 Metropolitan City Tables:** Not yet published by NCRB as of the current dataset snapshot (`2023` is the latest published NCRB edition).
4. **Aggregate Nagpur District Court Remand & Bail Ratios:** `eCourts` provides case-by-case lookup by CNR/FIR number rather than bulk city-level statistical CSV exports.
5. **Nagpur Central Prison Live Occupancy & Remand Feed:** Restricted to Maharashtra Prison Department internal systems.

---

## 5. Synthetic Demo Profile Layer (`data/demo/`)

- **Total Profiles:** `5,000` (`SYN-NGP-00001` through `SYN-NGP-05000`)
- **Schema Completeness:** `35` columns per record, `0` blank cells (`175,000` validated cells)
- **Status Distribution:** `1,852` Active Investigation | `1,383` In Custody | `1,000` Released on Bail | `765` Wanted
- **Threat Level Distribution:** `614` High | `1,833` Medium | `2,553` Low
- **Portraits:** `32` local AI-generated synthetic portraits (`public/images/portrait_001.jpg` to `portrait_032.jpg`) plus fallback vector (`public/images/portrait_fallback.svg`).
- **Ethical ML Policy:** CrimeTrack AI **does not train predictive policing or criminality classifiers on synthetic demographic fields**. Biometric (ArcFace 512-D) and NLP (SBERT 768-D) modules are architectural retrieval/similarity demonstrations evaluated on explicit benchmark metrics.

---

## 6. Running the Data Import & Validation Pipeline

```bash
# 1. Parse official CSVs, run all 10 validation checks, and write normalized JSON:
npm run import:data

# 2. Run the automated data integrity and provenance test suite:
npm run test
```
