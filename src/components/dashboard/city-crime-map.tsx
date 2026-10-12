'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  Sliders, 
  Activity, 
  Layers, 
  Eye, 
  Radio, 
  Calendar,
  Building,
  Car,
  DollarSign,
  AlertOctagon,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type CrimeTypeKey = 
  | 'all' 
  | 'theft' 
  | 'assault' 
  | 'fraud' 
  | 'robbery' 
  | 'narcotics' 
  | 'vehicle';

interface HotspotZone {
  id: string;
  name: string;
  policeStation: string;
  x: number; // percentage coordinate 0-100
  y: number;
  count: number;
  changePct: number; // e.g. +28 means +28% increase
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'STABLE';
  dominantMO: string;
  patrolRecommendation: string;
}

const CRIME_TYPE_OPTIONS: { id: CrimeTypeKey; label: string; icon: any; color: string }[] = [
  { id: 'all', label: 'All Crimes (Combined Hotspots)', icon: Activity, color: 'text-blue-400' },
  { id: 'theft', label: 'Theft & Burglary (BNS 303 / IPC 379)', icon: DollarSign, color: 'text-amber-400' },
  { id: 'assault', label: 'Assault & Violent Crimes (IPC 324/326)', icon: AlertOctagon, color: 'text-rose-400' },
  { id: 'fraud', label: 'Cyber Fraud & Phishing (IT Act 66D)', icon: Radio, color: 'text-cyan-400' },
  { id: 'robbery', label: 'Armed Robbery & Dacoity (IPC 392/395)', icon: ShieldAlert, color: 'text-red-400' },
  { id: 'narcotics', label: 'Narcotics & Contraband (NDPS Act)', icon: AlertTriangle, color: 'text-purple-400' },
  { id: 'vehicle', label: 'Vehicle Theft & Smuggling Ring', icon: Car, color: 'text-emerald-400' },
];

