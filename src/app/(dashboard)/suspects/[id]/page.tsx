'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Calendar,
  Activity,
  Clock,
  User,
  Building,
  AlertTriangle,
  GitCommit,
  Check,
  X,
  Trash2,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  getSuspectById,
  saveSuspect,
  removeSuspect,
  SuspectRecord,
  FALLBACK_PORTRAIT_URL,
  normalizePhotoUrl,
} from '@/lib/data/suspects-data';

export default function SuspectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = String(params?.id || 'SYN-NGP-00001');

  const [record, setRecord] = useState<SuspectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Editable Demo State
  const [suspectStatus, setSuspectStatus] = useState('UNDER_INVESTIGATION (DEMO)');
  const [suspectName, setSuspectName] = useState('');
  const [suspectAlias, setSuspectAlias] = useState('Not recorded (demo)');
  const [threatLevel, setThreatLevel] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [physicalDesc, setPhysicalDesc] = useState('');
  const [distinguishingMarks, setDistinguishingMarks] = useState('');
  const [locality, setLocality] = useState('Sitabuldi');
  const [policeStation, setPoliceStation] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState('170 cm');
  const [weight, setWeight] = useState('70 kg');
  const [photoUrl, setPhotoUrl] = useState<string>(FALLBACK_PORTRAIT_URL);

  // Demo Workflow Status Modal State
  const [newStatus, setNewStatus] = useState('IN_REMAND (DEMO)');
  const [demoNote, setDemoNote] = useState('UI workflow simulation event (not a real order)');

  const [timelineEvents, setTimelineEvents] = useState<
    Array<{ status: string; date: string; location: string; order: string; current: boolean }>
  >([]);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setLoading(true);
      // 1. Check custom/local first
      const localMatch = getSuspectById(rawId);

      try {
        const res = await fetch(`/api/suspects/${encodeURIComponent(rawId)}`);
        if (res.ok) {
          const json = await res.json();
          const p: SuspectRecord = localMatch || json.data;
          if (active && p) {
            applyProfileToState(p);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to local
      }

      if (active) {
        if (localMatch) {
          applyProfileToState(localMatch);
        }
        setLoading(false);
      }
    }

    function applyProfileToState(p: SuspectRecord) {
      setRecord(p);
      setSuspectName(p.name);
      setSuspectAlias(p.alias || 'Not recorded (demo)');
      setSuspectStatus(p.status || 'UNDER_INVESTIGATION (DEMO)');
      setThreatLevel(p.threatLevel || 'MEDIUM');
      setPhysicalDesc(p.physicalDesc || 'Fictional visual description for UI testing.');
      setDistinguishingMarks(p.distinguishingMarks || 'No distinguishing mark recorded (demo)');
      setLocality(p.locality || p.city || 'Nagpur');
      setPoliceStation(
        p.policeStation ||
          `DEMO AREA MAPPING — ${p.locality || 'Nagpur'}; not an actual case assignment`
      );
      setGender(p.gender || 'Male');
      setAge(p.age || 30);
      setHeight(p.height || '170 cm');
      setWeight(p.weight || '70 kg');
      setPhotoUrl(normalizePhotoUrl(p.photoUrl));

      setTimelineEvents([
        {
          status: `${p.status} [Synthetic Workflow State]`,
          date: p.lastUpdated || '2026-10-13',
          location: `DEMO AREA — ${p.locality || 'Nagpur'} (Not a real station/court)`,
          order: p.caseReferenceDemo || `DEMO-NGP-2026-${p.id}`,
          current: true,
        },
        {
          status: 'Synthetic Demo Record Generated for UI Testing',
          date: '2026-10-13',
          location: 'CrimeTrack AI Synthetic Sandbox',
          order: 'SYNTHETIC_DEMO_ONLY',
          current: false,
        },
      ]);
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [rawId]);

  const persistUpdate = (overrides: Partial<SuspectRecord> = {}) => {
    if (!record) return;
    const updated: SuspectRecord = {
      ...record,
      name: suspectName,
      alias: suspectAlias || 'Not recorded (demo)',
      threatLevel,
      status: suspectStatus,
      locality,
      policeStation,
      gender,
      age: Number(age) || 30,
      height,
      weight,
      physicalDesc,
      distinguishingMarks,
      photoUrl,
      lastUpdated: new Date().toISOString().split('T')[0],
      ...overrides,
    };
    saveSuspect(updated);
    setRecord(updated);
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSuspectStatus(newStatus);
    persistUpdate({ status: newStatus });

    const newEvent = {
      status: `${newStatus} [Demo Simulation]`,
      date: new Date().toISOString().split('T')[0],
      location: `Simulated Workflow (${locality})`,
      order: demoNote || 'DEMO-WORKFLOW-STEP',
      current: true,
    };
    setTimelineEvents([
      newEvent,
      ...timelineEvents.map((ev) => ({ ...ev, current: false })),
    ]);
    setShowStatusModal(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    persistUpdate();
    setShowEditModal(false);
  };

  const handleDeleteRecord = () => {
    if (confirm(`Remove custom modifications for demo record "${suspectName}"?`)) {
      removeSuspect(record?.id || rawId);
      router.push('/suspects');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading synthetic demo profile {rawId}...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-lg font-bold text-white">
          Synthetic Demo Profile &ldquo;{rawId}&rdquo; Not Found
        </p>
        <Link
          href="/suspects"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to 5,000 Demo Profiles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Unmistakable Synthetic Provenance Banner */}
      <div className="p-4 bg-amber-500/15 border-2 border-amber-500/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
              SYNTHETIC DEMO — NOT A REAL PERSON OR CASE
            </span>
            <p className="text-xs text-amber-100 mt-1 font-medium">
              {record.recordDisclaimer ||
                'FICTIONAL GENERATED DEMO ONLY — NOT A REAL SUSPECT, FIR, CASE, ARREST, CONVICTION OR CUSTODY RECORD.'}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-amber-300 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-amber-500/30 shrink-0">
          isSynthetic: TRUE • isRealPerson: FALSE
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[hsl(217,33%,17%)] pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/suspects"
            className="p-2.5 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {suspectName}
              </h1>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold border bg-blue-500/15 text-blue-400 border-blue-500/30">
                {suspectStatus}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold border bg-amber-500/15 text-amber-300 border-amber-500/30">
                Threat Tag: {threatLevel} (DEMO)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
              <span>Demo ID: {record.id}</span>
              <span>•</span>
              <span className="text-blue-400">Alias: {suspectAlias}</span>
              <span>•</span>
              <span>Case Ref: {record.caseReferenceDemo || `DEMO-NGP-2026-${record.id}`}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all"
          >
            <Edit className="w-4 h-4 text-blue-400" />
            Edit Demo Fields
          </button>
          <button
            onClick={() => setShowStatusModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all"
          >
            <GitCommit className="w-4 h-4" />
            Simulate Workflow Step
          </button>
          {String(record.id).includes('CUSTOM') && (
            <button
              onClick={handleDeleteRecord}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Fictional Demographic & UI Test Fields */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Synthetic Demo Attributes (All 35 Dataset Columns Populated)
              </h2>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                recordType: {record.recordType || 'SYNTHETIC_DEMO_ONLY'}
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-sm">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Fictional Age &amp; Gender
                </p>
                <p className="text-slate-200 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {age} Years • {gender}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Fictional Height &amp; Weight
                </p>
                <p className="text-slate-200 font-medium">
                  {height} • {weight}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Nagpur Demo Locality &amp; Region
                </p>
                <p className="text-slate-200 font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  {locality}, {record.city || 'Nagpur'}, {record.stateOrUT || 'Maharashtra'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{record.region}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Demo Station Mapping
                </p>
                <p className="text-slate-200 font-medium text-xs">{policeStation}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Illustrative Synthetic Offence Category
                </p>
                <p className="text-amber-300 font-medium text-xs">
                  {record.crimeCategory || 'Other Cognizable Offence (synthetic demo category)'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Demo Case Reference &amp; Count
                </p>
                <p className="text-slate-200 font-mono text-xs">
                  {record.caseReferenceDemo || `DEMO-NGP-2026-${record.id}`} ({record.cases} demo cases)
                </p>
              </div>

              <div className="md:col-span-2 border-t border-[hsl(217,33%,17%)] pt-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" /> Fictional Visual Description &amp; Marks (UI Testing Only)
                </p>
                <p className="text-xs text-slate-300 mb-2">{physicalDesc}</p>
                <div className="bg-[hsl(222,47%,6%)] p-3 rounded-lg border border-[hsl(217,33%,17%)] text-xs">
                  <span className="text-amber-400 font-medium block mb-0.5">
                    Distinguishing Marks Field:
                  </span>
                  <span className="text-slate-300">{distinguishingMarks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Provenance & Basis Metadata Card (All Basis Columns from Dataset) */}
          <div className="bg-[hsl(222,47%,8%)] border border-amber-500/30 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-amber-500/5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                Data Provenance &amp; Field Basis Disclosures
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                Updated: {record.lastUpdated || '2026-10-13'}
              </span>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Status Basis:</span>
                  <span className="text-slate-300">
                    {record.statusBasis || 'Random UI field; not an actual police/court/custody status.'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Threat Level Basis:</span>
                  <span className="text-slate-300">
                    {record.threatLevelBasis ||
                      'Random UI display label; no predictive, forensic or legal validity.'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Crime Category Basis:</span>
                  <span className="text-slate-300">
                    {record.crimeCategoryBasis ||
                      'Illustrative synthetic label only; not an actual accusation and not frequency-calibrated to NCRB counts.'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Locality Basis:</span>
                  <span className="text-slate-300">
                    {record.localityBasis ||
                      'Real locality name used only as a broad demo setting; no event is asserted to have occurred there.'}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                <strong>Official Statistics Separation Context:</strong>{' '}
                {record.statsSourceContext ||
                  'Use separate official aggregate CSV for crime counts; no aggregate count is assigned to this profile.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fictional Portrait Card */}
          <div className="bg-[hsl(222,47%,8%)] border border-amber-500/30 rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <span className="mb-3 px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase">
              AI-Generated Fictional Portrait
            </span>
            <div className="w-40 h-40 rounded-full bg-slate-900 border-4 border-amber-500/30 shadow-xl flex items-center justify-center mb-4 relative overflow-hidden">
              <img
                src={photoUrl}
                alt={suspectName}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_PORTRAIT_URL;
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-white text-base">{suspectName}</h3>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">{photoUrl}</p>
            <div className="w-full mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-[11px] leading-snug">
              {record.photoDisclaimer ||
                'AI-generated fictional portrait; not a real person and not identity evidence.'}
            </div>
          </div>

          {/* Simulated Workflow Stepper Timeline */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[hsl(217,33%,17%)] pb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-blue-400" />
                Simulated Lifecycle Workflow (Demo)
              </h3>
            </div>
            <div className="relative pl-4 space-y-5">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-[hsl(217,33%,17%)]"></div>
              {timelineEvents.map((event, i) => (
                <div key={i} className="relative pl-6">
                  <div
                    className={cn(
                      'absolute -left-1 top-1 w-3.5 h-3.5 rounded-full border-2 border-[hsl(222,47%,8%)]',
                      event.current
                        ? 'bg-blue-500 ring-4 ring-blue-500/20'
                        : 'bg-slate-600'
                    )}
                  ></div>
                  <p
                    className={cn(
                      'text-xs font-bold',
                      event.current ? 'text-blue-400' : 'text-slate-200'
                    )}
                  >
                    {event.status}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{event.location}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.order}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulate Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[hsl(217,33%,17%)]">
              <h3 className="text-base font-bold text-white">
                Simulate Demo Workflow Status Transition
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                This updates the local UI demonstration state only. It does not represent a real police, judicial, or custodial action.
              </div>
              <div>
                <label className="block text-slate-400 mb-1 uppercase font-semibold">
                  Select Demo Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-white"
                >
                  <option value="UNDER_INVESTIGATION (DEMO)">UNDER_INVESTIGATION (DEMO)</option>
                  <option value="ARRESTED (DEMO)">ARRESTED (DEMO)</option>
                  <option value="IN_REMAND (DEMO)">IN_REMAND (DEMO)</option>
                  <option value="COURT_PENDING (DEMO)">COURT_PENDING (DEMO)</option>
                  <option value="ON_BAIL (DEMO)">ON_BAIL (DEMO)</option>
                  <option value="CONVICTED (DEMO)">CONVICTED (DEMO)</option>
                  <option value="CLOSED (DEMO)">CLOSED (DEMO)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 uppercase font-semibold">
                  Simulation Note
                </label>
                <input
                  type="text"
                  value={demoNote}
                  onChange={(e) => setDemoNote(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[hsl(217,33%,17%)]">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Apply Demo Transition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Demo Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[hsl(217,33%,17%)]">
              <h3 className="text-base font-bold text-white">Edit Synthetic Demo Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Fictional Name</label>
                  <input
                    type="text"
                    value={suspectName}
                    onChange={(e) => setSuspectName(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Demo Alias</label>
                  <input
                    type="text"
                    value={suspectAlias}
                    onChange={(e) => setSuspectAlias(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Portrait Asset (1–32)</label>
                  <select
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-white"
                  >
                    {Array.from({ length: 32 }, (_, i) => {
                      const num = String(i + 1).padStart(3, '0');
                      const url = `/images/portrait_${num}.jpg`;
                      return (
                        <option key={url} value={url}>
                          portrait_{num}.jpg (Synthetic Asset)
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nagpur Demo Locality</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[hsl(217,33%,17%)]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
                >
                  Save Demo Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
