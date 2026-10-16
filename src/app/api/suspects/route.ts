import { NextResponse } from 'next/server';
import {
  loadAll5000SyntheticProfiles,
  getSyntheticFilterMetadata,
  SYNTHETIC_DATASET_SUMMARY,
  addCustomServerSuspect,
  removeCustomServerSuspect,
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
      default: {
        const aCustom = a.recordType === 'CUSTOM_RECORD' || String(a.id).includes('CUSTOM') || Number(String(a.id).replace(/\D/g, '')) > 5000;
        const bCustom = b.recordType === 'CUSTOM_RECORD' || String(b.id).includes('CUSTOM') || Number(String(b.id).replace(/\D/g, '')) > 5000;
        if (aCustom && !bCustom) return -1;
        if (!aCustom && bCustom) return 1;
        return String(a.id).localeCompare(String(b.id));
      }
    }
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * limit;
  const paginated = sorted.slice(startIndex, startIndex + limit);

  const filterMeta = getSyntheticFilterMetadata();

  return NextResponse.json({
    jurisdiction: 'Nagpur Police Commissionerate',
    department: 'Intelligent Biometric Suspect Tracking System',
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
  try {
    const body = await request.json();

    // Support array sync
    if (Array.isArray(body)) {
      const added = body.map((item) => addCustomServerSuspect(ensureSyntheticCompliance(item)));
      return NextResponse.json({ success: true, count: added.length, data: added }, { status: 201 });
    }

    if (body.sync && Array.isArray(body.sync)) {
      const added = body.sync.map((item: SuspectRecord) => addCustomServerSuspect(ensureSyntheticCompliance(item)));
      return NextResponse.json({ success: true, count: added.length, data: added }, { status: 201 });
    }

    const newId = body.id || `SYN-NGP-${Date.now().toString().slice(-5)}`;

    const record: SuspectRecord = ensureSyntheticCompliance({
      id: newId,
      name: body.name || `Suspect Profile`,
      alias: body.alias || 'None',
      threatLevel: body.threatLevel || 'MEDIUM',
      status: body.status || 'UNDER_INVESTIGATION',
      city: body.city || 'Nagpur',
      district: 'Nagpur',
      stateOrUT: 'Maharashtra',
      region: 'Nagpur Metropolitan Region',
      locality: body.locality || 'Sitabuldi',
      policeStation:
        body.policeStation ||
        `Nagpur Police — ${body.locality || 'Sitabuldi'} Station`,
      cases: typeof body.cases === 'number' ? body.cases : 1,
      lastUpdated: new Date().toISOString().split('T')[0],
      gender: body.gender || 'Male',
      age: typeof body.age === 'number' ? body.age : 30,
      height: body.height || '170 cm',
      weight: body.weight || '70 kg',
      physicalDesc:
        body.physicalDesc ||
        'Standard identification physical profile.',
      distinguishingMarks:
        body.distinguishingMarks || 'None recorded',
      photoUrl: body.photoUrl || '/images/portrait_001.jpg',
      crimeCategory:
        body.crimeCategory || 'Other Cognizable Offence',
      caseReferenceDemo: body.caseReferenceDemo || `NGP-2026-${newId}`,
    });

    const saved = addCustomServerSuspect(record);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/suspects:', err);
    return NextResponse.json({ error: 'Failed to register suspect record' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('deleteId');
    if (!id) {
      return NextResponse.json({ error: 'Missing suspect ID' }, { status: 400 });
    }
    const removed = removeCustomServerSuspect(id);
    return NextResponse.json({ success: true, removed, id });
  } catch (err) {
    console.error('Error in DELETE /api/suspects:', err);
    return NextResponse.json({ error: 'Failed to delete suspect' }, { status: 500 });
  }
}

