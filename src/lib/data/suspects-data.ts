/**
 * Layer B: Synthetic Individual Demo Profiles Layer
 *
 * IMPORTANT PROVENANCE NOTICE:
 * All records in this module are 100% FICTIONAL SYNTHETIC DEMO PROFILES
 * created strictly to test UI workflows, search, pagination, and role permissions.
 *
 * - DO NOT present any name, alias, portrait, case reference, status, or threat level
 *   as a real police, FIR, court, or custody record.
 * - DO NOT aggregate these records into official government crime totals.
 *   Use src/lib/data/official-stats.ts for verified NCRB / Nagpur Police statistics.
 */

export interface SuspectRecord {
  id: string;
  name: string;
  alias: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  city: string;
  district?: string;
  stateOrUT?: string;
  region?: string;
  locality?: string;
  policeStation: string;
  cases: number;
  lastUpdated: string;
  gender: string;
  age: number;
  height: string;
  weight: string;
  physicalDesc: string;
  distinguishingMarks: string;
  photoUrl: string;
  photoDisclaimer?: string;
  crimeCategory?: string;
  recordType?: string;
  isSynthetic?: string | boolean;
  isRealPerson?: string | boolean;
  isRealCase?: string | boolean;
  caseReferenceDemo?: string;
  statusBasis?: string;
  threatLevelBasis?: string;
  casesBasis?: string;
  crimeCategoryBasis?: string;
  localityBasis?: string;
  statsSourceContext?: string;
  notForRealWorldIdentificationOrDecisions?: string | boolean;
  recordDisclaimer?: string;
  featureVector?: number[];
}

export const FALLBACK_PORTRAIT_URL = '/images/portrait_fallback.svg';

export function normalizePhotoUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return FALLBACK_PORTRAIT_URL;
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  return '/' + trimmed.replace(/^\.?\//, '');
}

export const SYNTHETIC_DATASET_SUMMARY = {
  totalProfiles: 5000,
  totalColumns: 35,
  blankCells: 0,
  portraitCount: 32,
  profilesWithAlias: 189,
  statusBreakdown: {
    'ON_BAIL (DEMO)': 783,
    'ARRESTED (DEMO)': 729,
    'CLOSED (DEMO)': 726,
    'COURT_PENDING (DEMO)': 695,
    'UNDER_INVESTIGATION (DEMO)': 694,
    'CONVICTED (DEMO)': 687,
    'IN_REMAND (DEMO)': 686,
  } as Record<string, number>,
  threatLevelBreakdown: {
    LOW: 1808,
    MEDIUM: 1713,
    HIGH: 1024,
    CRITICAL: 455,
  } as Record<string, number>,
  genderBreakdown: {
    Male: 2682,
    Female: 2262,
    Other: 56,
  } as Record<string, number>,
  disclaimer: 'SYNTHETIC DEMO — NOT A REAL PERSON OR CASE. Never aggregated into official crime statistics.',
};

