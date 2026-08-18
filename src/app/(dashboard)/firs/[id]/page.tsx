'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, MapPin, User, Link as LinkIcon, Network, FileSearch } from 'lucide-react';

export default function FIRDetailPage({ params }: { params: { id: string } }) {
  const firId = params.id || 'FIR-2026-1042';
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/firs" className="p-2 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-amber-500" />
              <h1 className="text-2xl font-bold font-mono text-white">{firId}</h1>
              <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md text-[10px] font-medium">INVESTIGATING</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">Filed on Aug 10, 2026 at Central Police Station</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] hover:bg-white/5 text-slate-300 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Document */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#fdfbf7] dark:bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-sm p-8 font-serif relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-8xl font-bold transform -rotate-45 text-slate-900 dark:text-white">POLICE COPY</span>
            </div>
            
            <h2 className="text-xl font-bold text-center mb-6 text-slate-900 dark:text-white border-b pb-4 dark:border-[hsl(217,33%,17%)]">FIRST INFORMATION REPORT (FIR)</h2>
            
            <div className="space-y-6 text-sm text-slate-800 dark:text-slate-300 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>1. District:</strong> Mumbai</div>
                <div><strong>PS:</strong> Central PS</div>
                <div><strong>2. Year:</strong> 2026</div>
                <div><strong>FIR No:</strong> 1042</div>
                <div><strong>3. Date/Time of FI:</strong> 10/08/2026 15:45</div>
                <div><strong>Acts & Sections:</strong> IPC 392, 397</div>
              </div>

              <div>
                <strong>4. Complainant / Informant:</strong><br/>
                Name: Ramesh Patel<br/>
                Occupation: Store Manager, Laxmi Jewellers<br/>
                Address: 45, MG Road, Mumbai
              </div>

              <div>
                <strong>5. Details of known/suspected/unknown accused with full particulars:</strong><br/>
                Three unknown males, approx 25-30 years of age. One wearing a red cap, others with faces covered by scarves. Armed with handguns.
              </div>

              <div className="border-t border-b dark:border-[hsl(217,33%,17%)] py-4 my-6">
                <strong>6. Narrative / Details of incident:</strong><br/>
                <p className="mt-2 leading-relaxed text-justify">
                  On 10th August 2026, at approximately 14:30 hrs, three armed individuals entered Laxmi Jewellers. They immediately ordered all staff and customers to lie on the floor at gunpoint. One individual stood guard at the door while the other two proceeded to smash the main display cases using hammers they brought with them. They emptied the contents (primarily gold necklaces and diamond rings, inventory attached) into two large black duffel bags. The entire incident lasted approximately 3 minutes. The suspects fled the scene in a grey SUV parked outside, bearing partial license plate MH-02. The vehicle headed south towards the highway. No one was injured during the incident.
                </p>
              </div>

              <div className="pt-8 flex justify-between">
                <div className="text-center">
                  <div className="border-b border-dashed dark:border-slate-500 w-32 mb-1"></div>
                  Signature of Complainant
                </div>
                <div className="text-center">
                  <div className="border-b border-dashed dark:border-slate-500 w-40 mb-1">Insp. R. Patil</div>
                  Signature of Officer
                </div>
              </div>
            </div>
          </div>

          {/* AI Extracted MO */}
          <div className="bg-[hsl(222,47%,8%)] border border-blue-500/30 rounded-xl overflow-hidden shadow-sm relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-blue-500/5 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-400" /> AI Extracted Modus Operandi
              </h3>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-medium">AUTO-GENERATED</span>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {['Daytime armed robbery (14:30)', 'Group of 3', 'Targeted jewelry displays', 'Use of hammers for smashing', 'Black duffel bags', 'Grey SUV getaway'].map((tag, i) => (
                <span key={i} className="bg-[hsl(217,33%,17%)] text-slate-300 text-xs px-2.5 py-1.5 rounded-md border border-[hsl(217,33%,25%)]">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Metadata & Similar FIRs */}
        <div className="space-y-6">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-medium text-slate-300 mb-4 uppercase tracking-wider">Related Case</h3>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 block">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-4 h-4 text-blue-400" />
                <Link href="/cases/CASE-2026-084" className="font-mono text-sm font-bold text-blue-400 hover:underline">CASE-2026-084</Link>
              </div>
              <p className="text-sm font-medium text-slate-200">Armed Robbery at Jeweller</p>
              <p className="text-xs text-slate-500 mt-1">Status: Active Investigation</p>
            </div>
          </div>

          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileSearch className="w-4 h-4" /> Similar FIRs
              </h3>
              <span className="text-[10px] bg-[hsl(217,33%,17%)] text-slate-400 px-2 py-0.5 rounded">AI Match</span>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'FIR-2025-0891', sim: 89, desc: 'Jewellery store robbery in Thane, 3 suspects, grey car.' },
                { id: 'FIR-2025-0422', sim: 76, desc: 'Armed robbery at electronics store, daytime, hammers used.' },
                { id: 'FIR-2024-1105', sim: 65, desc: 'Bank robbery, 4 suspects, duffel bags used.' },
              ].map((fir, i) => (
                <div key={i} className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg p-3 hover:bg-[hsl(217,33%,12%)] transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs text-white">{fir.id}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${fir.sim > 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {fir.sim}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{fir.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
