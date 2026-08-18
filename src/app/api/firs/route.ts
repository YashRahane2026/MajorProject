import { NextResponse } from 'next/server';

const demoFirs = [
  { id: '1', fir_number: 'FIR/2024/1001', case_id: '1', complainant_name: 'Ramesh Deshmukh', crime_type: 'robbery', incident_date: '2024-08-10T02:30:00Z', incident_location: 'Sitabuldi Main Road, Nagpur', police_station: 'Sitabuldi PS', status: 'UNDER_INVESTIGATION', narrative_text: 'At approximately 0230 hours, three unidentified males entered the Shree Jewellers establishment on Sitabuldi Main Road through the rear entrance. The suspects used forged security credentials to bypass the alarm system. Estimated loss of gold ornaments valued at Rs. 45 lakhs.' },
  { id: '2', fir_number: 'FIR/2024/1002', case_id: '2', complainant_name: 'Priya Mehta', crime_type: 'cyber_fraud', incident_date: '2024-07-28T11:00:00Z', incident_location: 'Online/Digital', police_station: 'Cyber Crime PS, Mumbai', status: 'REGISTERED', narrative_text: 'Complainant received a phishing SMS purporting to be from SBI Bank requesting KYC update. Upon clicking the link and entering OTP, Rs. 2.8 lakhs were debited from her savings account via multiple UPI transactions to unknown beneficiaries.' },
  { id: '3', fir_number: 'FIR/2024/1003', case_id: '3', complainant_name: 'ASI Mohan Patil', crime_type: 'narcotics', incident_date: '2024-06-15T23:45:00Z', incident_location: 'NH-48, Lonavala Bypass', police_station: 'Lonavala PS', status: 'CHARGE_SHEETED', narrative_text: 'During routine highway checkpoint operations at NH-48 near Lonavala, officers intercepted a commercial vehicle (MH-12-XX-4567). Search revealed 15kg of suspected methamphetamine concealed in modified fuel tank compartments. Driver attempted to flee on foot but was apprehended 200m from the checkpoint.' },
];

export async function GET() {
  return NextResponse.json({ data: demoFirs, count: demoFirs.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newFir = {
    id: crypto.randomUUID(),
    fir_number: `FIR/2024/${Math.floor(1000 + Math.random() * 1000)}`,
    ...body,
    status: 'REGISTERED',
    created_at: new Date().toISOString(),
  };
  return NextResponse.json({ data: newFir }, { status: 201 });
}
