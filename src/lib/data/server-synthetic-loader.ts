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

const CUSTOM_PERSISTENCE_PATH = path.join(process.cwd(), 'data', 'demo', 'custom_registered_suspects.json');

function initServerCustomSuspects(): SuspectRecord[] {
  try {
    if (fs.existsSync(CUSTOM_PERSISTENCE_PATH)) {
      const raw = fs.readFileSync(CUSTOM_PERSISTENCE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(ensureSyntheticCompliance);
      }
    }
  } catch (err) {
    // Ignore in ephemeral or read-only serverless environment
  }
  return [];
}

const serverCustomSuspects: SuspectRecord[] = initServerCustomSuspects();

function persistCustomSuspectsToFile() {
  try {
    fs.writeFileSync(CUSTOM_PERSISTENCE_PATH, JSON.stringify(serverCustomSuspects, null, 2), 'utf-8');
  } catch {
    // Ignore if running in a read-only serverless environment
  }
}

export function addCustomServerSuspect(suspect: SuspectRecord): SuspectRecord {
  const compliant = ensureSyntheticCompliance(suspect);
  const existingIdx = serverCustomSuspects.findIndex(
    (s) => String(s.id).toLowerCase() === String(compliant.id).toLowerCase()
  );
  if (existingIdx >= 0) {
    serverCustomSuspects[existingIdx] = compliant;
  } else {
    serverCustomSuspects.unshift(compliant);
  }
  // Invalidate cached filter metadata
  cachedFilterMeta = null;
  persistCustomSuspectsToFile();
  return compliant;
}

export function getCustomServerSuspects(): SuspectRecord[] {
  return serverCustomSuspects;
}

export function removeCustomServerSuspect(id: string): boolean {
  const idClean = String(id).trim().toLowerCase();
  const idx = serverCustomSuspects.findIndex(
    (s) => String(s.id).toLowerCase() === idClean
  );
  if (idx >= 0) {
    serverCustomSuspects.splice(idx, 1);
    cachedFilterMeta = null;
    persistCustomSuspectsToFile();
    return true;
  }
  return false;
}

export function loadAll5000SyntheticProfiles(): SuspectRecord[] {
  let base: SuspectRecord[] = [];
  if (cached5000) {
    base = cached5000;
  } else {
    try {
      const jsonPath = path.join(process.cwd(), 'data', 'demo', 'synthetic_nagpur_suspects_5000.json');
      if (fs.existsSync(jsonPath)) {
        const rawText = fs.readFileSync(jsonPath, 'utf-8');
        const parsed = JSON.parse(rawText) as SuspectRecord[];
        cached5000 = parsed.map(ensureSyntheticCompliance);
        base = cached5000;
      } else {
        base = BASE_INDIAN_SUSPECTS;
      }
    } catch (err) {
      console.error('Failed to load synthetic_nagpur_suspects_5000.json:', err);
      base = BASE_INDIAN_SUSPECTS;
    }
  }

  if (serverCustomSuspects.length === 0) return base;

  const customIds = new Set(serverCustomSuspects.map((s) => String(s.id).toLowerCase()));
  return [...serverCustomSuspects, ...base.filter((b) => !customIds.has(String(b.id).toLowerCase()))];
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
