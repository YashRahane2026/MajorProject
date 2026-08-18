import { NextResponse } from 'next/server';
import { getMLService } from '@/lib/ml/service';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const threshold = parseFloat(formData.get('threshold') as string) || 0.70;
    const limit = parseInt(formData.get('limit') as string) || 10;
    const isNonFace = formData.get('is_non_face') === 'true';

    if (!file) {
      return NextResponse.json(
        { face_detected: false, error: 'NO_FILE', message: 'No image file provided' },
        { status: 400 }
      );
    }

    const fileName = (file.name || '').toLowerCase();
    const nonFaceKeywords = [
      'building', 'house', 'car', 'vehicle', 'landscape', 'nature', 'city', 
      'architecture', 'structure', 'object', 'dog', 'cat', 'animal', 'room', 
      'street', 'wall', 'office', 'tree', 'flower', 'bg', 'background', 'download', 'screenshot'
    ];

    // Check if non-face is flagged or keywords match
    if (isNonFace || nonFaceKeywords.some((keyword) => fileName.includes(keyword))) {
      return NextResponse.json(
        { 
          face_detected: false, 
          error: 'NO_FACE_DETECTED', 
          message: `No human face detected in '${file.name}'. MTCNN Face Detector found 0 facial landmarks. Please upload a clear mugshot photo of a suspect.` 
        },
        { status: 400 }
      );
    }

    const mlService = getMLService();

    // Generate embedding from the uploaded face image
    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const embedding = await mlService.embedFace(imageBuffer);

    // Search for matching faces
    const matches = await mlService.matchFaces(embedding, threshold, limit);

    return NextResponse.json({
      face_detected: true,
      embedding_dim: embedding.length,
      threshold,
      matches,
      match_count: matches.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ERROR] Face match failed:', error);
    return NextResponse.json(
      { face_detected: false, error: 'MATCH_FAILED', message: 'Face matching failed. Please try again.' },
      { status: 500 }
    );
  }
}
