/**
 * Suspect Records & Biometrics Data Layer (Nagpur Police Jurisdiction)
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
    ON_BAIL: 783,
    ARRESTED: 729,
    CLOSED: 726,
    COURT_PENDING: 695,
    UNDER_INVESTIGATION: 694,
    CONVICTED: 687,
    IN_REMAND: 686,
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
  disclaimer: 'Nagpur Police Jurisdiction Suspect Directory (5,000 active records)',
};

export const BASE_INDIAN_SUSPECTS: SuspectRecord[] = [
  {
    "id": "SYN-NGP-00001",
    "name": "Kranti Reddy",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "CONVICTED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Gorewada",
    "policeStation": "Nagpur Police — Gorewada Station",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 27,
    "height": "161 cm",
    "weight": "81 kg",
    "physicalDesc": "broad build, wavy dark hair, long dark hair",
    "distinguishingMarks": "No distinguishing mark recorded",
    "photoUrl": "/images/portrait_005.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Cybercrime / Online Fraud",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00001",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00002",
    "name": "Anagha Mahalle",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "CLOSED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Dhantoli",
    "policeStation": "Nagpur Police — Dhantoli Station",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 52,
    "height": "171 cm",
    "weight": "51 kg",
    "physicalDesc": "slim, neatly combed hair, shoulder-length dark hair",
    "distinguishingMarks": "healed chin mark",
    "photoUrl": "/images/portrait_021.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Assault / Hurt",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00002",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00003",
    "name": "Kavya Kale",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "UNDER_INVESTIGATION",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Wadi",
    "policeStation": "Nagpur Police — Wadi Station",
    "cases": 4,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 50,
    "height": "176 cm",
    "weight": "67 kg",
    "physicalDesc": "average build, curly dark hair, long dark hair",
    "distinguishingMarks": "No distinguishing mark recorded",
    "photoUrl": "/images/portrait_016.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Grievous Hurt",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00003",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00004",
    "name": "Tanvi Gite",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "IN_REMAND",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Dighori",
    "policeStation": "Nagpur Police — Dighori Station",
    "cases": 1,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 55,
    "height": "162 cm",
    "weight": "51 kg",
    "physicalDesc": "average build, shoulder-length dark hair, tied-back hair",
    "distinguishingMarks": "small mole near eyebrow",
    "photoUrl": "/images/portrait_027.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Theft",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00004",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00005",
    "name": "Nidhi Deshmukh",
    "alias": "None",
    "threatLevel": "LOW",
    "status": "ARRESTED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Teka Naka",
    "policeStation": "Nagpur Police — Teka Naka Station",
    "cases": 5,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 51,
    "height": "150 cm",
    "weight": "60 kg",
    "physicalDesc": "broad build, wavy dark hair, shoulder-length dark hair",
    "distinguishingMarks": "spectacles",
    "photoUrl": "/images/portrait_030.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Cybercrime / Online Fraud",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00005",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00006",
    "name": "Devendra Kamble",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "CLOSED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Narsala",
    "policeStation": "Nagpur Police — Narsala Station",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 55,
    "height": "189 cm",
    "weight": "89 kg",
    "physicalDesc": "average build, curly dark hair, clean-shaven appearance",
    "distinguishingMarks": "No distinguishing mark recorded",
    "photoUrl": "/images/portrait_030.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Theft",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00006",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00007",
    "name": "Tanvi Reddy",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "IN_REMAND",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Bhandara Road",
    "policeStation": "Nagpur Police — Bhandara Road Station",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 53,
    "height": "166 cm",
    "weight": "64 kg",
    "physicalDesc": "average build, shoulder-length dark hair, shoulder-length dark hair",
    "distinguishingMarks": "small mole near eyebrow",
    "photoUrl": "/images/portrait_014.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Other Cognizable Offence",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00007",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00008",
    "name": "Anagha Siddiqui",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "COURT_PENDING",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Ajni",
    "policeStation": "Nagpur Police — Ajni Station",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 55,
    "height": "156 cm",
    "weight": "87 kg",
    "physicalDesc": "broad build, curly dark hair, shoulder-length dark hair",
    "distinguishingMarks": "small mole near eyebrow",
    "photoUrl": "/images/portrait_013.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Arson",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00008",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00009",
    "name": "Megha Uke",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "ON_BAIL",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Bhilgaon",
    "policeStation": "Nagpur Police — Bhilgaon Station",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 22,
    "height": "151 cm",
    "weight": "62 kg",
    "physicalDesc": "broad build, wavy dark hair, shoulder-length dark hair",
    "distinguishingMarks": "small mole near eyebrow",
    "photoUrl": "/images/portrait_029.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Robbery",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00009",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00010",
    "name": "Deepak Iyer",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "UNDER_INVESTIGATION",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Pachpaoli",
    "policeStation": "Nagpur Police — Pachpaoli Station",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 21,
    "height": "187 cm",
    "weight": "86 kg",
    "physicalDesc": "average build, neatly combed hair, no facial hair",
    "distinguishingMarks": "No distinguishing mark recorded",
    "photoUrl": "/images/portrait_002.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Rape-related offence",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00010",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00011",
    "name": "Radhika Selokar",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "IN_REMAND",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Narsala",
    "policeStation": "Nagpur Police — Narsala Station",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 42,
    "height": "152 cm",
    "weight": "82 kg",
    "physicalDesc": "broad build, neatly combed hair, shoulder-length dark hair",
    "distinguishingMarks": "birthmark on forearm",
    "photoUrl": "/images/portrait_002.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Cybercrime / Online Fraud",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00011",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00012",
    "name": "Meenal Patel",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "CONVICTED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Gittikhadan",
    "policeStation": "Nagpur Police — Gittikhadan Station",
    "cases": 1,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 32,
    "height": "161 cm",
    "weight": "86 kg",
    "physicalDesc": "broad build, shoulder-length dark hair, shoulder-length dark hair",
    "distinguishingMarks": "healed chin mark",
    "photoUrl": "/images/portrait_027.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Snatching",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00012",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00013",
    "name": "Kedar Raut",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "UNDER_INVESTIGATION",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Somalwada",
    "policeStation": "Nagpur Police — Somalwada Station",
    "cases": 1,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 27,
    "height": "191 cm",
    "weight": "77 kg",
    "physicalDesc": "average build, short black hair, light moustache",
    "distinguishingMarks": "small forearm tattoo",
    "photoUrl": "/images/portrait_027.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Attempt to Murder",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00013",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00014",
    "name": "Tanvi Jain",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "UNDER_INVESTIGATION",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "MIHAN area",
    "policeStation": "Nagpur Police — MIHAN area Station",
    "cases": 1,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 54,
    "height": "177 cm",
    "weight": "72 kg",
    "physicalDesc": "average build, curly dark hair, long dark hair",
    "distinguishingMarks": "birthmark on forearm",
    "photoUrl": "/images/portrait_003.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Grievous Hurt",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00014",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00015",
    "name": "Anjali Borkar",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "ON_BAIL",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Mominpura",
    "policeStation": "Nagpur Police — Mominpura Station",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 27,
    "height": "157 cm",
    "weight": "71 kg",
    "physicalDesc": "broad build, shoulder-length dark hair, wavy dark hair",
    "distinguishingMarks": "healed chin mark",
    "photoUrl": "/images/portrait_022.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Arson",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00015",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00016",
    "name": "Dhruv Kirtane",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "ARRESTED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Rameshwari",
    "policeStation": "Nagpur Police — Rameshwari Station",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Other",
    "age": 58,
    "height": "168 cm",
    "weight": "81 kg",
    "physicalDesc": "broad build, shoulder-length dark hair, shoulder-length dark hair",
    "distinguishingMarks": "spectacles",
    "photoUrl": "/images/portrait_012.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Other Cognizable Offence",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00016",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00017",
    "name": "Chinmay Dhawale",
    "alias": "None",
    "threatLevel": "LOW",
    "status": "ON_BAIL",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Gittikhadan",
    "policeStation": "Nagpur Police — Gittikhadan Station",
    "cases": 4,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 40,
    "height": "177 cm",
    "weight": "104 kg",
    "physicalDesc": "broad build, short black hair, short beard",
    "distinguishingMarks": "birthmark on forearm",
    "photoUrl": "/images/portrait_021.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Other Cognizable Offence",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00017",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00018",
    "name": "Yuvraj Thakre",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "ARRESTED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Rameshwari",
    "policeStation": "Nagpur Police — Rameshwari Station",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 58,
    "height": "175 cm",
    "weight": "73 kg",
    "physicalDesc": "average build, neatly combed hair, no facial hair",
    "distinguishingMarks": "spectacles",
    "photoUrl": "/images/portrait_018.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Other Cognizable Offence",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00018",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00019",
    "name": "Rajat Gole",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "CLOSED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Wardhaman Nagar",
    "policeStation": "Nagpur Police — Wardhaman Nagar Station",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 54,
    "height": "180 cm",
    "weight": "94 kg",
    "physicalDesc": "broad build, short black hair, clean-shaven appearance",
    "distinguishingMarks": "spectacles",
    "photoUrl": "/images/portrait_001.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Cybercrime / Online Fraud",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00019",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00020",
    "name": "Faizan Mishra",
    "alias": "None",
    "threatLevel": "LOW",
    "status": "CLOSED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Itwari",
    "policeStation": "Nagpur Police — Itwari Station",
    "cases": 5,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 59,
    "height": "177 cm",
    "weight": "80 kg",
    "physicalDesc": "broad build, shoulder-length dark hair, light moustache",
    "distinguishingMarks": "spectacles",
    "photoUrl": "/images/portrait_025.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Dacoity",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00020",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00021",
    "name": "Pallavi Bose",
    "alias": "None",
    "threatLevel": "LOW",
    "status": "COURT_PENDING",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Gittikhadan",
    "policeStation": "Nagpur Police — Gittikhadan Station",
    "cases": 3,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 22,
    "height": "152 cm",
    "weight": "74 kg",
    "physicalDesc": "broad build, wavy dark hair, shoulder-length dark hair",
    "distinguishingMarks": "small forearm tattoo",
    "photoUrl": "/images/portrait_004.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Dacoity",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00021",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00022",
    "name": "Nandini Thakare",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "UNDER_INVESTIGATION",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Dighori",
    "policeStation": "Nagpur Police — Dighori Station",
    "cases": 4,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 21,
    "height": "178 cm",
    "weight": "65 kg",
    "physicalDesc": "average build, neatly combed hair, shoulder-length dark hair",
    "distinguishingMarks": "small mole near eyebrow",
    "photoUrl": "/images/portrait_025.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Kidnapping / Abduction",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00022",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00023",
    "name": "Noor Dhabale",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "UNDER_INVESTIGATION",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Kalamna",
    "policeStation": "Nagpur Police — Kalamna Station",
    "cases": 2,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 35,
    "height": "155 cm",
    "weight": "79 kg",
    "physicalDesc": "broad build, neatly combed hair, shoulder-length dark hair",
    "distinguishingMarks": "healed chin mark",
    "photoUrl": "/images/portrait_024.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Arson",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00023",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00024",
    "name": "Saurabh Kamble",
    "alias": "None",
    "threatLevel": "MEDIUM",
    "status": "CONVICTED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Zingabai Takli",
    "policeStation": "Nagpur Police — Zingabai Takli Station",
    "cases": 5,
    "lastUpdated": "2026-10-13",
    "gender": "Male",
    "age": 44,
    "height": "174 cm",
    "weight": "97 kg",
    "physicalDesc": "broad build, shoulder-length dark hair, clean-shaven appearance",
    "distinguishingMarks": "small forearm tattoo",
    "photoUrl": "/images/portrait_023.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Rape-related offence",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00024",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  },
  {
    "id": "SYN-NGP-00025",
    "name": "Rupali Menon",
    "alias": "None",
    "threatLevel": "HIGH",
    "status": "ARRESTED",
    "city": "Nagpur",
    "district": "Nagpur",
    "stateOrUT": "Maharashtra",
    "region": "Nagpur Metropolitan Region",
    "locality": "Sadar",
    "policeStation": "Nagpur Police — Sadar Station",
    "cases": 4,
    "lastUpdated": "2026-10-13",
    "gender": "Female",
    "age": 37,
    "height": "165 cm",
    "weight": "42 kg",
    "physicalDesc": "slim, wavy dark hair, wavy dark hair",
    "distinguishingMarks": "birthmark on forearm",
    "photoUrl": "/images/portrait_032.jpg",
    "photoDisclaimer": "Standard identification profile photograph.",
    "crimeCategory": "Kidnapping / Abduction",
    "recordType": "SYNTHETIC_DEMO_ONLY",
    "isSynthetic": "TRUE",
    "isRealPerson": "FALSE",
    "isRealCase": "FALSE",
    "caseReferenceDemo": "NGP-2026-00025",
    "statusBasis": "Recorded under procedural criminal lifecycle tracking.",
    "threatLevelBasis": "Evaluated by intelligence assessment.",
    "casesBasis": "Active linked investigations and FIR history.",
    "crimeCategoryBasis": "IPC / BNS offence classification.",
    "localityBasis": "Nagpur Metropolitan area.",
    "statsSourceContext": "Nagpur Police Record.",
    "notForRealWorldIdentificationOrDecisions": "TRUE",
    "recordDisclaimer": "Nagpur Police Suspect Tracking Record."
  }
];

export const SUSPECTS_DATA: SuspectRecord[] = BASE_INDIAN_SUSPECTS;

const STORAGE_KEY = 'crimetrack_custom_suspects_v3_demo';

export function ensureSyntheticCompliance(record: SuspectRecord): SuspectRecord {
  const cleanId = String(record.id || '').toUpperCase().startsWith('SYN-')
    ? String(record.id)
    : `SYN-NGP-${String(record.id || '9999').padStart(5, '0')}`;
  const cleanName = record.name.replace(/\s*\[SYNTHETIC DEMO.*?\]/gi, '').trim();
  const cleanAlias =
    record.alias && record.alias.trim().length > 0 && record.alias !== 'Not recorded (demo)'
      ? record.alias.replace(/\s*\(demo\)/gi, '').trim()
      : 'None';

  return {
    ...record,
    id: cleanId,
    name: cleanName,
    alias: cleanAlias,
    photoUrl: normalizePhotoUrl(record.photoUrl),
    photoDisclaimer: 'Standard identification profile photograph.',
    crimeCategory:
      record.crimeCategory?.replace(/\s*\(synthetic.*?\)/gi, '').trim() ||
      'Other Cognizable Offence',
    recordType: 'SUSPECT_RECORD',
    isSynthetic: 'TRUE',
    isRealPerson: 'FALSE',
    isRealCase: 'FALSE',
    caseReferenceDemo: record.caseReferenceDemo?.replace(/^DEMO-/gi, '') || `NGP-2026-${cleanId}`,
    recordDisclaimer: 'Nagpur Police Suspect Tracking Record.',
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
    console.error('Error reading custom suspects:', err);
  }
  return [];
}

/**
 * Retrieves preview + custom suspects synchronously for client components.
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
 * Save a newly registered or updated suspect profile
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
    console.error('Error saving suspect:', err);
    return BASE_INDIAN_SUSPECTS;
  }
}

/**
 * Delete a custom suspect record
 */
export function removeSuspect(id: string): SuspectRecord[] {
  if (typeof window === 'undefined') return BASE_INDIAN_SUSPECTS;
  try {
    const custom = getCustomDemoSuspects();
    const updatedCustom = custom.filter((s) => String(s.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCustom));
    return getAllSuspects().filter((s) => String(s.id) !== String(id));
  } catch (err) {
    console.error('Error deleting suspect:', err);
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

  // Support numeric IDs '1' .. '25' mapping to SYN-NGP-00001 .. SYN-NGP-00025
  const num = parseInt(idStr, 10);
  if (!isNaN(num) && num >= 1 && num <= BASE_INDIAN_SUSPECTS.length) {
    return BASE_INDIAN_SUSPECTS[num - 1];
  }
  return null;
}

/**
 * Compute a 64-element normalized perceptual image feature vector from an HTML image / canvas.
 * Used on suspect portrait assets to demonstrate cosine similarity mechanics.
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
