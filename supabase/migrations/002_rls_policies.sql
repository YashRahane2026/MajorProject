-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE firs ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspect_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fir_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifecycle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ADMIN: Full CRUD on everything
CREATE POLICY "Admin full access users" ON users FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin full access suspects" ON suspects FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin full access cases" ON cases FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin full access firs" ON firs FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin full access suspect_cases" ON suspect_cases FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin full access face_embeddings" ON face_embeddings FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin full access fir_embeddings" ON fir_embeddings FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin full access match_results" ON match_results FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin full access lifecycle_events" ON lifecycle_events FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin full access audit_log" ON audit_log FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- POLICE: Full CRUD on suspects, cases, firs, embeddings, match_results, suspect_cases
CREATE POLICY "Police full access suspects" ON suspects FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');
CREATE POLICY "Police full access cases" ON cases FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');
CREATE POLICY "Police full access firs" ON firs FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');
CREATE POLICY "Police full access suspect_cases" ON suspect_cases FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');
CREATE POLICY "Police full access face_embeddings" ON face_embeddings FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');
CREATE POLICY "Police full access fir_embeddings" ON fir_embeddings FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');
CREATE POLICY "Police full access match_results" ON match_results FOR ALL TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');

-- Police: read lifecycle_events
CREATE POLICY "Police read lifecycle_events" ON lifecycle_events FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');

-- Police: create and read audit_log entries
CREATE POLICY "Police create audit_log" ON audit_log FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');
CREATE POLICY "Police read audit_log" ON audit_log FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'police');

-- COURT: Read suspects, cases, firs, suspect_cases
CREATE POLICY "Court read suspects" ON suspects FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'court');
CREATE POLICY "Court read cases" ON cases FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'court');
CREATE POLICY "Court read firs" ON firs FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'court');
CREATE POLICY "Court read suspect_cases" ON suspect_cases FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'court');

-- Court: update suspects lifecycle_status
CREATE POLICY "Court update suspects" ON suspects FOR UPDATE TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'court');

-- Court: read match_results
CREATE POLICY "Court read match_results" ON match_results FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'court');

-- Court: create and read lifecycle_events
CREATE POLICY "Court create lifecycle_events" ON lifecycle_events FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'court');
CREATE POLICY "Court read lifecycle_events" ON lifecycle_events FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'court');

-- CUSTODIAL STAFF: Read suspects (filtered to CUSTODY status)
CREATE POLICY "Custodial read suspects in custody" ON suspects FOR SELECT TO authenticated USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'custodial_staff' AND lifecycle_status = 'CUSTODY'
);

-- Custodial: update suspects lifecycle_status
CREATE POLICY "Custodial update suspects" ON suspects FOR UPDATE TO authenticated USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'custodial_staff' AND lifecycle_status = 'CUSTODY'
);

-- Custodial: create and read lifecycle_events
CREATE POLICY "Custodial create lifecycle_events" ON lifecycle_events FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'custodial_staff');
CREATE POLICY "Custodial read lifecycle_events" ON lifecycle_events FOR SELECT TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'custodial_staff');

-- USERS: Read own user profile
CREATE POLICY "Users read own profile" ON users FOR SELECT TO authenticated USING (id = auth.uid());

-- AUDIT LOG: insert by all authenticated
CREATE POLICY "All authenticated create audit_log" ON audit_log FOR INSERT TO authenticated WITH CHECK (true);
