import {
  generateMockFaceEmbedding,
  generateMockFIREmbedding,
  generateMockFaceMatches,
  generateMockFIRMatches,
} from './mock-service';

export interface FaceMatchResponse {
  suspect_id: string;
  suspect_name: string;
  photo_url: string;
  similarity: number;
  threat_level: string;
  lifecycle_status: string;
}

export interface FIRMatchResponse {
  fir_id: string;
  fir_number: string;
  case_number: string;
  similarity: number;
  crime_type: string;
  mo_description: string;
  incident_date: string;
}

export interface MLService {
  embedFace(image: Buffer): Promise<number[]>;
  embedFIR(text: string): Promise<number[]>;
  matchFaces(embedding: number[], threshold: number, limit: number): Promise<FaceMatchResponse[]>;
  linkCases(embedding: number[], threshold: number, limit: number): Promise<FIRMatchResponse[]>;
}

/**
 * Mock ML Service - used when ML_SERVICE_URL is not configured.
 * Provides deterministic mock embeddings and pre-generated match results.
 */
class MockMLService implements MLService {
  async embedFace(image: Buffer): Promise<number[]> {
    return generateMockFaceEmbedding(image);
  }

  async embedFIR(text: string): Promise<number[]> {
    return generateMockFIREmbedding(text);
  }

  async matchFaces(_embedding: number[], _threshold: number, limit: number): Promise<FaceMatchResponse[]> {
    return generateMockFaceMatches(limit);
  }

  async linkCases(_embedding: number[], _threshold: number, limit: number): Promise<FIRMatchResponse[]> {
    return generateMockFIRMatches(limit);
  }
}

/**
 * Remote ML Service - calls the FastAPI inference service on HF Spaces.
 */
class RemoteMLService implements MLService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async embedFace(image: Buffer): Promise<number[]> {
    const formData = new FormData();
    formData.append('file', new Blob([image as unknown as BlobPart]), 'face.jpg');

    const response = await fetch(`${this.baseUrl}/embed-face`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Face embedding failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
  }

  async embedFIR(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/embed-fir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`FIR embedding failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
  }

  async matchFaces(embedding: number[], threshold: number, limit: number): Promise<FaceMatchResponse[]> {
    const response = await fetch(`${this.baseUrl}/match-face`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embedding, threshold, limit }),
    });

    if (!response.ok) {
      throw new Error(`Face matching failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.matches;
  }

  async linkCases(embedding: number[], threshold: number, limit: number): Promise<FIRMatchResponse[]> {
    const response = await fetch(`${this.baseUrl}/link-cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embedding, threshold, limit }),
    });

    if (!response.ok) {
      throw new Error(`Case linking failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.matches;
  }
}

/**
 * Factory function - returns MockMLService if ML_SERVICE_URL is not set,
 * otherwise returns RemoteMLService pointing to the FastAPI service.
 */
export function getMLService(): MLService {
  const mlServiceUrl = process.env.ML_SERVICE_URL;

  if (!mlServiceUrl || mlServiceUrl === 'http://localhost:8000') {
    console.log('[ML] Using MockMLService (ML_SERVICE_URL not configured)');
    return new MockMLService();
  }

  console.log(`[ML] Using RemoteMLService at ${mlServiceUrl}`);
  return new RemoteMLService(mlServiceUrl);
}
