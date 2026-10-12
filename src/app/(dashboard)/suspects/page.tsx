'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  ShieldAlert, 
  UserCheck, 
  X, 
  Trash2,
  FolderOpen,
  MapPin,
  Building
} from 'lucide-react';
import { getAllSuspects, removeSuspect, SuspectRecord } from '@/lib/data/suspects-data';
import DatasetInspectorModal from '@/components/modals/dataset-inspector-modal';

const getInitials = (name: string) => (name || 'Suspect').split(' ').map(n => n[0]).join('').substring(0, 2);

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
    'TRIAL': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    'CUSTODY': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };
  const label = (status || 'AT_LARGE').replace('_', ' ');
  return <span className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${colors[status] || colors.AT_LARGE}`}>{label}</span>;
};

export default function SuspectsPage() {
  const [suspects, setSuspects] = useState<SuspectRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [threatFilter, setThreatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const pageSize = 8;

  // Load centralized Nagpur & Indian suspects on mount
  useEffect(() => {
    setSuspects(getAllSuspects());
  }, []);

  const handleDeleteSuspect = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete suspect record: "${name}"?`)) {
      const updated = removeSuspect(id);
      setSuspects(updated);
    }
  };

  // Real-time filtering logic
  const filteredSuspects = suspects.filter((s) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = 
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.alias && s.alias.toLowerCase().includes(q)) ||
      s.city.toLowerCase().includes(q) ||
      (s.policeStation && s.policeStation.toLowerCase().includes(q)) ||
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
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[hsl(217,33%,17%)] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Suspects Directory</span>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-mono font-normal">
              Nagpur Region & Cross-Zone
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Centralized biometric criminal registry with 512-dim ArcFace embeddings and authentic Maharashtra police station records
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Dataset & Augmentation Inspector Trigger */}
          <button
            onClick={() => setShowDatasetModal(true)}
            className="flex-1 sm:flex-none bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/30 px-3.5 py-2.5 rounded-xl flex items-center justify-center text-sm font-semibold transition-all shadow-sm group"
          >
            <FolderOpen className="w-4 h-4 mr-2 text-cyan-400 group-hover:scale-110 transition-transform" />
            Dataset & Augmentations
          </button>

          <Link href="/suspects/new">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Register New Suspect
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-xl">
        {/* Filter Bar */}
        <div className="p-4 border-b border-[hsl(217,33%,17%)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, alias, Nagpur PS..." 
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
              <option value="TRIAL">Trial</option>
              <option value="CUSTODY">Custody</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[hsl(217,33%,17%)] text-xs text-slate-400 uppercase tracking-wider bg-slate-900/40">
                <th className="p-4">Suspect Profile</th>
                <th className="p-4">Aliases</th>
                <th className="p-4">Threat Level</th>
                <th className="p-4">Status</th>
                <th className="p-4">Station / Jurisdiction</th>
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
                        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[hsl(217,33%,17%)] flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700 flex-shrink-0 shadow-sm ring-1 ring-white/10 group-hover/item:ring-blue-500 transition-all">
                          {suspect.photoUrl ? (
                            <img 
                              src={suspect.photoUrl} 
                              alt={suspect.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <span className="absolute inset-0 flex items-center justify-center -z-10 bg-slate-800 text-slate-300">
                            {getInitials(suspect.name)}
                          </span>
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
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono text-[11px]">
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
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Building className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="truncate max-w-[190px]">{suspect.policeStation || `${suspect.city} PS`}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono text-xs text-slate-300 font-bold">
                      {suspect.cases}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/suspects/${suspect.id}`}>
                          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="View Dossier">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDeleteSuspect(suspect.id, suspect.name)} 
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" 
                          title="Delete Suspect Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

        {/* Stateful Pagination Footer */}
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

      {/* Dataset & Augmentation Inspector Modal */}
      <DatasetInspectorModal
        isOpen={showDatasetModal}
        onClose={() => setShowDatasetModal(false)}
      />
    </div>
  );
}
