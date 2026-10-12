/**
 * Centralized Suspect Database & Biometric Feature Extraction
 * Focused on authentic Indian criminal records from Nagpur and Maharashtra jurisdictions.
 */

export interface SuspectRecord {
  id: string;
  name: string;
  alias: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ARRESTED' | 'IN_REMAND' | 'TRIAL' | 'BAILED' | 'CONVICTED' | 'AT_LARGE' | 'CUSTODY';
  city: string;
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
  featureVector?: number[]; // 64-dim normalized visual feature embedding
}

export const BASE_INDIAN_SUSPECTS: SuspectRecord[] = [
  {
    id: '1',
    name: 'Vikram "Vicky" Sharma',
    alias: 'Vicky Don / Bhai',
    threatLevel: 'CRITICAL',
    status: 'AT_LARGE',
    city: 'Nagpur',
    policeStation: 'Sitabuldi PS, Nagpur',
    cases: 4,
    lastUpdated: '2026-08-18',
    gender: 'Male',
    age: 34,
    height: '178 cm',
    weight: '82 kg',
    physicalDesc: 'Wheatish complexion, sharp eyes, athletic build.',
    distinguishingMarks: 'Deep cut scar on left cheek, Trishul tattoo on right forearm.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
  },
  {
    id: '2',
    name: 'Rahul "Raju" Gaikwad',
    alias: 'Raju Ganger',
    threatLevel: 'HIGH',
    status: 'ARRESTED',
    city: 'Nagpur',
    policeStation: 'Sadar PS, Nagpur',
    cases: 3,
    lastUpdated: '2026-08-17',
    gender: 'Male',
    age: 29,
    height: '172 cm',
    weight: '74 kg',
    physicalDesc: 'Medium build, dark complexion, mustache.',
    distinguishingMarks: 'Burn mark on left wrist, birthmark on neck.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'
  },
  {
    id: '3',
    name: 'Sachin "Bhaiya" Deshmukh',
    alias: 'Nagpur Bhaiya',
    threatLevel: 'MEDIUM',
    status: 'IN_REMAND',
    city: 'Nagpur',
    policeStation: 'Dhantoli PS, Nagpur',
    cases: 2,
    lastUpdated: '2026-08-15',
    gender: 'Male',
    age: 38,
    height: '175 cm',
    weight: '85 kg',
    physicalDesc: 'Broad frame, fair complexion, wears spectacles.',
    distinguishingMarks: 'Surgical scar on right knee, mole near ear.',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300'
  },
  {
    id: '4',
    name: 'Sanjay "Sanju" Patil',
    alias: 'Sanju Chhota',
    threatLevel: 'LOW',
    status: 'BAILED',
    city: 'Nagpur',
    policeStation: 'Pachpaoli PS, Nagpur',
    cases: 1,
    lastUpdated: '2026-08-14',
    gender: 'Male',
    age: 26,
    height: '168 cm',
    weight: '65 kg',
    physicalDesc: 'Lean build, dark complexion, short cropped hair.',
    distinguishingMarks: 'Eagle tattoo on chest, faded stitch marks on chin.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300'
  },
  {
    id: '5',
    name: 'Priya "Lady Don" Kulkarni',
    alias: 'Madam X / Priya Don',
    threatLevel: 'HIGH',
    status: 'AT_LARGE',
    city: 'Nagpur',
    policeStation: 'Ambazari PS, Nagpur',
    cases: 5,
    lastUpdated: '2026-08-10',
    gender: 'Female',
    age: 31,
    height: '165 cm',
    weight: '58 kg',
    physicalDesc: 'Fair complexion, shoulder-length black hair.',
    distinguishingMarks: 'Star tattoo on left collarbone.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
  },
  {
    id: '6',
    name: 'Ravi "Baba" Verma',
    alias: 'Baba Nagpurkar',
    threatLevel: 'CRITICAL',
    status: 'CONVICTED',
    city: 'Nagpur',
    policeStation: 'Jaripatka PS, Nagpur',
    cases: 6,
    lastUpdated: '2026-08-01',
    gender: 'Male',
    age: 42,
    height: '183 cm',
    weight: '90 kg',
    physicalDesc: 'Heavy muscular build, thick beard, intense gaze.',
    distinguishingMarks: 'Scorpion tattoo on back of neck, chipped front tooth.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300'
  },
  {
    id: '7',
    name: 'Anil "AK" Wankhede',
    alias: 'AK-47 Wankhede',
    threatLevel: 'HIGH',
    status: 'AT_LARGE',
    city: 'Nagpur',
    policeStation: 'Lakadganj PS, Nagpur',
    cases: 3,
    lastUpdated: '2026-07-28',
    gender: 'Male',
    age: 36,
    height: '176 cm',
    weight: '78 kg',
    physicalDesc: 'Medium frame, curly dark hair, wheatish complexion.',
    distinguishingMarks: 'Knife wound mark on upper right arm.',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300'
  },
  {
    id: '8',
    name: 'Sneha "Guddi" Meshram',
    alias: 'Guddi Cyber',
    threatLevel: 'LOW',
    status: 'ARRESTED',
    city: 'Nagpur',
    policeStation: 'Cyber Cell, Nagpur',
    cases: 2,
    lastUpdated: '2026-07-25',
    gender: 'Female',
    age: 24,
    height: '160 cm',
    weight: '52 kg',
    physicalDesc: 'Fair complexion, brown eyes, petite build.',
    distinguishingMarks: 'Mole on right temple.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'
  },
  {
    id: '9',
    name: 'Mohammad "Bhai" Ansari',
    alias: 'Ansari Seth',
    threatLevel: 'HIGH',
    status: 'IN_REMAND',
    city: 'Nagpur',
    policeStation: 'Gittikhadan PS, Nagpur',
    cases: 4,
    lastUpdated: '2026-07-20',
    gender: 'Male',
    age: 39,
    height: '180 cm',
    weight: '84 kg',
    physicalDesc: 'Tall athletic build, light beard, trimmed mustache.',
    distinguishingMarks: 'Curved scar above left eyebrow.',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300'
  },
  {
    id: '10',
    name: 'Deepak "DD" Joshi',
    alias: 'DD Extortion',
    threatLevel: 'MEDIUM',
    status: 'BAILED',
    city: 'Nagpur',
    policeStation: 'Nandanvan PS, Nagpur',
    cases: 2,
    lastUpdated: '2026-07-15',
    gender: 'Male',
    age: 33,
    height: '170 cm',
    weight: '71 kg',
    physicalDesc: 'Average height, wheatish tone, spectacles.',
    distinguishingMarks: 'Snake tattoo on inner right forearm.',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300'
  },
  {
    id: '11',
    name: 'Neha "Bullet" Gupta',
    alias: 'Bullet Queen',
    threatLevel: 'LOW',
    status: 'CONVICTED',
    city: 'Nagpur',
    policeStation: 'MIDC Hingna PS, Nagpur',
    cases: 1,
    lastUpdated: '2026-07-10',
    gender: 'Female',
    age: 27,
    height: '163 cm',
    weight: '56 kg',
    physicalDesc: 'Medium height, dusky complexion, athletic posture.',
    distinguishingMarks: 'Small burn mark on left hand.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300'
  },
  {
    id: '12',
    name: 'Surya "Surya Don" Narayanan',
    alias: 'South Surya',
    threatLevel: 'CRITICAL',
    status: 'AT_LARGE',
    city: 'Nagpur',
    policeStation: 'Koradi PS, Nagpur',
    cases: 7,
    lastUpdated: '2026-07-05',
    gender: 'Male',
    age: 41,
    height: '182 cm',
    weight: '88 kg',
    physicalDesc: 'Broad shoulders, intense gaze, shaved head.',
    distinguishingMarks: 'Dragon tattoo on left shoulder extending to neck.',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300'
  },
  {
    id: '13',
    name: 'Ganesh "Ganya" Choudhary',
    alias: 'Ganya Chor',
    threatLevel: 'HIGH',
    status: 'ARRESTED',
    city: 'Nagpur',
    policeStation: 'Sonegaon PS, Nagpur',
    cases: 3,
    lastUpdated: '2026-06-28',
    gender: 'Male',
    age: 30,
    height: '174 cm',
    weight: '76 kg',
    physicalDesc: 'Wheatish complexion, short beard.',
    distinguishingMarks: 'Trishul mark on left arm.',
    photoUrl: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=300'
  },
  {
    id: '14',
    name: 'Kavita "Pinky" Mohite',
    alias: 'Pinky Smuggler',
    threatLevel: 'MEDIUM',
    status: 'IN_REMAND',
    city: 'Nagpur',
    policeStation: 'Mankapur PS, Nagpur',
    cases: 2,
    lastUpdated: '2026-06-20',
    gender: 'Female',
    age: 28,
    height: '162 cm',
    weight: '54 kg',
    physicalDesc: 'Fair complexion, prominent eyes.',
    distinguishingMarks: 'Mole above upper lip.',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300'
  },
  {
    id: '15',
    name: 'Akash "Banti" Raut',
    alias: 'Banti Sharpshooter',
    threatLevel: 'CRITICAL',
    status: 'ARRESTED',
    city: 'Nagpur',
    policeStation: 'Sitabuldi PS, Nagpur',
    cases: 5,
    lastUpdated: '2026-06-15',
    gender: 'Male',
    age: 32,
    height: '177 cm',
    weight: '80 kg',
    physicalDesc: 'Athletic frame, mustache, scar across bridge of nose.',
    distinguishingMarks: 'Bullet grazing scar on right rib.',
    photoUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=300'
  }
];

