import { NextResponse } from 'next/server';
import { findSyntheticProfileById } from '@/lib/data/server-synthetic-loader';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const profile = findSyntheticProfileById(id);

  if (!profile) {
    return NextResponse.json(
      {
        error: 'Suspect profile not found',
        id,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    provenance: {
      layer: 'CENTRAL_SUSPECT_REGISTRY',
      badge: 'OFFICIAL ENROLLED SUSPECT RECORD',
    },
    data: profile,
  });
}
