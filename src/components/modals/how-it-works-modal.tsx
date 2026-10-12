'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ScanFace, 
  FileText, 
  Layers, 
  ArrowRight, 
  Play, 
  Pause, 
  CheckCircle2, 
  Sliders, 
  Database, 
  ShieldCheck, 
  Network, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HowItWorksModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [faceWeight, setFaceWeight] = useState(0.60);
  const moWeight = parseFloat((1.0 - faceWeight).toFixed(2));

  // Auto-play animation through 5 steps
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  // Sample fusion calculation for Step 4
  const sampleFaceSim = 0.95; // 95%
  const sampleMoSim = 0.88;   // 88%
  const compositeScore = ((faceWeight * sampleFaceSim + moWeight * sampleMoSim) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[hsl(222,47%,8%)] border border-blue-500/30 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto animate-fade-in border-t-2 border-t-blue-500">
        {/* Header */}
        <div className="p-5 border-b border-[hsl(217,33%,17%)] flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Multimodal AI Pipeline: How It Works
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-500/30">
                  Dual-Modality Fusion
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing how CrimeTrack AI processes facial mugshots (pixels) and FIR narratives (text) simultaneously.
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
            { step: 1, label: '1. Ingestion' },
            { step: 2, label: '2. Encoders' },
            { step: 3, label: '3. pgvector' },
            { step: 4, label: '4. Fusion Formula' },
            { step: 5, label: '5. Intelligence Lead' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => { setActiveStep(item.step); setIsPlaying(false); }}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap",
                activeStep === item.step 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <span className={cn("w-4 h-4 rounded-full flex items-center justify-center text-[10px]", activeStep === item.step ? "bg-white text-blue-600 font-bold" : "bg-slate-800")}>
                {item.step}
              </span>
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-900 border border-slate-800 flex items-center gap-1 text-[11px]"
            title={isPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            {isPlaying ? 'Pause' : 'Autoplay'}
          </button>
        </div>

        {/* Active Stage Body */}
        <div className="p-6 md:p-8 space-y-6 flex-1 min-h-[380px]">
          {activeStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  Stage 1: Multi-Source Data Ingestion
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Incoming Evidence from Multiple Domains</h3>
                <p className="text-xs text-slate-400 mt-1">
                  The police officer uploads raw suspect mugshot (visual domain) along with an FIR narrative or suspect details (textual domain).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <ScanFace className="w-5 h-5" /> Image Modality (Visual Domain)
                  </div>
                  <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-3 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" 
                      alt="Sample Face" 
                      className="h-24 w-24 rounded-full object-cover border-2 border-blue-500/60 shadow-lg"
                    />
                    <div className="absolute inset-0 bg-blue-500/5 pointer-events-none animate-pulse rounded-xl" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Input: Raw RGB image matrix (<span className="font-mono text-blue-300">112×112×3</span> pixels).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <FileText className="w-5 h-5" /> Text Modality (NLP Domain)
                  </div>
                  <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-300 font-mono space-y-1 overflow-hidden">
                    <p className="text-amber-400 font-bold">FIR-2026-1042 (Sitabuldi PS)</p>
                    <p className="text-slate-400 text-[11px] line-clamp-3">
                      "3 suspects entered jewelry store at 14:30. Used heavy sledgehammers to smash counters, fled in grey SUV towards highway."
                    </p>
                  </div>
                  <p className="text-xs text-slate-300">
                    Input: Unstructured FIR text narrative & suspect metadata.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  Stage 2: Deep Feature Vector Extraction
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Converting Different Data Types to Dense Embeddings</h3>
                <p className="text-xs text-slate-400 mt-1">
                  How do we compare image pixels with text words? Both are translated into continuous mathematical vectors in hyperspace!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-300 flex items-center gap-1.5">
                      <ScanFace className="w-4 h-4 text-blue-400" /> ArcFace CNN (InceptionResnetV1)
                    </span>
                    <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">512-dim</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Extracts invariant geometric distances between eyes, nose bridge, jawline angle.
                  </p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/20 font-mono text-xs text-blue-300 space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase">Normalized Continuous Vector (v_face):</p>
                    <p className="truncate">[+0.142, -0.489, +0.781, -0.052, +0.631, ...]</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-purple-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-purple-400" /> Sentence-BERT (all-mpnet-base-v2)
                    </span>
                    <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">768-dim</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Extracts contextual Modus Operandi semantics (weapons, entry, timing, escape).
                  </p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-purple-500/20 font-mono text-xs text-purple-300 space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase">Dense Semantic Vector (v_mo):</p>
                    <p className="truncate">[+0.852, +0.041, -0.329, +0.612, -0.198, ...]</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Stage 3: Vector Search in PostgreSQL
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Cosine Distance Indexing with `pgvector`</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Instead of slow text matching, PostgreSQL compares angular distances between vector embeddings in milliseconds using HNSW indexes!
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <Database className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">PostgreSQL Vector Query Execution</h4>
                    <p className="text-xs text-slate-400">Using the Cosine Distance operator `&lt;=&gt;`</p>
                  </div>
                </div>
                
                <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 space-y-1.5 overflow-x-auto border border-slate-800">
                  <p className="text-blue-400">SELECT suspect_id, suspect_name,</p>
                  <p className="text-slate-300 pl-4">1 - (face_embedding &lt;=&gt; :query_face_vec) AS face_similarity,</p>
                  <p className="text-slate-300 pl-4">1 - (mo_embedding &lt;=&gt; :query_mo_vec) AS mo_similarity</p>
                  <p className="text-purple-400">FROM suspects_registry</p>
                  <p className="text-emerald-400">ORDER BY face_similarity DESC LIMIT 5;</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-slate-400">Cosine Distance Formula:</p>
                    <p className="font-mono text-emerald-400 font-bold mt-0.5">cos(θ) = (A · B) / (||A|| ||B||)</p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-slate-400">Query Latency:</p>
                    <p className="font-mono text-emerald-400 font-bold mt-0.5">~38 milliseconds over 100k vectors</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  Stage 4: Multimodal Composite Score Fusion
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Interactive Multimodal Weighting Formula</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust the live slider below to demonstrate how weights prioritize biometric vs. modus operandi leads!
                </p>
              </div>

              {/* The Live Interactive Formula Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 border border-blue-500/30 space-y-4">
                <div className="text-center p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-sm">
                  <span className="text-white font-bold">Composite Score</span> = 
                  (<span className="text-blue-400 font-bold">w_face</span> × <span className="text-blue-300">Face_Sim</span>) + 
                  (<span className="text-purple-400 font-bold">w_mo</span> × <span className="text-purple-300">MO_Sim</span>)
                </div>

                {/* Slider */}
                <div className="space-y-2 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-400 font-bold flex items-center gap-1">
                      <ScanFace className="w-4 h-4" /> Face Weight: {(faceWeight * 100).toFixed(0)}%
                    </span>
                    <span className="text-purple-400 font-bold flex items-center gap-1">
                      <FileText className="w-4 h-4" /> MO Text Weight: {(moWeight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0.10" 
                    max="0.90" 
                    step="0.05"
                    value={faceWeight}
                    onChange={(e) => setFaceWeight(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Live Calculated Output */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-slate-400">Sample Candidate: <span className="text-white font-bold">Vikram "Vicky" Sharma</span></p>
                    <p className="text-slate-500 text-[11px]">Face Sim: 95.0% • MO Text Sim: 88.0%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-[11px]">Calculated Composite:</p>
                    <p className="text-2xl font-mono font-bold text-emerald-400">{compositeScore}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Stage 5: High-Precision Investigative Lead
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Surface Repeat Offenders &amp; Unsolved Links</h3>
                <p className="text-xs text-slate-400 mt-1">
                  The officer receives an actionable lead with evidence breakdown for court corroboration!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" /> Repeat Offender / Alias Alert
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Even if the suspect gives a fake name like <em>"Rohan Gupta"</em> in Nagpur, their ArcFace biometric score (&gt;95%) matches against their Mumbai arrest record under <em>"Vikram Sharma"</em>!
                  </p>
                  <span className="inline-block text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                    Alias Cluster Verified
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <Network className="w-5 h-5" /> Cross-Jurisdiction MO Link
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If the suspect wore a helmet (face vector score low), their Sentence-BERT MO similarity (&gt;88%) autolinks the incident to 2 unsolved armed jewelry robberies in Pune East!
                  </p>
                  <span className="inline-block text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
                    Inter-Agency Case Linked
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-slate-900/80 border-t border-[hsl(217,33%,17%)] flex justify-between items-center text-xs">
          <button
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="px-4 py-2 bg-slate-800 disabled:opacity-40 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors font-semibold"
          >
            ← Previous Stage
          </button>

          <span className="text-slate-400 font-mono">Stage {activeStep} of 5</span>

          {activeStep < 5 ? (
            <button
              onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              Next Stage →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-semibold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Got It, Back to System
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
