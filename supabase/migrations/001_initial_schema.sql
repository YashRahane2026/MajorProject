-- Enable extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-running migration
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS lifecycle_events CASCADE;
DROP TABLE IF EXISTS match_results CASCADE;
DROP TABLE IF EXISTS fir_embeddings CASCADE;
DROP TABLE IF EXISTS face_embeddings CASCADE;
DROP TABLE IF EXISTS suspect_cases CASCADE;
DROP TABLE IF EXISTS firs CASCADE;
DROP TABLE IF EXISTS cases CASCADE;
DROP TABLE IF EXISTS suspects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. users
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'police', 'court', 'custodial_staff')),
    badge_number VARCHAR(50),
    department VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. suspects
CREATE TABLE suspects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    alias VARCHAR(200),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN')),
    nationality VARCHAR(100) DEFAULT 'Indian',
    id_type VARCHAR(50) CHECK (id_type IN ('AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'OTHER')),
    id_number VARCHAR(100),
    physical_description TEXT,
    height_cm NUMERIC(5,1),
    weight_kg NUMERIC(5,1),
    distinguishing_marks TEXT,
    threat_level VARCHAR(20) CHECK (threat_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')) DEFAULT 'MEDIUM',
    lifecycle_status VARCHAR(30) CHECK (lifecycle_status IN ('ARRESTED', 'REMAND', 'BAIL', 'TRIAL', 'CONVICTED', 'CUSTODY', 'RELEASED', 'ABSCONDING', 'DECEASED')) DEFAULT 'ARRESTED',
    last_known_address TEXT,
    last_known_city VARCHAR(100),
    last_known_state VARCHAR(100),
    primary_photo_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. cases
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    crime_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')) DEFAULT 'MEDIUM',
    status VARCHAR(30) CHECK (status IN ('OPEN', 'UNDER_INVESTIGATION', 'CHARGE_SHEETED', 'TRIAL', 'CLOSED', 'COLD')) DEFAULT 'OPEN',
    jurisdiction VARCHAR(100),
    investigating_officer UUID REFERENCES users(id),
    incident_date DATE,
    incident_location TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. firs
CREATE TABLE firs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_number VARCHAR(50) UNIQUE NOT NULL,
    case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
    complainant_name VARCHAR(200) NOT NULL,
    complainant_contact VARCHAR(100),
    incident_date TIMESTAMPTZ NOT NULL,
    incident_location TEXT NOT NULL,
    narrative_text TEXT NOT NULL,
    mo_description TEXT,
    crime_type VARCHAR(100),
    status VARCHAR(30) DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'UNDER_INVESTIGATION', 'CHARGE_SHEETED', 'CLOSED', 'TRANSFERRED')),
    filed_by UUID REFERENCES users(id),
    police_station VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. suspect_cases
CREATE TABLE suspect_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suspect_id UUID NOT NULL REFERENCES suspects(id) ON DELETE CASCADE,
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    role VARCHAR(30) CHECK (role IN ('PRIMARY_SUSPECT', 'ACCOMPLICE', 'WITNESS', 'PERSON_OF_INTEREST')) DEFAULT 'PRIMARY_SUSPECT',
    added_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(suspect_id, case_id)
);

-- 6. face_embeddings
CREATE TABLE face_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suspect_id UUID NOT NULL REFERENCES suspects(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    source_type VARCHAR(50) DEFAULT 'MUGSHOT' CHECK (source_type IN ('MUGSHOT', 'CCTV_FRAME', 'ID_CARD', 'SURVEILLANCE', 'UPLOADED')),
    embedding vector(512) NOT NULL,
    model_version VARCHAR(50) DEFAULT 'arcface-vggface2',
    confidence_score FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. fir_embeddings
CREATE TABLE fir_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
    embedding vector(768) NOT NULL,
    model_version VARCHAR(50) DEFAULT 'all-mpnet-base-v2',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. match_results
CREATE TABLE match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_type VARCHAR(20) NOT NULL CHECK (query_type IN ('FACE', 'FIR')),
    query_entity_id UUID NOT NULL,
    matched_entity_id UUID NOT NULL,
    similarity_score FLOAT NOT NULL,
    threshold_used FLOAT NOT NULL,
    is_confirmed BOOLEAN DEFAULT false,
    confirmed_by UUID REFERENCES users(id),
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. lifecycle_events
CREATE TABLE lifecycle_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suspect_id UUID NOT NULL REFERENCES suspects(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    event_date TIMESTAMPTZ DEFAULT now(),
    location VARCHAR(200),
    court_name VARCHAR(200),
    order_number VARCHAR(100),
    notes TEXT,
    changed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. audit_log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'FACE_MATCH', 'FIR_MATCH', 'LOGIN', 'EXPORT')),
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('suspect', 'case', 'fir', 'face_embedding', 'fir_embedding', 'match_result', 'user')),
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Vector indexes
CREATE INDEX IF NOT EXISTS idx_face_embeddings_hnsw ON face_embeddings USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_fir_embeddings_hnsw ON fir_embeddings USING hnsw (embedding vector_cosine_ops);

-- B-tree indexes
CREATE INDEX IF NOT EXISTS idx_suspects_status ON suspects(lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_suspects_threat ON suspects(threat_level);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_crime_type ON cases(crime_type);
CREATE INDEX IF NOT EXISTS idx_firs_status ON firs(status);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger
DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_suspects_updated_at ON suspects;
CREATE TRIGGER set_suspects_updated_at BEFORE UPDATE ON suspects FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_cases_updated_at ON cases;
CREATE TRIGGER set_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_firs_updated_at ON firs;
CREATE TRIGGER set_firs_updated_at BEFORE UPDATE ON firs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
