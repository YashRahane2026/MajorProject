import { NextResponse } from 'next/server';
import {
  loadAll5000SyntheticProfiles,
  getSyntheticFilterMetadata,
  SYNTHETIC_DATASET_SUMMARY,
} from '@/lib/data/server-synthetic-loader';
import { ensureSyntheticCompliance, SuspectRecord } from '@/lib/data/suspects-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const threat = (searchParams.get('threat') || '').trim();
  const status = (searchParams.get('status') || '').trim();
  const category = (searchParams.get('category') || '').trim();
  const locality = (searchParams.get('locality') || '').trim();
  const gender = (searchParams.get('gender') || '').trim();
  const sort = (searchParams.get('sort') || 'id_asc').trim();

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12', 10) || 12));

  const allProfiles = loadAll5000SyntheticProfiles();

  const filtered = allProfiles.filter((s) => {
    if (threat && s.threatLevel !== threat) return false;
    if (status && s.status !== status) return false;
    if (category && s.crimeCategory !== category) return false;
    if (locality && s.locality !== locality) return false;
    if (gender && s.gender !== gender) return false;

    if (q) {
      const hay = [
        s.id,
        s.name,
        s.alias,
        s.locality,
        s.policeStation,
        s.crimeCategory,
        s.caseReferenceDemo,
        s.city,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'id_desc':
        return String(b.id).localeCompare(String(a.id));
      case 'name_asc':
        return String(a.name).localeCompare(String(b.name));
      case 'age_asc':
        return (a.age || 0) - (b.age || 0);
      case 'age_desc':
        return (b.age || 0) - (a.age || 0);
      case 'cases_desc':
        return (b.cases || 0) - (a.cases || 0);
      case 'id_asc':
      default:
        return String(a.id).localeCompare(String(b.id));
    }
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * limit;
  const paginated = sorted.slice(startIndex, startIndex + limit);

  const filterMeta = getSyntheticFilterMetadata();

  return NextResponse.json({
    provenance: {
      layer: 'SYNTHETIC_DEMO_ONLY',
      badge: 'SYNTHETIC DEMO — NOT A REAL PERSON OR CASE',
      totalSyntheticProfiles: allProfiles.length,
      officialCrimeStatsIncluded: false,
      note: 'All records returned by this endpoint are fictional demo profiles and are strictly excluded from official government crime statistics.',
    },
    data: paginated,
    count: paginated.length,
    total,
    page: safePage,
    limit,
    totalPages,
    summary: SYNTHETIC_DATASET_SUMMARY,
    filters: filterMeta,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<SuspectRecord>;
  const newId = body.id || `SYN-NGP-CUSTOM-${Date.now().toString().slice(-5)}`;

  const record: SuspectRecord = ensureSyntheticCompliance({
    id: newId,
    name: body.name || `Demo Profile [SYNTHETIC DEMO]`,
    alias: body.alias || 'None (demo record)',
    threatLevel: body.threatLevel || 'MEDIUM',
    status: body.status || 'UNDER_INVESTIGATION (DEMO)',
    city: body.city || 'Nagpur',
    district: 'Nagpur',
    stateOrUT: 'Maharashtra',
    region: 'Nagpur metropolitan region (demo assignment)',
    locality: body.locality || 'Sitabuldi',
    policeStation:
      body.policeStation ||
      `DEMO AREA MAPPING — ${body.locality || 'Sitabuldi'}; not an actual case assignment`,
    cases: typeof body.cases === 'number' ? body.cases : 1,
    lastUpdated: new Date().toISOString().split('T')[0],
    gender: body.gender || 'Male',
    age: typeof body.age === 'number' ? body.age : 30,
    height: body.height || '170 cm',
    weight: body.weight || '70 kg',
    physicalDesc:
      body.physicalDesc ||
      'Fictional visual description for UI testing; not verified evidence.',
    distinguishingMarks:
      body.distinguishingMarks || 'No distinguishing mark recorded (demo)',
    photoUrl: body.photoUrl || '/images/portrait_001.jpg',
    crimeCategory:
      body.crimeCategory || 'Other Cognizable Offence (synthetic demo category)',
    caseReferenceDemo: body.caseReferenceDemo || `DEMO-NGP-2026-${newId}`,
  });

  return NextResponse.json({ data: record }, { status: 201 });
}
