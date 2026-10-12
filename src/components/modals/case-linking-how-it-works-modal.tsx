'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Link2, 
  FileText, 
  Brain, 
  Network, 
  Database, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Pause, 
  GitBranch, 
  ShieldCheck, 
  Zap, 
  Search, 
  Layers,
  RotateCcw,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CaseLinkingHowItWorksModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simCutoff, setSimCutoff] = useState(0.70);

  // Auto-advance through the 5 stages when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[hsl(222,47%,8%)] border border-indigo-500/30 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto animate-fade-in border-t-2 border-t-indigo-500">
        
        {/* Header */}
        <div className="p-5 border-b border-[hsl(217,33%,17%)] flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Sentence-BERT FIR Case Linking Engine
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono border border-indigo-500/30">
                  NLP Semantic Matching
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing how CrimeTrack AI extracts 768-dim semantic vectors from unstructured FIR narratives to link modus operandi (MO) signatures.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Navigation */}
        <div className="p-3 bg-slate-950/80 border-b border-[hsl(217,33%,17%)] flex items-center justify-between gap-1 overflow-x-auto text-xs">
          {[
            { step: 1, label: '1. Narrative Tokenization' },
            { step: 2, label: '2. SBERT 768-D Embedding' },
            { step: 3, label: '3. pgvector Cosine Search' },
            { step: 4, label: '4. MO Pattern Linking' },
            { step: 5, label: '5. Syndicate Graph' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => { setActiveStep(item.step); setIsPlaying(false); }}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap",
                activeStep === item.step 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <span className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center text-[10px]", 
                activeStep === item.step ? "bg-white text-indigo-600 font-bold" : "bg-slate-800"
              )}>
                {item.step}
              </span>
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg ml-2 flex-shrink-0"
            title={isPlaying ? "Pause auto-walkthrough" : "Play auto-walkthrough"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>

        {/* Dynamic Interactive Stage Body */}
        <div className="p-6 min-h-[380px] flex flex-col justify-center">
          
          {/* STAGE 1: NARRATIVE INGESTION & NLP PREPROCESSING */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Stage 1: Unstructured Police FIR Ingestion &amp; Key MO Extraction
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    First Information Reports (FIRs) contain diverse human phrasing across Marathi, Hindi, and English. The NLP engine tokenizes and isolates key behavioral tactics.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Input: Raw Narrative Text
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-semibold text-slate-300">Raw Police FIR Narrative</span>
                    <span className="font-mono text-indigo-400">FIR-2026-1042</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    "At 02:15 hrs, <span className="bg-amber-500/20 text-amber-300 px-1 rounded">three masked perpetrators</span> cut padlock using gas cutter, smashed internal glass display with heavy hammers, collected <span className="bg-purple-500/20 text-purple-300 px-1 rounded">gold jewelry into black duffel bags</span>, fled in an <span className="bg-blue-500/20 text-blue-300 px-1 rounded">unregistered grey SUV</span> towards Amravati Highway."
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3">
                  <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-indigo-400" />
                    Isolated Behavioral &amp; Tactical Entities (NER)
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Entry Method:</span>
                      <span className="text-amber-400 font-semibold">Gas Torch / Lock Snip</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Weapon / Tool:</span>
                      <span className="text-blue-400 font-semibold">Heavy Iron Hammers</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Target Goods:</span>
                      <span className="text-purple-400 font-semibold">Showcase Gold Jewelry</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Getaway Signature:</span>
                      <span className="text-emerald-400 font-semibold">Grey SUV Corridor Run</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: SENTENCE-BERT TRANSFORMER EMBEDDING */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    Stage 2: Sentence-BERT (SBERT) Deep Semantic Embeddings
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Traditional keyword search fails when officers use synonyms (e.g. "sledgehammer smash" vs "shattered glass counters"). SBERT maps narratives into dense mathematical conceptual spaces.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Model: paraphrase-MiniLM-L6-v2
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-1">Transformer Architecture</span>
                    <span className="text-white font-mono font-bold">BERT MiniLM (6-layer)</span>
                    <p className="text-[10px] text-slate-500 mt-1">Self-attention contextual heads</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-1">Embedding Output</span>
                    <span className="text-purple-400 font-mono font-bold">768 Float32 Dimensions</span>
                    <p className="text-[10px] text-slate-500 mt-1">L2-normalized dense vector</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-1">Loss Function</span>
                    <span className="text-emerald-400 font-mono font-bold">Triplet Cosine Loss</span>
                    <p className="text-[10px] text-slate-500 mt-1">Trained on matched criminal MOs</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-lg border border-indigo-500/20 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Generated Vector e_fir [768-D snippet]:</span>
                    <span className="text-emerald-400">||e|| = 1.000 (Normalized)</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded text-[10px] text-indigo-300 tracking-wider break-all border border-slate-800">
                    [+0.0482, -0.1924, +0.3129, +0.0091, -0.4418, +0.1192, -0.0763, +0.2281, +0.1504, -0.0932, +0.3810, -0.1129, +0.0543, ...]
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: PGVECTOR HIGH-DIMENSIONAL COSINE SEARCH */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Stage 3: Vector Database (pgvector HNSW Cosine Index)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    The 768-dim query vector is matched against thousands of historical FIRs in milliseconds using Hierarchical Navigable Small World (HNSW) graphs.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Query Time: &lt; 18ms
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                  <div className="text-[11px] text-cyan-400 font-semibold mb-2">Live SQL / pgvector Query:</div>
                  <pre className="text-[11px] text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
{`SELECT fir_no, police_station, mo_text,
  1 - (mo_embedding <=> $query_vector) 
    AS cosine_similarity
FROM police_firs
WHERE (1 - (mo_embedding <=> $query_vector)) 
      >= 0.60
ORDER BY cosine_similarity DESC
LIMIT 10;`}
                  </pre>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Ranked Semantic Neighbors</span>
                    <span className="text-[10px] text-slate-500">Distance Metric: Cosine</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-emerald-400 block">CR-2025-4412 (Thane West PS)</span>
                        <span className="text-[11px] text-slate-400">Hammer jewelry smash, 3 dark masks, grey car</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-sm">92.4%</span>
                    </div>

                    <div className="p-2.5 rounded bg-blue-500/10 border border-blue-500/30 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-blue-400 block">CR-2025-3312 (Lonavala Rural PS)</span>
                        <span className="text-[11px] text-slate-400">Afternoon hammer counter smash, 3-min getaway</span>
                      </div>
                      <span className="font-mono font-bold text-blue-400 text-sm">87.1%</span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-300 block">CR-2024-8901 (Pune Camp PS)</span>
                        <span className="text-[11px] text-slate-400">Jewelry store target, black duffel bags, CCTV cut</span>
                      </div>
                      <span className="font-mono font-bold text-slate-300 text-sm">79.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: MODUS OPERANDI FUSION & THRESHOLDING */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    Stage 4: Threshold Filtering &amp; Legal Signature Verification
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Investigators can calibrate sensitivity. Lowering the threshold links broader syndicate activities; raising it isolates exact copycat executions.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Active Cutoff: {(simCutoff * 100).toFixed(0)}%
                </span>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block">Adjust Similarity Threshold:</label>
                    <span className="text-[11px] text-slate-400">Controls minimum semantic confidence needed to flag case as linked.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="0.50" 
                      max="0.95" 
                      step="0.05" 
                      value={simCutoff}
                      onChange={(e) => setSimCutoff(parseFloat(e.target.value))}
                      className="w-40 accent-indigo-500 cursor-pointer"
                    />
                    <span className="font-mono font-bold text-indigo-400 w-12 text-right">
                      {(simCutoff * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Classification Outcome:</span>
                    <span className={cn(
                      "font-semibold px-2 py-0.5 rounded text-[10px]",
                      simCutoff <= 0.85 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    )}>
                      {simCutoff <= 0.85 ? '3 Highly Correlated Prior FIRs Identified' : 'Strict Match: 1 Exact Match Identified'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Cases exceeding {(simCutoff * 100).toFixed(0)}% semantic score share identical entry tools (gas cutter), targets (showcase gold), and escape tactics, establishing prima facie grounds for joint investigation under Section 111 (Organized Crime).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: CRIMINAL SYNDICATE NETWORK GRAPH */}
          {activeStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-emerald-400" />
                    Stage 5: Cross-Jurisdiction Crime Syndicate Lead Graph
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    The final output synthesizes isolated local FIRs into a unified regional crime syndicate cluster, empowering detectives with inter-district coordination leads.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Syndicate Detected: 3 Districts
                </span>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/30 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[11px] block">Query Incident</span>
                    <p className="font-bold text-white text-xs mt-1">Sitabuldi PS (Nagpur)</p>
                    <span className="text-[10px] text-indigo-400 font-mono">FIR-2026-1042</span>
                  </div>

                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/40 text-center">
                    <span className="text-emerald-400 text-[11px] block font-semibold">Matched Hub (92.4%)</span>
                    <p className="font-bold text-white text-xs mt-1">Thane West PS</p>
                    <span className="text-[10px] text-emerald-300 font-mono">Linked Suspect: Vicky Sharma</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[11px] block">Secondary Link (87.1%)</span>
                    <p className="font-bold text-white text-xs mt-1">Lonavala Rural PS</p>
                    <span className="text-[10px] text-blue-400 font-mono">CR-2025-3312</span>
                  </div>
                </div>

                <div className="p-3.5 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200">
                      <strong>Automated Action:</strong> Inter-district Special Investigation Team (SIT) alert dispatched to Nagpur Crime Branch and Thane Police.
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500 text-white font-bold text-[10px] uppercase">
                    Lead Confirmed
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-[hsl(217,33%,17%)] flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <button
              disabled={activeStep === 1}
              onClick={() => { setActiveStep(prev => Math.max(1, prev - 1)); setIsPlaying(false); }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-medium transition-colors"
            >
              Previous Step
            </button>
            <button
              disabled={activeStep === 5}
              onClick={() => { setActiveStep(prev => Math.min(5, prev + 1)); setIsPlaying(false); }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold flex items-center gap-1 transition-colors"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveStep(1); setIsPlaying(true); }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
              title="Restart auto-walkthrough"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
