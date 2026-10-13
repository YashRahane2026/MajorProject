import fs from 'fs';
import path from 'path';
import {
  SuspectRecord,
  BASE_INDIAN_SUSPECTS,
  ensureSyntheticCompliance,
  SYNTHETIC_DATASET_SUMMARY,
} from './suspects-data';

let cached5000: SuspectRecord[] | null = null;
let cachedFilterMeta: {
  statuses: string[];
  categories: string[];
  localities: string[];
} | null = null;

export function loadAll5000SyntheticProfiles(): SuspectRecord[] {
  if (cached5000) return cached5000;

  try {
    const jsonPath = path.join(process.cwd(), 'data', 'demo', 'synthetic_nagpur_suspects_5000.json');
    if (fs.existsSync(jsonPath)) {
      const rawText = fs.readFileSync(jsonPath, 'utf-8');
      const parsed = JSON.parse(rawText) as SuspectRecord[];
      cached5000 = parsed.map(ensureSyntheticCompliance);
      return cached5000;
    }
  } catch (err) {
    console.error('Failed to load synthetic_nagpur_suspects_5000.json:', err);
  }

  return BASE_INDIAN_SUSPECTS;
}

export function getSyntheticFilterMetadata() {
  if (cachedFilterMeta) return cachedFilterMeta;
  const all = loadAll5000SyntheticProfiles();

  const statuses = Array.from(new Set(all.map((r) => r.status).filter(Boolean))).sort();
  const categories = Array.from(
    new Set(all.map((r) => r.crimeCategory || '').filter(Boolean))
  ).sort();
  const localities = Array.from(new Set(all.map((r) => r.locality || '').filter(Boolean))).sort();

  cachedFilterMeta = { statuses, categories, localities };
  return cachedFilterMeta;
}

export function findSyntheticProfileById(id: string): SuspectRecord | null {
  const all = loadAll5000SyntheticProfiles();
  const idClean = decodeURIComponent(String(id)).trim().toLowerCase();

  const exact = all.find((r) => String(r.id).toLowerCase() === idClean);
  if (exact) return exact;

  // Support numeric lookup e.g. "1" -> "SYN-NGP-00001"
  const num = parseInt(idClean, 10);
  if (!isNaN(num) && num >= 1 && num <= all.length) {
    const padded = `syn-ngp-${String(num).padStart(5, '0')}`;
    const byPadded = all.find((r) => String(r.id).toLowerCase() === padded);
    if (byPadded) return byPadded;
    return all[num - 1] || null;
  }

  return null;
}

export { SYNTHETIC_DATASET_SUMMARY };