const ZONE_DATA_BY_CRIME: Record<CrimeTypeKey, HotspotZone[]> = {
  all: [
    {
      id: 'sitabuldi',
      name: 'Sitabuldi Central',
      policeStation: 'Sitabuldi PS, Nagpur',
      x: 48,
      y: 50,
      count: 78,
      changePct: 28,
      severity: 'CRITICAL',
      dominantMO: 'Commercial break-ins & peak-hour electronics snatching',
      patrolRecommendation: 'Deploy 2 night vans along Variety Chowk & Subhash Road (22:00–04:00)'
    },
    {
      id: 'sadar',
      name: 'Sadar & Civil Lines',
      policeStation: 'Sadar PS, Nagpur',
      x: 52,
      y: 34,
      count: 62,
      changePct: 34,
      severity: 'CRITICAL',
      dominantMO: 'Banking credential smishing & corporate identity fraud',
      patrolRecommendation: 'Cyber Cell alert & daily inspection of commercial ATMs'
    },
    {
      id: 'dharampeth',
      name: 'Dharampeth & Law College',
      policeStation: 'Ambazari PS, Nagpur',
      x: 32,
      y: 46,
      count: 45,
      changePct: 14,
      severity: 'HIGH',
      dominantMO: 'High-end jewelry showroom snatching & credit fraud',
      patrolRecommendation: 'Foot patrols at West High Court Road during retail rush (17:00–21:00)'
    },
    {
      id: 'dhantoli',
      name: 'Dhantoli & Medical Sq',
      policeStation: 'Dhantoli PS, Nagpur',
      x: 50,
      y: 65,
      count: 49,
      changePct: 19,
      severity: 'HIGH',
      dominantMO: 'Hospital corridor two-wheeler theft & unattended baggage theft',
      patrolRecommendation: 'Parking barrier checkpoints around Medical College corridor'
    },
    {
      id: 'pachpaoli',
      name: 'Pachpaoli & Railway Terminus',
      policeStation: 'Pachpaoli PS, Nagpur',
      x: 65,
      y: 38,
      count: 68,
      changePct: 38,
      severity: 'CRITICAL',
      dominantMO: 'Nighttime train platform theft & weapon brandishing',
      patrolRecommendation: 'Joint GRP-Nagpur Police barricade at Golibar Chowk'
    },
    {
      id: 'lakadganj',
      name: 'Lakadganj & Itwari Trade',
      policeStation: 'Lakadganj PS, Nagpur',
      x: 74,
      y: 48,
      count: 58,
      changePct: 22,
      severity: 'CRITICAL',
      dominantMO: 'Wholesale bullion cash intercept & strongroom tampering',
      patrolRecommendation: 'CCTV surveillance sweep along Sarafa Bazaar & Timber Market'
    },
    {
      id: 'midc_hingna',
      name: 'MIDC Hingna Industrial',
      policeStation: 'MIDC PS, Nagpur',
      x: 18,
      y: 74,
      count: 41,
      changePct: 31,
      severity: 'CRITICAL',
      dominantMO: 'Factory inventory theft & synthetic narcotic drop-offs',
      patrolRecommendation: 'Night vehicular checkpoints at Hingna T-Point'
    },
    {
      id: 'jaripatka',
      name: 'Jaripatka Ring',
      policeStation: 'Jaripatka PS, Nagpur',
      x: 56,
      y: 20,
      count: 36,
      changePct: 11,
      severity: 'MODERATE',
      dominantMO: 'Residential lock-picking & neighborhood scuffles',
      patrolRecommendation: 'Beat marshals active on Dayanand Park road'
    },
    {
      id: 'nandanvan',
      name: 'Nandanvan & Hasanbagh',
      policeStation: 'Nandanvan PS, Nagpur',
      x: 76,
      y: 68,
      count: 44,
      changePct: 16,
      severity: 'HIGH',
      dominantMO: 'Unlicensed weapon supply & contraband transit',
      patrolRecommendation: 'Random breathalyzer and trunk inspections along Great Nag Rd'
    },
    {
      id: 'sonegaon',
      name: 'Sonegaon & Airport Rd',
      policeStation: 'Sonegaon PS, Nagpur',
      x: 38,
      y: 82,
      count: 33,
      changePct: -6,
      severity: 'STABLE',
      dominantMO: 'Highway transit theft & speeding violations',
      patrolRecommendation: 'Highway safety interceptor patrol active'
    },
    {
      id: 'koradi',
      name: 'Koradi Highway Corridor',
      policeStation: 'Koradi PS, Nagpur',
      x: 68,
      y: 15,
      count: 27,
      changePct: 8,
      severity: 'MODERATE',
      dominantMO: 'Heavy truck fuel siphoning & scrap metal theft',
      patrolRecommendation: 'Highway patrol vehicle on Kamptee-Koradi bypass'
    }
  ],

  theft: [
    {
      id: 'sitabuldi',
      name: 'Sitabuldi Market',
      policeStation: 'Sitabuldi PS, Nagpur',
      x: 48,
      y: 50,
      count: 54,
      changePct: 32,
      severity: 'CRITICAL',
      dominantMO: 'Shoplifting & shutter padlock shearing with bolt-cutters',
      patrolRecommendation: 'Night foot patrol along Main Market & Variety Sq (23:00–04:00)'
    },
    {
      id: 'lakadganj',
      name: 'Itwari Wholesale',
      policeStation: 'Lakadganj PS, Nagpur',
      x: 74,
      y: 48,
      count: 46,
      changePct: 24,
      severity: 'HIGH',
      dominantMO: 'Goods transport vehicle theft & godown break-ins',
      patrolRecommendation: 'Warehouse guard registry verification'
    },
    {
      id: 'pachpaoli',
      name: 'Pachpaoli Station',
      policeStation: 'Pachpaoli PS, Nagpur',
      x: 65,
      y: 38,
      count: 39,
      changePct: 18,
      severity: 'HIGH',
      dominantMO: 'Luggage snatching & mobile phone pocket picking',
      patrolRecommendation: 'Plainclothes spotters at circulating area'
    },
    {
      id: 'dharampeth',
      name: 'Dharampeth Shopping',
      policeStation: 'Ambazari PS, Nagpur',
      x: 32,
      y: 46,
      count: 28,
      changePct: 9,
      severity: 'MODERATE',
      dominantMO: 'Boutique clothing and cosmetics shoplifting',
      patrolRecommendation: 'Shopkeepers association CCTV integration'
    },
    {
      id: 'dhantoli',
      name: 'Dhantoli Clinics',
      policeStation: 'Dhantoli PS, Nagpur',
      x: 50,
      y: 65,
      count: 22,
      changePct: -4,
      severity: 'STABLE',
      dominantMO: 'Waiting lounge purse thefts',
      patrolRecommendation: 'Hospital security coordinator briefing'
    }
  ],

  assault: [
    {
      id: 'pachpaoli',
      name: 'Pachpaoli & Hansapuri',
      policeStation: 'Pachpaoli PS, Nagpur',
      x: 65,
      y: 38,
      count: 36,
      changePct: 29,
      severity: 'CRITICAL',
      dominantMO: 'Sharp weapons brandishing during late-night gambling scuffles',
      patrolRecommendation: 'Emergency response van positioned at Golibar Chowk'
    },
    {
      id: 'jaripatka',
      name: 'Jaripatka Colony',
      policeStation: 'Jaripatka PS, Nagpur',
      x: 56,
      y: 20,
      count: 26,
      changePct: 21,
      severity: 'HIGH',
      dominantMO: 'Neighbor territorial clashes & extortive threats',
      patrolRecommendation: 'Community policing liaison meetings & beat rounds'
    },
    {
      id: 'nandanvan',
      name: 'Hasanbagh Slums',
      policeStation: 'Nandanvan PS, Nagpur',
      x: 76,
      y: 68,
      count: 24,
      changePct: 15,
      severity: 'HIGH',
      dominantMO: 'Street group brawls using iron rods & clubs',
      patrolRecommendation: 'Special preventive detention under MPDA'
    },
    {
      id: 'sitabuldi',
      name: 'Sitabuldi Station Rd',
      policeStation: 'Sitabuldi PS, Nagpur',
      x: 48,
      y: 50,
      count: 18,
      changePct: 4,
      severity: 'MODERATE',
      dominantMO: 'Auto-rickshaw driver turf altercations',
      patrolRecommendation: 'Prepaid auto booth policing'
    }
  ],

  fraud: [
    {
      id: 'sadar',
      name: 'Sadar Financial Core',
      policeStation: 'Sadar PS, Nagpur',
      x: 52,
      y: 34,
      count: 58,
      changePct: 45,
      severity: 'CRITICAL',
      dominantMO: 'Digital arrest imposter calls & stock investment Ponzi schemes',
      patrolRecommendation: 'Priority cyber FIR logging & beneficiary account freezing'
    },
    {
      id: 'dharampeth',
      name: 'Dharampeth IT Hub',
      policeStation: 'Ambazari PS, Nagpur',
      x: 32,
      y: 46,
      count: 42,
      changePct: 33,
      severity: 'CRITICAL',
      dominantMO: 'Part-time telegram job scam & credit card OTP hijacking',
      patrolRecommendation: 'Bank liaison desk monitoring'
    },
    {
      id: 'midc_hingna',
      name: 'Hingna IT Park',
      policeStation: 'MIDC PS, Nagpur',
      x: 18,
      y: 74,
      count: 31,
      changePct: 26,
      severity: 'HIGH',
      dominantMO: 'Fake call center tech support refund phishing',
      patrolRecommendation: 'Premise raids on unlisted commercial BPOs'
    },
    {
      id: 'sitabuldi',
      name: 'Sitabuldi Banks',
      policeStation: 'Sitabuldi PS, Nagpur',
      x: 48,
      y: 50,
      count: 27,
      changePct: 12,
      severity: 'MODERATE',
      dominantMO: 'ATM skimming device placement',
      patrolRecommendation: 'Surprise physical audit of standalone ATM kiosks'
    }
  ],

  robbery: [
    {
      id: 'lakadganj',
      name: 'Sarafa Bullion Market',
      policeStation: 'Lakadganj PS, Nagpur',
      x: 74,
      y: 48,
      count: 38,
      changePct: 41,
      severity: 'CRITICAL',
      dominantMO: 'Armed jewelry showroom hold-ups with sledgehammers & firearms',
      patrolRecommendation: 'Armed escort for bulk gold transit & panic button checks'
    },
    {
      id: 'sitabuldi',
      name: 'Sitabuldi Central Hub',
      policeStation: 'Sitabuldi PS, Nagpur',
      x: 48,
      y: 50,
      count: 29,
      changePct: 26,
      severity: 'CRITICAL',
      dominantMO: 'Daytime cash delivery van ambush using pepper spray',
      patrolRecommendation: 'Cash transit vehicle SOP compliance inspection'
    },
    {
      id: 'midc_hingna',
      name: 'Hingna Warehouse Belt',
      policeStation: 'MIDC PS, Nagpur',
      x: 18,
      y: 74,
      count: 21,
      changePct: 18,
      severity: 'HIGH',
      dominantMO: 'Watchman tying & electronics container hijack',
      patrolRecommendation: 'Industrial association guard patrol integration'
    },
    {
      id: 'nandanvan',
      name: 'Great Nag Road',
      policeStation: 'Nandanvan PS, Nagpur',
      x: 76,
      y: 68,
      count: 17,
      changePct: 6,
      severity: 'MODERATE',
      dominantMO: 'Late night highway motorist knife-point extortion',
      patrolRecommendation: 'High-mast lighting maintenance & static patrol picket'
    }
  ],

  narcotics: [
    {
      id: 'midc_hingna',
      name: 'Hingna Industrial Fringe',
      policeStation: 'MIDC PS, Nagpur',
      x: 18,
      y: 74,
      count: 44,
      changePct: 56,
      severity: 'CRITICAL',
      dominantMO: 'Chemical precursor diversion & synthetic MDMA distribution',
      patrolRecommendation: 'ANC (Anti-Narcotics Cell) chemical inventory audits'
    },
    {
      id: 'nandanvan',
      name: 'Nandanvan Highway',
      policeStation: 'Nandanvan PS, Nagpur',
      x: 76,
      y: 68,
      count: 39,
      changePct: 37,
      severity: 'CRITICAL',
      dominantMO: 'Odisha ganja consignment transit via interstate trucks',
      patrolRecommendation: 'K9 sniffer dog teams at border octroi points'
    },
    {
      id: 'pachpaoli',
      name: 'Railway Yards Pachpaoli',
      policeStation: 'Pachpaoli PS, Nagpur',
      x: 65,
      y: 38,
      count: 28,
      changePct: 22,
      severity: 'HIGH',
      dominantMO: 'Peddling of commercial cough syrups & alprazolam strips',
      patrolRecommendation: 'Joint FDA-Police chemist shop audits'
    },
    {
      id: 'koradi',
      name: 'Koradi Bypass',
      policeStation: 'Koradi PS, Nagpur',
      x: 68,
      y: 15,
      count: 23,
      changePct: 14,
      severity: 'MODERATE',
      dominantMO: 'Truck driver dhabas serving unrefined contraband',
      patrolRecommendation: 'Surprise night raids on highway dhabas'
    }
  ],

  vehicle: [
    {
      id: 'pachpaoli',
      name: 'Nagpur Central Station',
      policeStation: 'Pachpaoli PS, Nagpur',
      x: 65,
      y: 38,
      count: 59,
      changePct: 44,
      severity: 'CRITICAL',
      dominantMO: 'Master key ignition bypass on parked two-wheelers',
      patrolRecommendation: 'ANPR (Automatic Number Plate Recognition) camera tracking'
    },
    {
      id: 'sonegaon',
      name: 'Wardha Rd Metro & Airport',
      policeStation: 'Sonegaon PS, Nagpur',
      x: 38,
      y: 82,
      count: 48,
      changePct: 35,
      severity: 'CRITICAL',
      dominantMO: 'SUV theft using electronic OBD port scanners',
      patrolRecommendation: 'CCTV sensor grid at airport long-term parking'
    },
    {
      id: 'dhantoli',
      name: 'Medical Hospital Parking',
      policeStation: 'Dhantoli PS, Nagpur',
      x: 50,
      y: 65,
      count: 41,
      changePct: 27,
      severity: 'HIGH',
      dominantMO: 'Motorcycle lifting during emergency hospital admissions',
      patrolRecommendation: 'Token-based gated entry for two-wheelers'
    },
    {
      id: 'sitabuldi',
      name: 'Sitabuldi Multi-Level',
      policeStation: 'Sitabuldi PS, Nagpur',
      x: 48,
      y: 50,
      count: 36,
      changePct: 16,
      severity: 'HIGH',
      dominantMO: 'Unlocked scooter helmet & storage compartment tampering',
      patrolRecommendation: 'Security guard rounds at commercial complexes'
    },
    {
      id: 'sadar',
      name: 'Residency Road',
      policeStation: 'Sadar PS, Nagpur',
      x: 52,
      y: 34,
      count: 24,
      changePct: -3,
      severity: 'STABLE',
      dominantMO: 'Vintage automobile part strip-down',
      patrolRecommendation: 'Patrol beat verification'
    }
  ]
};

