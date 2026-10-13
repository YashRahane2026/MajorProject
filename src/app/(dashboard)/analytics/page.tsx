'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Sliders,
  Database,
  Microscope,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { VERIFIED_OFFICIAL_STATISTICS } from '@/lib/data/official-stats';

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  // Multimodal Mathematical Formula Demonstration Weights
  const [faceWeight, setFaceWeight] = useState(0.6);
  const moWeight = parseFloat((1.0 - faceWeight).toFixed(2));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Official Time-Series Data Computed from VERIFIED_OFFICIAL_STATISTICS
  const nagpurCityCognizableSeries = useMemo(() => {
    return VERIFIED_OFFICIAL_STATISTICS.filter(
      (r) =>
        r.jurisdiction_id === 'nagpur_city' &&
        r.metric === 'Cognizable offences registered'
    )
      .sort((a, b) => a.year - b.year)
      .map((r) => ({
        year: String(r.year),
        cases: r.registered_cases || 0,
      }));
  }, []);

  const nagpurCityViolentAndWomenSeries = useMemo(() => {
    const cityRecs = VERIFIED_OFFICIAL_STATISTICS.filter(
      (r) => r.jurisdiction_id === 'nagpur_city'
    );
    return [2021, 2022, 2023].map((yr) => ({
      year: String(yr),
      violentCrimes:
        cityRecs.find((r) => r.year === yr && r.metric === 'Violent crimes registered')
          ?.registered_cases || 0,
      crimesAgainstWomen:
        cityRecs.find(
          (r) => r.year === yr && r.metric === 'Cases involving crimes against women'
        )?.registered_cases || 0,
      seniorCitizenCrimes:
        cityRecs.find(
          (r) => r.year === yr && r.metric === 'Cases involving senior-citizen victims'
        )?.registered_cases || 0,
      murderCases:
        cityRecs.find((r) => r.year === yr && r.crime_category === 'Murder')
          ?.registered_cases || 0,
    }));
  }, []);

  const railwayTimeSeries = useMemo(() => {
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

  // Synthetic Mathematical Formula Sandbox Candidates (Explicitly Fictional)
  const rawDemoCandidates = [
    {
      id: 'SYN-NGP-00001',
      name: 'Kranti Reddy [SYNTHETIC DEMO 00001]',
      faceSim: 0.94,
      moSim: 0.86,
      scenario: 'High synthetic portrait similarity + high synthetic text similarity',
      tag: 'Synthetic Demo Pair A',
    },
    {
      id: 'SYN-NGP-00003',
      name: 'Kavya Kale [SYNTHETIC DEMO 00003]',
      faceSim: 0.58,
      moSim: 0.95,
      scenario: 'Low portrait similarity, high synthetic MO text cosine score',
      tag: 'Synthetic Demo Pair B',
    },
    {
      id: 'SYN-NGP-00006',
      name: 'Devendra Kamble [SYNTHETIC DEMO 00006]',
      faceSim: 0.91,
      moSim: 0.44,
      scenario: 'High synthetic portrait similarity, unrelated synthetic text category',
      tag: 'Synthetic Demo Pair C',
    },
  ];

  const rankedCandidates = rawDemoCandidates
    .map((c) => {
      const composite = faceWeight * c.faceSim + moWeight * c.moSim;
      return {
        ...c,
        compositeScore: (composite * 100).toFixed(1),
      };
    })
    .sort((a, b) => parseFloat(b.compositeScore) - parseFloat(a.compositeScore));

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto text-slate-200 space-y-8 pb-16">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[hsl(217,33%,17%)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <BarChart3 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Official Crime-Trend Analytics &amp; ML Methodology Disclosure
            </h1>
            <p className="text-sm text-slate-400">
              Verified government aggregate time-series (NCRB &amp; Nagpur Railway Police) strictly separated from synthetic similarity demonstrations.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/analytics/evaluation"
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Microscope className="w-4 h-4" /> Model Evaluation &amp; Limitations
          </Link>
          <Link
            href="/data-sources"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <Database className="w-4 h-4 text-emerald-400" /> Verify Data Sources
          </Link>
        </div>
      </header>

      {/* =====================================================================
          SECTION 1: OFFICIAL GOVERNMENT TIME-SERIES ANALYSIS
          ===================================================================== */}
      <section className="bg-[hsl(222,47%,8%)] border border-emerald-500/30 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[hsl(217,33%,17%)] pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Government Statistics
            </span>
            <h2 className="text-lg font-bold text-white mt-1">
              Historical Time-Series Analysis (Verified NCRB &amp; Nagpur Railway Police Observations)
            </h2>
            <p className="text-xs text-slate-400">
              Time-series charts below use only verified historical government observations. Due to the 3–4 year observation window, no speculative multi-year forecasting or extrapolation is claimed.
            </p>
          </div>
          <a
            href="https://www.data.gov.in/catalog/crime-india-2023"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
          >
            data.gov.in (NCRB 2023) <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart A: Nagpur City Cognizable Offences 2020-2022 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white uppercase">
                Nagpur City: All Cognizable Offences (2020–2022)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">NCRB Cited</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Jurisdiction: Nagpur City Police • 2023 total not in verified excerpt
            </p>
            <div className="h-[220px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nagpurCityCognizableSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        fontSize: '12px',
                      }}
                    />
                    <Bar
                      dataKey="cases"
                      name="Cognizable Offences"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart B: Nagpur City Violent & Thematic Trends 2021-2023 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white uppercase">
                Nagpur Metro: Violent &amp; Thematic Series (2021–2023)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">NCRB 2023</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Violent Crimes (1,409 → 1,278 → 1,468) &amp; Crimes Against Women
            </p>
            <div className="h-[220px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={nagpurCityViolentAndWomenSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line
                      type="monotone"
                      dataKey="violentCrimes"
                      name="Violent Crimes"
                      stroke="#f43f5e"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="crimesAgainstWomen"
                      name="Crimes Against Women"
                      stroke="#a855f7"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="seniorCitizenCrimes"
                      name="Senior Citizens (60+)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart C: Nagpur Railway Police 2023-2025 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white uppercase">
                Nagpur Railway Police (GRP): 2023–2025
              </h3>
              <span className="text-[10px] font-mono text-blue-400">Separate Jurisdiction</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Source: nagpurrailwaypolice.gov.in • Registered vs. Detected
            </p>
            <div className="h-[220px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={railwayTimeSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="registered" name="Registered" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="detected" name="Detected" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: ML METHODOLOGY, PROVENANCE & ETHICAL BOUNDARIES
          ===================================================================== */}
      <section className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">
            Machine Learning Provenance, Pre-Trained Sources &amp; Ethical Boundaries
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="font-bold text-red-400 uppercase tracking-wider block">
              Zero Training on Synthetic Demographics
            </span>
            <p className="text-slate-300 leading-relaxed">
              No model in CrimeTrack AI is trained on generated suspect names, synthetic threat levels, age/gender fields, or fictional convictions. We never claim a model has learned real criminal behavior from synthetic profiles.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="font-bold text-blue-400 uppercase tracking-wider block">
              Visual Embedding Pipeline (UI Asset Demo)
            </span>
            <p className="text-slate-300 leading-relaxed">
              The Python microservice (`ml-service/main.py`) uses pre-trained <code>InceptionResnetV1 (vggface2)</code> and the web sandbox uses normalized 64-D canvas luminance vectors strictly on the <strong>32 AI-generated fictional portraits</strong> as UI assets, never to profile real people.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="font-bold text-purple-400 uppercase tracking-wider block">
              Text Embedding Pipeline (Synthetic FIR Demo)
            </span>
            <p className="text-slate-300 leading-relaxed">
              FIR narrative similarity uses pre-trained Sentence-BERT (<code>all-mpnet-base-v2</code>, 768-D cosine similarity) on synthetic Modus Operandi descriptions to demonstrate cross-case text retrieval mechanics.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: MULTIMODAL COSINE FUSION FORMULA SANDBOX (SYNTHETIC DEMO)
          ===================================================================== */}
      <section className="bg-[hsl(222,47%,8%)] border border-amber-500/30 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[hsl(217,33%,17%)] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
                SYNTHETIC DEMO FORMULA SANDBOX
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Composite Score = (w_visual × S_visual) + (w_text × S_text)
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Interactive Linear Combination Simulator (Demonstration Only)
            </h2>
            <p className="text-xs text-slate-400">
              Demonstrates how visual embedding cosine similarity and text embedding cosine similarity combine mathematically on synthetic test records. Not a criminality or risk score.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 min-w-[280px]">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-blue-400 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Visual Weight: {(faceWeight * 100).toFixed(0)}%
              </span>
              <span className="text-purple-400">
                Text MO Weight: {(moWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={faceWeight}
              onChange={(e) => setFaceWeight(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
              aria-label="Adjust Visual vs Text Similarity Weight"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rankedCandidates.map((c, idx) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-amber-300 font-bold">
                  Rank #{idx + 1} • {c.id}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-mono font-bold">
                  {c.compositeScore}%
                </span>
              </div>
              <p className="font-bold text-white text-sm">{c.name}</p>
              <p className="text-slate-400">{c.scenario}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[11px] text-slate-300">
                <span>Visual Sim: {(c.faceSim * 100).toFixed(0)}%</span>
                <span>Text Sim: {(c.moSim * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
