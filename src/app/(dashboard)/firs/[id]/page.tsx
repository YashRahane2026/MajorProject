'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  MapPin, 
  User, 
  Link as LinkIcon, 
  Network, 
  FileSearch,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Zap,
  ExternalLink,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FIRDetailPage({ params }: { params: { id: string } }) {
  const firId = params.id || 'FIR-2026-1042';
  const [selectedMatch, setSelectedMatch] = useState<number | null>(0);

  const similarFirs = [
    { 
      id: 'FIR-2025-0891', 
      ps: 'Thane West PS', 
      sim: 92.4, 
      crimeType: 'Robbery',
      mo: '3 armed suspects entered jewelry store during daytime, used heavy hammers to smash display cases, packed gold into black duffel bags, getaway in grey sedan.', 
      keywords: ['Daytime armed robbery', 'Hammer glass smash', 'Black duffel bags', 'Grey getaway car']
    },
    { 
      id: 'FIR-2025-0422', 
      ps: 'Lonavala Rural PS', 
      sim: 84.1, 
      crimeType: 'Robbery',
      mo: 'Armed robbery at electronics showroom, 3 suspects with faces covered, smashed glass display counters, 3 minute operation time.', 
      keywords: ['3 suspects', 'Glass display smash', '3-min execution']
    },
    { 
      id: 'FIR-2024-1105', 
      ps: 'Pune Camp PS', 
      sim: 76.8, 
      crimeType: 'Extortion / Robbery',
      mo: 'Bank Cash Counter robbery at gunpoint, black duffel bags used for cash storage.', 
      keywords: ['Gunpoint robbery', 'Black duffel bags']
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[hsl(217,33%,17%)] pb-4">
        <div className="flex items-center gap-4">
          <Link href="/firs" className="p-2 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-amber-500" />
              <h1 className="text-2xl font-bold font-mono text-white">{firId}</h1>
              <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md text-xs font-semibold">UNDER INVESTIGATION</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">Filed on Aug 10, 2026 at Sitabuldi Police Station, Nagpur</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()} 
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            Print Official FIR
          </button>
          <Link href="/matching/cases" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20 gap-2">
            <Zap className="w-4 h-4" /> Run FIR Similarity Search
          </Link>
        </div>
      </div>

      {/* NLP Modus Operandi Linkage Banner */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-blue-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Sentence-BERT NLP Auto-Linked Unsolved Cases (vector 768-d)</p>
            <p className="text-xs text-blue-300/80">Semantic narrative embeddings automatically identified 3 historical FIRs sharing identical Modus Operandi patterns across 3 different police stations.</p>
          </div>
        </div>
        <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg font-mono border border-blue-500/30 whitespace-nowrap self-start md:self-auto">
          Model: all-mpnet-base-v2
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Document */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#fdfbf7] dark:bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-sm p-8 font-serif relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-8xl font-bold transform -rotate-45 text-slate-900 dark:text-white">POLICE COPY</span>
            </div>
            
            <h2 className="text-xl font-bold text-center mb-6 text-slate-900 dark:text-white border-b pb-4 dark:border-[hsl(217,33%,17%)] tracking-tight">
              FIRST INFORMATION REPORT (FIR)
            </h2>
            
            <div className="space-y-6 text-sm text-slate-800 dark:text-slate-300 relative z-10">
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div><strong>1. District:</strong> Nagpur</div>
                <div><strong>Police Station:</strong> Sitabuldi PS</div>
                <div><strong>2. Year:</strong> 2026</div>
                <div><strong>FIR No:</strong> 1042</div>
                <div><strong>3. Date/Time:</strong> 10/08/2026 14:30</div>
                <div><strong>Sections:</strong> IPC 392, 397 (Armed Robbery)</div>
              </div>

              <div>
                <strong className="text-slate-200">4. Complainant / Informant:</strong><br/>
                Name: Ramesh Deshmukh<br/>
                Occupation: Store Manager, Shree Jewellers<br/>
                Location: Sitabuldi Main Road, Nagpur
              </div>

              <div>
                <strong className="text-slate-200">5. Accused Details:</strong><br/>
                Three unidentified males, age group 25-30 yrs. One wearing red cap, faces covered with dark scarves. Armed with handguns.
              </div>

              <div className="border-t border-b dark:border-[hsl(217,33%,17%)] py-4 my-6">
                <strong className="text-slate-200">6. Narrative / Incident Details:</strong><br/>
                <p className="mt-2 leading-relaxed text-justify text-xs font-sans text-slate-300">
                  On 10th August 2026, at approximately 14:30 hrs, three armed individuals entered Shree Jewellers on Sitabuldi Main Road. They immediately ordered all staff and customers to lie on the floor at gunpoint. One suspect stood guard at the rear exit while the other two used heavy hammers brought in black duffel bags to smash the main glass display counters. They packed gold ornaments valued at Rs. 45 Lakhs and fled in a grey SUV towards the highway. Operation completed in ~3 minutes.
                </p>
              </div>

              <div className="pt-4 flex justify-between text-xs font-mono text-slate-400">
                <div className="text-center">
                  <div className="border-b border-dashed dark:border-slate-600 w-32 mb-1"></div>
                  Complainant Signature
                </div>
                <div className="text-center">
                  <div className="border-b border-dashed dark:border-slate-600 w-40 mb-1">Insp. Mohan Patil</div>
                  Investigating Officer
                </div>
              </div>
            </div>
          </div>

          {/* AI Extracted MO Keywords */}
          <div className="bg-[hsl(222,47%,8%)] border border-blue-500/30 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-blue-500/5 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-400" /> Extracted Modus Operandi (MO) Keywords
              </h3>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">NLP KEYWORDS</span>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {[
                'Daytime armed robbery (14:30)', 
                'Group of 3 suspects', 
                'Jewelry store display target', 
                'Hammer glass smash technique', 
                'Black duffel bag storage', 
                'Grey SUV getaway'
              ].map((tag, i) => (
                <span key={i} className="bg-blue-500/10 text-blue-300 text-xs px-3 py-1.5 rounded-lg border border-blue-500/20 flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-blue-400" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Similar FIRs & NLP MO Comparison */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[hsl(217,33%,17%)] pb-3">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-blue-400" /> Auto-Linked Cases (MO Match)
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                Sentence-BERT
              </span>
            </div>
            
            <div className="space-y-3">
              {similarFirs.map((fir, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedMatch(i)}
                  className={cn(
                    "border rounded-xl p-4 transition-all cursor-pointer",
                    selectedMatch === i 
                      ? "bg-blue-500/10 border-blue-500/40 ring-1 ring-blue-500/30" 
                      : "bg-[hsl(222,47%,6%)] border-[hsl(217,33%,17%)] hover:bg-slate-800/40"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-blue-400" /> {fir.id}
                    </span>
                    <span className={cn(
                      "text-xs font-mono font-bold px-2 py-0.5 rounded border",
                      fir.sim > 90 
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                        : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    )}>
                      {fir.sim}% MO Similarity
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mb-2">{fir.ps} • {fir.crimeType}</p>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{fir.mo}</p>
                  
                  {/* Matching Keyword Tags */}
                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-slate-800">
                    {fir.keywords.map((kw, k) => (
                      <span key={k} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Match MO Breakdown Card */}
          {selectedMatch !== null && (
            <div className="bg-[hsl(222,47%,8%)] border border-emerald-500/30 rounded-xl p-5 shadow-sm space-y-3 bg-emerald-500/5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> MO Correlation Analysis
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The NLP embedding vector for <strong>{firId}</strong> matches <strong>{similarFirs[selectedMatch].id}</strong> at <strong>{similarFirs[selectedMatch].sim}% cosine similarity</strong>. Both crimes share the same specific execution signature (hammer smashing, grey getaway vehicle, 3-min window).
              </p>
              <div className="pt-2 flex justify-end">
                <Link href={`/matching/cases`} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  Compare in Case Linking Workbench <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
