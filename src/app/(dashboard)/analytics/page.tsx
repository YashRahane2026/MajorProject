'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Activity, BarChart3, Network, Target } from 'lucide-react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center text-slate-500">Loading Network Graph...</div> });

// Mock data for Network Graph
const mockGraphData = {
  nodes: Array.from({ length: 20 }).map((_, i) => ({
    id: `n${i}`,
    name: `Suspect ${i+1}`,
    val: Math.random() * 5 + 3,
    color: ['#ef4444', '#f97316', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)]
  })),
  links: Array.from({ length: 30 }).map(() => ({
    source: `n${Math.floor(Math.random() * 20)}`,
    target: `n${Math.floor(Math.random() * 20)}`,
    value: Math.random() * 0.5 + 0.5
  })).filter(l => l.source !== l.target)
};

// Mock data for Heatmap
const heatmapData = [
  { id: 'Armed Robbery', 'Nagpur': 85, 'Mumbai': 92, 'Pune': 45, 'Delhi': 78, 'Hyderabad': 34 },
  { id: 'Cyber Fraud', 'Nagpur': 42, 'Mumbai': 98, 'Pune': 88, 'Delhi': 95, 'Hyderabad': 89 },
  { id: 'Burglary', 'Nagpur': 76, 'Mumbai': 65, 'Pune': 72, 'Delhi': 81, 'Hyderabad': 64 },
  { id: 'Drug Trafficking', 'Nagpur': 23, 'Mumbai': 88, 'Pune': 67, 'Delhi': 91, 'Hyderabad': 55 },
  { id: 'Vehicle Theft', 'Nagpur': 67, 'Mumbai': 85, 'Pune': 93, 'Delhi': 88, 'Hyderabad': 72 },
  { id: 'Extortion', 'Nagpur': 55, 'Mumbai': 82, 'Pune': 41, 'Delhi': 76, 'Hyderabad': 48 }
].map(item => ({
  id: item.id,
  data: [
    { x: 'Nagpur', y: item['Nagpur'] },
    { x: 'Mumbai', y: item['Mumbai'] },
    { x: 'Pune', y: item['Pune'] },
    { x: 'Delhi', y: item['Delhi'] },
    { x: 'Hyderabad', y: item['Hyderabad'] }
  ]
}));

// Mock data for Charts
const performanceData = [
  { name: 'Mon', responseTime: 145, faceMatches: 120, firMatches: 85 },
  { name: 'Tue', responseTime: 160, faceMatches: 142, firMatches: 92 },
  { name: 'Wed', responseTime: 135, faceMatches: 110, firMatches: 78 },
  { name: 'Thu', responseTime: 210, faceMatches: 185, firMatches: 115 },
  { name: 'Fri', responseTime: 180, faceMatches: 156, firMatches: 102 },
  { name: 'Sat', responseTime: 125, faceMatches: 95, firMatches: 65 },
  { name: 'Sun', responseTime: 120, faceMatches: 88, firMatches: 54 },
];

export default function AnalyticsPage() {
  const [graphThreshold, setGraphThreshold] = useState(0.6);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto text-slate-200">
      <header className="flex items-center gap-3 mb-8 pb-4 border-b border-[hsl(217,33%,17%)]">
        <div className="p-2 bg-pink-500/10 rounded-lg">
          <Activity className="w-8 h-8 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Intelligence Analytics</h1>
          <p className="text-sm text-slate-400">System-wide patterns, clusters, and performance metrics.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Network Graph Section */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] flex justify-between items-center bg-slate-900/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-400" />
              Suspect Similarity Network
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Threshold: {graphThreshold.toFixed(2)}</span>
              <input 
                type="range" min="0.5" max="0.99" step="0.01" 
                value={graphThreshold} 
                onChange={(e) => setGraphThreshold(parseFloat(e.target.value))}
                className="w-24 accent-blue-500"
              />
            </div>
          </div>
          <div className="h-[500px] bg-[#0b1121] relative">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 border border-slate-700 p-3 rounded-lg backdrop-blur-sm text-xs pointer-events-none">
              <p className="text-slate-300 font-medium mb-1">Graph Stats</p>
              <p className="text-slate-400">Nodes: 20 suspects</p>
              <p className="text-slate-400">Edges: 30 connections</p>
              <div className="mt-2 flex gap-2">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> Crit</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"/> High</span>
              </div>
            </div>
            {mounted && (
              <ForceGraph2D
                graphData={mockGraphData}
                nodeLabel="name"
                nodeColor="color"
                backgroundColor="#0b1121"
                linkColor={() => 'rgba(148, 163, 184, 0.2)'}
                linkWidth={(link: any) => (link.value > graphThreshold ? 2 : 0.5)}
              />
            )}
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-slate-900/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-red-400" />
              Modus Operandi × Jurisdiction Correlation
            </h2>
          </div>
          <div className="h-[500px] p-4 bg-[#0b1121]">
            {mounted && (
              <ResponsiveHeatMap
                data={heatmapData}
                margin={{ top: 60, right: 20, bottom: 20, left: 120 }}
                valueFormat=">-.0f"
                axisTop={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: '',
                  legendOffset: 46
                }}
                axisRight={null}
                axisBottom={null}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                colors={{
                  type: 'sequential',
                  scheme: 'reds'
                }}
                emptyColor="#1e293b"
                borderWidth={1}
                borderColor="#0f172a"
                enableLabels={true}
                labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                theme={{
                  text: { fill: '#94a3b8', fontSize: 11 },
                  tooltip: {
                    container: {
                      background: '#0f172a',
                      color: '#f8fafc',
                      fontSize: 12,
                      borderRadius: '6px',
                      border: '1px solid #334155',
                    },
                  },
                  axis: {
                    legend: { text: { fill: '#cbd5e1', fontWeight: 600 } },
                    ticks: { text: { fill: '#94a3b8' } },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Response Time Trend (ms)
          </h2>
          <div className="h-[300px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="responseTime" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Daily Match Volume
          </h2>
          <div className="h-[300px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    cursor={{ fill: 'rgba(51, 65, 85, 0.4)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="faceMatches" name="Face Matches" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="firMatches" name="FIR Matches" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
