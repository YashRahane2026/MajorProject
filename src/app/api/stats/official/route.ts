import { NextResponse } from 'next/server';
import {
  VERIFIED_OFFICIAL_STATISTICS,
  OFFICIAL_DATA_SOURCES,
  UNAVAILABLE_GOVERNMENT_DATA,
  OFFICIAL_VALIDATION_REPORT,
} from '@/lib/data/official-stats';
import { computeSafeCategorySum } from '@/lib/data/validation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jurisdictionParam = searchParams.get('jurisdiction') as 'nagpur_city' | 'nagpur_railway' | null;
  const yearParam = searchParams.get('year');

  let records = VERIFIED_OFFICIAL_STATISTICS;

  if (jurisdictionParam === 'nagpur_city' || jurisdictionParam === 'nagpur_railway') {
    records = records.filter((r) => r.jurisdiction_id === jurisdictionParam);
  }

  if (yearParam) {
    const yearNum = parseInt(yearParam, 10);
    if (!isNaN(yearNum)) {
      records = records.filter((r) => r.year === yearNum);
    }
  }

  const city2023Summary = computeSafeCategorySum(VERIFIED_OFFICIAL_STATISTICS, 'nagpur_city', 2023);
  const railway2025Summary = computeSafeCategorySum(VERIFIED_OFFICIAL_STATISTICS, 'nagpur_railway', 2025);

  return NextResponse.json({
    provenance: {
      layer: 'OFFICIAL_GOVERNMENT_STATISTICS',
      description:
        'Verified aggregate government crime statistics from NCRB and Nagpur Railway Police. Strictly separated from individual suspect profiles.',
      synthetic_records_included: 0,
    },
    count: records.length,
    records,
    sources: OFFICIAL_DATA_SOURCES,
    unavailable_data: UNAVAILABLE_GOVERNMENT_DATA,
    validation_report: OFFICIAL_VALIDATION_REPORT,
    reconciliation_summaries: {
      nagpur_city_2023: city2023Summary,
      nagpur_railway_2025: railway2025Summary,
    },
  });
}
