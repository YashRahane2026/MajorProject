import { NextResponse } from 'next/server';

const demoAuditLog = [
  { id: '1', user_id: 'admin-1', user_name: 'Admin User', user_role: 'admin', action: 'LOGIN', resource_type: 'user', resource_id: 'admin-1', metadata: { ip: '192.168.1.100' }, created_at: '2024-08-18T10:00:00Z' },
  { id: '2', user_id: 'police-1', user_name: 'SI Mohan Patil', user_role: 'police', action: 'FACE_MATCH', resource_type: 'face_embedding', resource_id: 'emb-001', metadata: { threshold: 0.70, results: 5 }, created_at: '2024-08-18T10:15:00Z' },
  { id: '3', user_id: 'police-1', user_name: 'SI Mohan Patil', user_role: 'police', action: 'CREATE', resource_type: 'suspect', resource_id: 'sus-001', metadata: { suspect_name: 'Rajesh Kumar' }, created_at: '2024-08-18T10:30:00Z' },
  { id: '4', user_id: 'police-2', user_name: 'Inspector Priya Shah', user_role: 'police', action: 'FIR_MATCH', resource_type: 'fir_embedding', resource_id: 'emb-002', metadata: { threshold: 0.60, results: 3 }, created_at: '2024-08-18T11:00:00Z' },
  { id: '5', user_id: 'court-1', user_name: 'Magistrate R. Sharma', user_role: 'court', action: 'UPDATE', resource_type: 'suspect', resource_id: 'sus-001', metadata: { field: 'lifecycle_status', from: 'REMAND', to: 'TRIAL' }, created_at: '2024-08-18T11:30:00Z' },
  { id: '6', user_id: 'admin-1', user_name: 'Admin User', user_role: 'admin', action: 'EXPORT', resource_type: 'report', resource_id: null, metadata: { format: 'PDF', report_type: 'monthly_summary' }, created_at: '2024-08-18T12:00:00Z' },
  { id: '7', user_id: 'police-1', user_name: 'SI Mohan Patil', user_role: 'police', action: 'CREATE', resource_type: 'fir', resource_id: 'fir-001', metadata: { fir_number: 'FIR/2024/1001' }, created_at: '2024-08-18T12:30:00Z' },
  { id: '8', user_id: 'custodial-1', user_name: 'Warden K. Deshmukh', user_role: 'custodial_staff', action: 'UPDATE', resource_type: 'suspect', resource_id: 'sus-002', metadata: { field: 'lifecycle_status', from: 'CONVICTED', to: 'CUSTODY' }, created_at: '2024-08-18T13:00:00Z' },
  { id: '9', user_id: 'police-2', user_name: 'Inspector Priya Shah', user_role: 'police', action: 'FACE_MATCH', resource_type: 'face_embedding', resource_id: 'emb-003', metadata: { threshold: 0.75, results: 2 }, created_at: '2024-08-18T13:30:00Z' },
  { id: '10', user_id: 'admin-1', user_name: 'Admin User', user_role: 'admin', action: 'DELETE', resource_type: 'match_result', resource_id: 'match-old-001', metadata: { reason: 'false_positive' }, created_at: '2024-08-18T14:00:00Z' },
];

export async function GET() {
  return NextResponse.json({ data: demoAuditLog, count: demoAuditLog.length });
}
