'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  FolderOpen,
  MapPin,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import {
  getCustomDemoSuspects,
  removeSuspect,
  SuspectRecord,
  FALLBACK_PORTRAIT_URL,
  normalizePhotoUrl,
} from '@/lib/data/suspects-data';
import DatasetInspectorModal from '@/components/modals/dataset-inspector-modal';

const ThreatBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30',
    HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    LOW: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
        colors[level] || colors.LOW
      }`}
      title="Random UI display label; no predictive, forensic or legal validity."
    >
      {level} (DEMO)
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = (status || 'UNDER_INVESTIGATION (DEMO)').toUpperCase();
  let style = 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  if (s.includes('ARRESTED')) style = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  else if (s.includes('REMAND')) style = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  else if (s.includes('BAIL')) style = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  else if (s.includes('CONVICTED')) style = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  else if (s.includes('COURT')) style = 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
  else if (s.includes('INVESTIGATION')) style = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';

  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${style}`}
      title="Random UI field; not an actual police/court/custody status."
    >
      {status}
    </span>
  );
};

export default function SuspectsPage() {
  const [suspects, setSuspects] = useState<SuspectRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(5000);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search, Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [threatFilter, setThreatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [localityFilter, setLocalityFilter] = useState('');
  const [sortBy, setSortBy] = useState('id_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [jumpPageInput, setJumpPageInput] = useState('1');

  // Filter options returned from server
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableLocalities, setAvailableLocalities] = useState<string[]>([]);

  const [showDatasetModal, setShowDatasetModal] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const qParam = sp.get('q');
      const statusParam = sp.get('status');
      if (qParam) {
        setSearchTerm(qParam);
        setDebouncedSearch(qParam);
      }
      if (statusParam) {
        setStatusFilter(statusParam);
      }
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pageSize),
        sort: sortBy,
      });
      if (debouncedSearch) params.set('q', debouncedSearch);
      if (threatFilter) params.set('threat', threatFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      if (localityFilter) params.set('locality', localityFilter);

      const res = await fetch(`/api/suspects?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // Merge any browser-saved custom demo records on page 1
      const customLocal = getCustomDemoSuspects();
      let rows: SuspectRecord[] = json.data || [];
      if (currentPage === 1 && customLocal.length > 0 && !debouncedSearch) {
        rows = [...customLocal, ...rows];
      }

      setSuspects(rows);
      setTotalRecords((json.total || 0) + customLocal.length);
      setTotalPages(json.totalPages || 1);
      setJumpPageInput(String(json.page || currentPage));

      if (json.filters) {
        setAvailableStatuses(json.filters.statuses || []);
        setAvailableCategories(json.filters.categories || []);
        setAvailableLocalities(json.filters.localities || []);
      }
    } catch (err) {
      console.error('Error loading synthetic profiles:', err);
      setError('Unable to fetch synthetic demo profiles from server API.');
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    sortBy,
    debouncedSearch,
    threatFilter,
    statusFilter,
    categoryFilter,
    localityFilter,
  ]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleDeleteSuspect = (id: string, name: string) => {
    if (confirm(`Remove custom synthetic demo record "${name}" from local session?`)) {
      removeSuspect(id);
      fetchProfiles();
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setThreatFilter('');
    setStatusFilter('');
    setCategoryFilter('');
    setLocalityFilter('');
    setSortBy('id_asc');
    setCurrentPage(1);
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Unmistakable Synthetic Provenance Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                SYNTHETIC DEMO — NOT A REAL PERSON OR CASE
              </span>
              <span className="text-xs font-mono text-slate-300">
                5,000 Fictional Nagpur Demo Profiles • 32 AI-Generated Portrait Assets
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              All 5,000 profiles (`SYN-NGP-00001` to `SYN-NGP-05000`), names, aliases, portraits, case references, statuses, and offence labels are <strong>100% fictional generated test data</strong>. None of these profiles are counted in official crime statistics.
            </p>
          </div>
        </div>
        <Link
          href="/data-sources"
          className="text-xs font-semibold text-amber-300 hover:text-amber-200 underline whitespace-nowrap"
        >
          View Official NCRB Stats &amp; Provenance →
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Suspects Sandbox (5,000 Synthetic Demo Profiles)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Showing <span className="text-white font-semibold font-mono">{totalRecords.toLocaleString()}</span> matching fictional Nagpur demo profiles (`synthetic_nagpur_suspects_5000.csv`)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowDatasetModal(true)}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3.5 py-2.5 rounded-xl flex items-center text-sm font-medium transition-colors"
          >
            <FolderOpen className="w-4 h-4 mr-2 text-slate-400" />
            Inspect 5,000 Dataset &amp; 32 Portraits
          </button>
          <Link href="/suspects/new">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Add Demo Profile
            </button>
          </Link>
        </div>
      </div>

      {/* Search, Filters & Sorting Bar */}
      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search across 5,000 profiles by ID (e.g., SYN-NGP-00001), name, alias, locality, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Sort profiles"
              className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="id_asc">Sort: ID Ascending (00001 → 05000)</option>
              <option value="id_desc">Sort: ID Descending (05000 → 00001)</option>
              <option value="name_asc">Sort: Name (A → Z)</option>
              <option value="age_desc">Sort: Age (High → Low)</option>
              <option value="age_asc">Sort: Age (Low → High)</option>
              <option value="cases_desc">Sort: Demo Case Count (High → Low)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Demo Status"
            className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Demo Statuses (7)</option>
            {availableStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={threatFilter}
            onChange={(e) => {
              setThreatFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Demo Threat Tag"
            className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Demo Threat Tags</option>
            <option value="CRITICAL">CRITICAL (Demo)</option>
            <option value="HIGH">HIGH (Demo)</option>
            <option value="MEDIUM">MEDIUM (Demo)</option>
            <option value="LOW">LOW (Demo)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Synthetic Offence Category"
            className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Demo Offence Categories (16)</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={localityFilter}
            onChange={(e) => {
              setLocalityFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by Nagpur Locality"
            className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Nagpur Demo Localities (50)</option>
            {availableLocalities.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Rows per page"
              className="flex-1 bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value={12}>12 rows / page</option>
              <option value={25}>25 rows / page</option>
              <option value={50}>50 rows / page</option>
            </select>

            {(searchTerm ||
              threatFilter ||
              statusFilter ||
              categoryFilter ||
              localityFilter) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
            <p className="text-sm">Loading synthetic demo profiles...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-red-400 font-semibold">{error}</p>
            <button
              onClick={fetchProfiles}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[hsl(217,33%,17%)] bg-[hsl(222,47%,6%)]/60 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Synthetic Demo Profile</th>
                  <th className="py-3.5 px-4 font-semibold">Demo Alias</th>
                  <th className="py-3.5 px-4 font-semibold">Demo Case &amp; Category</th>
                  <th className="py-3.5 px-4 font-semibold">Demo Status</th>
                  <th className="py-3.5 px-4 font-semibold">Nagpur Demo Locality</th>
                  <th className="py-3.5 px-4 font-semibold">Provenance</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(217,33%,17%)] text-sm">
                {suspects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No synthetic demo profiles match your search criteria.
                    </td>
                  </tr>
                ) : (
                  suspects.map((suspect) => (
                    <tr
                      key={suspect.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/suspects/${suspect.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-11 h-11 rounded-full bg-slate-800 border border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={normalizePhotoUrl(suspect.photoUrl)}
                              alt={suspect.name}
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_PORTRAIT_URL;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                              {suspect.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {suspect.id} • {suspect.age}y • {suspect.gender}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300 font-medium">
                        {suspect.alias || 'Not recorded (demo)'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-mono text-blue-400">
                          {suspect.caseReferenceDemo || `DEMO-NGP-2026-${suspect.id}`}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[220px]" title={suspect.crimeCategory}>
                          {suspect.crimeCategory || 'Synthetic demo category'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={suspect.status} />
                          <ThreatBadge level={suspect.threatLevel} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1 font-medium text-white">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          {suspect.locality || suspect.city}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]" title={suspect.policeStation}>
                          {suspect.policeStation}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                          SYNTHETIC DEMO
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Not a real person/case
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/suspects/${suspect.id}`}>
                            <button
                              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="View Synthetic Demo Profile Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          {String(suspect.id).includes('CUSTOM') && (
                            <button
                              onClick={() => handleDeleteSuspect(suspect.id, suspect.name)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete Custom Demo Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer with Jump-to-Page */}
        <div className="px-6 py-4 border-t border-[hsl(217,33%,17%)] bg-[hsl(222,47%,6%)]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Page <span className="font-semibold text-white font-mono">{currentPage}</span> of{' '}
            <span className="font-semibold text-white font-mono">{totalPages}</span> • Total Matching Demo Profiles:{' '}
            <span className="font-semibold text-white font-mono">{totalRecords.toLocaleString()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleJumpPage} className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Go to page:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono text-xs text-center"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium"
              >
                Go
              </button>
            </form>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,8%)] text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,8%)] text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DatasetInspectorModal
        isOpen={showDatasetModal}
        onClose={() => setShowDatasetModal(false)}
      />
    </div>
  );
}
