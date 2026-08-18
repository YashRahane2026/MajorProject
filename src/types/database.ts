// Supabase Database Types
// Auto-generated types matching the PostgreSQL schema

export type UserRole = 'admin' | 'police' | 'court' | 'custodial_staff';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';

export type ThreatLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type LifecycleStatus =
  | 'ARRESTED'
  | 'REMAND'
  | 'BAIL'
  | 'TRIAL'
  | 'CONVICTED'
  | 'CUSTODY'
  | 'RELEASED'
  | 'ABSCONDING'
  | 'DECEASED';

export type CaseStatus =
  | 'OPEN'
  | 'UNDER_INVESTIGATION'
  | 'CHARGE_SHEETED'
  | 'TRIAL'
  | 'CLOSED'
  | 'COLD';

export type CrimeType =
  | 'theft'
  | 'cyber_fraud'
  | 'assault'
  | 'narcotics'
  | 'forgery'
  | 'robbery'
  | 'murder'
  | 'kidnapping'
  | 'extortion'
  | 'arson'
  | 'other';

export type FIRStatus =
  | 'REGISTERED'
  | 'UNDER_INVESTIGATION'
  | 'CHARGE_SHEETED'
  | 'CLOSED'
  | 'TRANSFERRED';

export type SuspectRole =
  | 'PRIMARY_SUSPECT'
  | 'ACCOMPLICE'
  | 'WITNESS'
  | 'PERSON_OF_INTEREST';

export type AuditAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'FACE_MATCH'
  | 'FIR_MATCH'
  | 'LOGIN'
  | 'EXPORT';

export type SourceType = 'MUGSHOT' | 'CCTV_FRAME' | 'ID_CARD' | 'SURVEILLANCE' | 'UPLOADED';

// ==================== Database Row Types ====================

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  badge_number: string | null;
  department: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Suspect {
  id: string;
  first_name: string;
  last_name: string;
  alias: string | null;
  date_of_birth: string | null;
  gender: Gender;
  nationality: string;
  id_type: string | null;
  id_number: string | null;
  physical_description: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  distinguishing_marks: string | null;
  threat_level: ThreatLevel;
  lifecycle_status: LifecycleStatus;
  last_known_address: string | null;
  last_known_city: string | null;
  last_known_state: string | null;
  primary_photo_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  case_number: string;
  title: string;
  description: string | null;
  crime_type: CrimeType;
  severity: ThreatLevel;
  status: CaseStatus;
  jurisdiction: string | null;
  investigating_officer: string | null;
  incident_date: string | null;
  incident_location: string | null;
  created_at: string;
  updated_at: string;
}

export interface FIR {
  id: string;
  fir_number: string;
  case_id: string | null;
  complainant_name: string;
  complainant_contact: string | null;
  incident_date: string;
  incident_location: string;
  narrative_text: string;
  mo_description: string | null;
  crime_type: CrimeType | null;
  status: FIRStatus;
  filed_by: string | null;
  police_station: string | null;
  created_at: string;
  updated_at: string;
}

export interface FaceEmbedding {
  id: string;
  suspect_id: string;
  photo_url: string;
  source_type: SourceType;
  embedding: number[];
  model_version: string;
  confidence_score: number;
  created_at: string;
}

export interface FIREmbedding {
  id: string;
  fir_id: string;
  embedding: number[];
  model_version: string;
  created_at: string;
}

export interface MatchResult {
  id: string;
  query_type: 'FACE' | 'FIR';
  query_entity_id: string;
  matched_entity_id: string;
  similarity_score: number;
  threshold_used: number;
  is_confirmed: boolean;
  confirmed_by: string | null;
  confirmed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface LifecycleEvent {
  id: string;
  suspect_id: string;
  from_status: LifecycleStatus | null;
  to_status: LifecycleStatus;
  event_date: string;
  location: string | null;
  court_name: string | null;
  order_number: string | null;
  notes: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: AuditAction;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface SuspectCase {
  id: string;
  suspect_id: string;
  case_id: string;
  role: SuspectRole;
  added_at: string;
}

// ==================== API Response Types ====================

export interface FaceMatchResult {
  id: string;
  suspect_id: string;
  suspect_name: string;
  photo_url: string;
  similarity: number;
  threat_level: ThreatLevel;
  lifecycle_status: LifecycleStatus;
}

export interface FIRMatchResult {
  id: string;
  fir_id: string;
  fir_number: string;
  case_id: string | null;
  case_number: string | null;
  similarity: number;
  crime_type: CrimeType | null;
  mo_description: string | null;
  incident_date: string;
}

export interface DashboardStats {
  total_suspects: number;
  active_cases: number;
  total_firs: number;
  total_matches: number;
  avg_match_accuracy: number;
  suspects_by_status: Record<LifecycleStatus, number>;
  cases_by_type: Record<CrimeType, number>;
  recent_activity_count: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  group: 'SUSPECT' | 'CASE' | 'FIR';
  val: number;
  threat_level?: ThreatLevel;
  photo_url?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  similarity: number;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  links: NetworkLink[];
}
