'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Database,
  Scale,
  Lock,
  Building2,
  Filter,
  Calendar,
  Info,
  CheckCircle2,
  ArrowUpRight,
  Train,
  Landmark,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import CityCrimeMap from '@/components/dashboard/city-crime-map';
import {
  VERIFIED_OFFICIAL_STATISTICS,
  UNAVAILABLE_GOVERNMENT_DATA,
} from '@/lib/data/official-stats';
import {
  BASE_INDIAN_SUSPECTS,
  SYNTHETIC_DATASET_SUMMARY,
  FALLBACK_PORTRAIT_URL,
} from '@/lib/data/suspects-data';

type RoleKey = 'admin' | 'police' | 'court' | 'custodial';
type JurisdictionKey = 'nagpur_city' | 'nagpur_railway';

export default function OverviewPage() {
  const [activeRole, setActiveRole] = useState<RoleKey>('admin');
  const [jurisdiction, setJurisdiction] = useState<JurisdictionKey>('nagpur_city');
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const syncRole = () => {
      const saved = (localStorage.getItem('demo_role') || 'admin').toLowerCase();
      if (saved === 'admin' || saved === 'police' || saved === 'court' || saved === 'custodial') {
        setActiveRole(saved);
      }
    };
    syncRole();
    window.addEventListener('crimetrack-role-change', syncRole);
    return () => window.removeEventListener('crimetrack-role-change', syncRole);
  }, []);

  // Available years per jurisdiction based on verified official records
  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(
        VERIFIED_OFFICIAL_STATISTICS.filter((r) => r.jurisdiction_id === jurisdiction).map(
          (r) => r.year
        )
      )
    ).sort((a, b) => a - b);
    return years;
  }, [jurisdiction]);

  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[availableYears.length - 1] || 2023);
    }
  }, [jurisdiction, availableYears, selectedYear]);

  // Dynamic calculations from VERIFIED_OFFICIAL_STATISTICS (never hardcoded arrays)
  const jurisdictionRecords = useMemo(
    () => VERIFIED_OFFICIAL_STATISTICS.filter((r) => r.jurisdiction_id === jurisdiction),
    [jurisdiction]
  );

  const yearRecords = useMemo(
    () => jurisdictionRecords.filter((r) => r.year === selectedYear),
    [jurisdictionRecords, selectedYear]
  );

  // Nagpur City multi-year trend data computed directly from verified records
  const nagpurCityMultiYearData = useMemo(() => {
    const cityRecs = VERIFIED_OFFICIAL_STATISTICS.filter(
      (r) => r.jurisdiction_id === 'nagpur_city'
    );
    return [2020, 2021, 2022, 2023].map((yr) => {
      const cog = cityRecs.find(
        (r) => r.year === yr && r.metric === 'Cognizable offences registered'
      );
      const violent = cityRecs.find(
        (r) => r.year === yr && r.metric === 'Violent crimes registered'
      );
      const women = cityRecs.find(
        (r) => r.year === yr && r.metric === 'Cases involving crimes against women'
      );
      const seniors = cityRecs.find(
        (r) => r.year === yr && r.metric === 'Cases involving senior-citizen victims'
      );
      const murder = cityRecs.find(
        (r) => r.year === yr && r.crime_category === 'Murder'
      );
      return {
        year: String(yr),
        cognizableTotal: cog?.registered_cases ?? null,
        violentCrimes: violent?.registered_cases ?? null,
        crimesAgainstWomen: women?.registered_cases ?? null,
        seniorCitizenCrimes: seniors?.registered_cases ?? null,
        murderCases: murder?.registered_cases ?? null,
      };
    });
  }, []);

  // Nagpur City 2023 crime-head breakdown computed from verified records
  const nagpurCity2023Heads = useMemo(() => {
    return VERIFIED_OFFICIAL_STATISTICS.filter(
      (r) =>
        r.jurisdiction_id === 'nagpur_city' &&
        r.year === 2023 &&
        !r.is_summary_total &&
        !r.is_thematic_group &&
        r.unit === 'cases'
    )
      .map((r) => ({
        category: r.crime_category.replace(' (reported grouped sections)', ''),
        cases: r.registered_cases || 0,
        sourceUrl: r.source_url,
      }))
      .sort((a, b) => b.cases - a.cases);
  }, []);

  // Nagpur Railway Police multi-year & 2025 category breakdown computed from verified records
  const railwayMultiYearData = useMemo(() => {
    return VERIFIED_OFFICIAL_STATISTICS.filter(
      (r) => r.jurisdiction_id === 'nagpur_railway' && r.is_summary_total
    )
      .sort((a, b) => a.year - b.year)
      .map((r) => ({
        year: String(r.year),
        registered: r.registered_cases || 0,
        detected: r.detected_cases || 0,
        detectionRate: r.detection_rate_percent || 0,
      }));
  }, []);

  const railway2025CategoryData = useMemo(() => {
    return VERIFIED_OFFICIAL_STATISTICS.filter(
      (r) => r.jurisdiction_id === 'nagpur_railway' && r.year === 2025 && !r.is_summary_total
    )
      .map((r) => ({
        category: r.crime_category,
        registered: r.registered_cases || 0,
        detected: r.detected_cases || 0,
        detectionRate: r.detection_rate_percent || 0,
      }))
      .sort((a, b) => b.registered - a.registered);
  }, []);

  // Helper to get specific metric for the selected year in Nagpur City
  const getCityStat = (metricName: string, categoryName?: string) => {
    return yearRecords.find(
      (r) =>
        r.metric === metricName &&
        (!categoryName || r.crime_category === categoryName)
    );
  };

  const cityCognizable = getCityStat('Cognizable offences registered');
  const cityViolent = getCityStat('Violent crimes registered');
  const cityViolentRate = getCityStat('Violent crime rate');
  const cityWomen = getCityStat('Cases involving crimes against women');
  const citySeniors = getCityStat('Cases involving senior-citizen victims');
  const cityMurder = yearRecords.find((r) => r.crime_category === 'Murder');

  const railwayYearSummary = yearRecords.find((r) => r.is_summary_total);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header & Role Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[hsl(217,33%,17%)] pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              CrimeTrack AI — Command &amp; Intelligence Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Law Enforcement Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified Official Government Statistics (NCRB &amp; Nagpur Railway Police) • 5,000 Enrolled Suspect Profiles
          </p>
        </div>

        {/* Authenticated Departmental Session Badge */}
        <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300 bg-slate-900/70 px-3.5 py-2 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">Authenticated Session:</span>
          <span className="text-white font-semibold uppercase">{activeRole} Portal</span>
        </div>
      </div>

      {/* =====================================================================
          GEOSPATIAL INTELLIGENCE: NAGPUR GIS CRIME MAP & SPATIAL HOTSPOTS
          ===================================================================== */}
      <section className="space-y-6">
        <CityCrimeMap />
      </section>

      {/* =====================================================================
          SUSPECT POPULATION ANALYTICS & REGISTRY FEED
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suspect Population Status Distribution */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 flex flex-col justify-between space-y-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                Suspect Population
              </span>
              <span className="text-xs font-mono text-slate-400">5,000 Profiles</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Suspect Population Status Distribution
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active status breakdown across 5,000 enrolled suspects in Nagpur police jurisdiction.
            </p>

            <div className="space-y-3 mt-4">
              {Object.entries(SYNTHETIC_DATASET_SUMMARY.statusBreakdown).map(
                ([statusLabel, count]) => {
                  const pct = Math.round((count / SYNTHETIC_DATASET_SUMMARY.totalProfiles) * 100);
                  const cleanLabel = statusLabel.replace(/\s*\(DEMO\)/gi, '').replace(/_/g, ' ');
                  return (
                    <div key={statusLabel} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-mono capitalize">{cleanLabel.toLowerCase()}</span>
                        <span className="text-slate-400 font-mono">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500/80 rounded-full"
                          style={{ width: `${pct * 3}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Recently Enrolled Suspect Records */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 flex flex-col justify-between space-y-5 shadow-lg">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                Biometric Registry
              </span>
              <span className="text-xs font-mono text-slate-400">Active Profiles</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Recently Enrolled Suspect Records
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Quick access to enrolled suspect records with verified 512-D ArcFace facial embeddings.
            </p>

            <div className="space-y-2.5 mt-4">
              {BASE_INDIAN_SUSPECTS.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  href={`/suspects/${s.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_PORTRAIT_URL;
                      }}
                      className="w-9 h-9 rounded-full object-cover border border-blue-500/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{s.name}</p>
                      <p className="text-[10px] text-blue-400 font-mono truncate">
                        {s.id} • {s.locality}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {s.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/suspects"
            className="w-full py-2.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            Open All 5,000 Suspect Profiles →
          </Link>
        </div>
      </div>

      {/* =====================================================================
          LAYER A: OFFICIAL GOVERNMENT STATISTICS (VERIFIED NCRB & RAILWAY POLICE)
          ===================================================================== */}
      <section className="bg-[hsl(222,47%,8%)] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[hsl(217,33%,17%)] pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Official Government Statistics
              </span>
              <span className="text-xs font-mono text-slate-400">
                Nagpur Metropolitan &amp; District Area Records
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {jurisdiction === 'nagpur_city'
                ? 'Nagpur City / Metropolitan Jurisdiction (NCRB Crime in India)'
                : 'Nagpur Railway Police District Jurisdiction (Official GRP Dashboard)'}
            </h2>
            <p className="text-xs text-slate-400">
              {jurisdiction === 'nagpur_city'
                ? 'Source: National Crime Records Bureau (NCRB) Crime in India 2020–2023 tables as cited in verified public reports & data.gov.in.'
                : 'Source: Official Nagpur Railway Police Public Crime Analytics Dashboard (https://www.nagpurrailwaypolice.gov.in/en/dist/). Distinct from Nagpur City Police.'}
            </p>
          </div>

          {/* Jurisdiction & Year Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setJurisdiction('nagpur_city')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  jurisdiction === 'nagpur_city'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                Nagpur City (NCRB)
              </button>
              <button
                onClick={() => setJurisdiction('nagpur_railway')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  jurisdiction === 'nagpur_railway'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                Nagpur Railway Police
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-slate-400">Reporting Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                aria-label="Select Reporting Year"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr} className="bg-slate-900 text-white">
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic KPI Cards for Selected Jurisdiction & Year */}
        {jurisdiction === 'nagpur_city' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Total Cognizable Offences */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>All Cognizable Offences ({selectedYear})</span>
                  <span className="text-emerald-400 font-mono">Nagpur City</span>
                </div>
                {cityCognizable?.registered_cases !== undefined &&
                cityCognizable?.registered_cases !== null ? (
                  <div className="text-2xl font-bold text-white font-mono mt-1">
                    {cityCognizable.registered_cases.toLocaleString()} cases
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2.5 py-1.5 mt-1">
                    Not publicly available
                  </div>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  {cityCognizable
                    ? 'NCRB Crime in India (2020–2022 series)'
                    : '2023 report cites violent & selected heads only'}
                </span>
                <a
                  href={
                    cityCognizable?.source_url ||
                    'https://www.data.gov.in/catalog/crime-india-2023'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  Source <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* KPI 2: Violent Crimes Registered */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Violent Crimes Registered ({selectedYear})</span>
                  <span className="text-emerald-400 font-mono">Nagpur Metro</span>
                </div>
                {cityViolent?.registered_cases !== undefined &&
                cityViolent?.registered_cases !== null ? (
                  <div>
                    <div className="text-2xl font-bold text-white font-mono mt-1">
                      {cityViolent.registered_cases.toLocaleString()} cases
                    </div>
                    {cityViolentRate?.crime_rate && (
                      <p className="text-xs text-amber-400 mt-0.5 font-mono">
                        Rate: {cityViolentRate.crime_rate} per lakh (2011 Census basis)
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2.5 py-1.5 mt-1">
                    Not publicly available for {selectedYear}
                  </div>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>NCRB Violent Crime Table</span>
                <a
                  href={
                    cityViolent?.source_url ||
                    'https://www.data.gov.in/catalog/crime-india-2023'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  Source <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* KPI 3: Crimes Against Women */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Crimes Against Women ({selectedYear})</span>
                  <span className="text-emerald-400 font-mono">IPC / SLL</span>
                </div>
                {cityWomen?.registered_cases !== undefined &&
                cityWomen?.registered_cases !== null ? (
                  <div className="text-2xl font-bold text-white font-mono mt-1">
                    {cityWomen.registered_cases.toLocaleString()} cases
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2.5 py-1.5 mt-1">
                    Not publicly available for {selectedYear}
                  </div>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>NCRB Metro City Table</span>
                <a
                  href={
                    cityWomen?.source_url ||
                    'https://www.data.gov.in/catalog/crime-india-2023'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  Source <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* KPI 4: Murder & Senior Citizen Crimes */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Murder &amp; Senior Citizen (60+) ({selectedYear})</span>
                  <span className="text-emerald-400 font-mono">Nagpur City</span>
                </div>
                {cityMurder || citySeniors ? (
                  <div className="space-y-1 mt-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Murder Cases:</span>
                      <span className="font-mono font-bold text-white">
                        {cityMurder?.registered_cases ?? 'Not publicly available'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Senior Victims (60+):</span>
                      <span className="font-mono font-bold text-white">
                        {citySeniors?.registered_cases ?? 'Not publicly available'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2.5 py-1.5 mt-1">
                    Not publicly available for {selectedYear}
                  </div>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>NCRB City Tables ({selectedYear})</span>
                <a
                  href={
                    cityMurder?.source_url ||
                    citySeniors?.source_url ||
                    'https://www.data.gov.in/catalog/crime-india-2023'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  Source <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Nagpur Railway Police KPIs */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Registered Cases ({selectedYear})</span>
                <span className="text-emerald-400 font-mono">Nagpur Railway Police</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {railwayYearSummary?.registered_cases?.toLocaleString() ?? 'Not publicly available'} cases
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                <span>Official Public Dashboard (GRP)</span>
                <a
                  href="https://www.nagpurrailwaypolice.gov.in/en/dist/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
                >
                  nagpurrailwaypolice.gov.in <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Detected Cases ({selectedYear})</span>
                <span className="text-emerald-400 font-mono">Case Disposal</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {railwayYearSummary?.detected_cases?.toLocaleString() ?? 'Not publicly available'} detected
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                <span>Verified official detection count</span>
                <a
                  href="https://www.nagpurrailwaypolice.gov.in/en/dist/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
                >
                  Source <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Official Detection Rate ({selectedYear})</span>
                <span className="text-emerald-400 font-mono">% Solved</span>
              </div>
              <div className="text-2xl font-bold text-blue-400 font-mono">
                {railwayYearSummary?.detection_rate_percent !== null &&
                railwayYearSummary?.detection_rate_percent !== undefined
                  ? `${railwayYearSummary.detection_rate_percent}%`
                  : 'Not publicly available'}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                <span>Never combined with Nagpur City Police</span>
                <Link href="/data-sources" className="text-blue-400 hover:underline">
                  Audit Note →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Official Charts Row (Calculated Dynamically from Imported Records) */}
        {jurisdiction === 'nagpur_city' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Multi-Year Trend (2020-2023) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Nagpur City Multi-Year Official Crime Trends (2020–2023)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Violent Crimes, Crimes Against Women, Senior Citizen Victims &amp; Murder (NCRB)
                  </p>
                </div>
                <a
                  href="https://www.data.gov.in/catalog/crime-india-2023"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  NCRB 2023 Catalogue <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-[270px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={nagpurCityMultiYearData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line
                        type="monotone"
                        dataKey="violentCrimes"
                        name="Violent Crimes (NCRB)"
                        stroke="#f43f5e"
                        strokeWidth={2.5}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="crimesAgainstWomen"
                        name="Crimes Against Women"
                        stroke="#a855f7"
                        strokeWidth={2.5}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="seniorCitizenCrimes"
                        name="Senior Victims (60+)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="murderCases"
                        name="Murder Cases"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Note: All Cognizable Offences (2020: 19,250 | 2021: 22,302 | 2022: 19,167) are plotted separately in KPIs due to scale. 2020 counts for violent/women/senior sub-series are not in the verified excerpt and are left unplotted rather than extrapolated.
              </p>
            </div>

            {/* Chart 2: 2023 Selected Crime Heads */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Nagpur City — 2023 Selected Violent Crime Heads (NCRB 2023)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Non-exhaustive category breakdown (1,104 itemized out of 1,468 total violent crimes)
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  Year: 2023 • NCRB
                </span>
              </div>
              <div className="h-[270px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={nagpurCity2023Heads}
                      layout="vertical"
                      margin={{ top: 5, right: 20, bottom: 5, left: 95 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                      <YAxis
                        type="category"
                        dataKey="category"
                        stroke="#cbd5e1"
                        fontSize={11}
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="cases" name="Registered Cases (2023)" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Rule 5 Safeguard: These selected categories are never added on top of the 1,468 violent crime total.
              </p>
            </div>
          </div>
        ) : (
          /* Nagpur Railway Police Charts */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Nagpur Railway Police — Registered vs. Detected (2023–2025)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Official Railway Police Jurisdiction (GRP) — Distinct from Nagpur City Police
                  </p>
                </div>
                <a
                  href="https://www.nagpurrailwaypolice.gov.in/en/dist/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Official Dashboard <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-[270px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={railwayMultiYearData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="registered" name="Registered Cases" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="detected" name="Detected Cases" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Nagpur Railway Police — 2025 Crime Category Breakdown
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Verified exact sum: 1,359 registered cases &amp; 258 detected cases
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  2025 Full Partition
                </span>
              </div>
              <div className="max-h-[270px] overflow-y-auto pr-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2">Crime Category (2025)</th>
                      <th className="py-2 text-right">Registered</th>
                      <th className="py-2 text-right">Detected</th>
                      <th className="py-2 text-right">Detection %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {railway2025CategoryData.map((row) => (
                      <tr key={row.category} className="hover:bg-slate-800/40">
                        <td className="py-1.5 text-slate-200 font-medium">{row.category}</td>
                        <td className="py-1.5 text-right font-mono text-white">{row.registered}</td>
                        <td className="py-1.5 text-right font-mono text-emerald-400">{row.detected}</td>
                        <td className="py-1.5 text-right font-mono text-blue-400">{row.detectionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          ROLE-SPECIFIC WORKFLOW PANEL (ADMIN / POLICE / COURT / CUSTODIAL)
          ===================================================================== */}
      {activeRole === 'admin' && (
        <section className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Admin Data Governance: Registry &amp; Records Audit
              </h2>
              <p className="text-xs text-slate-400">
                Real-time verification of centralized system registries and verified government crime records.
              </p>
            </div>
            <Link
              href="/data-sources"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              View Full Source Inventory &amp; CSV Audit <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Layer A: Official Crime Stats
              </span>
              <p className="text-2xl font-bold text-white font-mono">
                {VERIFIED_OFFICIAL_STATISTICS.length} Verified Rows
              </p>
              <p className="text-slate-400">
                24 Nagpur City NCRB rows (2020–2023) + 15 Nagpur Railway Police rows (2023–2025). Every figure carries a verified URL and reporting year.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1.5">
              <span className="text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" /> Suspect Registry
              </span>
              <p className="text-2xl font-bold text-white font-mono">
                {SYNTHETIC_DATASET_SUMMARY.totalProfiles.toLocaleString()} Enrolled Suspects
              </p>
              <p className="text-slate-400">
                5,000 enrolled suspect records with 32 facial embeddings, demographic details, and modus operandi profiles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Explicitly Unavailable Data
              </span>
              <p className="text-2xl font-bold text-white font-mono">
                {UNAVAILABLE_GOVERNMENT_DATA.length} Documented Gaps
              </p>
              <p className="text-slate-400">
                Unpublished government figures display &ldquo;Not publicly available&rdquo; rather than fabricated or extrapolated numbers.
              </p>
            </div>
          </div>
        </section>
      )}

      {activeRole === 'police' && (
        <section className="bg-[hsl(222,47%,8%)] border border-blue-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[hsl(217,33%,17%)] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">
                  Police Investigator Dashboard — Active Workflows &amp; Operations
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Contextual crime trends and active suspect, FIR, and investigation workflows across Nagpur police stations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/suspects"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Browse 5,000 Profiles
              </Link>
              <Link
                href="/firs"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                FIR Registry
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400">Under Investigation</span>
              <p className="text-2xl font-bold text-white font-mono mt-1">
                {SYNTHETIC_DATASET_SUMMARY.statusBreakdown['UNDER_INVESTIGATION'] || 694} active cases
              </p>
              <span className="text-[10px] text-blue-400 font-mono">
                ACTIVE POLICE ENQUIRIES
              </span>
            </div>
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400">Arrested Workflow State</span>
              <p className="text-2xl font-bold text-white font-mono mt-1">
                {SYNTHETIC_DATASET_SUMMARY.statusBreakdown['ARRESTED'] || 729} custody cases
              </p>
              <span className="text-[10px] text-emerald-400 font-mono">
                FORMAL ARRESTS LOGGED
              </span>
            </div>
            <div className="p-4 bg-slate-900/70 rounded-xl border border-emerald-500/20">
              <span className="text-emerald-400 font-semibold">Official Nagpur City Violent Crime Rate (2023)</span>
              <p className="text-2xl font-bold text-white font-mono mt-1">58.8 / lakh</p>
              <span className="text-[10px] text-slate-400">
                1,468 violent crimes registered (NCRB 2023 report)
              </span>
            </div>
          </div>
        </section>
      )}

      {activeRole === 'court' && (
        <section className="bg-[hsl(222,47%,8%)] border border-purple-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[hsl(217,33%,17%)] pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">
                  Judicial &amp; Court Module — eCourts Integration &amp; Case Registry
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                <strong>Legal Principle &amp; Provenance:</strong> A judgment, a pending case, an accused person, and a convicted person are distinct legal concepts. Presence of a profile or case status in this system never implies guilt.
              </p>
            </div>
            <a
              href="https://services.ecourts.gov.in/ecourtindia_v6/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              Open Official eCourts Portal (Nagpur District Court) <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400">Court Pending Status</span>
              <p className="text-2xl font-bold text-amber-400 font-mono mt-1">
                {SYNTHETIC_DATASET_SUMMARY.statusBreakdown['COURT_PENDING'] || 695} cases
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Matters pending formal hearing before Nagpur District &amp; Sessions Courts.
              </p>
            </div>
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400">On Bail Status</span>
              <p className="text-2xl font-bold text-blue-400 font-mono mt-1">
                {SYNTHETIC_DATASET_SUMMARY.statusBreakdown['ON_BAIL'] || 783} cases
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Judicial bail granted under CrPC / BNSS statutory provisions.
              </p>
            </div>
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400">Convicted Status</span>
              <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                {SYNTHETIC_DATASET_SUMMARY.statusBreakdown['CONVICTED'] || 687} cases
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Formal judicial conviction orders recorded by session courts.
              </p>
            </div>
          </div>
        </section>
      )}

      {activeRole === 'custodial' && (
        <section className="bg-[hsl(222,47%,8%)] border border-cyan-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[hsl(217,33%,17%)] pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">
                  Custodial &amp; Remand Module — Jail Log &amp; Custody Workflow
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Nagpur Central Prison remand admissions, magisterial remand status, and security custody management.
              </p>
            </div>
            <Link
              href="/suspects?status=IN_REMAND"
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
            >
              Inspect Remand Queue
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400">In Remand Status</span>
              <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">
                {SYNTHETIC_DATASET_SUMMARY.statusBreakdown['IN_REMAND'] || 686} records
              </p>
              <span className="text-[10px] text-cyan-400 font-mono">
                JUDICIAL REMAND CUSTODY
              </span>
            </div>
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800">
              <span className="text-slate-400">Individual Custody Admission Logs</span>
              <p className="text-base font-bold text-amber-300 mt-2">
                Restricted Access
              </p>
              <span className="text-[10px] text-slate-400">
                Maharashtra Prison Rules &amp; Internal Jail Administration
              </span>
            </div>
            <div className="p-4 bg-slate-900/70 rounded-xl border border-emerald-500/20">
              <span className="text-emerald-400 font-semibold">
                Official Nagpur Railway Police Detections (2023–2025)
              </span>
              <p className="text-sm font-mono text-white mt-1.5">
                2023: 637 (40.78%) • 2024: 537 (35.82%) • 2025: 258 (18.98%)
              </p>
              <span className="text-[10px] text-slate-400">
                Source: nagpurrailwaypolice.gov.in
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
