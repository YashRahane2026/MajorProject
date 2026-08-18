import { NextResponse } from 'next/server';

// Demo suspects data for Phase 1
const demoSuspects = [
  { id: '1', first_name: 'Rajesh', last_name: 'Kumar', alias: 'Raju', threat_level: 'CRITICAL', lifecycle_status: 'ARRESTED', last_known_city: 'Nagpur', gender: 'MALE', created_at: '2024-08-15T10:30:00Z' },
  { id: '2', first_name: 'Amit', last_name: 'Sharma', alias: 'Chotu', threat_level: 'HIGH', lifecycle_status: 'REMAND', last_known_city: 'Mumbai', gender: 'MALE', created_at: '2024-07-20T14:15:00Z' },
  { id: '3', first_name: 'Vikram', last_name: 'Singh', alias: null, threat_level: 'MEDIUM', lifecycle_status: 'TRIAL', last_known_city: 'Delhi', gender: 'MALE', created_at: '2024-06-10T09:00:00Z' },
  { id: '4', first_name: 'Sunil', last_name: 'Verma', alias: 'Pappu', threat_level: 'HIGH', lifecycle_status: 'CUSTODY', last_known_city: 'Pune', gender: 'MALE', created_at: '2024-05-22T16:45:00Z' },
  { id: '5', first_name: 'Deepak', last_name: 'Patel', alias: null, threat_level: 'LOW', lifecycle_status: 'RELEASED', last_known_city: 'Hyderabad', gender: 'MALE', created_at: '2024-04-18T11:20:00Z' },
];

export async function GET() {
  return NextResponse.json({ data: demoSuspects, count: demoSuspects.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newSuspect = {
    id: crypto.randomUUID(),
    ...body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return NextResponse.json({ data: newSuspect }, { status: 201 });
}
