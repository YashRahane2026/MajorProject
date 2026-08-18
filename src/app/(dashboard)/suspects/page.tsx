'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const MOCK_SUSPECTS = [
  { id: '1', name: 'Vikram Singh', alias: 'Vicky', threatLevel: 'CRITICAL', status: 'AT_LARGE', city: 'Mumbai', cases: 3, lastUpdated: '2026-08-18' },
  { id: '2', name: 'Rahul Desai', alias: 'Raju', threatLevel: 'HIGH', status: 'ARRESTED', city: 'Pune', cases: 1, lastUpdated: '2026-08-17' },
  { id: '3', name: 'Amit Kumar', alias: 'AK', threatLevel: 'MEDIUM', status: 'IN_REMAND', city: 'Nagpur', cases: 2, lastUpdated: '2026-08-15' },
  { id: '4', name: 'Sanjay Patel', alias: '', threatLevel: 'LOW', status: 'BAILED', city: 'Delhi', cases: 1, lastUpdated: '2026-08-14' },
  { id: '5', name: 'Priya Sharma', alias: '', threatLevel: 'MEDIUM', status: 'AT_LARGE', city: 'Hyderabad', cases: 4, lastUpdated: '2026-08-10' },
  { id: '6', name: 'Ravi Verma', alias: 'Don', threatLevel: 'CRITICAL', status: 'CONVICTED', city: 'Bangalore', cases: 5, lastUpdated: '2026-08-01' },
  { id: '7', name: 'Anil Kapoor', alias: 'AK-47', threatLevel: 'HIGH', status: 'AT_LARGE', city: 'Chennai', cases: 2, lastUpdated: '2026-07-28' },
  { id: '8', name: 'Sneha Reddy', alias: '', threatLevel: 'LOW', status: 'ARRESTED', city: 'Kolkata', cases: 1, lastUpdated: '2026-07-25' },
  { id: '9', name: 'Mohammed Ali', alias: 'Bhai', threatLevel: 'HIGH', status: 'IN_REMAND', city: 'Mumbai', cases: 3, lastUpdated: '2026-07-20' },
  { id: '10', name: 'Deepak Joshi', alias: '', threatLevel: 'MEDIUM', status: 'BAILED', city: 'Pune', cases: 1, lastUpdated: '2026-07-15' },
  { id: '11', name: 'Neha Gupta', alias: '', threatLevel: 'LOW', status: 'CONVICTED', city: 'Nagpur', cases: 1, lastUpdated: '2026-07-10' },
  { id: '12', name: 'Surya Narayanan', alias: 'Suri', threatLevel: 'CRITICAL', status: 'AT_LARGE', city: 'Chennai', cases: 6, lastUpdated: '2026-07-05' },
  { id: '13', name: 'Manoj Bajpayee', alias: 'Bhiku', threatLevel: 'HIGH', status: 'ARRESTED', city: 'Mumbai', cases: 4, lastUpdated: '2026-07-01' },
  { id: '14', name: 'Kiran Rao', alias: '', threatLevel: 'MEDIUM', status: 'IN_REMAND', city: 'Delhi', cases: 2, lastUpdated: '2026-06-28' },
  { id: '15', name: 'Ajay Dev', alias: 'Singham', threatLevel: 'LOW', status: 'BAILED', city: 'Pune', cases: 1, lastUpdated: '2026-06-25' },
  { id: '16', name: 'Sunil Shetty', alias: 'Anna', threatLevel: 'CRITICAL', status: 'CONVICTED', city: 'Bangalore', cases: 5, lastUpdated: '2026-06-20' },
  { id: '17', name: 'Pooja Hegde', alias: '', threatLevel: 'MEDIUM', status: 'AT_LARGE', city: 'Hyderabad', cases: 2, lastUpdated: '2026-06-15' },
  { id: '18', name: 'Vijay Kumar', alias: 'Master', threatLevel: 'HIGH', status: 'ARRESTED', city: 'Chennai', cases: 3, lastUpdated: '2026-06-10' },
  { id: '19', name: 'Ram Charan', alias: 'Cherry', threatLevel: 'LOW', status: 'IN_REMAND', city: 'Hyderabad', cases: 1, lastUpdated: '2026-06-05' },
  { id: '20', name: 'NTR Jr', alias: 'Tarak', threatLevel: 'CRITICAL', status: 'BAILED', city: 'Hyderabad', cases: 4, lastUpdated: '2026-06-01' },
];

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

const ThreatBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    'CRITICAL': 'bg-red-500/10 text-red-500 border-red-500/20',
    'HIGH': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'MEDIUM': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'LOW': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };
  return <span className={`px-2 py-1 rounded-md text-[10px] font-medium border ${colors[level] || colors.LOW}`}>{level}</span>;
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    'AT_LARGE': 'bg-red-500/10 text-red-500 border-red-500/20',
    'ARRESTED': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'IN_REMAND': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'BAILED': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'CONVICTED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };
  const label = status.replace('_', ' ');
  return <span className={`px-2 py-1 rounded-md text-[10px] font-medium border ${colors[status] || colors.AT_LARGE}`}>{label}</span>;
};

export default function SuspectsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Suspects Database</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track criminal profiles</p>
        </div>
        <Link href="/suspects/new">
          <button className="bg-[hsl(210,100%,60%)] hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors shadow-sm shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Suspect
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
              placeholder="Search suspects by name or alias..." 
              className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
              <option value="">Threat Level</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
              <option value="">Status</option>
              <option value="AT_LARGE">At Large</option>
              <option value="ARRESTED">Arrested</option>
              <option value="IN_REMAND">In Remand</option>
              <option value="BAILED">Bailed</option>
              <option value="CONVICTED">Convicted</option>
            </select>
            <button className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] text-slate-300 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider border-b border-[hsl(217,33%,17%)]">
                <th className="p-4 font-medium">Suspect</th>
                <th className="p-4 font-medium">Threat Level</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Last Known City</th>
                <th className="p-4 font-medium text-center">Cases</th>
                <th className="p-4 font-medium">Last Updated</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(217,33%,17%)]">
              {MOCK_SUSPECTS.map((suspect) => (
                <tr key={suspect.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => window.location.href = `/suspects/${suspect.id}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[hsl(217,33%,17%)] flex items-center justify-center text-sm font-semibold text-slate-300">
                        {getInitials(suspect.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{suspect.name}</p>
                        {suspect.alias && <p className="text-xs text-slate-500">({suspect.alias})</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><ThreatBadge level={suspect.threatLevel} /></td>
                  <td className="p-4"><StatusBadge status={suspect.status} /></td>
                  <td className="p-4 text-sm text-slate-300">{suspect.city}</td>
                  <td className="p-4 text-sm text-slate-300 text-center">
                    <span className="bg-[hsl(217,33%,17%)] text-slate-300 px-2 py-0.5 rounded-full text-xs font-medium">
                      {suspect.cases}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{new Date(suspect.lastUpdated).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button className="text-slate-400 hover:text-blue-400 p-1 transition-colors" onClick={(e) => { e.stopPropagation(); window.location.href = `/suspects/${suspect.id}`; }}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[hsl(217,33%,17%)] flex justify-between items-center text-sm text-slate-400 bg-white/5">
          <div>Showing 1 to 20 of 247 suspects</div>
          <div className="flex gap-1">
            <button className="p-1 border border-[hsl(217,33%,17%)] rounded hover:bg-white/10 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 border border-[hsl(217,33%,17%)] rounded bg-blue-500/20 text-blue-400 font-medium px-3">1</button>
            <button className="p-1 border border-[hsl(217,33%,17%)] rounded hover:bg-white/10 px-3">2</button>
            <button className="p-1 border border-[hsl(217,33%,17%)] rounded hover:bg-white/10 px-3">3</button>
            <button className="p-1 border border-[hsl(217,33%,17%)] rounded hover:bg-white/10">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
