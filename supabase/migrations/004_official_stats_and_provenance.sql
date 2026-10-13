-- Migration 004: Strict Two-Layer Separation (Official Government Statistics vs. Synthetic Demo Records)

-- 1. Official Data Sources Registry
CREATE TABLE IF NOT EXISTS official_data_sources (
    source_id VARCHAR(100) PRIMARY KEY,
    source_type VARCHAR(120) NOT NULL,
    title TEXT NOT NULL,
    organisation TEXT NOT NULL,
    url TEXT NOT NULL CHECK (url LIKE 'https://%'),
    used_for TEXT NOT NULL,
    scope TEXT NOT NULL,
    data_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Official Government Crime Statistics (Layer A — Aggregate Observations Only)
CREATE TABLE IF NOT EXISTS official_crime_statistics (
    record_id VARCHAR(100) PRIMARY KEY,
    geography VARCHAR(150) NOT NULL,
    jurisdiction VARCHAR(200) NOT NULL,
    jurisdiction_id VARCHAR(50) NOT NULL CHECK (jurisdiction_id IN ('nagpur_city', 'nagpur_railway')),
    year INT NOT NULL CHECK (year >= 1990 AND year <= 2030),
    metric VARCHAR(200) NOT NULL,
    crime_category VARCHAR(200) NOT NULL,
    legal_framework VARCHAR(50) DEFAULT 'IPC_SLL_LEGACY' CHECK (legal_framework IN ('IPC_SLL_LEGACY', 'IPC_BNS_TRANSITION')),
    registered_cases INT CHECK (registered_cases IS NULL OR registered_cases >= 0),
    detected_cases INT CHECK (detected_cases IS NULL OR (detected_cases >= 0 AND detected_cases <= registered_cases)),
    detection_rate_percent FLOAT CHECK (detection_rate_percent IS NULL OR (detection_rate_percent >= 0 AND detection_rate_percent <= 100)),
    crime_rate FLOAT CHECK (crime_rate IS NULL OR crime_rate >= 0),
    unit VARCHAR(60) NOT NULL,
    population_basis TEXT NOT NULL,
    source_organisation TEXT NOT NULL,
    source_title TEXT NOT NULL,
    source_url TEXT NOT NULL CHECK (source_url LIKE 'https://%'),
    official_catalog_url TEXT NOT NULL,
    source_table TEXT NOT NULL,
    source_page TEXT NOT NULL,
    publication_date VARCHAR(40) NOT NULL,
    imported_at VARCHAR(40) NOT NULL,
    verification_status VARCHAR(80) NOT NULL,
    is_summary_total BOOLEAN DEFAULT FALSE,
    is_thematic_group BOOLEAN DEFAULT FALSE,
    is_synthetic BOOLEAN DEFAULT FALSE CHECK (is_synthetic = FALSE), -- Rule 10 Database Constraint: Synthetic rows can NEVER enter this table
    notes TEXT,
    UNIQUE (jurisdiction_id, year, metric, crime_category)
);

-- 3. Add explicit provenance columns to individual suspects table (Layer B — Synthetic Demo Layer)
ALTER TABLE suspects
    ADD COLUMN IF NOT EXISTS record_type VARCHAR(50) DEFAULT 'SYNTHETIC_DEMO_ONLY',
    ADD COLUMN IF NOT EXISTS is_synthetic BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS is_real_person BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_real_case BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS case_reference_demo VARCHAR(100),
    ADD COLUMN IF NOT EXISTS locality VARCHAR(150),
    ADD COLUMN IF NOT EXISTS crime_category VARCHAR(200),
    ADD COLUMN IF NOT EXISTS photo_disclaimer TEXT DEFAULT 'AI-generated fictional portrait; not a real person and not identity evidence.',
    ADD COLUMN IF NOT EXISTS record_disclaimer TEXT DEFAULT 'FICTIONAL GENERATED DEMO ONLY — NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD.';