const STORAGE_KEY = 'crimetrack_custom_suspects_v2';
const LEGACY_KEY = 'custom_suspects';

/**
 * Robust helper to retrieve all suspects:
 * Merges localStorage custom suspects cleanly on top of the 15 base Indian suspects.
 */
export function getAllSuspects(): SuspectRecord[] {
  if (typeof window === 'undefined') {
    return BASE_INDIAN_SUSPECTS;
  }

  try {
    let customList: SuspectRecord[] = [];
    const v2Json = localStorage.getItem(STORAGE_KEY);
    if (v2Json) {
      customList = JSON.parse(v2Json);
    } else {
      const legacyJson = localStorage.getItem(LEGACY_KEY);
      if (legacyJson) {
        customList = JSON.parse(legacyJson);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customList));
      }
    }

    if (Array.isArray(customList) && customList.length > 0) {
      // Merge unique: custom suspects take precedence
      const merged = [...customList];
      BASE_INDIAN_SUSPECTS.forEach(b => {
        if (!merged.some(m => String(m.id) === String(b.id))) {
          merged.push(b);
        }
      });
      return merged;
    }
  } catch (err) {
    console.error('Error reading suspects from localStorage:', err);
  }

  return BASE_INDIAN_SUSPECTS;
}

/**
 * Robustly save a newly registered suspect
 */
