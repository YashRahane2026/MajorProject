'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, Briefcase, MapPin, Calendar, Users, FileText, ChevronRight, AlertCircle } from 'lucide-react';

const MOCK_CASES = [
  { id: 'CASE-2026-084', title: 'Armed Robbery at Jeweller', type: 'ROBBERY', status: 'ACTIVE', severity: 'HIGH', jurisdiction: 'Mumbai Central', date: '2026-08-10', officer: 'Insp. R. Patil', suspects: 3, firs: 2 },
  { id: 'CASE-2026-079', title: 'Vehicle Theft Syndicate', type: 'THEFT', status: 'UNDER_INVESTIGATION', severity: 'MEDIUM', jurisdiction: 'Pune East', date: '2026-08-05', officer: 'Sub-Insp. S. Kadam', suspects: 5, firs: 8 },
  { id: 'CASE-2026-062', title: 'Cyber Fraud - Bank Scam', type: 'FRAUD', status: 'ACTIVE', severity: 'HIGH', jurisdiction: 'Cyber Cell, Delhi', date: '2026-07-28', officer: 'ACP V. Sharma', suspects: 2, firs: 15 },
  { id: 'CASE-2026-055', title: 'Assault at Nightclub', type: 'ASSAULT', status: 'CLOSED_ARREST', severity: 'MEDIUM', jurisdiction: 'Bandra', date: '2026-07-15', officer: 'Insp. M. Singh', suspects: 1, firs: 1 },
  { id: 'CASE-2026-042', title: 'Illegal Arms Trade', type: 'SMUGGLING', status: 'ACTIVE', severity: 'CRITICAL', jurisdiction: 'Nagpur HQ', date: '2026-07-02', officer: 'DCP A. Kumar', suspects: 8, firs: 4 },
  { id: 'CASE-2026-038', title: 'Extortion Racket', type: 'EXTORTION', status: 'UNDER_INVESTIGATION', severity: 'HIGH', jurisdiction: 'Thane', date: '2026-06-20', officer: 'Insp. K. Joshi', suspects: 4, firs: 3 },
  { id: 'CASE-2026-021', title: 'Serial House Break-ins', type: 'BURGLARY', status: 'ACTIVE', severity: 'MEDIUM', jurisdiction: 'Navi Mumbai', date: '2026-05-18', officer: 'Sub-Insp. P. Desai', suspects: 0, firs: 6 },
  { id: 'CASE-2026-015', title: 'Counterfeit Currency', type: 'FRAUD', status: 'CLOSED_CONVICTION', severity: 'CRITICAL', jurisdiction: 'Kolkata Central', date: '2026-04-10', officer: 'ACP D. Roy', suspects: 6, firs: 2 },
  { id: 'CASE-2026-009', title: 'Highway Hijacking', type: 'ROBBERY', status: 'PENDING_TRIAL', severity: 'HIGH', jurisdiction: 'Pune Rural', date: '2026-03-05', officer: 'Insp. N. Rane', suspects: 4, firs: 1 },
  { id: 'CASE-2025-184', title: 'Corporate Espionage', type: 'CYBER', status: 'ACTIVE', severity: 'MEDIUM', jurisdiction: 'Bangalore IT Corridor', date: '2025-11-22', officer: 'DCP S. Reddy', suspects: 2, firs: 1 },
  { id: 'CASE-2025-156', title: 'Narcotics Smuggling', type: 'NARCOTICS', status: 'UNDER_INVESTIGATION', severity: 'CRITICAL', jurisdiction: 'Mumbai Port', date: '2025-10-14', officer: 'ACP J. Fernandez', suspects: 7, firs: 5 },
  { id: 'CASE-2025-098', title: 'Rioting and Vandalism', type: 'PUBLIC_ORDER', status: 'CLOSED_ARREST', severity: 'MEDIUM', jurisdiction: 'Delhi North', date: '2025-08-01', officer: 'Insp. R. Yadav', suspects: 12, firs: 3 },
];

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'ACTIVE': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'UNDER_INVESTIGATION': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'PENDING_TRIAL': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'CLOSED_ARREST': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'CLOSED_CONVICTION': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  const label = status.replace('_', ' ');
  return <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{label}</span>;
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors: Record<string, string> = {
    'CRITICAL': 'text-red-500 bg-red-500/10',
    'HIGH': 'text-orange-500 bg-orange-500/10',
    'MEDIUM': 'text-amber-500 bg-amber-500/10',
    'LOW': 'text-blue-500 bg-blue-500/10',
  };
  return <span className={`p-1 rounded-md ${colors[severity] || colors.LOW}`} title={`Severity: ${severity}`}><AlertCircle className="w-4 h-4" /></span>;
};

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Cases Directory</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track criminal cases</p>
        </div>
        <button className="bg-[hsl(210,100%,60%)] hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors shadow-sm shadow-blue-500/20">
          <Plus className="w-4 h-4 mr-2" />
          New Case
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search cases by ID or title..." 
            className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="">Crime Type</option>
            <option value="ROBBERY">Robbery</option>
            <option value="THEFT">Theft</option>
            <option value="FRAUD">Fraud</option>
            <option value="ASSAULT">Assault</option>
          </select>
          <select className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
            <option value="">Status</option>
            <option value="ACTIVE">Active</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="CLOSED">Closed</option>
          </select>
          <button className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] text-slate-300 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_CASES.map((c) => (
          <Link key={c.id} href={`/cases/${c.id}`} className="block group">
            <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm hover:border-blue-500/50 hover:bg-white/[0.02] transition-all h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-mono text-slate-400 mb-1">{c.id}</p>
                  <StatusBadge status={c.status} />
                </div>
                <SeverityBadge severity={c.severity} />
              </div>
              
              <h3 className="text-base font-semibold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{c.title}</h3>
              
              <span className="inline-block px-2 py-1 bg-[hsl(217,33%,17%)] text-slate-300 text-[10px] rounded border border-[hsl(217,33%,25%)] w-fit mb-4">
                {c.type}
              </span>
              
              <div className="space-y-2 mt-auto mb-4">
                <div className="flex items-center text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  <span className="truncate">{c.jurisdiction}</span>
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  <span>{new Date(c.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <Briefcase className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  <span>{c.officer}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[hsl(217,33%,17%)]">
                <div className="flex gap-3">
                  <div className="flex items-center text-xs text-slate-400 font-medium" title="Linked Suspects">
                    <Users className="w-3.5 h-3.5 mr-1 text-blue-400" />
                    {c.suspects}
                  </div>
                  <div className="flex items-center text-xs text-slate-400 font-medium" title="Linked FIRs">
                    <FileText className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    {c.firs}
                  </div>
                </div>
                <span className="text-xs font-medium text-blue-400 flex items-center group-hover:translate-x-1 transition-transform">
                  View <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
