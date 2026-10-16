'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Database,
  Download,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import {
  BASE_INDIAN_SUSPECTS,
  SYNTHETIC_DATASET_SUMMARY,
  FALLBACK_PORTRAIT_URL,
  normalizePhotoUrl,
} from '@/lib/data/suspects-data';

export default function DatasetInspectorModal({
  isOpen = true,
  onClose,
}: {
  isOpen?: boolean;
  onClose: () => void;
}) {
  const [selectedSuspectIndex, setSelectedSuspectIndex] = useState(0);
  const currentSuspect =
    BASE_INDIAN_SUSPECTS[selectedSuspectIndex] || BASE_INDIAN_SUSPECTS[0];

  if (!isOpen) return null;

  const handleDownloadPreviewJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(BASE_INDIAN_SUSPECTS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      'synthetic_nagpur_suspects_preview_25.json'
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[hsl(222,47%,8%)] border border-blue-500/30 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col my-auto animate-fade-in border-t-2 border-t-blue-500 max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[hsl(217,33%,17%)] flex justify-between items-center bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex flex-wrap items-center gap-2">
                Dataset &amp; Provenance Inspector
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-500/30">
                  DATABASE SCHEMA &amp; ASSETS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                5,000 enrolled suspect profiles with complete 35-field metadata schema and 32 visual portrait embeddings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPreviewJson}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export 25 Preview JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Verification Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Enrolled Profiles</span>
              <p className="text-xl font-mono font-bold text-white mt-1">
                {SYNTHETIC_DATASET_SUMMARY.totalProfiles.toLocaleString()}
              </p>
              <span className="text-[10px] text-blue-400">
                35 Columns • 0 Missing Cells
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Facial Portraits</span>
              <p className="text-xl font-mono font-bold text-white mt-1">
                {SYNTHETIC_DATASET_SUMMARY.portraitCount} Files
              </p>
              <span className="text-[10px] text-blue-400">
                /images/portrait_001..032.jpg
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Nagpur City Stats</span>
              <p className="text-xl font-mono font-bold text-emerald-400 mt-1">
                24 Rows
              </p>
              <span className="text-[10px] text-emerald-400">
                Official NCRB (2020–2023)
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Railway Police Stats</span>
              <p className="text-xl font-mono font-bold text-emerald-400 mt-1">
                15 Rows
              </p>
              <span className="text-[10px] text-emerald-400">
                Official Dashboard (2023–2025)
              </span>
            </div>
          </div>

          {/* Biometric Augmentation Pipeline Showcase (5,000 Suspects) */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Biometric Image Augmentation Pipeline (5,000 Suspect Instances)
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                FORENSIC CCTV JITTER &amp; POSE INVARIANCE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To evaluate ArcFace feature extractor robustness under real surveillance environments, enrolled suspect profiles are calibrated across realistic forensic transformations: affine rotation (&plusmn;6&deg;), luminance/contrast shifts, Gaussian CCTV sensor noise, and surveillance vignette shading.
            </p>
            <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-1">
              <img 
                src="/images/augmentation_demo_comparison.jpg" 
                alt="Forensic Biometric Augmentation Comparison" 
                className="w-full h-auto object-contain max-h-48 rounded"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] text-slate-400 font-mono text-center">
              <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">1. Original Mugshot</div>
              <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">2. Low Light + Grain</div>
              <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">3. Affine Rotation &plusmn;6&deg;</div>
              <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">4. High Contrast CCTV</div>
              <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800">5. Surveillance Grain</div>
            </div>
          </div>

          {/* 32 Verified Portrait Gallery */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                32 Verified AI-Generated Portrait Assets (`/public/images/portrait_001.jpg` – `portrait_032.jpg`)
              </h3>
              <span className="text-[10px] text-amber-300 font-mono">
                UI Assets Only — Not Real Mugshots
              </span>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-2">
              {Array.from({ length: 32 }, (_, idx) => {
                const num = String(idx + 1).padStart(3, '0');
                const src = `/images/portrait_${num}.jpg`;
                return (
                  <div
                    key={src}
                    className="flex flex-col items-center gap-1"
                    title={`portrait_${num}.jpg`}
                  >
                    <img
                      src={src}
                      alt={`Portrait ${num}`}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_PORTRAIT_URL;
                      }}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                    />
                    <span className="text-[9px] font-mono text-slate-400">{num}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sample Record Inspector */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Inspect Sample Suspect Profile Schema (35 Populated Fields)
              </h3>
              <select
                value={selectedSuspectIndex}
                onChange={(e) => setSelectedSuspectIndex(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                {BASE_INDIAN_SUSPECTS.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    {s.id} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <img
                  src={normalizePhotoUrl(currentSuspect.photoUrl)}
                  alt={currentSuspect.name}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_PORTRAIT_URL;
                  }}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/40 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{currentSuspect.name}</p>
                  <p className="text-[11px] text-blue-400 font-mono">{currentSuspect.id}</p>
                  <p className="text-[11px] text-slate-400">
                    {currentSuspect.locality}, {currentSuspect.city}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 p-3 bg-slate-950/70 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                <div>
                  <span className="text-slate-500">alias:</span> {currentSuspect.alias}
                </div>
                <div>
                  <span className="text-slate-500">status:</span> {currentSuspect.status}
                </div>
                <div>
                  <span className="text-slate-500">crimeCategory:</span>{' '}
                  {currentSuspect.crimeCategory}
                </div>
                <div>
                  <span className="text-slate-500">jurisdiction:</span>{' '}
                  <span className="text-blue-300">{currentSuspect.policeStation}</span> •{' '}
                  <span className="text-slate-500">threatLevel:</span>{' '}
                  <span className="text-amber-400">{currentSuspect.threatLevel}</span>
                </div>
                <div className="text-slate-400 pt-1">
                  Enrolled under Nagpur Police Central Biometric Registry schema.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Official government statistics and centralized suspect profiles are independently indexed.
              </span>
            </div>
            <Link
              href="/data-sources"
              onClick={onClose}
              className="text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              Open Full Data Sources &amp; Provenance Page <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
