# CrimeTrack AI — Nagpur real statistics + synthetic demo profiles

Prepared: 2026-10-13

## Package contents

- `nagpur_city_official_reported_stats.csv`: Nagpur city aggregate numbers reported in NCRB-referencing public reports. Each row includes a source URL, scope and interpretation note.
- `nagpur_railway_police_official_stats.csv`: numbers shown on the official Nagpur Railway Police dashboard. This is a different jurisdiction and must not be combined with Nagpur City Police totals.
- `synthetic_nagpur_suspects_5000.csv`: 5,000 generated, fictional, Indian-style demo profiles for UI/database testing.
- `synthetic_nagpur_suspects_5000.json`: same records in JSON for seed scripts.
- `synthetic_nagpur_suspects_preview_25.csv`: first 25 profiles to inspect quickly.
- `images/portrait_001.jpg` … `portrait_032.jpg`: 32 AI-generated fictional South Asian adult portrait images cropped from two generated portrait grids; images are reused across profiles.
- `sources.csv`: sources, scope and caveats.
- `data_dictionary.csv`: field descriptions.
- `verification_report.txt`: row-count and completeness checks.

## Data integrity and provenance

**Official statistics are kept separate from generated people.** The official city-level crime values in the CSV are aggregate statistics and cannot be used as individual suspect records. For several city-specific 2023 figures, the original NCRB report catalogue is linked, and the value was transcribed from a published report citing NCRB because the report's large PDF / table export could not be downloaded via this workspace. These rows are labeled as secondary-source transcriptions; cross-check against the NCRB city-wise table before formal publication.

Official NCRB 2023 catalogue: https://www.data.gov.in/catalog/crime-india-2023

Nagpur City total cognizable crimes 2020-2022 (NCRB report figures as cited): https://timesofindia.indiatimes.com/city/nagpur/nagpur-crime-rate-down-14-ranks-8th-in-india-ncrb-data/articleshow/105760188.cms
Nagpur violent crimes and selected categories 2021-2023 (citing NCRB 2023): https://timesofindia.indiatimes.com/city/nagpur/nagpurs-violent-crime-surge-ranks-sixth-nationally-amid-urban-safety-crisis-ncrb-2023-reveals/articleshow/124264467.cms
Nagpur senior-citizen crime figures (citing NCRB 2023): https://timesofindia.indiatimes.com/city/nagpur/nagpur-ranks-7th-among-major-cities-for-senior-citizen-crimes-in-23-ncrb/articleshow/124264469.cms
Official Nagpur Railway Police dashboard: https://www.nagpurrailwaypolice.gov.in/en/dist/

### Scope note

The city-level CSV is a **verified-source subset, not a claim to reproduce every table in the complete NCRB report**. The official Open Government Data catalogue lists the full 2023 report and separate city-wise/ crime-head tables. The City Police dashboard is dynamic and showed placeholders to this browser, so no values were copied from it.

The Railway Police figures are labelled separately because railway crime coverage spans railway-police jurisdictions and stations; they are **not Nagpur City Police totals**.

## Synthetic profiles — important

- All 5,000 individual profiles are fabricated. Names are generated Indian-style names with a visible `[SYNTHETIC DEMO ...]` marker to avoid implying a real person is accused of a crime.
- Status, threat level, case count, aliases, descriptions and offence categories are generated for interface testing only.
- Alias is populated for every row: only 4% receive a demo alias; all other rows contain `Not recorded (demo)`.
- No profile represents a real FIR, arrest, accusation, conviction, custodial record or person. Do not display them as actual suspects and do not use them for any real law-enforcement/individual risk decision.
- Profile categories are illustrative and **not sampled to reproduce the real crime frequency distribution**. Use official aggregate stats for factual charts.
- Portraits are generated fictional images, not genuine police mugshots. They are reused across profiles and are not connected to any real identity.

## Suggested application integration

- Admin analytics: load `nagpur_city_official_reported_stats.csv` and `nagpur_railway_police_official_stats.csv` separately, making jurisdiction clear in charts.
- Suspect page: seed from `synthetic_nagpur_suspects_5000.json`; show a persistent badge `SYNTHETIC DEMO — NOT A REAL PERSON` for each profile.
- Images: copy `images/` into your frontend's static/public directory and map `photoUrl` to the deployed path. Do not rely on ZIP-local relative paths after deployment.

## Licensing and attribution

Consult each source's own terms. The crime numbers are reproduced as facts with source URLs; this kit does not grant extra rights over third-party page content. AI-generated portraits are synthetic.
