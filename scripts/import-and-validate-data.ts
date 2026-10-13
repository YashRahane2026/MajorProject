/**
 * Repeatable Data Import, Normalization & Validation Pipeline
 *
 * Usage:
 *   npx tsx scripts/import-and-validate-data.ts
 *
 * Responsibilities:
 * 1. Parse raw official CSV files in data/official/
 * 2. Run the 10-rule automated validation engine on official statistics
 * 3. Write normalized output to data/official/normalized_official_stats.json
 * 4. Verify the 5,000 synthetic demo profiles in data/demo/synthetic_nagpur_suspects_5000.json
 * 5. Verify all 32 synthetic portraits in public/images/portrait_001.jpg..portrait_032.jpg
 */

import fs from 'fs';
import path from 'path';
import {
  parseCsvToObjects,
  validateOfficialStatistics,
  isSyntheticRecord,
} from '../src/lib/data/validation';
import {
  VERIFIED_OFFICIAL_STATISTICS,
  OFFICIAL_DATA_SOURCES,
  UNAVAILABLE_GOVERNMENT_DATA,
} from '../src/lib/data/official-stats';

const ROOT = process.cwd();

function main() {
  console.log('======================================================================');
  console.log('CrimeTrack AI — Official & Synthetic Data Import & Validation Pipeline');
  console.log('======================================================================\n');

  // 1. Parse Official CSV Files
  const cityCsvPath = path.join(ROOT, 'data', 'official', 'nagpur_city_official_reported_stats.csv');
  const railwayCsvPath = path.join(ROOT, 'data', 'official', 'nagpur_railway_police_official_stats.csv');
  const sourcesCsvPath = path.join(ROOT, 'data', 'official', 'sources.csv');

  if (!fs.existsSync(cityCsvPath) || !fs.existsSync(railwayCsvPath) || !fs.existsSync(sourcesCsvPath)) {
    throw new Error('Missing required official CSV files in data/official/');
  }

  const cityRows = parseCsvToObjects(fs.readFileSync(cityCsvPath, 'utf8'));
  const railwayRows = parseCsvToObjects(fs.readFileSync(railwayCsvPath, 'utf8'));
  const sourceRows = parseCsvToObjects(fs.readFileSync(sourcesCsvPath, 'utf8'));

  console.log(`[1/4] Parsed Official CSVs:`);
  console.log(`      - nagpur_city_official_reported_stats.csv    : ${cityRows.length} rows`);
  console.log(`      - nagpur_railway_police_official_stats.csv   : ${railwayRows.length} rows`);
  console.log(`      - sources.csv                                : ${sourceRows.length} rows`);

  if (cityRows.length !== 24) {
    throw new Error(`Expected 24 rows in nagpur_city_official_reported_stats.csv, got ${cityRows.length}`);
  }
  if (railwayRows.length !== 15) {
    throw new Error(`Expected 15 rows in nagpur_railway_police_official_stats.csv, got ${railwayRows.length}`);
  }

  // 2. Run 10-Rule Validation Engine on Normalized Official Records
  const validation = validateOfficialStatistics(VERIFIED_OFFICIAL_STATISTICS);
  const checkEntries = Object.entries(validation.report.checks);
  const passedChecksCount = checkEntries.filter(([, ok]) => ok).length;

  console.log(`\n[2/4] Official Statistics Validation Report:`);
  console.log(`      - Total Input Rows       : ${validation.report.total_input_rows}`);
  console.log(`      - Accepted Verified Rows : ${validation.report.accepted_rows}`);
  console.log(`      - Rejected Rows          : ${validation.report.rejected_rows}`);
  console.log(`      - Checks Passed          : ${passedChecksCount} / ${checkEntries.length}`);

  for (const [checkName, ok] of checkEntries) {
    console.log(`        [${ok ? 'PASS' : 'FAIL'}] ${checkName}`);
  }

  if (!validation.report.passed || validation.report.rejected_rows > 0) {
    console.error('Validation failed:', validation.report.issues);
    process.exit(1);
  }

  // 3. Write Normalized Official JSON
  const normalizedOutPath = path.join(ROOT, 'data', 'official', 'normalized_official_stats.json');
  const normalizedPayload = {
    generated_at: new Date().toISOString(),
    layer: 'LAYER_A_VERIFIED_OFFICIAL_GOVERNMENT_STATISTICS',
    total_records: validation.accepted.length,
    nagpur_city_records: validation.accepted.filter((r) => r.jurisdiction_id === 'nagpur_city').length,
    nagpur_railway_records: validation.accepted.filter((r) => r.jurisdiction_id === 'nagpur_railway').length,
    validation_report: validation.report,
    sources: OFFICIAL_DATA_SOURCES,
    unavailable_government_data: UNAVAILABLE_GOVERNMENT_DATA,
    records: validation.accepted,
  };

  fs.writeFileSync(normalizedOutPath, JSON.stringify(normalizedPayload, null, 2), 'utf8');
  console.log(`\n[3/4] Wrote Normalized Official Dataset:`);
  console.log(`      -> ${normalizedOutPath} (${validation.accepted.length} verified records)`);

  // 4. Verify Layer B (5,000 Synthetic Demo Profiles + 32 Portraits)
  const syntheticJsonPath = path.join(ROOT, 'data', 'demo', 'synthetic_nagpur_suspects_5000.json');
  if (!fs.existsSync(syntheticJsonPath)) {
    throw new Error(`Missing synthetic dataset at ${syntheticJsonPath}`);
  }

  const syntheticProfiles = JSON.parse(fs.readFileSync(syntheticJsonPath, 'utf8')) as Record<string, unknown>[];
  let blankCells = 0;
  for (const profile of syntheticProfiles) {
    if (!isSyntheticRecord(profile)) {
      throw new Error(`Profile ${String(profile.id)} failed synthetic guard check`);
    }
    for (const [, val] of Object.entries(profile)) {
      if (val === null || val === undefined || String(val).trim() === '') {
        blankCells++;
      }
    }
  }

  // Verify 32 portraits + fallback SVG
  const imagesDir = path.join(ROOT, 'public', 'images');
  let portraitsFound = 0;
  for (let i = 1; i <= 32; i++) {
    const file = path.join(imagesDir, `portrait_${String(i).padStart(3, '0')}.jpg`);
    if (fs.existsSync(file) && fs.statSync(file).size > 0) {
      portraitsFound++;
    }
  }
  const fallbackExists = fs.existsSync(path.join(imagesDir, 'portrait_fallback.svg'));

  console.log(`\n[4/4] Verified Layer B (Synthetic Demo Sandbox):`);
  console.log(`      - Synthetic Profiles Loaded : ${syntheticProfiles.length}`);
  console.log(`      - Fields per Profile        : ${Object.keys(syntheticProfiles[0] || {}).length}`);
  console.log(`      - Blank / Null Cells        : ${blankCells}`);
  console.log(`      - Local Portrait Images     : ${portraitsFound} / 32 (Fallback SVG: ${fallbackExists ? 'YES' : 'NO'})`);

  if (syntheticProfiles.length !== 5000 || blankCells !== 0 || portraitsFound !== 32 || !fallbackExists) {
    throw new Error('Synthetic dataset or portrait verification failed!');
  }

  console.log('\n======================================================================');
  console.log('SUCCESS: All Official & Synthetic Datasets Imported and Validated.');
  console.log('======================================================================');
}

main();