// 12-Month Historical Incident Data for Trend Graph
const MONTHLY_TREND_DATA: Record<CrimeTypeKey, number[]> = {
  all: [142, 138, 155, 168, 162, 179, 188, 194, 210, 224, 238, 252],
  theft: [45, 42, 48, 52, 50, 56, 59, 63, 68, 72, 79, 84],
  assault: [28, 25, 29, 31, 30, 34, 32, 35, 39, 41, 44, 46],
  fraud: [32, 36, 41, 48, 52, 59, 64, 71, 80, 88, 97, 108],
  robbery: [12, 14, 13, 16, 18, 17, 21, 23, 26, 28, 32, 35],
  narcotics: [15, 18, 20, 22, 25, 29, 31, 35, 38, 44, 49, 54],
  vehicle: [38, 35, 40, 44, 42, 49, 52, 55, 60, 65, 71, 76]
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CityCrimeMap() {
  const [selectedCrime, setSelectedCrime] = useState<CrimeTypeKey>('all');
  const [activeTab, setActiveTab] = useState<'map' | 'trends'>('map');
  const [selectedZone, setSelectedZone] = useState<HotspotZone | null>(null);

  const zones = ZONE_DATA_BY_CRIME[selectedCrime] || ZONE_DATA_BY_CRIME.all;
  const trendPoints = MONTHLY_TREND_DATA[selectedCrime] || MONTHLY_TREND_DATA.all;
  const maxTrend = Math.max(...trendPoints) * 1.15;

  const currentOption = CRIME_TYPE_OPTIONS.find(c => c.id === selectedCrime) || CRIME_TYPE_OPTIONS[0];

  const criticalCount = zones.filter(z => z.severity === 'CRITICAL').length;
  const totalIncidents = zones.reduce((sum, z) => sum + z.count, 0);
  const highestSurgeZone = [...zones].sort((a, b) => b.changePct - a.changePct)[0];

  return (
    <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl overflow-hidden shadow-xl">
      
      {/* Top Card Header */}
      <div className="p-5 border-b border-[hsl(217,33%,17%)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Nagpur Police GIS: Crime Hotspots &amp; Trends</span>
            </h2>
            <span className="text-[11px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono font-medium">
              Metropolitan Jurisdiction
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial incident cluster bubbles with algorithmic YoY growth velocity tracking.
          </p>
        </div>

        {/* Action Controls: Tabs & Crime Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('map')}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'map' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Hotspot Map</span>
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5",
                activeTab === 'trends' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>12-Mo Trend</span>
            </button>
          </div>

          {/* Crime Category Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedCrime}
              onChange={(e) => {
                setSelectedCrime(e.target.value as CrimeTypeKey);
                setSelectedZone(null);
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
            >
              {CRIME_TYPE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Quick Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950/70 border-b border-[hsl(217,33%,17%)] text-xs font-mono">
        <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-400">Active Hotspots:</span>
          <span className="text-white font-bold">{zones.length} Zones</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-400">Recorded Incidents:</span>
          <span className="text-blue-400 font-bold">{totalIncidents} Total</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-400">Surge Zones:</span>
          <span className="text-red-400 font-bold">{criticalCount} High Alerts</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-400">Fastest Growth:</span>
          <span className="text-amber-400 font-bold truncate max-w-[95px]" title={highestSurgeZone?.name}>
            {highestSurgeZone?.name || 'Sitabuldi'} (+{highestSurgeZone?.changePct}%)
          </span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-4 sm:p-6">
        
        {/* TAB 1: GEOSPATIAL MAP VIEW */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            
            {/* Vector Schematic Map Canvas */}
            <div className="relative w-full h-[400px] sm:h-[450px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner select-none">
              
              {/* Background Grid & Blueprint Waterways/Roads */}
              <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="nagpur-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#nagpur-grid)" />
                
                {/* Major Nagpur Arterial Roads / Highway Network */}
                {/* NH-44 North-South (Kamptee -> Wardha Rd) */}
                <path d="M 68% 5% Q 55% 45% 38% 95%" stroke="#334155" strokeWidth="3" fill="none" strokeDasharray="6 3" />
                {/* NH-53 East-West (Amravati -> Bhandara Rd) */}
                <path d="M 5% 55% Q 50% 50% 95% 48%" stroke="#334155" strokeWidth="3" fill="none" strokeDasharray="6 3" />
                {/* Ring Road Loop */}
                <circle cx="50%" cy="50%" r="36%" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeDasharray="4 4" />
                {/* Ambazari Lake Contour */}
                <ellipse cx="28%" cy="58%" rx="5%" ry="3%" fill="#0284c7" opacity="0.18" />
                {/* Futala Lake Contour */}
                <ellipse cx="30%" cy="40%" rx="4%" ry="2.5%" fill="#0284c7" opacity="0.18" />
              </svg>

              {/* Geographical Watermarks & Landmarks */}
              <div className="absolute top-3 left-4 text-[10px] text-slate-500 font-mono flex items-center gap-1 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-cyan-500/40" />
                <span>Nagpur Metropolitan Area — Scale: 1:50,000</span>
              </div>
              <div className="absolute bottom-3 left-4 text-[10px] text-slate-600 font-mono pointer-events-none">
                Futala Lake / Ambazari Basin
              </div>
              <div className="absolute top-3 right-4 text-[10px] text-slate-600 font-mono pointer-events-none">
                Koradi / Kamptee Sector
              </div>

              {/* Dynamic Cluster Bubbles */}
              {zones.map((zone) => {
                const isSelected = selectedZone?.id === zone.id;
                
                // Radius mapping based on count (16px to 38px)
                const baseRadius = Math.min(38, Math.max(16, 14 + zone.count * 0.35));
                
                // Color mapping
                const colorMap = {
                  CRITICAL: {
                    bg: 'bg-red-500/85',
                    border: 'border-red-400',
                    pulse: 'bg-red-500/40',
                    glow: 'shadow-red-500/40'
                  },
                  HIGH: {
                    bg: 'bg-amber-500/85',
                    border: 'border-amber-400',
                    pulse: 'bg-amber-500/30',
                    glow: 'shadow-amber-500/30'
                  },
                  MODERATE: {
                    bg: 'bg-blue-500/85',
                    border: 'border-blue-400',
                    pulse: 'bg-blue-500/20',
                    glow: 'shadow-blue-500/20'
                  },
                  STABLE: {
                    bg: 'bg-emerald-500/85',
                    border: 'border-emerald-400',
                    pulse: 'bg-emerald-500/20',
                    glow: 'shadow-emerald-500/20'
                  }
                };

                const currentColors = colorMap[zone.severity];

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(isSelected ? null : zone)}
                    style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-transform duration-200 hover:scale-125"
                  >
                    {/* Animated Pulsing Radar Ring for CRITICAL surge */}
                    {zone.severity === 'CRITICAL' && (
                      <div 
                        className={cn(
                          "absolute inset-0 rounded-full animate-ping pointer-events-none",
                          currentColors.pulse
                        )}
                        style={{ width: baseRadius * 2, height: baseRadius * 2, margin: -baseRadius * 0 }}
                      />
                    )}

                    {/* Main Cluster Circle */}
                    <div 
                      className={cn(
                        "rounded-full border-2 flex items-center justify-center font-bold text-white font-mono shadow-lg transition-all",
                        currentColors.bg,
                        currentColors.border,
                        currentColors.glow,
                        isSelected ? "ring-4 ring-white scale-110" : ""
                      )}
                      style={{ 
                        width: `${baseRadius * 2}px`, 
                        height: `${baseRadius * 2}px` 
                      }}
                      title={`${zone.name}: ${zone.count} cases (${zone.changePct > 0 ? '+' : ''}${zone.changePct}%)`}
                    >
                      <span className="text-xs leading-none drop-shadow">{zone.count}</span>
                    </div>

                    {/* Zone Name Label Badge */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap pointer-events-none">
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-md border shadow transition-colors",
                        isSelected 
                          ? "bg-white text-slate-950 border-white font-bold" 
                          : "bg-slate-950/90 text-slate-300 border-slate-800 group-hover:text-white"
                      )}>
                        {zone.name}
                        <span className={cn(
                          "ml-1 font-mono text-[9px]",
                          zone.changePct > 0 ? "text-red-400 font-bold" : "text-emerald-400"
                        )}>
                          {zone.changePct > 0 ? `+${zone.changePct}%` : `${zone.changePct}%`}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Map Legend */}
              <div className="absolute bottom-3 right-4 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-[10px] space-y-1.5 shadow-lg backdrop-blur-sm z-30">
                <span className="font-semibold text-slate-300 block mb-1">Incident Velocity:</span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-slate-300">Surge Critical (&gt;+25%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-300">High Risk (+10% to +25%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-300">Moderate Baseline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Stable / Decreasing</span>
                </div>
              </div>

            </div>

            {/* Selected Zone Deep-Dive Dossier HUD */}
            {selectedZone ? (
              <div className="p-4 bg-slate-900/90 border border-blue-500/30 rounded-xl space-y-3 animate-fade-in shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        {selectedZone.name} Hotspot Analysis
                      </h4>
                      <span className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded font-bold border",
                        selectedZone.severity === 'CRITICAL' ? "bg-red-500/20 text-red-300 border-red-500/40" :
                        selectedZone.severity === 'HIGH' ? "bg-amber-500/20 text-amber-300 border-amber-500/40" :
                        selectedZone.severity === 'MODERATE' ? "bg-blue-500/20 text-blue-300 border-blue-500/40" :
                        "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      )}>
                        {selectedZone.severity} SURGE
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{selectedZone.policeStation}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">TOTAL CASES</span>
                      <span className="text-white font-bold text-sm">{selectedZone.count}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">12-MO TREND</span>
                      <span className={cn(
                        "font-bold text-sm",
                        selectedZone.changePct > 0 ? "text-red-400" : "text-emerald-400"
                      )}>
                        {selectedZone.changePct > 0 ? `+${selectedZone.changePct}%` : `${selectedZone.changePct}%`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                      Dominant Modus Operandi (MO) Pattern
                    </span>
                    <p className="text-slate-200">{selectedZone.dominantMO}</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">
                      Algorithmic Patrol Recommendation
                    </span>
                    <p className="text-blue-300 font-medium">{selectedZone.patrolRecommendation}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl text-center text-xs text-slate-400">
                💡 <em>Click any cluster circle above on the Nagpur City map to inspect station jurisdiction, primary MO signatures, and automated patrol suggestions.</em>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: 12-MONTH HISTORICAL TREND GRAPH */}
        {activeTab === 'trends' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400">Monthly Incident Frequency: </span>
                <span className="text-white font-semibold font-mono">{currentOption.label}</span>
              </div>
              <span className="text-slate-500 font-mono">Aggregation Period: Jan – Dec 2026</span>
            </div>

            {/* Continuous SVG Trend Curve */}
            <div className="h-64 w-full bg-slate-950 rounded-xl border border-slate-800 p-4 relative flex flex-col justify-end">
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 1100 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="crime-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                {[0, 40, 80, 120, 160].map((y) => (
                  <line 
                    key={y} 
                    x1="0" 
                    y1={y} 
                    x2="1100" 
                    y2={y} 
                    stroke="#1e293b" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                ))}

                {/* Compute Path Points */}
                {(() => {
                  const points = trendPoints.map((val, idx) => {
                    const x = (idx / (trendPoints.length - 1)) * 1100;
                    const y = 150 - (val / maxTrend) * 140;
                    return { x, y, val };
                  });

                  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
                  const areaD = `${pathD} L 1100,160 L 0,160 Z`;

                  return (
                    <>
                      {/* Area Fill */}
                      <path d={areaD} fill="url(#crime-gradient)" />
                      {/* Main Stroke */}
                      <path d={pathD} fill="none" stroke="#60a5fa" strokeWidth="3" />
                      {/* Data Point Nodes */}
                      {points.map((p, i) => (
                        <g key={i} className="group">
                          <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r="5" 
                            className="fill-blue-500 stroke-slate-950 stroke-2 hover:r-7 transition-all cursor-pointer" 
                          />
                          <text 
                            x={p.x} 
                            y={p.y - 10} 
                            textAnchor="middle" 
                            className="fill-slate-300 text-[11px] font-mono font-bold"
                          >
                            {p.val}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>

              {/* Month Axis Labels */}
              <div className="flex justify-between pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
                {MONTH_LABELS.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">
                Annual Trajectory: <strong className="text-amber-400">+{(((trendPoints[11] - trendPoints[0]) / trendPoints[0]) * 100).toFixed(0)}% increase</strong> from Jan to Dec
              </span>
              <span className="text-slate-500 font-mono">
                Average Velocity: {(totalIncidents / 12).toFixed(1)} incidents/month
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
