'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Eye, ShieldAlert, UserCheck, X } from 'lucide-react';

const INITIAL_SUSPECTS = [
  { id: '1', name: 'Vikram Sharma', alias: 'Vicky', threatLevel: 'CRITICAL', status: 'AT_LARGE', city: 'Nagpur', cases: 3, lastUpdated: '2026-08-18' },
  { id: '2', name: 'Rahul Desai', alias: 'Raju', threatLevel: 'HIGH', status: 'ARRESTED', city: 'Pune', cases: 1, lastUpdated: '2026-08-17' },
  { id: '3', name: 'Amit Patel', alias: 'Bhaiya', threatLevel: 'MEDIUM', status: 'IN_REMAND', city: 'Nagpur', cases: 2, lastUpdated: '2026-08-15' },
  { id: '4', name: 'Sanjay Kumar', alias: '-', threatLevel: 'LOW', status: 'BAILED', city: 'Mumbai', cases: 1, lastUpdated: '2026-08-14' },
  { id: '5', name: 'Priya Sharma', alias: 'Lady Gang', threatLevel: 'MEDIUM', status: 'AT_LARGE', city: 'Hyderabad', cases: 4, lastUpdated: '2026-08-10' },
  { id: '6', name: 'Ravi Verma', alias: 'Baba', threatLevel: 'CRITICAL', status: 'CONVICTED', city: 'Bangalore', cases: 5, lastUpdated: '2026-08-01' },
  { id: '7', name: 'Anil Kapoor', alias: 'AK', threatLevel: 'HIGH', status: 'AT_LARGE', city: 'Chennai', cases: 2, lastUpdated: '2026-07-28' },
  { id: '8', name: 'Sneha Reddy', alias: '-', threatLevel: 'LOW', status: 'ARRESTED', city: 'Kolkata', cases: 1, lastUpdated: '2026-07-25' },
  { id: '9', name: 'Mohammed Ali', alias: 'Bhai', threatLevel: 'HIGH', status: 'IN_REMAND', city: 'Mumbai', cases: 3, lastUpdated: '2026-07-20' },
  { id: '10', name: 'Deepak Joshi', alias: '-', threatLevel: 'MEDIUM', status: 'BAILED', city: 'Pune', cases: 1, lastUpdated: '2026-07-15' },
  { id: '11', name: 'Neha Gupta', alias: '-', threatLevel: 'LOW', status: 'CONVICTED', city: 'Nagpur', cases: 1, lastUpdated: '2026-07-10' },
  { id: '12', name: 'Surya Narayanan', alias: 'Suri', threatLevel: 'CRITICAL', status: 'AT_LARGE', city: 'Chennai', cases: 6, lastUpdated: '2026-07-05' },
];

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

const ThreatBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    'CRITICAL': 'bg-red-500/15 text-red-400 border-red-500/30',
    'HIGH': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    'MEDIUM': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'LOW': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };
  return <span className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${colors[level] || colors.LOW}`}>{level}</span>;
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'AT_LARGE': 'bg-red-500/15 text-red-400 border-red-500/30',
    'ARRESTED': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'IN_REMAND': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    'BAILED': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'CONVICTED': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };
  const label = status.replace('_', ' ');
  return <span className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${colors[status] || colors.AT_LARGE}`}>{label}</span>;
};

export default function SuspectsPage() {
  const [suspects, setSuspects] = useState(INITIAL_SUSPECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [threatFilter, setThreatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Merge custom_suspects from localStorage on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customJson = localStorage.getItem('custom_suspects');
      if (customJson) {
        try {
          const customList = JSON.parse(customJson);
          setSuspects([...customList, ...INITIAL_SUSPECTS]);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Real-time filtering logic
  const filteredSuspects = suspects.filter((s) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = 
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.alias && s.alias.toLowerCase().includes(q)) ||
      s.city.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q);

    const matchesThreat = !threatFilter || s.threatLevel === threatFilter;
    const matchesStatus = !statusFilter || s.status === statusFilter;

    return matchesSearch && matchesThreat && matchesStatus;
  });

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredSuspects.length / pageSize));
  const pageToDisplay = Math.min(currentPage, totalPages);
  const startIndex = (pageToDisplay - 1) * pageSize;
  const paginatedSuspects = filteredSuspects.slice(startIndex, startIndex + pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[hsl(217,33%,17%)] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Suspects Directory</h1>
          <p className="text-sm text-slate-400 mt-1">Manage, search, and track criminal profiles with 512-dim ArcFace vector indexing</p>
        </div>
        <Link href="/suspects/new">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Register New Suspect
          </button>
        </Link>
      </div>

      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-xl">
        {/* Filter Bar */}
        <div className="p-4 border-b border-[hsl(217,33%,17%)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search suspects by name, alias, city..." 
              className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg pl-9 pr-9 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => { setSearchTerm(''); setCurrentPage(1); }} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={threatFilter}
              onChange={(e) => { setThreatFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Threat Levels</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="AT_LARGE">At Large</option>
              <option value="ARRESTED">Arrested</option>
              <option value="IN_REMAND">In Remand</option>
              <option value="BAILED">Bailed</option>
              <option value="CONVICTED">Convicted</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[hsl(217,33%,17%)] text-xs text-slate-400 uppercase tracking-wider bg-slate-900/40">
                <th className="p-4">Suspect</th>
                <th className="p-4">Alias</th>
                <th className="p-4">Threat Level</th>
                <th className="p-4">Status</th>
                <th className="p-4">Jurisdiction</th>
                <th className="p-4 text-center">Cases</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(217,33%,17%)]">
              {paginatedSuspects.length > 0 ? (
                paginatedSuspects.map((suspect) => (
                  <tr key={suspect.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <Link href={`/suspects/${suspect.id}`} className="flex items-center gap-3 group/item">
                        <div className="w-9 h-9 rounded-full bg-[hsl(217,33%,17%)] flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700">
                          {getInitials(suspect.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 group-hover/item:text-blue-400 transition-colors">
                            {suspect.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            ID: SUS-{suspect.id}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {suspect.alias && suspect.alias !== '-' ? (
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                          aka {suspect.alias}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <ThreatBadge level={suspect.threatLevel} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={suspect.status} />
                    </td>
                    <td className="p-4 text-slate-300 text-xs font-medium">
                      {suspect.city}
                    </td>
                    <td className="p-4 text-center font-mono text-xs text-slate-300 font-bold">
                      {suspect.cases}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/suspects/1`}>
                        <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="View Dossier">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No suspect records match "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Working Stateful Pagination Footer */}
        <div className="p-4 border-t border-[hsl(217,33%,17%)] flex items-center justify-between text-xs text-slate-400 bg-slate-900/40">
          <span>
            Showing {filteredSuspects.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, filteredSuspects.length)} of {filteredSuspects.length} suspect records
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium text-slate-300">
              Page {pageToDisplay} of {totalPages}
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
