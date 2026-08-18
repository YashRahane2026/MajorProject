import { NextResponse } from 'next/server';

const demoCases = [
  { id: '1', case_number: 'CR/2024/5001', title: 'Armed Robbery at Sitabuldi Jewelry Store', crime_type: 'robbery', severity: 'CRITICAL', status: 'UNDER_INVESTIGATION', jurisdiction: 'Nagpur Central', incident_date: '2024-08-10' },
  { id: '2', case_number: 'CR/2024/5002', title: 'Cyber Fraud Ring - UPI Phishing Scam', crime_type: 'cyber_fraud', severity: 'HIGH', status: 'OPEN', jurisdiction: 'Mumbai Cyber Cell', incident_date: '2024-07-28' },
  { id: '3', case_number: 'CR/2024/5003', title: 'Narcotics Seizure - Highway Checkpoint', crime_type: 'narcotics', severity: 'HIGH', status: 'CHARGE_SHEETED', jurisdiction: 'Pune Rural', incident_date: '2024-06-15' },
  { id: '4', case_number: 'CR/2024/5004', title: 'Forgery of Government Documents', crime_type: 'forgery', severity: 'MEDIUM', status: 'TRIAL', jurisdiction: 'Delhi NCR', incident_date: '2024-05-20' },
  { id: '5', case_number: 'CR/2024/5005', title: 'Assault at Railway Station', crime_type: 'assault', severity: 'MEDIUM', status: 'CLOSED', jurisdiction: 'Hyderabad Central', incident_date: '2024-04-12' },
];

export async function GET() {
  return NextResponse.json({ data: demoCases, count: demoCases.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newCase = {
    id: crypto.randomUUID(),
    case_number: `CR/2024/${Math.floor(5000 + Math.random() * 1000)}`,
    ...body,
    created_at: new Date().toISOString(),
  };
  return NextResponse.json({ data: newCase }, { status: 201 });
}
