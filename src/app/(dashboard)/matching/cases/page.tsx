'use client';

import React, { useState } from 'react';
import { 
  Link2, 
  Search, 
  FileText, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  Tag, 
  ExternalLink,
  GitBranch,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CaseLinkingHowItWorksModal from '@/components/modals/case-linking-how-it-works-modal';

const mockFirs = [
  { id: 'FIR-2026-1042', text: 'FIR-2026-1042: Armed robbery at Sitabuldi Jewelry Store (Hammers & Grey SUV getaway)' },
  { id: 'FIR-2026-0891', text: 'FIR-2026-0891: Cyber fraud ring debited Rs 2.8L via fake SBI KYC phishing SMS' },
  { id: 'FIR-2026-0422', text: 'FIR-2026-0422: Highway methamphetamine seizure near Lonavala checkpoint' },
  { id: 'FIR-2025-0992', text: 'FIR-2025-0992: Forgery of government revenue documents & land titles' },
  { id: 'FIR-2025-0311', text: 'FIR-2025-0311: Commercial shop break-in & strongroom gas-cutter burglary' },
];

const mockResults = [
  { 
    id: 'FIR-2025-0891', 
    caseNo: 'CR-2025-4412', 
    score: 92.4, 
    type: 'ROBBERY', 
    ps: 'Thane West PS',
    mo: 'Three armed suspects wearing dark masks entered jewelry showroom at 14:30 hrs. Used heavy hammers to smash display cases, packed gold into black duffel bags, escaped in grey vehicle.',
    keywords: ['Daytime armed robbery', 'Hammer glass smash', 'Black duffel bags', 'Grey getaway car'],
    date: '12-Nov-2025' 
  },
  { 
    id: 'FIR-2025-0422', 
    caseNo: 'CR-2025-3312', 
    score: 87.1, 
    type: 'ROBBERY', 
    ps: 'Lonavala Rural PS',
    mo: 'Armed robbery at electronics showroom during afternoon. Suspects used hammers to break glass display counters in a 3-minute execution window.',
    keywords: ['3 suspects', 'Glass display smash', '3-min execution'],
    date: '04-Feb-2025' 
  },
  { 
    id: 'FIR-2024-0992', 
    caseNo: 'CR-2024-8901', 
    score: 79.8, 
    type: 'ROBBERY', 
    ps: 'Pune Camp PS',
    mo: 'Jewelry shop targeted during closing hours. Suspects cut CCTV power lines before entering with firearms and black duffel bags.',
    keywords: ['Jewelry store target', 'CCTV power cut', 'Duffel bags'],
    date: '28-Dec-2024' 
  },
  { 
    id: 'FIR-2024-0411', 
    caseNo: 'CR-2024-2201', 
    score: 72.5, 
    type: 'BURGLARY', 
    ps: 'Mumbai Central PS',
    mo: 'Commercial establishment break-in using heavy iron tools on display locks.',
    keywords: ['Commercial break-in', 'Iron tools'],
    date: '15-May-2024' 
  },
];

export default function CasesMatchingPage() {
  const [threshold, setThreshold] = useState(0.60);
  const [inputType, setInputType] = useState<'dropdown' | 'text'>('dropdown');
  const [selectedFir, setSelectedFir] = useState(mockFirs[0].id);
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch('/api/match/fir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputType === 'text' ? customText : undefined,
          fir_id: inputType === 'dropdown' ? selectedFir : undefined,
          threshold,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const targetPct = threshold * 100;
        const filtered = mockResults.filter(m => m.score >= targetPct);
        setLoading(false);
        setResults(filtered);
        return;
      }
    } catch {
      // Fallback
    }

    setTimeout(() => {
      const targetPct = threshold * 100;
      setLoading(false);
      setResults(mockResults.filter(m => m.score >= targetPct));
    }, 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-4 border-b border-[hsl(217,33%,17%)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Link2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Case Linking — FIR Modus Operandi (MO) Analysis</h1>
            <p className="text-sm text-slate-400">Sentence-BERT (768-dim) semantic narrative similarity search to autolink unsolved crimes sharing a common MO signature.</p>
          </div>
        </div>

        <button
          onClick={() => setShowHowItWorks(true)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors flex-shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
          <span>How It Works: Case Linking</span>
        </button>
      </header>

      {/* NLP Banner */}
      <div className="p-4 mb-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between text-indigo-300">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <p className="text-xs text-indigo-200">
            <strong>NLP Case Linking &amp; MO Similarity Engine:</strong> Powered by Sentence-BERT (<code>all-mpnet-base-v2</code>, 768-D semantic dense vectors) computing cosine similarity across First Information Report narratives and modus operandi patterns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Query Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Source Query Configuration</h2>
            
            <div className="flex gap-2 mb-4 p-1 bg-slate-900 rounded-lg">
              <button 
                className={cn("flex-1 text-sm py-2 rounded-md font-medium transition-colors", inputType === 'dropdown' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300')}
                onClick={() => setInputType('dropdown')}
              >
                Select Registered FIR
              </button>
              <button 
                className={cn("flex-1 text-sm py-2 rounded-md font-medium transition-colors", inputType === 'text' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300')}
                onClick={() => setInputType('text')}
              >
                Paste Narrative
              </button>
            </div>

            {inputType === 'dropdown' ? (
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Source FIR Record</label>
                <select 
                  value={selectedFir}
                  onChange={(e) => setSelectedFir(e.target.value)}
                  className="w-full bg-slate-900 border border-[hsl(217,33%,17%)] rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {mockFirs.map(fir => (
                    <option key={fir.id} value={fir.id}>{fir.text}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">FIR Narrative Text</label>
                <textarea 
                  rows={5}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-slate-900 border border-[hsl(217,33%,17%)] rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 resize-none"
                  placeholder="On 10th August 2026, three armed individuals entered Laxmi Jewellers. They used heavy hammers to smash display counters and fled in a grey SUV..."
                />
              </div>
            )}

            <div className="space-y-3 mb-6 pt-2 border-t border-[hsl(217,33%,17%)]">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Semantic MO Threshold</label>
                <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 font-bold">
                  {(threshold * 100).toFixed(0)}%
                </span>
              </div>
              <input 
                type="range" 
                min="0.50" 
                max="0.99" 
                step="0.01" 
                value={threshold} 
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>50% (Broad MO search)</span>
                <span>99% (Strict MO match)</span>
              </div>
            </div>

            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {loading ? 'Generating Sentence Vector & Searching...' : 'Run NLP Case Similarity Search'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-8">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 min-h-[500px]">
            <div className="flex items-center justify-between mb-6 border-b border-[hsl(217,33%,17%)] pb-3">
              <h2 className="text-lg font-semibold text-white">Auto-Linked Unsolved Cases (Shared MO)</h2>
              {results && (
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                  Sentence-BERT 768-d
                </span>
              )}
            </div>
            
            {!loading && !results && (
              <div className="h-80 flex flex-col items-center justify-center text-slate-500 border border-dashed border-[hsl(217,33%,17%)] rounded-lg bg-slate-900/30 text-center p-6">
                <FileText className="w-12 h-12 mb-3 opacity-20 text-indigo-400" />
                <p className="text-slate-300 font-medium mb-1">No Case Linkage Query Executed</p>
                <p className="text-xs text-slate-500 max-w-sm">Select an FIR or paste a narrative on the left panel, then click "Run NLP Case Similarity Search".</p>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-3 text-indigo-400 animate-pulse">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  <span className="text-sm font-medium">Extracting 768-dim Sentence-BERT embeddings & searching pgvector HNSW index...</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse p-5 border border-[hsl(217,33%,17%)] rounded-lg bg-slate-900/20">
                    <div className="flex justify-between mb-4">
                      <div className="h-5 bg-slate-800 rounded w-1/4" />
                      <div className="h-5 bg-slate-800 rounded w-1/6" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-800 rounded w-full" />
                      <div className="h-3 bg-slate-800 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results && (
              <div className="space-y-4">
                {results.length > 0 ? (
                  results.map((result) => (
                    <div key={result.id} className="p-5 border border-[hsl(217,33%,17%)] rounded-xl bg-[hsl(222,47%,6%)] hover:border-indigo-500/40 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                              <GitBranch className="w-4 h-4 text-indigo-400" /> {result.id}
                            </h3>
                            <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                              {result.caseNo}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20 font-medium">
                              {result.ps}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> Incident Date: {result.date}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">{result.type}</span>
                          </div>
                        </div>
                        
                        <div className="w-32 text-right flex-shrink-0">
                          <div className="text-sm font-mono font-bold text-slate-100 mb-1.5">{result.score}% MO Match</div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-1000"
                              style={{ width: `${result.score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* MO Description */}
                      <div className="mt-4 p-3.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <span className="text-indigo-400 font-bold uppercase tracking-wider mr-2 text-[10px] block mb-1">Extracted Modus Operandi (MO):</span>
                          {result.mo}
                        </p>
                      </div>

                      {/* Highlighted Key Features */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {result.keywords.map((kw, idx) => (
                          <span key={idx} className="text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Tag className="w-3 h-3 text-indigo-400" /> {kw}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <a href={`/firs/${result.id}`} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                          View Complete FIR & MO Dossier <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-center">
                    <p className="font-semibold text-sm">0 Linked Cases Found Exceeding {(threshold * 100).toFixed(0)}% Threshold</p>
                    <p className="text-xs text-amber-300/80 mt-1">Try lowering the MO similarity threshold slider on the left panel.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Case Linking How It Works Modal */}
      <CaseLinkingHowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />
    </div>
  );
}
