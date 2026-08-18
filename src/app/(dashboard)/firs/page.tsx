'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, FileText, Calendar, MapPin, Eye, Link as LinkIcon } from 'lucide-react';

const MOCK_FIRS = [
  { id: 'FIR-2026-1042', caseId: 'CASE-2026-084', type: 'ROBBERY', complainant: 'Ramesh Patel', date: '2026-08-10', station: 'Central PS', status: 'INVESTIGATING' },
  { id: 'FIR-2026-1041', caseId: null, type: 'BURGLARY', complainant: 'Sunita Sharma', date: '2026-08-09', station: 'East PS', status: 'FILED' },
  { id: 'FIR-2026-1038', caseId: 'CASE-2026-079', type: 'THEFT', complainant: 'Amit Deshmukh', date: '2026-08-05', station: 'North PS', status: 'INVESTIGATING' },
  { id: 'FIR-2026-1035', caseId: null, type: 'ASSAULT', complainant: 'Vikash Singh', date: '2026-08-02', station: 'Central PS', status: 'CLOSED' },
  { id: 'FIR-2026-1030', caseId: 'CASE-2026-062', type: 'FRAUD', complainant: 'HDFC Bank Mgr', date: '2026-07-28', station: 'Cyber Cell', status: 'INVESTIGATING' },
  { id: 'FIR-2026-1025', caseId: 'CASE-2026-055', type: 'ASSAULT', complainant: 'Rahul Khanna', date: '2026-07-15', station: 'Bandra PS', status: 'CLOSED' },
  { id: 'FIR-2026-1018', caseId: 'CASE-2026-042', type: 'SMUGGLING', complainant: 'Customs Officer', date: '2026-07-02', station: 'HQ', status: 'INVESTIGATING' },
  { id: 'FIR-2026-1012', caseId: null, type: 'THEFT', complainant: 'Priya Reddy', date: '2026-06-25', station: 'South PS', status: 'FILED' },
];

export default function FIRsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">First Information Reports</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and link police reports</p>
        </div>
        <Link href="/firs/new">
          <button className="bg-[hsl(210,100%,60%)] hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors shadow-sm shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-2" />
            File FIR
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
              placeholder="Search FIR number or complainant..." 
              className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
              <option value="">Crime Type</option>
              <option value="ROBBERY">Robbery</option>
              <option value="THEFT">Theft</option>
              <option value="ASSAULT">Assault</option>
            </select>
            <select className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
              <option value="">Status</option>
              <option value="FILED">Filed</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider border-b border-[hsl(217,33%,17%)]">
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
            <tbody className="divide-y divide-[hsl(217,33%,17%)]">
              {MOCK_FIRS.map((fir) => (
                <tr key={fir.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => window.location.href = `/firs/${fir.id}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span className="font-mono text-sm text-slate-200 font-medium">{fir.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-[hsl(217,33%,17%)] text-slate-300 text-[10px] rounded border border-[hsl(217,33%,25%)]">{fir.type}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-300">{fir.complainant}</td>
                  <td className="p-4 text-sm text-slate-300">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {fir.date}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {fir.station}</div>
                  </td>
                  <td className="p-4">
                    {fir.caseId ? (
                      <Link href={`/cases/${fir.caseId}`} onClick={(e) => e.stopPropagation()} className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded w-fit border border-blue-500/20">
                        <LinkIcon className="w-3 h-3" /> {fir.caseId}
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Unlinked</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] rounded font-medium border ${
                      fir.status === 'INVESTIGATING' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                      fir.status === 'CLOSED' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {fir.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-400 hover:text-blue-400 p-1 transition-colors" onClick={(e) => { e.stopPropagation(); window.location.href = `/firs/${fir.id}`; }}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
