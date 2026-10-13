'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Database,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  FileSpreadsheet,
  Info,
  Scale,
  Lock,
} from 'lucide-react';
import {
  VERIFIED_OFFICIAL_STATISTICS,
  OFFICIAL_DATA_SOURCES,
  UNAVAILABLE_GOVERNMENT_DATA,
  OFFICIAL_VALIDATION_REPORT,
} from '@/lib/data/official-stats';
import { SYNTHETIC_DATASET_SUMMARY } from '@/lib/data/suspects-data';

export default function DataSourcesPage() {
  const [jurisdictionFilter, setJurisdictionFilter] = useState<'all' | 'nagpur_city' | 'nagpur_railway'>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const filteredStats = VERIFIED_OFFICIAL_STATISTICS.filter((r) => {
    if (jurisdictionFilter !== 'all' && r.jurisdiction_id !== jurisdictionFilter) return false;
    if (yearFilter !== 'all' && String(r.year) !== yearFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-slate-200">
      {/* Header */}
      <header className="border-b border-[hsl(217,33%,17%)] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Data Sources, Provenance &amp; Validation Audit
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Panel Defense Reference
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Complete traceability of verified official government crime statistics versus labelled synthetic individual demo profiles.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href="/api/stats/official"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Inspect Raw Official JSON API
          </a>
        </div>
      </header>

      {/* Architectural Separation Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[hsl(222,47%,8%)] border border-emerald-500/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Layer A: Official Government Statistics (Actual Observations)
          </div>
          <h2 className="text-lg font-bold text-white">
            Verified NCRB &amp; Nagpur Railway Police Aggregate Counts
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Used exclusively for factual crime KPIs, year-on-year comparisons, category breakdowns, and detection rates. Every record includes its geographical jurisdiction, reporting year, source organisation, and direct URL.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Nagpur City / Metropolitan (NCRB):</strong> 24 verified rows (2020–2023 cognizable totals, violent crimes, 2023 rate 58.8/lakh, selected heads, crimes against women, senior citizens 60+).
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Nagpur Railway Police (GRP Official Dashboard):</strong> 15 verified rows (2023–2025 totals &amp; 2025 12-category breakdown summing to 1,359 registered / 258 detected). Kept strictly separate from Nagpur City Police.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-[hsl(222,47%,8%)] border border-amber-500/30 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Layer B: Synthetic Individual Demo Records (Generated Test Data)
          </div>
          <h2 className="text-lg font-bold text-white">
            5,000 Fictional Nagpur Demo Profiles &amp; 32 AI Portrait Assets
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Because individual suspect records, FIR narratives, biometric templates, and prison logs are protected law-enforcement records under Indian law (CCTNS / privacy regulations), individual-level workflows use <strong>{SYNTHETIC_DATASET_SUMMARY.totalProfiles.toLocaleString()} synthetic demo profiles</strong> (`SYN-NGP-00001` to `SYN-NGP-05000`).
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Every profile displays an unmistakable <strong>SYNTHETIC DEMO — NOT A REAL PERSON OR CASE</strong> badge.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                35 columns per profile with <strong>0 blank cells</strong> (missing aliases explicitly state <em>&ldquo;Not recorded (demo)&rdquo;</em>).
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Zero Contamination:</strong> Automated validation rules block synthetic records from ever entering official crime totals.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Automated 10-Rule Validation Status */}
      <section className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Automated Data-Quality &amp; Integrity Validation Checks
            </h2>
            <p className="text-xs text-slate-400">
              Executed automatically before any official statistic is accepted into the application.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
            STATUS: {OFFICIAL_VALIDATION_REPORT.passed ? 'ALL 10 CHECKS PASSED' : 'ISSUES DETECTED'} ({OFFICIAL_VALIDATION_REPORT.accepted_rows} / {OFFICIAL_VALIDATION_REPORT.total_input_rows} Verified)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          {[
            { label: '1. Non-Negative Integer Counts', ok: OFFICIAL_VALIDATION_REPORT.checks.non_negative_integers },
            { label: '2. Zero Duplicate Keys', ok: OFFICIAL_VALIDATION_REPORT.checks.no_duplicate_keys },
            { label: '3. Verified HTTPS Source URLs', ok: OFFICIAL_VALIDATION_REPORT.checks.source_urls_verified },
            { label: '4. Subtotal/Total Reconciliation', ok: OFFICIAL_VALIDATION_REPORT.checks.subtotal_reconciliation },
            { label: '5. Double-Counting Prevention', ok: OFFICIAL_VALIDATION_REPORT.checks.double_counting_prevention },
            { label: '6. IPC / BNS Distinction', ok: OFFICIAL_VALIDATION_REPORT.checks.ipc_bns_distinction },
            { label: '7. Jurisdiction Separation', ok: OFFICIAL_VALIDATION_REPORT.checks.jurisdiction_separation },
            { label: '8. Year & Source Attached', ok: OFFICIAL_VALIDATION_REPORT.checks.year_and_source_attached },
            { label: '9. Quarantine Audit Logging', ok: OFFICIAL_VALIDATION_REPORT.checks.rejected_rows_logged },
            { label: '10. Synthetic Rows Blocked', ok: OFFICIAL_VALIDATION_REPORT.checks.synthetic_rows_blocked },
          ].map((chk) => (
            <div
              key={chk.label}
              className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-medium">{chk.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 pt-2">
          {OFFICIAL_VALIDATION_REPORT.reconciliation_notes.map((note, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono"
            >
              {note}
            </div>
          ))}
        </div>
      </section>

      {/* Official Sources Inventory Table */}
      <section className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            Verified Government &amp; Secondary Source Inventory (`sources.csv`)
          </h2>
          <p className="text-xs text-slate-400">
            Direct links to original government catalogues, police dashboards, judicial portals, and NCRB-citing reports.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-3">Source ID &amp; Type</th>
                <th className="py-3 px-3">Title &amp; Organisation</th>
                <th className="py-3 px-3">Jurisdiction Scope</th>
                <th className="py-3 px-3">Used For &amp; Caveats</th>
                <th className="py-3 px-3 text-right">Official Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {OFFICIAL_DATA_SOURCES.map((src) => (
                <tr key={src.source_id} className="hover:bg-slate-900/50">
                  <td className="py-3 px-3 align-top">
                    <div className="font-mono font-bold text-emerald-400">{src.source_id}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{src.source_type}</div>
                  </td>
                  <td className="py-3 px-3 align-top">
                    <div className="font-semibold text-white">{src.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{src.organisation}</div>
                  </td>
                  <td className="py-3 px-3 align-top text-slate-300">{src.scope}</td>
                  <td className="py-3 px-3 align-top text-slate-300 max-w-md">
                    <div>{src.used_for}</div>
                    <div className="text-[11px] text-slate-500 mt-1 italic">{src.data_notes}</div>
                  </td>
                  <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium"
                    >
                      Verify URL <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Complete Integrated Official Statistics Table (All 39 Verified Rows) */}
      <section className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Complete Verified Official Statistics Table ({filteredStats.length} Rows)
            </h2>
            <p className="text-xs text-slate-400">
              Audited records from `nagpur_city_official_reported_stats.csv` (24 rows) and `nagpur_railway_police_official_stats.csv` (15 rows).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              <option value="all">All Jurisdictions (Separate)</option>
              <option value="nagpur_city">Nagpur City / Metro (NCRB)</option>
              <option value="nagpur_railway">Nagpur Railway Police (GRP)</option>
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              <option value="all">All Reporting Years (2020–2025)</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[520px] overflow-y-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-950 z-10">
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-3">Record ID</th>
                <th className="py-3 px-3">Jurisdiction</th>
                <th className="py-3 px-3">Year</th>
                <th className="py-3 px-3">Crime Category / Metric</th>
                <th className="py-3 px-3 text-right">Registered</th>
                <th className="py-3 px-3 text-right">Detected / Rate</th>
                <th className="py-3 px-3">Verification Status</th>
                <th className="py-3 px-3 text-right">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStats.map((row) => (
                <tr key={row.record_id} className="hover:bg-slate-900/60">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                    {row.record_id}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        row.jurisdiction_id === 'nagpur_city'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {row.jurisdiction}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white">{row.year}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white">{row.crime_category}</div>
                    <div className="text-[11px] text-slate-400">{row.metric}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                    {row.registered_cases !== null
                      ? row.registered_cases.toLocaleString()
                      : 'Rate Row'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                    {row.detected_cases !== null
                      ? `${row.detected_cases} (${row.detection_rate_percent}%)`
                      : row.crime_rate !== null
                      ? `${row.crime_rate} / lakh`
                      : 'Not publicly available'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {row.verification_status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <a
                      href={row.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Explicitly Unavailable Government Data Section */}
      <section className="bg-[hsl(222,47%,8%)] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">
            Documented Data Limitations &amp; &ldquo;Not Publicly Available&rdquo; Records
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          In strict compliance with data-engineering integrity rules, any statistic or individual record not published in accessible government tables is explicitly marked as <strong>&ldquo;Not publicly available&rdquo;</strong> rather than fabricated or extrapolated.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UNAVAILABLE_GOVERNMENT_DATA.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-2 text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-white">{item.category}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono text-[10px] shrink-0">
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Jurisdiction: {item.jurisdiction} • Period: {item.requested_period}
                </p>
                <p className="text-slate-300 mt-2 leading-relaxed">{item.reason}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                <a
                  href={item.official_reference_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  Official Portal Reference <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
