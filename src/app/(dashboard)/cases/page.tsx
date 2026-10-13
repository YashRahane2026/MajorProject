'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, Briefcase, MapPin, Calendar, Users, FileText, ChevronRight, ChevronLeft, AlertCircle, X, Check } from 'lucide-react';

const INITIAL_CASES = [
  { id: 'CASE-2026-084', title: 'Armed Robbery at Jeweller', type: 'ROBBERY', status: 'ACTIVE', severity: 'HIGH', jurisdiction: 'Sitabuldi, Nagpur', date: '2026-08-10', officer: 'Insp. R. Patil', suspects: 3, firs: 2 },
  { id: 'CASE-2026-079', title: 'Vehicle Theft Syndicate', type: 'THEFT', status: 'UNDER_INVESTIGATION', severity: 'MEDIUM', jurisdiction: 'Pune East', date: '2026-08-05', officer: 'Sub-Insp. S. Kadam', suspects: 5, firs: 8 },
  { id: 'CASE-2026-062', title: 'Cyber Fraud - Bank Scam', type: 'FRAUD', status: 'ACTIVE', severity: 'HIGH', jurisdiction: 'Cyber Cell, Nagpur', date: '2026-07-28', officer: 'ACP V. Sharma', suspects: 2, firs: 15 },
  { id: 'CASE-2026-055', title: 'Assault at Commercial Hub', type: 'ASSAULT', status: 'CLOSED_ARREST', severity: 'MEDIUM', jurisdiction: 'Bandra, Mumbai', date: '2026-07-15', officer: 'Insp. M. Singh', suspects: 1, firs: 1 },
  { id: 'CASE-2026-042', title: 'Illegal Arms Trade Ring', type: 'SMUGGLING', status: 'ACTIVE', severity: 'CRITICAL', jurisdiction: 'Nagpur HQ', date: '2026-07-02', officer: 'DCP A. Kumar', suspects: 8, firs: 4 },
  { id: 'CASE-2026-038', title: 'Highway Extortion Syndicate', type: 'EXTORTION', status: 'UNDER_INVESTIGATION', severity: 'HIGH', jurisdiction: 'Thane', date: '2026-06-20', officer: 'Insp. K. Joshi', suspects: 4, firs: 3 },
  { id: 'CASE-2026-021', title: 'Serial House Break-ins', type: 'BURGLARY', status: 'ACTIVE', severity: 'MEDIUM', jurisdiction: 'Navi Mumbai', date: '2026-05-18', officer: 'Sub-Insp. P. Desai', suspects: 2, firs: 6 },
  { id: 'CASE-2026-015', title: 'Counterfeit Currency Cell', type: 'FRAUD', status: 'CLOSED_CONVICTION', severity: 'CRITICAL', jurisdiction: 'Kolkata Central', date: '2026-04-10', officer: 'ACP D. Roy', suspects: 6, firs: 2 },
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
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{label}</span>;
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
  const [casesList, setCasesList] = useState(INITIAL_CASES);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // New Case Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('ROBBERY');
  const [newJurisdiction, setNewJurisdiction] = useState('Sitabuldi PS, Nagpur');
  const [newOfficer, setNewOfficer] = useState('Insp. Mohan Patil');
  const [newSeverity, setNewSeverity] = useState('HIGH');

  // Load custom cases from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customJson = localStorage.getItem('custom_cases');
      if (customJson) {
        try {
          const list = JSON.parse(customJson);
          setCasesList([...list, ...INITIAL_CASES]);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please enter a Case Title.');
      return;
    }

    const autoCaseId = `CASE-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newCase = {
      id: autoCaseId,
      title: newTitle.trim(),
      type: newType,
      status: 'ACTIVE',
      severity: newSeverity,
      jurisdiction: newJurisdiction.trim(),
      date: new Date().toISOString().split('T')[0],
      officer: newOfficer.trim(),
      suspects: 1,
      firs: 1,
    };

    const updated = [newCase, ...casesList];
    setCasesList(updated);

    if (typeof window !== 'undefined') {
      const customOnly = updated.filter(c => c.id.startsWith('CASE-2026-') && !INITIAL_CASES.some(i => i.id === c.id));
      localStorage.setItem('custom_cases', JSON.stringify(customOnly));
    }

    setNewTitle('');
    setShowCreateModal(false);
  };

  const filteredCases = casesList.filter((c) => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !typeFilter || c.type === typeFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const pageToDisplay = Math.min(currentPage, totalPages);
  const startIndex = (pageToDisplay - 1) * pageSize;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 uppercase">
              SYNTHETIC DEMO — NOT REAL POLICE OR COURT CASES:
            </span>{' '}
            <span className="text-slate-300">
              All case entries below are fictional demonstrations for workflow testing. A case status never implies guilt. For official judicial case lookups, visit{' '}
              <a
                href="https://services.ecourts.gov.in/ecourtindia_v6/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                services.ecourts.gov.in
              </a>
              .
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[hsl(217,33%,17%)] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cases Sandbox (Synthetic Demo)</h1>
          <p className="text-sm text-slate-400 mt-1">Demonstration case workflow records (strictly separated from official NCRB statistics)</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Case
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search cases by ID, title, or jurisdiction..." 
            className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Crime Types</option>
            <option value="ROBBERY">Armed Robbery</option>
            <option value="THEFT">Theft</option>
            <option value="FRAUD">Cyber Fraud</option>
            <option value="ASSAULT">Assault</option>
            <option value="SMUGGLING">Smuggling</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active Case</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="CLOSED_ARREST">Closed / Arrest Made</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedCases.length > 0 ? (
          paginatedCases.map((c) => (
            <Link key={c.id} href={`/cases/1`} className="block group">
              <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm hover:border-blue-500/50 hover:bg-white/[0.02] transition-all h-full flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-mono text-xs text-blue-400 font-bold block mb-1">{c.id}</span>
                    <h3 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">{c.title}</h3>
                  </div>
                  <SeverityBadge severity={c.severity} />
                </div>

                <div className="space-y-2 mb-4 text-xs text-slate-400 flex-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.jurisdiction}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Opened: {c.date}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[hsl(217,33%,17%)] flex items-center justify-between">
                  <StatusBadge status={c.status} />
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.suspects}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {c.firs}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-slate-500 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl">
            No case records match your search criteria.
          </div>
        )}
      </div>

      {/* Stateful Pagination Footer */}
      <div className="p-4 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing {filteredCases.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, filteredCases.length)} of {filteredCases.length} case records
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

      {/* Create New Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCase} className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[hsl(217,33%,17%)] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Create New Criminal Case
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Case Title <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                  placeholder="e.g. Highway Robbery & Syndicate Fraud"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Crime Type</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ROBBERY">Armed Robbery</option>
                    <option value="THEFT">Burglary / Theft</option>
                    <option value="FRAUD">Cyber Fraud</option>
                    <option value="ASSAULT">Assault</option>
                    <option value="SMUGGLING">Smuggling</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Severity</label>
                  <select 
                    value={newSeverity} 
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Jurisdiction / Police Station</label>
                <input 
                  type="text" 
                  value={newJurisdiction} 
                  onChange={(e) => setNewJurisdiction(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Investigating Officer</label>
                <input 
                  type="text" 
                  value={newOfficer} 
                  onChange={(e) => setNewOfficer(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[hsl(217,33%,17%)]">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Save & Open Case
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
