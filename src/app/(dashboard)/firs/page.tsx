'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, FileText, Calendar, MapPin, Eye, Link as LinkIcon, Sparkles } from 'lucide-react';

const INITIAL_FIRS = [
  { id: 'FIR-2026-1042', caseId: 'CASE-2026-084', type: 'ROBBERY', complainant: 'Ramesh Patel', date: '2026-08-10', station: 'Sitabuldi PS', status: 'INVESTIGATING' },
  { id: 'FIR-2026-1041', caseId: null, type: 'BURGLARY', complainant: 'Sunita Sharma', date: '2026-08-09', station: 'East PS', status: 'FILED' },
  { id: 'FIR-2026-1038', caseId: 'CASE-2026-079', type: 'THEFT', complainant: 'Amit Deshmukh', date: '2026-08-05', station: 'North PS', status: 'INVESTIGATING' },
  { id: 'FIR-2026-1035', caseId: null, type: 'ASSAULT', complainant: 'Vikash Singh', date: '2026-08-02', station: 'Central PS', status: 'CLOSED' },
  { id: 'FIR-2026-1030', caseId: 'CASE-2026-062', type: 'FRAUD', complainant: 'HDFC Bank Manager', date: '2026-07-28', station: 'Cyber Cell', status: 'INVESTIGATING' },
  { id: 'FIR-2026-1025', caseId: 'CASE-2026-055', type: 'ASSAULT', complainant: 'Rahul Khanna', date: '2026-07-15', station: 'Bandra PS', status: 'CLOSED' },
  { id: 'FIR-2026-1018', caseId: 'CASE-2026-042', type: 'NARCOTICS', complainant: 'Customs Officer', date: '2026-07-02', station: 'HQ', status: 'INVESTIGATING' },
  { id: 'FIR-2026-1012', caseId: null, type: 'THEFT', complainant: 'Priya Reddy', date: '2026-06-25', station: 'South PS', status: 'FILED' },
];

export default function FIRsPage() {
  const [firs, setFirs] = useState(INITIAL_FIRS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Load custom FIRs from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customJson = localStorage.getItem('custom_firs');
      if (customJson) {
        try {
          const customList = JSON.parse(customJson);
          setFirs([...customList, ...INITIAL_FIRS]);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const filteredFirs = firs.filter((f) => {
    const matchesSearch = 
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.station.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !typeFilter || f.type === typeFilter;
    const matchesStatus = !statusFilter || f.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">First Information Reports (FIRs)</h1>
          <p className="text-sm text-slate-400 mt-1">FIR repository with Sentence-BERT 768-dim Modus Operandi vector indexing</p>
        </div>
        <Link href="/firs/new">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-2" />
            File New FIR Record
          </button>
        </Link>
      </div>

      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
        {/* Filter Bar */}
        <div className="p-4 border-b border-[hsl(217,33%,17%)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search FIR number, complainant, station..." 
              className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Crime Types</option>
              <option value="ROBBERY">Armed Robbery</option>
              <option value="THEFT">Burglary / Theft</option>
              <option value="ASSAULT">Assault</option>
              <option value="FRAUD">Cyber Fraud</option>
              <option value="NARCOTICS">Narcotics</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="FILED">Registered / Filed</option>
              <option value="INVESTIGATING">Under Investigation</option>
              <option value="CLOSED">Closed / Resolved</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/40 text-xs text-slate-400 uppercase tracking-wider border-b border-[hsl(217,33%,17%)]">
                <th className="p-4 font-medium">FIR Number</th>
                <th className="p-4 font-medium">Crime Type</th>
                <th className="p-4 font-medium">Complainant</th>
                <th className="p-4 font-medium">Incident Date</th>
                <th className="p-4 font-medium">Police Station</th>
                <th className="p-4 font-medium">Linked Case</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(217,33%,17%)] text-sm">
              {filteredFirs.length > 0 ? (
                filteredFirs.map((fir) => (
                  <tr key={fir.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-500" />
                        <span className="font-mono text-sm text-slate-200 font-bold group-hover:text-blue-400 transition-colors">{fir.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-[hsl(217,33%,17%)] text-slate-300 text-[10px] font-semibold rounded border border-[hsl(217,33%,25%)]">{fir.type}</span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{fir.complainant}</td>
                    <td className="p-4 text-slate-400 text-xs">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {fir.date}</div>
                    </td>
                    <td className="p-4 text-slate-300 text-xs">
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {fir.station}</div>
                    </td>
                    <td className="p-4">
                      {fir.caseId ? (
                        <Link href={`/cases/${fir.caseId}`} className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" /> {fir.caseId}
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unlinked</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded border ${fir.status === 'INVESTIGATING' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : fir.status === 'FILED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        {fir.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/firs/1`}>
                        <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="View FIR Details & MO Embeddings">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No FIR records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[hsl(217,33%,17%)] flex items-center justify-between text-xs text-slate-400 bg-slate-900/40">
          <span>Showing {filteredFirs.length} of {firs.length} FIR records</span>
        </div>
      </div>
    </div>
  );
}
