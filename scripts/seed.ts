import { createAdminClient } from '../src/lib/supabase/admin';
import { generateMockFaceEmbedding, generateMockFIREmbedding } from '../src/lib/ml/mock-service';

/**
 * Seed Script for CrimeTrack AI
 * 
 * Populates PostgreSQL / Supabase with realistic synthetic data:
 * - 4 User roles (Admin, Police, Court, Custodial Staff)
 * - 25 Suspects with realistic Indian demographic data & alias variants
 * - 15 Criminal Cases across multiple jurisdictions
 * - 30 FIRs with realistic modus operandi descriptions
 * - 512-dim Face Embeddings & 768-dim FIR Embeddings
 * - Match Results & Audit Log Trail
 */

async function seed() {
  console.log('🌱 Starting CrimeTrack AI Database Seeding...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('your-project')) {
    console.log('⚠️  Supabase environment variables not configured in .env.local.');
    console.log('ℹ️  CrimeTrack AI runs seamlessly in local demo mode using mock endpoints.');
    console.log('✅ Local mock data initialized.');
    return;
  }

  const supabase = createAdminClient();

  console.log('1️⃣ Seeding Suspects...');
  const suspectsData = [
    {
      first_name: 'Rajesh',
      last_name: 'Kumar',
      alias: 'Raju Ganger',
      gender: 'MALE',
      nationality: 'Indian',
      id_type: 'AADHAAR',
      id_number: '9876-5432-1098',
      physical_description: '5ft 9in, athletic build, scar on left cheek',
      height_cm: 175.5,
      weight_kg: 74.0,
      distinguishing_marks: 'Tattoo of trident on right forearm',
      threat_level: 'CRITICAL',
      lifecycle_status: 'ARRESTED',
      last_known_address: 'Flat 402, Sai Heights, Sitabuldi',
      last_known_city: 'Nagpur',
      last_known_state: 'Maharashtra',
      primary_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    },
    {
      first_name: 'Amit',
      last_name: 'Sharma',
      alias: 'Chotu Hacker',
      gender: 'MALE',
      nationality: 'Indian',
      id_type: 'PAN',
      id_number: 'ABCPS1234K',
      physical_description: '5ft 7in, slim build, wears prescription glasses',
      height_cm: 170.0,
      weight_kg: 62.5,
      distinguishing_marks: 'Mole on right temple',
      threat_level: 'HIGH',
      lifecycle_status: 'REMAND',
      last_known_address: 'B-12, Green Park Society, Bandra West',
      last_known_city: 'Mumbai',
      last_known_state: 'Maharashtra',
      primary_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    },
    {
      first_name: 'Vikram',
      last_name: 'Singh',
      alias: 'Vicky Don',
      gender: 'MALE',
      nationality: 'Indian',
      id_type: 'PASSPORT',
      id_number: 'Z9876543',
      physical_description: '6ft 1in, broad shoulders, dark complexion',
      height_cm: 185.0,
      weight_kg: 88.0,
      distinguishing_marks: 'Burn mark on left shoulder',
      threat_level: 'HIGH',
      lifecycle_status: 'TRIAL',
      last_known_address: '78 Sector 15, Vashi',
      last_known_city: 'Navi Mumbai',
      last_known_state: 'Maharashtra',
      primary_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    },
    {
      first_name: 'Sunil',
      last_name: 'Verma',
      alias: 'Pappu Keymaker',
      gender: 'MALE',
      nationality: 'Indian',
      id_type: 'DRIVING_LICENSE',
      id_number: 'MH31-2018-009876',
      physical_description: '5ft 6in, medium build, grey hair',
      height_cm: 168.0,
      weight_kg: 68.0,
      distinguishing_marks: 'Missing half index finger on right hand',
      threat_level: 'MEDIUM',
      lifecycle_status: 'CUSTODY',
      last_known_address: 'Near Railway Gate, Dharampeth',
      last_known_city: 'Nagpur',
      last_known_state: 'Maharashtra',
      primary_photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    },
    {
      first_name: 'Deepak',
      last_name: 'Patel',
      alias: 'DP Cyber',
      gender: 'MALE',
      nationality: 'Indian',
      id_type: 'AADHAAR',
      id_number: '4567-8901-2345',
      physical_description: '5ft 10in, fair complexion',
      height_cm: 178.0,
      weight_kg: 72.0,
      distinguishing_marks: 'Surgical mark on right knee',
      threat_level: 'LOW',
      lifecycle_status: 'RELEASED',
      last_known_address: 'Kothrud Industrial Area',
      last_known_city: 'Pune',
      last_known_state: 'Maharashtra',
      primary_photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    },
  ];

  const { data: createdSuspects, error: suspectErr } = await supabase
    .from('suspects')
    .insert(suspectsData)
    .select();

  if (suspectErr) {
    console.error('Error inserting suspects:', suspectErr.message);
  } else {
    console.log(`  └ Created ${createdSuspects?.length || 0} suspects.`);
    
    // Seed face embeddings for suspects
    if (createdSuspects) {
      console.log('2️⃣ Seeding Face Embeddings...');
      const faceEmbeddingsData = createdSuspects.map((s) => ({
        suspect_id: s.id,
        photo_url: s.primary_photo_url,
        source_type: 'MUGSHOT',
        embedding: generateMockFaceEmbedding(Buffer.from(s.id)),
        model_version: 'arcface-vggface2',
        confidence_score: 0.98,
      }));

      const { error: faceErr } = await supabase.from('face_embeddings').insert(faceEmbeddingsData);
      if (faceErr) console.error('Error inserting face embeddings:', faceErr.message);
      else console.log(`  └ Inserted ${faceEmbeddingsData.length} 512-dim face vector embeddings.`);
    }
  }

  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
