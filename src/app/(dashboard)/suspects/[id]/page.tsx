'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, MapPin, Calendar, Fingerprint, Activity, Clock, ShieldAlert, CheckCircle2, User, Camera, History, Building, AlertTriangle } from 'lucide-react';

export default function SuspectDetailPage({ params }: { params: { id: string } }) {
  // Mock data for the specific suspect
  const suspect = {
    id: params.id,
    name: 'Vikram Singh',
    alias: 'Vicky',
    dob: '1985-04-12',
    gender: 'Male',
    nationality: 'Indian',
    physicalDesc: 'Tall build, wheatish complexion, scar on left cheek.',
    height: '182 cm',
    weight: '85 kg',
    distinguishingMarks: 'Large tattoo on right forearm of a tiger.',
    idType: 'Aadhaar',
    idNumber: 'XXXX-XXXX-1234',
    address: 'Plot 45, Shivaji Nagar',
    city: 'Mumbai',
    state: 'Maharashtra',
    threatLevel: 'CRITICAL',
    status: 'AT_LARGE',
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

  const ThreatBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      'CRITICAL': 'bg-red-500/10 text-red-500 border-red-500/20',
      'HIGH': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'MEDIUM': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'LOW': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    };
    return <span className={`px-2 py-1 rounded-md text-[10px] font-medium border flex items-center gap-1 ${colors[level] || colors.LOW}`}><ShieldAlert className="w-3 h-3"/> {level}</span>;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/suspects" className="p-2 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{suspect.name}</h1>
              <StatusBadge status={suspect.status} />
              <ThreatBadge level={suspect.threatLevel} />
            </div>
            <p className="text-sm text-slate-400 mt-1">ID: SUS-{suspect.id.padStart(5, '0')} • Alias: {suspect.alias}</p>
          </div>
        </div>
        <button className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] hover:bg-white/5 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[hsl(217,33%,17%)] bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Personal Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="text-sm text-slate-200 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(suspect.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Gender / Nationality</p>
                <p className="text-sm text-slate-200 font-medium">{suspect.gender} • {suspect.nationality}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Last Known Address</p>
                <p className="text-sm text-slate-200 font-medium flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  {suspect.address}, {suspect.city}, {suspect.state}
                </p>
              </div>
              <div className="md:col-span-2 border-t border-[hsl(217,33%,17%)] pt-6 mt-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Physical Description
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-slate-400">Height:</span>
                    <span className="text-sm text-slate-200 ml-2 font-medium">{suspect.height}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Weight:</span>
                    <span className="text-sm text-slate-200 ml-2 font-medium">{suspect.weight}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-2">{suspect.physicalDesc}</p>
                <div className="bg-[hsl(222,47%,6%)] p-3 rounded-lg border border-[hsl(217,33%,17%)]">
                  <span className="text-xs text-amber-500 font-medium mb-1 block">Distinguishing Marks:</span>
                  <span className="text-sm text-slate-300">{suspect.distinguishingMarks}</span>
                </div>
              </div>
              <div className="md:col-span-2 border-t border-[hsl(217,33%,17%)] pt-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" /> Identification
                </p>
                <div className="flex gap-4">
                  <div className="bg-[hsl(222,47%,6%)] p-3 rounded-lg border border-[hsl(217,33%,17%)] flex-1">
                    <span className="text-xs text-slate-400 mb-1 block">{suspect.idType}</span>
                    <span className="text-sm text-slate-200 font-mono tracking-wider">{suspect.idNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Cases */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[hsl(217,33%,17%)] bg-white/5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-400" />
                Linked Cases
              </h2>
              <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full font-medium">3 Cases</span>
            </div>
            <div className="divide-y divide-[hsl(217,33%,17%)]">
              {[
                { id: 'CASE-2026-084', title: 'Armed Robbery at Jeweller', type: 'ROBBERY', status: 'ACTIVE', date: '2026-08-10' },
                { id: 'CASE-2025-112', title: 'Vehicle Theft Syndicate', type: 'THEFT', status: 'CLOSED', date: '2025-11-05' },
                { id: 'CASE-2024-056', title: 'Assault and Battery', type: 'ASSAULT', status: 'CONVICTION', date: '2024-05-22' },
              ].map((c) => (
                <div key={c.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer" onClick={() => window.location.href = `/cases/${c.id}`}>
                  <div>
                    <p className="text-xs font-mono text-slate-400 mb-1">{c.id}</p>
                    <p className="text-sm font-medium text-slate-200">{c.title}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {c.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-[hsl(217,33%,17%)] text-slate-300 text-[10px] rounded border border-[hsl(217,33%,25%)]">{c.type}</span>
                    <span className={`px-2 py-1 text-[10px] rounded border ${c.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : c.status === 'CLOSED' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Face Match History */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
             <div className="p-6 border-b border-[hsl(217,33%,17%)] bg-white/5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                Face Match History
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { location: 'Nagpur Central Station', score: 98.2, date: '2026-08-18 14:30', image: 'bg-slate-700' },
                { location: 'Pune Airport T2', score: 94.5, date: '2026-07-22 09:15', image: 'bg-slate-700' },
                { location: 'Mumbai CST', score: 89.1, date: '2026-05-10 18:45', image: 'bg-slate-700' },
              ].map((match, i) => (
                <div key={i} className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg overflow-hidden flex flex-col">
                  <div className={`h-32 ${match.image} flex items-center justify-center relative`}>
                    <Camera className="w-8 h-8 text-white/20" />
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-emerald-400 border border-emerald-500/30">
                      {match.score}% MATCH
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-slate-300 truncate" title={match.location}>{match.location}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{match.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Photo Card */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-40 h-40 rounded-full bg-[hsl(217,33%,17%)] flex items-center justify-center mb-4 relative overflow-hidden border-4 border-[hsl(222,47%,8%)] shadow-xl ring-2 ring-[hsl(217,33%,25%)]">
              <span className="text-4xl font-bold text-slate-400">{getInitials(suspect.name)}</span>
              {/* Optional: Add actual image if available */}
            </div>
            <button className="bg-[hsl(217,33%,17%)] hover:bg-[hsl(217,33%,22%)] text-slate-300 text-xs px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors mb-4">
              <Camera className="w-3 h-3" /> Update Photo
            </button>
            {suspect.status === 'AT_LARGE' && (
              <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium p-3 rounded-lg flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> WANTED
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-slate-300 mb-4 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-[hsl(210,100%,60%)] hover:bg-blue-500 text-white p-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-500/20">
                Update Status
              </button>
              <button className="w-full bg-[hsl(217,33%,17%)] hover:bg-[hsl(217,33%,22%)] text-white p-2.5 rounded-lg text-sm font-medium transition-colors">
                Link to Case
              </button>
              <button className="w-full bg-[hsl(217,33%,17%)] hover:bg-[hsl(217,33%,22%)] text-white p-2.5 rounded-lg text-sm font-medium transition-colors">
                File New Match Report
              </button>
            </div>
          </div>

          {/* Lifecycle Timeline */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-slate-300 mb-6 uppercase tracking-wider">Lifecycle Timeline</h3>
            <div className="relative pl-4 space-y-6">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-[hsl(217,33%,17%)]"></div>
              
              {[
                { status: 'Arrest Warrant Issued', date: '2026-08-15', location: 'Mumbai High Court', current: true },
                { status: 'Bail Revoked', date: '2026-08-12', location: 'Sessions Court', current: false },
                { status: 'First Arrested', date: '2024-05-23', location: 'Andheri Police Station', current: false },
                { status: 'Suspect Identified', date: '2024-05-20', location: 'CCTV Analysis', current: false },
              ].map((event, i) => (
                <div key={i} className="relative pl-6">
                  <div className={`absolute -left-1 top-1 w-3 h-3 rounded-full border-2 border-[hsl(222,47%,8%)] ${event.current ? 'bg-red-500 ring-4 ring-red-500/20' : 'bg-slate-500'}`}></div>
                  <p className={`text-sm font-medium ${event.current ? 'text-white' : 'text-slate-300'}`}>{event.status}</p>
                  <p className="text-xs text-slate-500 mt-1">{event.date} • {event.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
