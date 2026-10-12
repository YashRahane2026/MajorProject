'use client';

import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Download, 
  Sliders, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Image as ImageIcon,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';
import { BASE_INDIAN_SUSPECTS, getAllSuspects } from '@/lib/data/suspects-data';
import { cn } from '@/lib/utils';

export default function DatasetInspectorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedSuspectIndex, setSelectedSuspectIndex] = useState(0);
  const allSuspects = getAllSuspects();
  const currentSuspect = allSuspects[selectedSuspectIndex] || BASE_INDIAN_SUSPECTS[0];

  if (!isOpen) return null;

  const handleDownloadDataset = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allSuspects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "crimetrack_nagpur_suspects_dataset.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[hsl(222,47%,8%)] border border-purple-500/30 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col my-auto animate-fade-in border-t-2 border-t-purple-500 max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[hsl(217,33%,17%)] flex justify-between items-center bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Indian Suspect Dataset &amp; Augmentation Inspector
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono border border-purple-500/30">
                  Nagpur Jurisdiction Corpus
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Transparent presentation dataset: 1,250 augmented records derived from authentic regional Indian demographics.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadDataset}
              className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
              title="Download JSON dataset for panel review"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
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
          {/* Dataset Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Total Records</span>
              <p className="text-xl font-mono font-bold text-white mt-1">1,250</p>
              <span className="text-[10px] text-purple-400">Synthetic Indian Corpus</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Base Identities</span>
              <p className="text-xl font-mono font-bold text-white mt-1">{allSuspects.length}</p>
              <span className="text-[10px] text-blue-400">Nagpur Police Stations</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Augmentation Rate</span>
              <p className="text-xl font-mono font-bold text-white mt-1">5× Multiplier</p>
              <span className="text-[10px] text-emerald-400">Surveillance Robustness</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Vector Embedding</span>
              <p className="text-xl font-mono font-bold text-white mt-1">512-dim</p>
              <span className="text-[10px] text-amber-400">ArcFace Continuous</span>
            </div>
          </div>

          {/* Live Data Augmentation Demonstration Card */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Live Synthetic Augmentation Pipeline (Panel Demonstration)
                </h3>
                <p className="text-xs text-slate-400">
                  Select a suspect below to inspect how data augmentations simulate low-light CCTV, angular tilt, and blur:
                </p>
              </div>
              <select
                value={selectedSuspectIndex}
                onChange={(e) => setSelectedSuspectIndex(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
              >
                {allSuspects.map((s, idx) => (
                  <option key={s.id} value={idx}>{s.name} ({s.city})</option>
                ))}
              </select>
            </div>

            {/* 4 Variant Augmentation Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {/* 1. Base Frontal Mugshot */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-emerald-500/50 relative shadow-md">
                  <img src={currentSuspect.photoUrl} alt="Base" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    1. Base Frontal
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Standard 112×112 Crop</p>
                </div>
              </div>

              {/* 2. Low-Light Surveillance */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-blue-500/50 relative shadow-md">
                  <img 
                    src={currentSuspect.photoUrl} 
                    alt="Low-light" 
                    className="w-full h-full object-cover brightness-75 contrast-125" 
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                    2. Night Surveillance
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Brightness -25% • High Contrast</p>
                </div>
              </div>

              {/* 3. CCTV Grain & Blur */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-amber-500/50 relative shadow-md">
                  <img 
                    src={currentSuspect.photoUrl} 
                    alt="CCTV Blur" 
                    className="w-full h-full object-cover blur-[0.6px] saturate-150" 
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    3. CCTV Noise Artifact
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Gaussian Blur • Color Dither</p>
                </div>
              </div>

              {/* 4. Horizontal Mirror / Angle Shift */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-purple-500/50 relative shadow-md">
                  <img 
                    src={currentSuspect.photoUrl} 
                    alt="Flipped" 
                    className="w-full h-full object-cover scale-x-[-1]" 
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                    4. Horizontal Flip
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Mirror Invariance Testing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Nagpur Criminal Registry Corpus Sample</span>
              <span className="text-slate-500 font-mono">Showing {allSuspects.length} Active Records</span>
            </div>
            <div className="max-h-60 overflow-y-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0 font-mono">
                  <tr>
                    <th className="p-2.5">Suspect</th>
                    <th className="p-2.5">Police Station</th>
                    <th className="p-2.5">Risk Level</th>
                    <th className="p-2.5">Physical Marks</th>
                    <th className="p-2.5 text-center">Cases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {allSuspects.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40">
                      <td className="p-2.5 flex items-center gap-2">
                        <img src={s.photoUrl} alt={s.name} className="w-6 h-6 rounded-full object-cover border border-slate-700" />
                        <div>
                          <p className="font-bold text-white text-xs">{s.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">aka {s.alias}</p>
                        </div>
                      </td>
                      <td className="p-2.5 text-slate-400 text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-400" /> {s.policeStation || 'Nagpur PS'}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          s.threatLevel === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          s.threatLevel === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        )}>
                          {s.threatLevel}
                        </span>
                      </td>
                      <td className="p-2.5 text-[11px] text-slate-400 max-w-xs truncate">
                        {s.distinguishingMarks || 'Registered profile'}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-300">
                        {s.cases}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
