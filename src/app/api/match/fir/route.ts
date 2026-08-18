import { NextResponse } from 'next/server';
import { getMLService } from '@/lib/ml/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, fir_id, threshold = 0.60, limit = 10 } = body;

    if (!text && !fir_id) {
      return NextResponse.json(
        { error: 'Either text or fir_id must be provided' },
        { status: 400 }
      );
    }

    const mlService = getMLService();

    // Generate embedding from FIR text
    const narrativeText = text || `Sample FIR narrative for ${fir_id}`;
    const embedding = await mlService.embedFIR(narrativeText);

    // Search for similar FIRs/cases
    const matches = await mlService.linkCases(embedding, threshold, limit);

    // Log the match query for audit
    console.log(`[AUDIT] FIR link query: threshold=${threshold}, results=${matches.length}`);

    return NextResponse.json({
      embedding_dim: embedding.length,
      threshold,
      matches,
      match_count: matches.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ERROR] FIR linking failed:', error);
    return NextResponse.json(
      { error: 'FIR linking failed. Please try again.' },
      { status: 500 }
    );
  }
}
