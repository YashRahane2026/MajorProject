import crypto from 'crypto';

/**
 * Mock ML Service
 * 
 * Provides deterministic mock embeddings and similarity search
 * for Phase 1 development. Same image/text always produces the 
 * same embedding, enabling consistent demo behavior.
 * 
 * Replace with RemoteMLService when the FastAPI service is deployed.
 */

/**
 * Generate a deterministic 512-dim face embedding from an image buffer.
 * Uses a hash of the image data to seed a pseudo-random number generator,
 * producing consistent embeddings for identical images.
 */
export function generateMockFaceEmbedding(imageBuffer: Buffer): number[] {
  const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
  return hashToEmbedding(hash, 512);
}

/**
 * Generate a deterministic 768-dim text embedding from a string.
 * Uses a hash of the text to seed a pseudo-random number generator.
 */
export function generateMockFIREmbedding(text: string): number[] {
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  return hashToEmbedding(hash, 768);
}

/**
 * Convert a hex hash string into a normalized embedding vector.
 * Uses a simple seeded PRNG (mulberry32) for deterministic output.
 */
function hashToEmbedding(hash: string, dimensions: number): number[] {
  // Use first 8 chars of hash as seed
  const seed = parseInt(hash.slice(0, 8), 16);
  const rng = mulberry32(seed);

  const embedding: number[] = [];
  for (let i = 0; i < dimensions; i++) {
    // Generate values in [-1, 1] range
    embedding.push(rng() * 2 - 1);
  }

  // L2 normalize the embedding
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map((val) => val / norm);
}

/**
 * Mulberry32 PRNG - fast, deterministic, seedable.
 * Returns a function that generates numbers in [0, 1).
 */
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Compute cosine similarity between two vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Generate sample face match results for demo purposes.
 * Returns realistic-looking match results with varying confidence scores.
 */
export function generateMockFaceMatches(count: number = 5): Array<{
  suspect_id: string;
  suspect_name: string;
  photo_url: string;
  similarity: number;
  threat_level: string;
  lifecycle_status: string;
}> {
  const names = [
    'Rajesh Kumar', 'Amit Sharma', 'Vikram Singh', 'Sunil Verma', 'Deepak Patel',
    'Manoj Tiwari', 'Rahul Gupta', 'Sanjay Mishra', 'Arun Yadav', 'Pradeep Joshi',
  ];
  const threats = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const statuses = ['ARRESTED', 'REMAND', 'TRIAL', 'CUSTODY', 'ABSCONDING'];

  return Array.from({ length: count }, (_, i) => ({
    suspect_id: crypto.randomUUID(),
    suspect_name: names[i % names.length],
    photo_url: `/api/placeholder/150/150?text=${encodeURIComponent(names[i % names.length])}`,
    similarity: 0.95 - i * 0.07 + Math.random() * 0.03,
    threat_level: threats[i % threats.length],
    lifecycle_status: statuses[i % statuses.length],
  }));
}

/**
 * Generate sample FIR match results for demo purposes.
 */
export function generateMockFIRMatches(count: number = 5): Array<{
  fir_id: string;
  fir_number: string;
  case_number: string;
  similarity: number;
  crime_type: string;
  mo_description: string;
  incident_date: string;
}> {
  const crimeTypes = ['theft', 'robbery', 'assault', 'cyber_fraud', 'narcotics'];
  const moDescriptions = [
    'Suspect used forged identity documents to gain access to the premises during nighttime.',
    'Armed robbery at a jewelry store using a stolen vehicle as getaway. Multiple suspects involved.',
    'Cyber fraud involving phishing emails targeting senior citizens. Siphoned funds via UPI transfers.',
    'Narcotics seizure at highway checkpoint. Suspect attempted to flee on foot.',
    'Assault with a blunt weapon during a domestic dispute. Victim hospitalized.',
  ];

  return Array.from({ length: count }, (_, i) => ({
    fir_id: crypto.randomUUID(),
    fir_number: `FIR/${2024 + Math.floor(i / 3)}/${(1001 + i).toString()}`,
    case_number: `CR/${2024}/${(5001 + i).toString()}`,
    similarity: 0.92 - i * 0.06 + Math.random() * 0.04,
    crime_type: crimeTypes[i % crimeTypes.length],
    mo_description: moDescriptions[i % moDescriptions.length],
    incident_date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  }));
}
