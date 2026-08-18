'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Calendar, 
  Fingerprint, 
  Activity, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  Camera, 
  History, 
  Building, 
  AlertTriangle,
  GitCommit,
  Link2,
  FileText,
  Layers,
  Zap,
  Check,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const DEFAULT_SUSPECT_MAP: Record<string, any> = {
  '1': { name: 'Vikram Sharma', alias: 'Vicky', threatLevel: 'CRITICAL', status: 'AT_LARGE', city: 'Nagpur', physicalDesc: 'Tall build, wheatish complexion, scar on left cheek.', distinguishingMarks: 'Large tattoo of trident on right forearm.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  '2': { name: 'Rahul Desai', alias: 'Raju', threatLevel: 'HIGH', status: 'ARRESTED', city: 'Pune', physicalDesc: 'Medium build, short dark hair, sharp jawline.', distinguishingMarks: 'Cut mark near right ear.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
  '3': { name: 'Amit Patel', alias: 'Bhaiya', threatLevel: 'MEDIUM', status: 'IN_REMAND', city: 'Nagpur', physicalDesc: 'Stocky build, wears spectacles.', distinguishingMarks: 'Mole on right side of neck.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' },
  '4': { name: 'Sanjay Kumar', alias: '-', threatLevel: 'LOW', status: 'BAILED', city: 'Mumbai', physicalDesc: 'Lean build, dark complexion.', distinguishingMarks: 'Burn scar on left wrist.', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300' },
  '5': { name: 'Priya Sharma', alias: 'Lady Gang', threatLevel: 'MEDIUM', status: 'AT_LARGE', city: 'Hyderabad', physicalDesc: 'Slim build, long black hair.', distinguishingMarks: 'Star tattoo on left shoulder.', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
  '6': { name: 'Ravi Verma', alias: 'Baba', threatLevel: 'CRITICAL', status: 'CONVICTED', city: 'Bangalore', physicalDesc: 'Muscular build, bearded, short hair.', distinguishingMarks: 'Eagle tattoo on chest.', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300' },
  '7': { name: 'Anil Kapoor', alias: 'AK', threatLevel: 'HIGH', status: 'AT_LARGE', city: 'Chennai', physicalDesc: 'Average height, curly dark hair.', distinguishingMarks: 'Surgical scar on right knee.', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300' },
  '8': { name: 'Sneha Reddy', alias: '-', threatLevel: 'LOW', status: 'ARRESTED', city: 'Kolkata', physicalDesc: 'Petite build, brown eyes.', distinguishingMarks: 'Birthmark on left forearm.', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300' },
  '9': { name: 'Mohammed Ali', alias: 'Bhai', threatLevel: 'HIGH', status: 'IN_REMAND', city: 'Mumbai', physicalDesc: 'Tall, athletic build.', distinguishingMarks: 'Scar above left eyebrow.', photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300' },
  '10': { name: 'Deepak Joshi', alias: '-', threatLevel: 'MEDIUM', status: 'BAILED', city: 'Pune', physicalDesc: 'Medium height, wears thick glasses.', distinguishingMarks: 'Tattoo on right wrist.', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300' },
  '11': { name: 'Neha Gupta', alias: '-', threatLevel: 'LOW', status: 'CONVICTED', city: 'Nagpur', physicalDesc: 'Fair complexion, medium height.', distinguishingMarks: 'Small scar on chin.', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300' },
  '12': { name: 'Surya Narayanan', alias: 'Suri', threatLevel: 'CRITICAL', status: 'AT_LARGE', city: 'Chennai', physicalDesc: 'Broad shoulders, shaved head.', distinguishingMarks: 'Dragon tattoo on arm.', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300' },
};

export default function SuspectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [suspectStatus, setSuspectStatus] = useState('ARRESTED');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLinkCaseModal, setShowLinkCaseModal] = useState(false);

  // Edit Suspect Profile Form State
  const [suspectName, setSuspectName] = useState('');
  const [suspectAlias, setSuspectAlias] = useState('');
  const [threatLevel, setThreatLevel] = useState('HIGH');
  const [physicalDesc, setPhysicalDesc] = useState('');
  const [distinguishingMarks, setDistinguishingMarks] = useState('');
  const [suspectCity, setSuspectCity] = useState('Nagpur');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Link Case State
  const [selectedCaseToLink, setSelectedCaseToLink] = useState('CR/2026/9001');

  // Linked Cases List State
  const [linkedCases, setLinkedCases] = useState([
    { id: 'CR/2026/5001', title: 'Armed Robbery at Sitabuldi Jewelry Store', type: 'ROBBERY', status: 'UNDER_INVESTIGATION', date: '2026-08-10', role: 'PRIMARY_SUSPECT' },
    { id: 'CR/2025/4412', title: 'Highway Narcotics Seizure Syndicate', type: 'NARCOTICS', status: 'CHARGE_SHEETED', date: '2025-11-05', role: 'ACCOMPLICE' },
    { id: 'CR/2024/2009', title: 'Cyber Fraud Phishing Operations', type: 'CYBER_FRAUD', status: 'TRIAL', date: '2024-05-22', role: 'PRIMARY_SUSPECT' },
  ]);

  // Timeline events state
  const [newStatus, setNewStatus] = useState('REMAND');
  const [courtName, setCourtName] = useState('District & Sessions Court, Nagpur');
  const [orderNo, setOrderNo] = useState('ORD-2026-9941');

  const [timelineEvents, setTimelineEvents] = useState([
    { status: 'Remand Extended (7 Days)', date: '2026-08-18', location: 'District Court, Nagpur', order: 'ORD-2026-9941', current: true },
    { status: 'Arrested at Railway Station', date: '2026-08-15', location: 'Sitabuldi PS, Nagpur', order: 'FIR-2026-104', current: false },
    { status: 'ArcFace Alias Matched (98.2%)', date: '2026-08-10', location: 'Mumbai Cyber Cell Database', order: 'BIO-SCAN-09', current: false },
    { status: 'Bail Revoked', date: '2025-11-12', location: 'Sessions Court, Pune', order: 'ORD-2025-4412', current: false },
  ]);

  // DYNAMIC DATA LOADING BASED ON params.id
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const idStr = String(params.id).trim();

      // 1. Check custom_suspects in localStorage
      const customJson = localStorage.getItem('custom_suspects');
      if (customJson) {
        try {
          const list = JSON.parse(customJson);
          const matched = list.find((s: any) => String(s.id).trim().toLowerCase() === idStr.toLowerCase());
          if (matched) {
            setSuspectName(matched.name);
            setSuspectAlias(matched.alias || '-');
            setThreatLevel(matched.threatLevel || 'HIGH');
            setSuspectStatus(matched.status || 'ARRESTED');
            setSuspectCity(matched.city || 'Nagpur');
            setPhysicalDesc(matched.physicalDesc || 'Registered criminal suspect profile.');
            setDistinguishingMarks(matched.distinguishingMarks || 'Scar/tattoo mark registered in database.');
            setPhotoUrl(matched.photoUrl || matched.photo || null);
            return;
          }
        } catch {
          // ignore
        }
      }

      // 2. Check DEFAULT_SUSPECT_MAP
      const defaultData = DEFAULT_SUSPECT_MAP[idStr];
      if (defaultData) {
        setSuspectName(defaultData.name);
        setSuspectAlias(defaultData.alias);
        setThreatLevel(defaultData.threatLevel);
        setSuspectStatus(defaultData.status);
        setSuspectCity(defaultData.city);
        setPhysicalDesc(defaultData.physicalDesc);
        setDistinguishingMarks(defaultData.distinguishingMarks);
        setPhotoUrl(defaultData.photo);
        return;
      }

      // 3. Fallback for any other custom or unmapped ID
      setSuspectName(`Suspect Record #${idStr}`);
      setSuspectAlias('Unassigned Alias');
      setThreatLevel('HIGH');
      setSuspectStatus('ARRESTED');
      setSuspectCity('Nagpur');
      setPhysicalDesc('Active suspect under police investigation.');
      setDistinguishingMarks('Physical traits registered in CCTNS.');
      setPhotoUrl(null);
    }
  }, [params.id]);

  const handleDeleteRecord = () => {
    if (confirm(`Are you sure you want to permanently delete suspect record: "${suspectName}"?`)) {
      if (typeof window !== 'undefined') {
        const customJson = localStorage.getItem('custom_suspects');
        if (customJson) {
          try {
            const list = JSON.parse(customJson);
            const updated = list.filter((s: any) => String(s.id) !== String(params.id));
            localStorage.setItem('custom_suspects', JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
      }
      router.push('/suspects');
    }
  };

  const handleUpdateStatus = () => {
    setSuspectStatus(newStatus);
    setTimelineEvents([
      { 
        status: `Transferred to ${newStatus.replace('_', ' ')}`, 
        date: new Date().toISOString().split('T')[0], 
        location: courtName, 
        order: orderNo, 
        current: true 
      },
      ...timelineEvents.map(e => ({ ...e, current: false }))
    ]);
    setShowStatusModal(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(false);
  };

  const handleLinkCase = (e: React.FormEvent) => {
    e.preventDefault();
    const newLink = {
      id: selectedCaseToLink,
      title: 'Commercial Burglary & Strongroom Break-in',
      type: 'BURGLARY',
      status: 'UNDER_INVESTIGATION',
      date: new Date().toISOString().split('T')[0],
      role: 'PRIMARY_SUSPECT'
    };
    setLinkedCases([newLink, ...linkedCases]);
    setShowLinkCaseModal(false);
  };

  const getInitials = (name: string) => (name || 'Suspect').split(' ').map(n => n[0]).join('').substring(0, 2);

  const ThreatBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      'CRITICAL': 'bg-red-500/15 text-red-400 border-red-500/30',
      'HIGH': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      'MEDIUM': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      'LOW': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    };
    return <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 ${colors[level] || colors.LOW}`}><ShieldAlert className="w-3.5 h-3.5"/> {level} RISK</span>;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'ARRESTED': 'bg-red-500/15 text-red-400 border-red-500/30',
      'REMAND': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      'BAIL': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      'TRIAL': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      'CONVICTED': 'bg-rose-600/15 text-rose-400 border-rose-500/30',
      'CUSTODY': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      'RELEASED': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    };
    return <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${colors[status] || colors.ARRESTED}`}>{status}</span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[hsl(217,33%,17%)] pb-6">
        <div className="flex items-center gap-4">
          <Link href="/suspects" className="p-2.5 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white tracking-tight">{suspectName || 'Loading Suspect...'}</h1>
              <StatusBadge status={suspectStatus} />
              <ThreatBadge level={threatLevel} />
            </div>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <span>System ID: SUS-{params.id}</span>
              <span>•</span>
              <span className="text-blue-400 font-medium">Aliases: {suspectAlias}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowEditModal(true)}
            className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
          >
            <Edit className="w-4 h-4 text-blue-400" />
            Edit Profile
          </button>
          <button 
            onClick={() => setShowStatusModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            <GitCommit className="w-4 h-4" />
            Update Lifecycle Status
          </button>
          <button 
            onClick={handleDeleteRecord}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all"
            title="Delete Suspect Record"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Cross-Jurisdiction Repeat Offender Alert */}
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-purple-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Unified Biometric Cluster Detected (3 Jurisdictions)</p>
            <p className="text-xs text-purple-300/80">Identical ArcFace 512-dim facial vector matches cases across {suspectCity}, Mumbai Cyber Cell, and Pune Rural.</p>
          </div>
        </div>
        <Link href="/analytics" className="text-xs bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-200 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap self-start md:self-auto transition-colors flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-purple-400" /> View Similarity Network
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Personal Info */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Demographic & Biometric Metadata
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="text-sm text-slate-200 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  April 12, 1988 (Age: 38)
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Gender / Nationality</p>
                <p className="text-sm text-slate-200 font-medium">Male • Indian</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Last Known Address</p>
                <p className="text-sm text-slate-200 font-medium flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  Sitabuldi Road, {suspectCity}, Maharashtra
                </p>
              </div>
              <div className="md:col-span-2 border-t border-[hsl(217,33%,17%)] pt-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" /> Physical Marks & Traits
                </p>
                <p className="text-sm text-slate-300 mb-3">{physicalDesc}</p>
                <div className="bg-[hsl(222,47%,6%)] p-3 rounded-lg border border-[hsl(217,33%,17%)]">
                  <span className="text-xs text-amber-400 font-medium mb-1 block">Distinguishing Marks:</span>
                  <span className="text-sm text-slate-300 font-medium">{distinguishingMarks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Cases */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5 flex justify-between items-center">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-400" />
                Linked Criminal Cases
              </h2>
              <button 
                onClick={() => setShowLinkCaseModal(true)}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs px-3 py-1.5 rounded-lg font-semibold border border-purple-500/30 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Link Case
              </button>
            </div>
            <div className="divide-y divide-[hsl(217,33%,17%)]">
              {linkedCases.map((c) => (
                <div key={c.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-blue-400 font-bold">{c.id}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">{c.role}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200">{c.title}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Date: {c.date}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-md font-semibold border bg-amber-500/10 text-amber-400 border-amber-500/20">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mugshot Card */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-4 border-[hsl(222,47%,8%)] shadow-2xl ring-2 ring-blue-500/30 flex items-center justify-center mb-4 relative overflow-hidden">
              {photoUrl ? (
                <img src={photoUrl} alt={suspectName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-slate-300">{getInitials(suspectName)}</span>
              )}
            </div>
            <h3 className="font-bold text-white text-lg">{suspectName}</h3>
            <p className="text-xs text-slate-400 mb-4">ArcFace 512-dim Vector: Indexed</p>
            <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Active Arrest Record
            </div>
          </div>

          {/* Interactive Lifecycle Stepper Timeline */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-[hsl(217,33%,17%)] pb-3">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-blue-400" />
                Arrest-to-Custody Timeline
              </h3>
            </div>
            <div className="relative pl-4 space-y-6">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-[hsl(217,33%,17%)]"></div>
              
              {timelineEvents.map((event, i) => (
                <div key={i} className="relative pl-6">
                  <div className={cn(
                    "absolute -left-1 top-1 w-3.5 h-3.5 rounded-full border-2 border-[hsl(222,47%,8%)] transition-all",
                    event.current ? 'bg-blue-500 ring-4 ring-blue-500/20 scale-110' : 'bg-slate-600'
                  )}></div>
                  <p className={cn("text-sm font-bold", event.current ? 'text-blue-400' : 'text-slate-200')}>
                    {event.status}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{event.location}</p>
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveProfile} className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[hsl(217,33%,17%)] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-400" /> Edit Suspect Profile
              </h3>
              <button type="button" onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input type="text" value={suspectName} onChange={(e) => setSuspectName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Aliases</label>
                <input type="text" value={suspectAlias} onChange={(e) => setSuspectAlias(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Threat Level</label>
                <select value={threatLevel} onChange={(e) => setThreatLevel(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Physical Description</label>
                <textarea rows={2} value={physicalDesc} onChange={(e) => setPhysicalDesc(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[hsl(217,33%,17%)]">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Link Case Modal */}
      {showLinkCaseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleLinkCase} className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[hsl(217,33%,17%)] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-purple-400" /> Link Case to Suspect
              </h3>
              <button type="button" onClick={() => setShowLinkCaseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Case Record</label>
                <select value={selectedCaseToLink} onChange={(e) => setSelectedCaseToLink(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white">
                  <option value="CR/2026/9001">CR/2026/9001 — Commercial Burglary & Strongroom Break-in</option>
                  <option value="CR/2026/8002">CR/2026/8002 — Cyber Phishing Financial Fraud</option>
                  <option value="CR/2026/7003">CR/2026/7003 — Highway Vehicle Theft Ring</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[hsl(217,33%,17%)]">
              <button type="button" onClick={() => setShowLinkCaseModal(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">Confirm Case Link</button>
            </div>
          </form>
        </div>
      )}

      {/* Lifecycle Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[hsl(217,33%,17%)] pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-blue-400" />
                Update Suspect Lifecycle Status
              </h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">New Status</label>
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ARRESTED">ARRESTED (Initial Detention)</option>
                  <option value="REMAND">REMAND (Judicial / Police Remand)</option>
                  <option value="BAIL">BAIL (Granted Court Bail)</option>
                  <option value="TRIAL">TRIAL (Under Active Court Trial)</option>
                  <option value="CONVICTED">CONVICTED (Sentenced by Court)</option>
                  <option value="CUSTODY">CUSTODY (State Correctional Custody)</option>
                  <option value="RELEASED">RELEASED (Acquitted / Released)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Court / Station Jurisdiction</label>
                <input 
                  type="text" 
                  value={courtName} 
                  onChange={(e) => setCourtName(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">Legal Order / Warrant Reference</label>
                <input 
                  type="text" 
                  value={orderNo} 
                  onChange={(e) => setOrderNo(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[hsl(217,33%,17%)]">
              <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white">
                Cancel
              </button>
              <button onClick={handleUpdateStatus} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Save Status Transition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
