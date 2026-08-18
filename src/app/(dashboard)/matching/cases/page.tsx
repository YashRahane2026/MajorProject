'use client';

import React, { useState } from 'react';
import { Link2, Search, FileText, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockFirs = [
  { id: 'FIR-2023-142', text: 'FIR-2023-142: Armed robbery at jewelry store in downtown.' },
  { id: 'FIR-2023-189', text: 'FIR-2023-189: Vehicle theft from residential parking.' },
  { id: 'FIR-2023-204', text: 'FIR-2023-204: Cyber fraud targeting elderly victims.' },
  { id: 'FIR-2023-256', text: 'FIR-2023-256: House burglary during night time.' },
  { id: 'FIR-2023-311', text: 'FIR-2023-311: Extortion call received from unknown number.' },
  { id: 'FIR-2023-402', text: 'FIR-2023-402: Snatching incident near railway station.' },
  { id: 'FIR-2023-455', text: 'FIR-2023-455: Drug peddling reported in university area.' },
  { id: 'FIR-2023-512', text: 'FIR-2023-512: Commercial shop break-in.' },
  { id: 'FIR-2023-678', text: 'FIR-2023-678: Phishing scam involving fake bank alerts.' },
  { id: 'FIR-2023-890', text: 'FIR-2023-890: Highway robbery involving armed gang.' },
];

const mockResults = [
  { id: 'FIR-2022-843', caseNo: 'CR-45-22', score: 92.4, type: 'ROBBERY', mo: 'Suspects entered wearing helmets, used country-made firearms to intimidate staff, targeted high-value gold ornaments.', date: '12-Nov-2022' },
  { id: 'FIR-2023-056', caseNo: 'CR-12-23', score: 87.1, type: 'ROBBERY', mo: 'Armed men on motorcycles, fired blank rounds, looted cash counter and display items.', date: '04-Feb-2023' },
  { id: 'FIR-2021-992', caseNo: 'CR-89-21', score: 79.8, type: 'ROBBERY', mo: 'Jewelry shop targeted during closing hours. Suspects cut CCTV wires before entry.', date: '28-Dec-2021' },
  { id: 'FIR-2022-411', caseNo: 'CR-33-22', score: 74.2, type: 'BURGLARY', mo: 'Commercial establishment break-in. Gas cutters used on strongroom.', date: '15-May-2022' },
  { id: 'FIR-2023-112', caseNo: 'CR-28-23', score: 68.5, type: 'DACOITY', mo: 'Gang of 5 intercepted cash van. Used stolen vehicles for escape.', date: '22-Mar-2023' },
];

export default function CasesMatchingPage() {
  const [threshold, setThreshold] = useState(0.60);
  const [inputType, setInputType] = useState<'dropdown' | 'text'>('dropdown');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);

  const handleSearch = () => {
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setLoading(false);
      setResults(mockResults);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <header className="flex items-center gap-3 mb-8 pb-4 border-b border-[hsl(217,33%,17%)]">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Link2 className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Case Linking — FIR Similarity Analysis</h1>
          <p className="text-sm text-slate-400">Discover related cases based on Modus Operandi (MO) and incident narratives.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Query Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Query Configuration</h2>
            
            <div className="flex gap-2 mb-4 p-1 bg-slate-900 rounded-lg">
              <button 
                className={cn("flex-1 text-sm py-2 rounded-md font-medium transition-colors", inputType === 'dropdown' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300')}
                onClick={() => setInputType('dropdown')}
              >
                Select Existing FIR
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Source FIR</label>
                <select className="w-full bg-slate-900 border border-[hsl(217,33%,17%)] rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                  <option value="">Select an FIR...</option>
                  {mockFirs.map(fir => (
                    <option key={fir.id} value={fir.id}>{fir.text}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Narrative Text</label>
                <textarea 
                  rows={5}
                  className="w-full bg-slate-900 border border-[hsl(217,33%,17%)] rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600"
                  placeholder="Paste the incident description or modus operandi here to find similar patterns..."
                />
              </div>
            )}

            <div className="space-y-4 mb-6 pt-2 border-t border-[hsl(217,33%,17%)]">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Semantic Threshold</label>
                <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">
                  {(threshold * 100).toFixed(0)}%
                </span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="0.99" 
                step="0.01" 
                value={threshold} 
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? 'Analyzing...' : 'Find Similar Cases'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-8">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Linked Cases — Similar Modus Operandi</h2>
              {results && (
                <span className="text-sm text-slate-400">Sorted by semantic similarity</span>
              )}
            </div>
            
            {!loading && !results && (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-[hsl(217,33%,17%)] rounded-lg bg-slate-900/30">
                <FileText className="w-12 h-12 mb-3 opacity-20" />
                <p>Select an FIR and search to discover linked cases</p>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
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
                {results.map((result) => (
                  <div key={result.id} className="p-5 border border-[hsl(217,33%,17%)] rounded-lg bg-[hsl(222,47%,6%)] hover:border-indigo-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                            {result.id}
                          </h3>
                          <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                            {result.caseNo}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded border border-red-500/20 font-medium">
                            {result.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Incident Date: {result.date}</span>
                        </div>
                      </div>
                      
                      <div className="w-24 text-right">
                        <div className="text-sm font-mono font-medium text-slate-200 mb-1">{result.score}% Match</div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${result.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-slate-900/50 rounded-md border border-slate-800/50">
                      <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        <span className="text-slate-500 font-medium mr-2">MO:</span>
                        {result.mo}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                        View Complete FIR <Link2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
