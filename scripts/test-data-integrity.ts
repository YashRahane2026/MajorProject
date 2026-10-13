/**
 * Automated Data Integrity, Provenance & Validation Test Suite
 *
 * Usage:
 *   npx tsx scripts/test-data-integrity.ts
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  parseCsvToObjects,
  validateOfficialStatistics,
  computeSafeCategorySum,
  isSyntheticRecord,
  OfficialStatisticRecord,
} from '../src/lib/data/validation';
import {
  VERIFIED_OFFICIAL_STATISTICS,
  OFFICIAL_DATA_SOURCES,
  UNAVAILABLE_GOVERNMENT_DATA,
} from '../src/lib/data/official-stats';
import {
  SUSPECTS_DATA,
  SYNTHETIC_DATASET_SUMMARY,
  ensureSyntheticCompliance,
} from '../src/lib/data/suspects-data';
import {
  addCustomServerSuspect,
  findSyntheticProfileById,
  removeCustomServerSuspect,
  loadAll5000SyntheticProfiles,
} from '../src/lib/data/server-synthetic-loader';
import {
  authenticateOrRegisterUser,
  formatNameFromEmail,
} from '../src/lib/auth/auth-store';

const ROOT = process.cwd();
let passedTests = 0;

function runTest(name: string, fn: () => void) {
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('======================================================================');
console.log('CrimeTrack AI — Automated Data Provenance & Integrity Test Suite');
console.log('======================================================================\n');

// ----------------------------------------------------------------------------
// 1. Unit Tests for CSV Parser & Validation Engine
// ----------------------------------------------------------------------------
console.log('Suite 1: Parser & 10-Rule Validation Engine Tests');

runTest('1.1 RFC-4180 CSV parser handles quoted fields and commas accurately', () => {
  const sampleCsv = `col1,col2,col3\n"Nagpur, MH",2023,"1,468 cases"\nSimple,2024,500`;
  const parsed = parseCsvToObjects(sampleCsv);
  assert.strictEqual(parsed.length, 2);
  assert.strictEqual(parsed[0].col1, 'Nagpur, MH');
  assert.strictEqual(parsed[0].col3, '1,468 cases');
  assert.strictEqual(parsed[1].col2, '2024');
});

runTest('1.2 All 39 official statistics records pass all 10 validation rules with 0 rejections', () => {
  const res = validateOfficialStatistics(VERIFIED_OFFICIAL_STATISTICS);
  assert.strictEqual(res.report.passed, true);
  assert.strictEqual(res.report.total_input_rows, 39);
  assert.strictEqual(res.report.accepted_rows, 39);
  assert.strictEqual(res.report.rejected_rows, 0);
  const allChecksTrue = Object.values(res.report.checks).every(Boolean);
  assert.strictEqual(allChecksTrue, true);
});

runTest('1.3 Validator rejects records with missing or non-https source_url', () => {
  const badRecord: OfficialStatisticRecord = {
    ...VERIFIED_OFFICIAL_STATISTICS[0],
    record_id: 'BAD-URL-TEST',
    source_url: '',
  };
  const res = validateOfficialStatistics([badRecord]);
  assert.strictEqual(res.accepted.length, 0);
  assert.strictEqual(res.report.rejected_rows, 1);
  assert.ok(res.report.issues.some((e) => e.rule_id === 'RULE_3_SOURCE_VERIFICATION'));
});

runTest('1.4 Validator rejects duplicate rows (same jurisdiction + year + metric + crime_category)', () => {
  const dup1 = VERIFIED_OFFICIAL_STATISTICS[0];
  const dup2: OfficialStatisticRecord = {
    ...VERIFIED_OFFICIAL_STATISTICS[0],
    record_id: 'DUP-ID-2',
  };
  const res = validateOfficialStatistics([dup1, dup2]);
  assert.strictEqual(res.accepted.length, 1);
  assert.strictEqual(res.report.rejected_rows, 1);
  assert.ok(res.report.issues.some((e) => e.rule_id === 'RULE_2_DUPLICATE_ROW'));
});

runTest('1.5 Validator rejects negative or non-integer numeric counts', () => {
  const negativeRecord: OfficialStatisticRecord = {
    ...VERIFIED_OFFICIAL_STATISTICS[0],
    record_id: 'NEG-COUNT-TEST',
    crime_category: 'Test Negative Category',
    registered_cases: -25,
  };
  const res = validateOfficialStatistics([negativeRecord]);
  assert.strictEqual(res.accepted.length, 0);
  assert.strictEqual(res.report.rejected_rows, 1);
  assert.ok(res.report.issues.some((e) => e.rule_id === 'RULE_1_NON_NEGATIVE_INTEGER'));
});

runTest('1.6 Validator rejects records where detected_cases > registered_cases', () => {
  const badDetection: OfficialStatisticRecord = {
    ...VERIFIED_OFFICIAL_STATISTICS[24], // Railway row
    record_id: 'BAD-DET-TEST',
    crime_category: 'Invalid Detection Test',
    registered_cases: 50,
    detected_cases: 95,
  };
  const res = validateOfficialStatistics([badDetection]);
  assert.strictEqual(res.accepted.length, 0);
  assert.strictEqual(res.report.rejected_rows, 1);
  assert.ok(res.report.issues.some((e) => e.rule_id === 'RULE_1_NON_NEGATIVE_INTEGER'));
});

runTest('1.7 Validator blocks synthetic suspect records from entering official statistics (Zero Cross-Contamination)', () => {
  const contaminatedRecord = {
    ...VERIFIED_OFFICIAL_STATISTICS[0],
    record_id: 'SYN-NGP-00001',
    crime_category: 'SYNTHETIC DEMO — NOT A REAL PERSON OR CASE',
    isSynthetic: 'TRUE',
  };

  assert.strictEqual(isSyntheticRecord(contaminatedRecord), true);
  const res = validateOfficialStatistics([contaminatedRecord]);
  assert.strictEqual(res.accepted.length, 0);
  assert.strictEqual(res.report.rejected_rows, 1);
  assert.ok(res.report.issues.some((e) => e.rule_id === 'RULE_10_SYNTHETIC_GUARD'));
});

runTest('1.8 computeSafeCategorySum excludes summary totals and thematic groups to prevent double-counting', () => {
  const safeRly2025 = computeSafeCategorySum(VERIFIED_OFFICIAL_STATISTICS, 'nagpur_railway', 2025);
  assert.strictEqual(safeRly2025.publishedTotal, 1359);
  assert.strictEqual(safeRly2025.componentCategorySum, 1359);
  assert.strictEqual(safeRly2025.categoryCount, 12);
  assert.strictEqual(safeRly2025.isExhaustivePartition, true);

  const safeCity2023 = computeSafeCategorySum(VERIFIED_OFFICIAL_STATISTICS, 'nagpur_city', 2023);
  assert.strictEqual(safeCity2023.publishedTotal, 1468);
  assert.strictEqual(safeCity2023.componentCategorySum, 1104); // 79+13+132+520+121+237+1+1
  assert.strictEqual(safeCity2023.isExhaustivePartition, false);
});

// ----------------------------------------------------------------------------
// 2. Manual Cross-Verification of 12+ Official Values Against Source CSVs
// ----------------------------------------------------------------------------
console.log('\nSuite 2: Cross-Verification of Official Statistics Against Raw CSV Tables');

const cityCsvRows = parseCsvToObjects(
  fs.readFileSync(path.join(ROOT, 'data', 'official', 'nagpur_city_official_reported_stats.csv'), 'utf8')
);
const rlyCsvRows = parseCsvToObjects(
  fs.readFileSync(path.join(ROOT, 'data', 'official', 'nagpur_railway_police_official_stats.csv'), 'utf8')
);

function findOfficialValue(id: string): OfficialStatisticRecord {
  const found = VERIFIED_OFFICIAL_STATISTICS.find((r) => r.record_id === id);
  assert.ok(found, `Missing official record ${id}`);
  return found;
}

runTest('2.1 Verify 12+ official numbers match raw CSV tables and NCRB/Railway Police figures', () => {
  // 1. Nagpur City 2020 Cognizable Offences = 19,250
  assert.strictEqual(findOfficialValue('NGP-CITY-2020-COG-TOTAL').registered_cases, 19250);
  assert.strictEqual(Number(cityCsvRows[0].official_or_reported_count), 19250);

  // 2. Nagpur City 2021 Cognizable Offences = 22,302
  assert.strictEqual(findOfficialValue('NGP-CITY-2021-COG-TOTAL').registered_cases, 22302);
  assert.strictEqual(Number(cityCsvRows[1].official_or_reported_count), 22302);

  // 3. Nagpur City 2022 Cognizable Offences = 19,167
  assert.strictEqual(findOfficialValue('NGP-CITY-2022-COG-TOTAL').registered_cases, 19167);
  assert.strictEqual(Number(cityCsvRows[2].official_or_reported_count), 19167);

  // 4. Nagpur City 2023 Violent Crimes Total = 1,468 & Rate = 58.8
  assert.strictEqual(findOfficialValue('NGP-CITY-2023-VIOLENT-TOTAL').registered_cases, 1468);
  assert.strictEqual(findOfficialValue('NGP-CITY-2023-VIOLENT-RATE').crime_rate, 58.8);

  // 5. Nagpur City Murder 2021 (95), 2022 (65), 2023 (79)
  assert.strictEqual(findOfficialValue('NGP-CITY-2021-MURDER').registered_cases, 95);
  assert.strictEqual(findOfficialValue('NGP-CITY-2022-MURDER').registered_cases, 65);
  assert.strictEqual(findOfficialValue('NGP-CITY-2023-MURDER').registered_cases, 79);

  // 6. Nagpur City 2023 Kidnapping & Abduction = 520
  assert.strictEqual(findOfficialValue('NGP-CITY-2023-KIDNAPPING').registered_cases, 520);

  // 7. Nagpur City 2023 Attempt to Murder = 121, Grievous Hurt = 237, Rape = 132 (2022 Rape = 115)
  assert.strictEqual(findOfficialValue('NGP-CITY-2023-ATTEMPT-MURDER').registered_cases, 121);
  assert.strictEqual(findOfficialValue('NGP-CITY-2023-GRIEVOUS-HURT').registered_cases, 237);
  assert.strictEqual(findOfficialValue('NGP-CITY-2023-RAPE').registered_cases, 132);
  assert.strictEqual(findOfficialValue('NGP-CITY-2022-RAPE').registered_cases, 115);

  // 8. Nagpur City Crimes Against Women: 2021 (1,156), 2022 (1,259), 2023 (1,556)
  assert.strictEqual(findOfficialValue('NGP-CITY-2021-WOMEN').registered_cases, 1156);
  assert.strictEqual(findOfficialValue('NGP-CITY-2022-WOMEN').registered_cases, 1259);
  assert.strictEqual(findOfficialValue('NGP-CITY-2023-WOMEN').registered_cases, 1556);

  // 9. Nagpur City Senior Citizen Crimes (60+): 2021 (250), 2022 (167), 2023 (231)
  assert.strictEqual(findOfficialValue('NGP-CITY-2021-SENIORS').registered_cases, 250);
  assert.strictEqual(findOfficialValue('NGP-CITY-2022-SENIORS').registered_cases, 167);
  assert.strictEqual(findOfficialValue('NGP-CITY-2023-SENIORS').registered_cases, 231);

  // 10. Nagpur Railway Police Totals: 2023 (1562/637/40.78%), 2024 (1499/537/35.82%), 2025 (1359/258/18.98%)
  const rly23 = findOfficialValue('NGP-RLY-2023-TOTAL');
  assert.strictEqual(rly23.registered_cases, 1562);
  assert.strictEqual(rly23.detected_cases, 637);
  assert.strictEqual(rly23.detection_rate_percent, 40.78);

  const rly24 = findOfficialValue('NGP-RLY-2024-TOTAL');
  assert.strictEqual(rly24.registered_cases, 1499);
  assert.strictEqual(rly24.detected_cases, 537);
  assert.strictEqual(rly24.detection_rate_percent, 35.82);

  const rly25 = findOfficialValue('NGP-RLY-2025-TOTAL');
  assert.strictEqual(rly25.registered_cases, 1359);
  assert.strictEqual(rly25.detected_cases, 258);
  assert.strictEqual(rly25.detection_rate_percent, 18.98);
  assert.strictEqual(Number(rlyCsvRows[2].registered_cases), 1359);

  // 11. Nagpur Railway Police 2025 Theft = 1278 reg / 213 det (16.67%)
  const rlyTheft = findOfficialValue('NGP-RLY-2025-THEFT');
  assert.strictEqual(rlyTheft.registered_cases, 1278);
  assert.strictEqual(rlyTheft.detected_cases, 213);
  assert.strictEqual(rlyTheft.detection_rate_percent, 16.67);
});

runTest('2.2 Official data sources and unavailable government data disclosures are complete', () => {
  assert.strictEqual(OFFICIAL_DATA_SOURCES.length, 9);
  assert.strictEqual(UNAVAILABLE_GOVERNMENT_DATA.length, 6);
  for (const item of UNAVAILABLE_GOVERNMENT_DATA) {
    assert.strictEqual(item.status, 'Not publicly available');
  }
});

// ----------------------------------------------------------------------------
// 3. Synthetic Demo Profile Layer Verification (5,000 Profiles + 32 Portraits)
// ----------------------------------------------------------------------------
console.log('\nSuite 3: Synthetic Demo Dataset (5,000 Profiles) & Portrait Asset Tests');

runTest('3.1 All 5,000 synthetic profiles have 35 fields, 0 blank cells, and mandatory synthetic badges', () => {
  const jsonPath = path.join(ROOT, 'data', 'demo', 'synthetic_nagpur_suspects_5000.json');
  const all5000 = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as Record<string, unknown>[];
  assert.strictEqual(all5000.length, 5000);
  assert.strictEqual(all5000[0].id, 'SYN-NGP-00001');
  assert.strictEqual(all5000[4999].id, 'SYN-NGP-05000');

  let aliasRecordedCount = 0;
  let aliasPlaceholderCount = 0;

  for (const p of all5000) {
    const keys = Object.keys(p);
    assert.strictEqual(keys.length, 35, `Expected 35 fields on ${String(p.id)}, found ${keys.length}`);
    assert.strictEqual(String(p.isSynthetic).toUpperCase(), 'TRUE');
    assert.strictEqual(p.recordType, 'SYNTHETIC_DEMO_ONLY');
    assert.ok(String(p.recordDisclaimer).includes('Nagpur Police'));
    assert.ok(String(p.photoUrl).startsWith('/images/portrait_'));

    for (const k of keys) {
      const val = p[k];
      assert.ok(val !== null && val !== undefined && String(val).trim() !== '', `Blank cell on ${String(p.id)}.${k}`);
    }

    if (p.alias === 'None' || p.alias === 'Not recorded (demo)') {
      aliasPlaceholderCount++;
    } else {
      aliasRecordedCount++;
    }
  }

  assert.strictEqual(aliasRecordedCount, 189);
  assert.strictEqual(aliasPlaceholderCount, 4811);
  assert.strictEqual(SYNTHETIC_DATASET_SUMMARY.totalProfiles, 5000);
  assert.strictEqual(SUSPECTS_DATA.length, 25);
});

runTest('3.2 ensureSyntheticCompliance enforces synthetic disclaimer on new runtime profiles', () => {
  const normalized = ensureSyntheticCompliance({
    ...SUSPECTS_DATA[0],
    id: '9999',
    photoUrl: '',
  });
  assert.ok(normalized.id.startsWith('SYN-NGP-'));
  assert.strictEqual(String(normalized.isSynthetic).toUpperCase(), 'TRUE');
  assert.strictEqual(normalized.recordType, 'SUSPECT_RECORD');
  assert.strictEqual(normalized.photoUrl, '/images/portrait_fallback.svg');
});

runTest('3.3 All 32 synthetic portraits and fallback SVG exist in public/images/', () => {
  for (let i = 1; i <= 32; i++) {
    const imgPath = path.join(ROOT, 'public', 'images', `portrait_${String(i).padStart(3, '0')}.jpg`);
    assert.ok(fs.existsSync(imgPath), `Missing ${imgPath}`);
    assert.ok(fs.statSync(imgPath).size > 1000, `Portrait ${imgPath} is unexpectedly small`);
  }
  const fallbackPath = path.join(ROOT, 'public', 'images', 'portrait_fallback.svg');
  assert.ok(fs.existsSync(fallbackPath), 'Missing portrait_fallback.svg');
});

console.log(`\nSuite 4: Custom Suspect Server Operations & Smart Authentication`);

runTest('4.1 addCustomServerSuspect, findSyntheticProfileById, and removeCustomServerSuspect work reliably', () => {
  const customId = 'SYN-TEST-99999';
  const custom = {
    ...SUSPECTS_DATA[0],
    id: customId,
    name: 'Test Suspect Profile',
    locality: 'Sitabuldi',
  };

  // Add custom suspect
  addCustomServerSuspect(custom);
  const found = findSyntheticProfileById(customId);
  assert.ok(found, 'Added custom suspect should be retrievable by ID');
  assert.strictEqual(found?.name, 'Test Suspect Profile');

  // Verify it appears in loadAll5000SyntheticProfiles at the top
  const all = loadAll5000SyntheticProfiles();
  assert.strictEqual(all[0].id, customId);

  // Remove custom suspect
  const removed = removeCustomServerSuspect(customId);
  assert.strictEqual(removed, true, 'Custom suspect should be removed');
  const foundAfter = findSyntheticProfileById(customId);
  assert.strictEqual(foundAfter, null, 'Removed suspect should not be found');
});

runTest('4.2 authenticateOrRegisterUser verifies existing accounts, detects wrong passwords, and auto-registers new users', () => {
  // Test seeded account correct password
  const adminRes = authenticateOrRegisterUser('admin@crimetrack.gov.in', 'admin');
  assert.strictEqual(adminRes.success, true);
  assert.strictEqual(adminRes.isNew, false);
  assert.strictEqual(adminRes.user?.role, 'admin');

  // Test seeded account with '123' suffix
  const admin123Res = authenticateOrRegisterUser('admin@crimetrack.gov.in', 'admin123');
  assert.strictEqual(admin123Res.success, true);
  assert.strictEqual(admin123Res.isNew, false);

  // Test seeded account with wrong password
  const wrongRes = authenticateOrRegisterUser('admin@crimetrack.gov.in', 'incorrect_pass');
  assert.strictEqual(wrongRes.success, false);
  assert.ok(wrongRes.error?.includes('Incorrect password'));

  // Test auto-registration for a brand new user
  const newEmail = 'vedansh.gupta@gmail.com';
  const newPass = 'securePass2026';
  const newRes = authenticateOrRegisterUser(newEmail, newPass);
  assert.strictEqual(newRes.success, true);
  assert.strictEqual(newRes.isNew, true);
  assert.strictEqual(newRes.user?.name, 'Vedansh Gupta');
  assert.strictEqual(newRes.user?.role, 'admin');

  // Subsequent login with correct password should succeed as registered user
  const subRes = authenticateOrRegisterUser(newEmail, newPass);
  assert.strictEqual(subRes.success, true);
  assert.strictEqual(subRes.isNew, false);

  // Subsequent login with wrong password should fail
  const wrongSubRes = authenticateOrRegisterUser(newEmail, 'wrongPassword');
  assert.strictEqual(wrongSubRes.success, false);
  assert.ok(wrongSubRes.error?.includes('Incorrect password'));
});

runTest('4.3 formatNameFromEmail handles various email formats cleanly', () => {
  assert.strictEqual(formatNameFromEmail('yash.rahane@gmail.com'), 'Yash Rahane');
  assert.strictEqual(formatNameFromEmail('prince_maurya@police.gov.in'), 'Prince Maurya');
  assert.strictEqual(formatNameFromEmail('shubham-singh@nagpur.gov.in'), 'Shubham Singh');
  assert.strictEqual(formatNameFromEmail('officer@crimetrack.gov.in'), 'Officer');
});

console.log(`\n======================================================================`);
console.log(`ALL ${passedTests} TEST SUITES PASSED WITH ZERO ERRORS!`);
console.log(`======================================================================`);
