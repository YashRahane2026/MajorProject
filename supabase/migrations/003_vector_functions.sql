-- 1. match_faces
CREATE OR REPLACE FUNCTION match_faces(
    query_embedding vector(512),
    match_threshold float DEFAULT 0.65,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    suspect_id UUID,
    suspect_name TEXT,
    photo_url TEXT,
    similarity FLOAT,
    threat_level TEXT,
    lifecycle_status TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        fe.id,
        s.id AS suspect_id,
        (s.first_name || ' ' || s.last_name) AS suspect_name,
        fe.photo_url,
        1 - (fe.embedding <=> query_embedding) AS similarity,
        s.threat_level::TEXT,
        s.lifecycle_status::TEXT
    FROM face_embeddings fe
    JOIN suspects s ON s.id = fe.suspect_id
    WHERE 1 - (fe.embedding <=> query_embedding) > match_threshold
    ORDER BY fe.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 2. match_firs
CREATE OR REPLACE FUNCTION match_firs(
    query_embedding vector(768),
    match_threshold float DEFAULT 0.60,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    fir_id UUID,
    fir_number TEXT,
    case_id UUID,
    case_number TEXT,
    similarity FLOAT,
    crime_type TEXT,
    mo_description TEXT,
    incident_date TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        fe.id,
        f.id AS fir_id,
        f.fir_number::TEXT,
        c.id AS case_id,
        c.case_number::TEXT,
        1 - (fe.embedding <=> query_embedding) AS similarity,
        f.crime_type::TEXT,
        f.mo_description,
        f.incident_date
    FROM fir_embeddings fe
    JOIN firs f ON f.id = fe.fir_id
    LEFT JOIN cases c ON c.id = f.case_id
    WHERE 1 - (fe.embedding <=> query_embedding) > match_threshold
    ORDER BY fe.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 3. get_suspect_network
DROP FUNCTION IF EXISTS get_suspect_network(UUID, float);

CREATE OR REPLACE FUNCTION get_suspect_network(
    p_target_suspect_id UUID,
    similarity_threshold float DEFAULT 0.60
)
RETURNS TABLE (
    source_suspect_id UUID,
    source_name TEXT,
    target_suspect_id UUID,
    target_name TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
    target_embedding vector(512);
    target_full_name TEXT;
BEGIN
    -- Get the target suspect's most recent embedding
    SELECT embedding INTO target_embedding
    FROM face_embeddings
    WHERE suspect_id = p_target_suspect_id
    ORDER BY created_at DESC
    LIMIT 1;

    -- Get target suspect's name
    SELECT (first_name || ' ' || last_name) INTO target_full_name
    FROM suspects
    WHERE id = p_target_suspect_id;

    RETURN QUERY
    SELECT DISTINCT
        p_target_suspect_id AS source_suspect_id,
        target_full_name AS source_name,
        s.id AS target_suspect_id,
        (s.first_name || ' ' || s.last_name) AS target_name,
        1 - (fe.embedding <=> target_embedding) AS similarity
    FROM face_embeddings fe
    JOIN suspects s ON s.id = fe.suspect_id
    WHERE s.id != p_target_suspect_id
      AND 1 - (fe.embedding <=> target_embedding) > similarity_threshold
    ORDER BY similarity DESC;
END;
$$;

-- 4. get_dashboard_stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_suspects BIGINT,
    active_cases BIGINT,
    total_firs BIGINT,
    total_matches BIGINT,
    avg_match_accuracy FLOAT,
    suspects_by_status JSONB,
    cases_by_type JSONB,
    recent_activity_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT count(*) FROM suspects) AS total_suspects,
        (SELECT count(*) FROM cases WHERE status IN ('OPEN', 'UNDER_INVESTIGATION', 'TRIAL')) AS active_cases,
        (SELECT count(*) FROM firs) AS total_firs,
        (SELECT count(*) FROM match_results) AS total_matches,
        (SELECT COALESCE(AVG(similarity_score), 0) FROM match_results) AS avg_match_accuracy,
        (SELECT jsonb_object_agg(status_count.lifecycle_status, status_count.count)
         FROM (SELECT lifecycle_status, count(*) FROM suspects GROUP BY lifecycle_status) status_count) AS suspects_by_status,
        (SELECT jsonb_object_agg(type_count.crime_type, type_count.count)
         FROM (SELECT crime_type, count(*) FROM cases GROUP BY crime_type) type_count) AS cases_by_type,
        (SELECT count(*) FROM audit_log WHERE created_at > now() - interval '7 days') AS recent_activity_count;
END;
$$;