export const BASE_INDIAN_SUSPECTS: SuspectRecord[] = [
  {
    "id": "SYN-NGP-00001",
    "name": "Kranti Reddy [SYNTHETIC DEMO 00001]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "CONVICTED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Gorewada",
    "policeStation": "DEMO AREA MAPPING \u2014 Gorewada; not an actual case assignment",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 27,
    "height": "161 cm",
    "weight": "81 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, wavy dark hair, long dark hair; not verified evidence.",
    "distinguishingMarks": "No distinguishing mark recorded (demo)",
    "photoUrl": "/images/portrait_005.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Cybercrime / Online Fraud (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00001",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00002",
    "name": "Anagha Mahalle [SYNTHETIC DEMO 00002]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "CLOSED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Dhantoli",
    "policeStation": "DEMO AREA MAPPING \u2014 Dhantoli; not an actual case assignment",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 52,
    "height": "171 cm",
    "weight": "51 kg",
    "physicalDesc": "Fictional visual description for UI testing: slim, neatly combed hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: healed chin mark (fictional)",
    "photoUrl": "/images/portrait_021.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Assault / Hurt (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00002",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00003",
    "name": "Kavya Kale [SYNTHETIC DEMO 00003]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "UNDER_INVESTIGATION (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Wadi",
    "policeStation": "DEMO AREA MAPPING \u2014 Wadi; not an actual case assignment",
    "cases": 4,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 50,
    "height": "176 cm",
    "weight": "67 kg",
    "physicalDesc": "Fictional visual description for UI testing: average build, curly dark hair, long dark hair; not verified evidence.",
    "distinguishingMarks": "No distinguishing mark recorded (demo)",
    "photoUrl": "/images/portrait_016.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Grievous Hurt (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00003",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00004",
    "name": "Tanvi Gite [SYNTHETIC DEMO 00004]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "IN_REMAND (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Dighori",
    "policeStation": "DEMO AREA MAPPING \u2014 Dighori; not an actual case assignment",
    "cases": 1,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 55,
    "height": "162 cm",
    "weight": "51 kg",
    "physicalDesc": "Fictional visual description for UI testing: average build, shoulder-length dark hair, tied-back hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: small mole near eyebrow (fictional)",
    "photoUrl": "/images/portrait_027.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Theft (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00004",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00005",
    "name": "Nidhi Deshmukh [SYNTHETIC DEMO 00005]",
    "alias": "Not recorded (demo)",
    "threatLevel": "LOW",
    "status": "ARRESTED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Teka Naka",
    "policeStation": "DEMO AREA MAPPING \u2014 Teka Naka; not an actual case assignment",
    "cases": 5,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 51,
    "height": "150 cm",
    "weight": "60 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, wavy dark hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: spectacles (fictional)",
    "photoUrl": "/images/portrait_030.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Cybercrime / Online Fraud (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00005",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00006",
    "name": "Devendra Kamble [SYNTHETIC DEMO 00006]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "CLOSED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Narsala",
    "policeStation": "DEMO AREA MAPPING \u2014 Narsala; not an actual case assignment",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 55,
    "height": "189 cm",
    "weight": "89 kg",
    "physicalDesc": "Fictional visual description for UI testing: average build, curly dark hair, clean-shaven appearance; not verified evidence.",
    "distinguishingMarks": "No distinguishing mark recorded (demo)",
    "photoUrl": "/images/portrait_030.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Theft (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00006",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00007",
    "name": "Tanvi Reddy [SYNTHETIC DEMO 00007]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "IN_REMAND (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Bhandara Road",
    "policeStation": "DEMO AREA MAPPING \u2014 Bhandara Road; not an actual case assignment",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 53,
    "height": "166 cm",
    "weight": "64 kg",
    "physicalDesc": "Fictional visual description for UI testing: average build, shoulder-length dark hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: small mole near eyebrow (fictional)",
    "photoUrl": "/images/portrait_014.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Other Cognizable Offence (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00007",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00008",
    "name": "Anagha Siddiqui [SYNTHETIC DEMO 00008]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "COURT_PENDING (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Ajni",
    "policeStation": "DEMO AREA MAPPING \u2014 Ajni; not an actual case assignment",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 55,
    "height": "156 cm",
    "weight": "87 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, curly dark hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: small mole near eyebrow (fictional)",
    "photoUrl": "/images/portrait_013.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Arson (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00008",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00009",
    "name": "Megha Uke [SYNTHETIC DEMO 00009]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "ON_BAIL (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Bhilgaon",
    "policeStation": "DEMO AREA MAPPING \u2014 Bhilgaon; not an actual case assignment",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 22,
    "height": "151 cm",
    "weight": "62 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, wavy dark hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: small mole near eyebrow (fictional)",
    "photoUrl": "/images/portrait_029.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Robbery (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00009",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00010",
    "name": "Deepak Iyer [SYNTHETIC DEMO 00010]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "UNDER_INVESTIGATION (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Pachpaoli",
    "policeStation": "DEMO AREA MAPPING \u2014 Pachpaoli; not an actual case assignment",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 21,
    "height": "187 cm",
    "weight": "86 kg",
    "physicalDesc": "Fictional visual description for UI testing: average build, neatly combed hair, no facial hair; not verified evidence.",
    "distinguishingMarks": "No distinguishing mark recorded (demo)",
    "photoUrl": "/images/portrait_002.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Rape-related offence (synthetic category only; not an allegation)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00010",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00011",
    "name": "Radhika Selokar [SYNTHETIC DEMO 00011]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "IN_REMAND (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Narsala",
    "policeStation": "DEMO AREA MAPPING \u2014 Narsala; not an actual case assignment",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 42,
    "height": "152 cm",
    "weight": "82 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, neatly combed hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: birthmark on forearm (fictional)",
    "photoUrl": "/images/portrait_002.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Cybercrime / Online Fraud (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00011",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00012",
    "name": "Meenal Patel [SYNTHETIC DEMO 00012]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "CONVICTED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Gittikhadan",
    "policeStation": "DEMO AREA MAPPING \u2014 Gittikhadan; not an actual case assignment",
    "cases": 1,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 32,
    "height": "161 cm",
    "weight": "86 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, shoulder-length dark hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: healed chin mark (fictional)",
    "photoUrl": "/images/portrait_027.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Snatching (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00012",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00013",
    "name": "Kedar Raut [SYNTHETIC DEMO 00013]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "UNDER_INVESTIGATION (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Somalwada",
    "policeStation": "DEMO AREA MAPPING \u2014 Somalwada; not an actual case assignment",
    "cases": 1,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 27,
    "height": "191 cm",
    "weight": "77 kg",
    "physicalDesc": "Fictional visual description for UI testing: average build, short black hair, light moustache; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: small forearm tattoo (fictional)",
    "photoUrl": "/images/portrait_027.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Attempt to Murder (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00013",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00014",
    "name": "Tanvi Jain [SYNTHETIC DEMO 00014]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "UNDER_INVESTIGATION (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "MIHAN area",
    "policeStation": "DEMO AREA MAPPING \u2014 MIHAN area; not an actual case assignment",
    "cases": 1,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 54,
    "height": "177 cm",
    "weight": "72 kg",
    "physicalDesc": "Fictional visual description for UI testing: average build, curly dark hair, long dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: birthmark on forearm (fictional)",
    "photoUrl": "/images/portrait_003.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Grievous Hurt (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00014",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00015",
    "name": "Anjali Borkar [SYNTHETIC DEMO 00015]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "ON_BAIL (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Mominpura",
    "policeStation": "DEMO AREA MAPPING \u2014 Mominpura; not an actual case assignment",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 27,
    "height": "157 cm",
    "weight": "71 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, shoulder-length dark hair, wavy dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: healed chin mark (fictional)",
    "photoUrl": "/images/portrait_022.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Arson (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00015",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00016",
    "name": "Dhruv Kirtane [SYNTHETIC DEMO 00016]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "ARRESTED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Rameshwari",
    "policeStation": "DEMO AREA MAPPING \u2014 Rameshwari; not an actual case assignment",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Other",
    "age": 58,
    "height": "168 cm",
    "weight": "81 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, shoulder-length dark hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: spectacles (fictional)",
    "photoUrl": "/images/portrait_012.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Other Cognizable Offence (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00016",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00017",
    "name": "Chinmay Dhawale [SYNTHETIC DEMO 00017]",
    "alias": "Not recorded (demo)",
    "threatLevel": "LOW",
    "status": "ON_BAIL (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Gittikhadan",
    "policeStation": "DEMO AREA MAPPING \u2014 Gittikhadan; not an actual case assignment",
    "cases": 4,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 40,
    "height": "177 cm",
    "weight": "104 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, short black hair, short beard; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: birthmark on forearm (fictional)",
    "photoUrl": "/images/portrait_021.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Other Cognizable Offence (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00017",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00018",
    "name": "Yuvraj Thakre [SYNTHETIC DEMO 00018]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "ARRESTED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Rameshwari",
    "policeStation": "DEMO AREA MAPPING \u2014 Rameshwari; not an actual case assignment",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 58,
    "height": "175 cm",
    "weight": "73 kg",
    "physicalDesc": "Fictional visual description for UI testing: average build, neatly combed hair, no facial hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: spectacles (fictional)",
    "photoUrl": "/images/portrait_018.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Other Cognizable Offence (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00018",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00019",
    "name": "Rajat Gole [SYNTHETIC DEMO 00019]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "CLOSED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Wardhaman Nagar",
    "policeStation": "DEMO AREA MAPPING \u2014 Wardhaman Nagar; not an actual case assignment",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 54,
    "height": "180 cm",
    "weight": "94 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, short black hair, clean-shaven appearance; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: spectacles (fictional)",
    "photoUrl": "/images/portrait_001.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Cybercrime / Online Fraud (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00019",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00020",
    "name": "Faizan Mishra [SYNTHETIC DEMO 00020]",
    "alias": "Not recorded (demo)",
    "threatLevel": "LOW",
    "status": "CLOSED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Itwari",
    "policeStation": "DEMO AREA MAPPING \u2014 Itwari; not an actual case assignment",
    "cases": 5,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 59,
    "height": "177 cm",
    "weight": "80 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, shoulder-length dark hair, light moustache; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: spectacles (fictional)",
    "photoUrl": "/images/portrait_025.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Dacoity (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00020",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00021",
    "name": "Pallavi Bose [SYNTHETIC DEMO 00021]",
    "alias": "Not recorded (demo)",
    "threatLevel": "LOW",
    "status": "COURT_PENDING (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Gittikhadan",
    "policeStation": "DEMO AREA MAPPING \u2014 Gittikhadan; not an actual case assignment",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 22,
    "height": "152 cm",
    "weight": "74 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, wavy dark hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: small forearm tattoo (fictional)",
    "photoUrl": "/images/portrait_004.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Dacoity (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00021",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00022",
    "name": "Nandini Thakare [SYNTHETIC DEMO 00022]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "UNDER_INVESTIGATION (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Dighori",
    "policeStation": "DEMO AREA MAPPING \u2014 Dighori; not an actual case assignment",
    "cases": 4,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 21,
    "height": "178 cm",
    "weight": "65 kg",
    "physicalDesc": "Fictional visual description for UI testing: average build, neatly combed hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: small mole near eyebrow (fictional)",
    "photoUrl": "/images/portrait_025.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Kidnapping / Abduction (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00022",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00023",
    "name": "Noor Dhabale [SYNTHETIC DEMO 00023]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "UNDER_INVESTIGATION (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Kalamna",
    "policeStation": "DEMO AREA MAPPING \u2014 Kalamna; not an actual case assignment",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 35,
    "height": "155 cm",
    "weight": "79 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, neatly combed hair, shoulder-length dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: healed chin mark (fictional)",
    "photoUrl": "/images/portrait_024.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Arson (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00023",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00024",
    "name": "Saurabh Kamble [SYNTHETIC DEMO 00024]",
    "alias": "Not recorded (demo)",
    "threatLevel": "MEDIUM",
    "status": "CONVICTED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Zingabai Takli",
    "policeStation": "DEMO AREA MAPPING \u2014 Zingabai Takli; not an actual case assignment",
    "cases": 5,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 44,
    "height": "174 cm",
    "weight": "97 kg",
    "physicalDesc": "Fictional visual description for UI testing: broad build, shoulder-length dark hair, clean-shaven appearance; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: small forearm tattoo (fictional)",
    "photoUrl": "/images/portrait_023.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Rape-related offence (synthetic category only; not an allegation)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00024",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  },
  {
    "id": "SYN-NGP-00025",
    "name": "Rupali Menon [SYNTHETIC DEMO 00025]",
    "alias": "Not recorded (demo)",
    "threatLevel": "HIGH",
    "status": "ARRESTED (DEMO)",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur metropolitan region (demo assignment)",
    "locality": "Sadar",
    "policeStation": "DEMO AREA MAPPING \u2014 Sadar; not an actual case assignment",
    "cases": 4,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 37,
    "height": "165 cm",
    "weight": "42 kg",
    "physicalDesc": "Fictional visual description for UI testing: slim, wavy dark hair, wavy dark hair; not verified evidence.",
    "distinguishingMarks": "Synthetic visual attribute: birthmark on forearm (fictional)",
    "photoUrl": "/images/portrait_032.jpg",
    "photoDisclaimer": "AI-generated fictional portrait; not a real person and not identity evidence.",
    "crimeCategory": "Kidnapping / Abduction (synthetic demo category)",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "DEMO-NGP-2026-00025",
    "statusBasis": "Random UI field; not an actual police/court/custody status.",
    "threatLevelBasis": "Random UI display label; no predictive, forensic or legal validity.",
    "casesBasis": "Random demo case-count field; not a count from government records.",
    "crimeCategoryBasis": "Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.",
    "localityBasis": "Real locality name used only as a broad demo setting; no event is asserted to have occurred there.",
    "statsSourceContext": "Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "FICTIONAL GENERATED DEMO ONLY \u2014 NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD."
  }
];

const STORAGE_KEY = 'crimetrack_custom_suspects_v3_demo';

export const SUSPECTS_DATA: SuspectRecord[] = BASE_INDIAN_SUSPECTS;

export function ensureSyntheticCompliance(record: SuspectRecord): SuspectRecord {
  const cleanId = String(record.id || '').startsWith('SYN-NGP-')
    ? String(record.id)
    : `SYN-NGP-${String(record.id || '9999').padStart(5, '0')}`;
  const cleanName = record.name.includes('[SYNTHETIC DEMO')
    ? record.name
    : `${record.name} [SYNTHETIC DEMO]`;
  const cleanAlias =
    record.alias && record.alias.trim().length > 0
      ? record.alias
      : 'Not recorded (demo)';

  return {
    ...record,
    id: cleanId,
    name: cleanName,
    alias: cleanAlias,
    photoUrl: normalizePhotoUrl(record.photoUrl),
    photoDisclaimer:
      record.photoDisclaimer ||
      'AI-generated fictional portrait; not a real person and not identity evidence.',
    crimeCategory:
      record.crimeCategory || 'Other Cognizable Offence (synthetic demo category)',
    recordType: 'SYNTHETIC_DEMO_ONLY',
    isSynthetic: 'TRUE',
    isRealPerson: 'FALSE',
    isRealCase: 'FALSE',
    caseReferenceDemo: record.caseReferenceDemo || `DEMO-NGP-2026-${cleanId}`,
    recordDisclaimer:
      record.recordDisclaimer ||
      'FICTIONAL GENERATED DEMO ONLY — NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD.',
  };
}

export function getCustomDemoSuspects(): SuspectRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(ensureSyntheticCompliance);
    }
  } catch (err) {
    console.error('Error reading custom demo suspects:', err);
  }
  return [];
}

/**
 * Retrieves preview + custom demo suspects synchronously for client components.
 * Full 5,000-record search & pagination is served via /api/suspects.
 */
export function getAllSuspects(): SuspectRecord[] {
  const custom = getCustomDemoSuspects();
  if (custom.length === 0) return BASE_INDIAN_SUSPECTS;

  const merged = [...custom];
  BASE_INDIAN_SUSPECTS.forEach((b) => {
    if (!merged.some((m) => String(m.id) === String(b.id))) {
      merged.push(b);
    }
  });
  return merged;
}

/**
 * Save a newly registered or updated demo suspect profile
 */
export function saveSuspect(suspect: SuspectRecord): SuspectRecord[] {
  const compliant = ensureSyntheticCompliance(suspect);
  if (typeof window === 'undefined') return BASE_INDIAN_SUSPECTS;

  try {
    const custom = getCustomDemoSuspects();
    const updatedCustom = [
      compliant,
      ...custom.filter((s) => String(s.id) !== String(compliant.id)),
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCustom));
    return getAllSuspects();
  } catch (err) {
    console.error('Error saving demo suspect:', err);
    return BASE_INDIAN_SUSPECTS;
  }
}

/**
 * Delete a custom demo suspect record
 */
export function removeSuspect(id: string): SuspectRecord[] {
  if (typeof window === 'undefined') return BASE_INDIAN_SUSPECTS;
  try {
    const custom = getCustomDemoSuspects();
    const updatedCustom = custom.filter((s) => String(s.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCustom));
    return getAllSuspects().filter((s) => String(s.id) !== String(id));
  } catch (err) {
    console.error('Error deleting demo suspect:', err);
    return BASE_INDIAN_SUSPECTS;
  }
}

/**
 * Synchronous lookup across custom + preview records (fallback when offline)
 */
export function getSuspectById(id: string): SuspectRecord | null {
  const all = getAllSuspects();
  const idStr = String(id).trim().toLowerCase();
  const exact = all.find((s) => String(s.id).trim().toLowerCase() === idStr);
  if (exact) return exact;

  // Support legacy numeric IDs '1' .. '25' mapping to SYN-NGP-00001 .. SYN-NGP-00025
  const num = parseInt(idStr, 10);
  if (!isNaN(num) && num >= 1 && num <= BASE_INDIAN_SUSPECTS.length) {
    return BASE_INDIAN_SUSPECTS[num - 1];
  }
  return null;
}

/**
 * Compute a 64-element normalized perceptual image feature vector from an HTML image / canvas.
 * Used strictly on synthetic demo portrait assets to demonstrate cosine similarity mechanics.
 */
export function extractCanvasFeatureVector(img: HTMLImageElement): number[] {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new Array(64).fill(0.1);

    ctx.drawImage(img, 0, 0, 8, 8);
    const data = ctx.getImageData(0, 0, 8, 8).data;

    const vector: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255.0;
      vector.push(lum);
    }

    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1.0;
    return vector.map((v) => v / norm);
  } catch {
    const seed = (img.src || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return Array.from({ length: 64 }, (_, i) => Math.sin(seed + i * 0.5) / 8);
  }
}

/**
 * Cosine Similarity between two normalized vectors (0.0 to 1.0)
 */
export function computeVectorCosine(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0.45;
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return Math.max(0, Math.min(1.0, dot));
}