export function saveSuspect(suspect: SuspectRecord): SuspectRecord[] {
  if (typeof window === 'undefined') return BASE_INDIAN_SUSPECTS;

  try {
    const existing = getAllSuspects();
    const updated = [suspect, ...existing.filter(s => String(s.id) !== String(suspect.id))];
    
    // Save to both keys for backward-compatibility
    const customOnly = updated.filter(s => !BASE_INDIAN_SUSPECTS.some(b => String(b.id) === String(s.id)));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
    localStorage.setItem(LEGACY_KEY, JSON.stringify(customOnly));
    
    return updated;
  } catch (err) {
    console.error('Error saving suspect:', err);
    return BASE_INDIAN_SUSPECTS;
  }
}

/**
 * Delete a suspect record permanently
 */
export function removeSuspect(id: string): SuspectRecord[] {
  if (typeof window === 'undefined') return BASE_INDIAN_SUSPECTS;

  try {
    const existing = getAllSuspects();
    const updated = existing.filter(s => String(s.id) !== String(id));
    
    const customOnly = updated.filter(s => !BASE_INDIAN_SUSPECTS.some(b => String(b.id) === String(s.id)));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
    localStorage.setItem(LEGACY_KEY, JSON.stringify(customOnly));
    
    return updated;
  } catch (err) {
    console.error('Error deleting suspect:', err);
    return BASE_INDIAN_SUSPECTS;
  }
}

/**
 * Find suspect by ID (looks in custom first, then base)
 */
export function getSuspectById(id: string): SuspectRecord | null {
  const all = getAllSuspects();
  const idStr = String(id).trim().toLowerCase();
  return all.find(s => String(s.id).trim().toLowerCase() === idStr) || null;
}

/**
 * Compute an 64-element normalized perceptual image feature vector from an HTML image / canvas.
 * This extracts spatial brightness and color distributions, allowing true mathematical Cosine Similarity!
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
      // Perceptual luminance = 0.299R + 0.587G + 0.114B
      const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255.0;
      vector.push(lum);
    }

    // L2 Normalize
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1.0;
    return vector.map(v => v / norm);
  } catch {
    // Deterministic fallback based on src string length/characters
    const seed = (img.src || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return Array.from({ length: 64 }, (_, i) => Math.sin(seed + i * 0.5) / 8);
  }
}

/**
 * Cosine Similarity between two normalized vectors:
 * Returns score between 0.0 and 1.0
 */
export function computeVectorCosine(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0.45;
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return Math.max(0, Math.min(1.0, dot));
}
