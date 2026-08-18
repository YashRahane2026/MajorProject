'use client';

import React, { useState, useEffect } from 'react';
import { Microscope, BrainCircuit, Database, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const prCurveData = [
  { recall: 0.0, precision: 1.0 },
  { recall: 0.1, precision: 1.0 },
  { recall: 0.2, precision: 0.99 },
  { recall: 0.3, precision: 0.99 },
  { recall: 0.4, precision: 0.98 },
  { recall: 0.5, precision: 0.98 },
  { recall: 0.6, precision: 0.97 },
  { recall: 0.7, precision: 0.96 },
  { recall: 0.8, precision: 0.94 },
  { recall: 0.9, precision: 0.90 },
  { recall: 0.95, precision: 0.82 },
  { recall: 1.0, precision: 0.65 },
];

const topKData = [
  { name: 'K=1', accuracy: 96.4 },
  { name: 'K=3', accuracy: 98.1 },
  { name: 'K=5', accuracy: 99.2 },
  { name: 'K=10', accuracy: 99.8 },
];

const retrievalData = [
  { name: 'Theft', top1: 89.2, top5: 96.5 },
  { name: 'Robbery', top1: 86.4, top5: 94.8 },
  { name: 'Cyber', top1: 82.1, top5: 91.2 },
  { name: 'Assault', top1: 88.5, top5: 97.1 },
  { name: 'Narcotics', top1: 85.6, top5: 93.9 },
];

const MetricCard = ({ title, value, label }: { title: string, value: string, label?: string }) => (
  <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm">
    <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
    <div className="flex items-end gap-2">
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      {label && <span className="text-sm text-slate-500 mb-1">{label}</span>}
    </div>
  </div>
);

export default function EvaluationMetricsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <header className="flex items-center gap-3 mb-8 pb-4 border-b border-[hsl(217,33%,17%)]">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Microscope className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">ML Model Evaluation Metrics</h1>
          <p className="text-sm text-slate-400">Quantitative assessment of recognition and retrieval algorithms.</p>
        </div>
      </header>

      {/* Section 1: Face Recognition */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <BrainCircuit className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Face Recognition — ArcFace Evaluation</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard title="Precision" value="94.2%" />
          <MetricCard title="Recall" value="91.8%" />
          <MetricCard title="F1-Score" value="93.0%" />
          <MetricCard title="Top-1 Accuracy" value="96.4%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5">
            <h3 className="text-md font-medium text-slate-200 mb-4">Precision-Recall Curve</h3>
            <div className="h-[280px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={prCurveData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                    <defs>
                      <linearGradient id="colorPrecision" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                    <XAxis 
                      dataKey="recall" 
                      type="number" 
                      domain={[0, 1]} 
                      tickCount={6}
                      stroke="#64748b" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      label={{ value: 'Recall', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 1]} 
                      tickCount={6}
                      stroke="#64748b" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      label={{ value: 'Precision', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                      formatter={(value: any) => [Number(value).toFixed(3), 'Precision']}
                      labelFormatter={(label: any) => `Recall: ${Number(label).toFixed(2)}`}
                    />
                    <Area type="monotone" dataKey="precision" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrecision)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5">
            <h3 className="text-md font-medium text-slate-200 mb-4">Top-K Accuracy</h3>
            <div className="h-[280px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topKData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis domain={[90, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${val}%`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                      cursor={{ fill: 'rgba(51, 65, 85, 0.4)' }}
                      formatter={(value: any) => [`${value}%`, 'Accuracy']}
                    />
                    <Bar dataKey="accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: FIR Linking */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-semibold text-white">FIR Linking — Sentence-BERT Evaluation</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard title="Top-1 Accuracy" value="87.3%" />
          <MetricCard title="Top-5 Accuracy" value="95.6%" />
          <MetricCard title="MRR" value="0.912" label="Mean Reciprocal Rank" />
          <MetricCard title="NDCG@10" value="0.934" />
        </div>

        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5">
          <h3 className="text-md font-medium text-slate-200 mb-4">Retrieval Accuracy by Crime Type</h3>
          <div className="h-[320px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={retrievalData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis domain={[60, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${val}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    cursor={{ fill: 'rgba(51, 65, 85, 0.4)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="top1" name="Top-1 Accuracy" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="top5" name="Top-5 Accuracy" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Dataset Info */}
      <section>
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Evaluation Dataset Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Face Recognition</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Identities: 1,680</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Total Images: 13,233</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Test Pairs: 5,749 (positive/negative)</li>
                <li className="mt-2 text-slate-500 italic text-xs">Based on LFW (Labeled Faces in the Wild) benchmark + Custom HQ subset</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">FIR Semantic Linking</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Corpus Size: 500 FIRs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> MO Clusters: 20 distinct categories</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Test Queries: 100 unseen narratives</li>
                <li className="mt-2 text-slate-500 italic text-xs">Synthetic FIR corpus generated with controlled near-duplicate MO clusters</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
