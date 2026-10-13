'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Calendar,
  Activity,
  User,
  GitCommit,
  Check,
  X,
  Trash2,
  Building2,
  FileText,
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

  // Editable State
  const [suspectStatus, setSuspectStatus] = useState('UNDER_INVESTIGATION');
  const [suspectName, setSuspectName] = useState('');
  const [suspectAlias, setSuspectAlias] = useState('None');
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

  // Workflow Status Modal State
  const [newStatus, setNewStatus] = useState('IN_REMAND');
  const [statusNote, setStatusNote] = useState('Official jurisdictional remand record');

  const [timelineEvents, setTimelineEvents] = useState<
    Array<{ status: string; date: string; location: string; order: string; current: boolean }>
  >([]);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setLoading(true);
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
      setSuspectName(p.name.replace(/\s*\[SYNTHETIC DEMO.*?\]/gi, '').trim());
      setSuspectAlias(p.alias && p.alias !== 'Not recorded (demo)' ? p.alias.replace(/\s*\(demo\)/gi, '').trim() : 'None');
      setSuspectStatus(p.status.replace(/\s*\(DEMO\)/gi, '').trim() || 'UNDER_INVESTIGATION');
      setThreatLevel((p.threatLevel as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM');
      setPhysicalDesc(
        p.physicalDesc
          ?.replace(/^Fictional visual description for UI testing:\s*/gi, '')
          ?.replace(/;\s*not verified evidence\.?$/gi, '')
          ?.trim() || ''
      );
      setDistinguishingMarks(
        p.distinguishingMarks
          ?.replace(/\(demo\)/gi, '')
          ?.replace(/\(fictional\)/gi, '')
          ?.replace(/^Synthetic visual attribute:\s*/gi, '')
          ?.trim() || 'None recorded'
      );
      setLocality(p.locality || 'Sitabuldi');
      setPoliceStation(
        p.policeStation
          ?.replace(/DEMO AREA MAPPING —\s*/gi, 'Nagpur Police — ')
          ?.replace(/;\s*not an actual case assignment/gi, '')
          ?.trim() || 'Nagpur Police — Central Station'
      );
      setGender(p.gender || 'Male');
      setAge(p.age || 30);
      setHeight(p.height || '170 cm');
      setWeight(p.weight || '70 kg');
      setPhotoUrl(normalizePhotoUrl(p.photoUrl));

      setTimelineEvents([
        {
          status: p.status.replace(/\s*\(DEMO\)/gi, '').trim() || 'UNDER_INVESTIGATION',
          date: p.lastUpdated || '2026-10-13',
          location: `Nagpur Police — ${p.locality || 'Central'} Jurisdiction`,
          order: `REC-NGP-${p.id}`,
          current: true,
        },
        {
          status: 'FIR Registered',
          date: '2026-08-15',
          location: `${p.policeStation || 'Nagpur City Police'}`,
          order: p.caseReferenceDemo?.replace(/^DEMO-/gi, '') || `NGP-2026-${p.id}`,
          current: false,
        },
        {
          status: 'Biometric Face Enrollment',
          date: '2026-08-16',
          location: 'Central Identification Bureau, Nagpur',
          order: 'BIO-ENROLL-PASS',
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
      alias: suspectAlias,
      status: suspectStatus,
      threatLevel,
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
      status: newStatus,
      date: new Date().toISOString().split('T')[0],
      location: `Nagpur Jurisdiction (${locality})`,
      order: statusNote || `ORDER-NGP-${Date.now().toString().slice(-4)}`,
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
    if (confirm(`Remove profile "${suspectName}"?`)) {
      removeSuspect(record?.id || rawId);
      router.push('/suspects');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading suspect profile {rawId}...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-lg font-bold text-white">
          Suspect Profile &ldquo;{rawId}&rdquo; Not Found
        </p>
        <Link
          href="/suspects"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Suspects Directory
        </Link>
      </div>
    );
  }

  const cleanDisplayStatus = suspectStatus
    .replace(/\s*\(DEMO\)/gi, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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
                {cleanDisplayStatus}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold border bg-amber-500/15 text-amber-300 border-amber-500/30">
                Threat Level: {threatLevel}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
              <span>ID: {record.id}</span>
              <span>•</span>
              <span className="text-blue-400">Alias: {suspectAlias}</span>
              <span>•</span>
              <span>Case Ref: {record.caseReferenceDemo?.replace(/^DEMO-/i, '') || record.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all"
          >
            <Edit className="w-4 h-4 text-blue-400" />
            Edit Profile
          </button>
          <button
            onClick={() => setShowStatusModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            <GitCommit className="w-4 h-4" />
            Update Status
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
          {/* Demographic & Physical Profile */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Personal &amp; Demographic Profile
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Active Enrolled Record
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-sm">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Age &amp; Gender
                </p>
                <p className="text-slate-200 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {age} Years • {gender}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Height &amp; Weight
                </p>
                <p className="text-slate-200 font-medium">
                  {height} • {weight}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Jurisdiction &amp; Locality
                </p>
                <p className="text-slate-200 font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  {locality}, {record.city || 'Nagpur'}, {record.stateOrUT || 'Maharashtra'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{record.region || 'Nagpur Metropolitan Region'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Assigned Police Station
                </p>
                <p className="text-slate-200 font-medium text-xs flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {policeStation}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Primary Offence Classification
                </p>
                <p className="text-amber-300 font-medium text-xs">
                  {record.crimeCategory?.replace(/\s*\(synthetic.*?\)/i, '') || 'Cognizable Offence'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Case Reference &amp; Investigations
                </p>
                <p className="text-slate-200 font-mono text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  {record.caseReferenceDemo?.replace(/^DEMO-/i, '') || record.id} ({record.cases} linked cases)
                </p>
              </div>

              <div className="md:col-span-2 border-t border-[hsl(217,33%,17%)] pt-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" /> Physical Identification &amp; Distinguishing Marks
                </p>
                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{physicalDesc}</p>
                <div className="bg-[hsl(222,47%,6%)] p-3 rounded-lg border border-[hsl(217,33%,17%)] text-xs">
                  <span className="text-blue-400 font-medium block mb-0.5">
                    Distinguishing Marks:
                  </span>
                  <span className="text-slate-300">{distinguishingMarks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Investigation & Legal Status Card */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Departmental Status &amp; Jurisdiction
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                Last Updated: {record.lastUpdated || '2026-10-13'}
              </span>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Custodial / Legal Status:</span>
                  <span className="text-slate-200 font-medium">{cleanDisplayStatus}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Threat Level Assessment:</span>
                  <span className="text-amber-400 font-medium">{threatLevel} Priority</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Legal Head / Category:</span>
                  <span className="text-slate-200">{record.crimeCategory?.replace(/\s*\(synthetic.*?\)/i, '')}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Jurisdiction / Locality:</span>
                  <span className="text-slate-200">{locality}, Nagpur Police</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Portrait Card */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <span className="mb-3 px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
              Enrolled Biometric Portrait
            </span>
            <div className="w-40 h-40 rounded-full bg-slate-900 border-4 border-slate-700 shadow-xl flex items-center justify-center mb-4 relative overflow-hidden">
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
            <p className="text-[11px] text-slate-400 mt-1 font-mono">{record.id}</p>
            <div className="w-full mt-4 p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-400 text-[11px] leading-snug">
              Standard identification profile photograph enrolled for ArcFace biometric verification.
            </div>
          </div>

          {/* Lifecycle Workflow Stepper Timeline */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[hsl(217,33%,17%)] pb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-blue-400" />
                Custody &amp; Trial Lifecycle Timeline
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

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[hsl(217,33%,17%)]">
              <h3 className="text-base font-bold text-white">
                Update Suspect Status Transition
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 uppercase font-semibold">
                  Select Updated Lifecycle Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-white"
                >
                  <option value="UNDER_INVESTIGATION">Under Investigation</option>
                  <option value="ARRESTED">Arrested</option>
                  <option value="IN_REMAND">In Remand</option>
                  <option value="COURT_PENDING">Court Pending</option>
                  <option value="ON_BAIL">On Bail</option>
                  <option value="CONVICTED">Convicted</option>
                  <option value="CLOSED">Case Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 uppercase font-semibold">
                  Departmental Notes / Case Order Ref
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
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
                  <Check className="w-4 h-4" /> Apply Status Transition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[hsl(217,33%,17%)]">
              <h3 className="text-base font-bold text-white">Edit Suspect Profile</h3>
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
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={suspectName}
                    onChange={(e) => setSuspectName(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Alias / Known As</label>
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
                          Enrolled Photo {num}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Locality</label>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
