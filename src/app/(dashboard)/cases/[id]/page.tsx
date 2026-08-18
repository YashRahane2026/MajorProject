'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, MapPin, Calendar, Users, FileText, Briefcase, Activity, ExternalLink, ShieldAlert, Plus } from 'lucide-react';

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for the specific case
  const caseData = {
    id: params.id || 'CASE-2026-084',
    title: 'Armed Robbery at Jeweller',
    type: 'ROBBERY',
    status: 'ACTIVE',
    severity: 'HIGH',
    jurisdiction: 'Mumbai Central',
    date: '2026-08-10',
    officer: 'Insp. R. Patil',
    description: 'A group of three armed individuals entered the Laxmi Jewellers store at 14:30 hrs. They held the staff at gunpoint and cleared out the main display cases. The suspects fled in a grey SUV (stolen) bearing partial plates MH-02-XX-1234. CCTV footage captured one suspect whose mask slipped briefly.',
    suspects: [
      { id: '1', name: 'Vikram Singh', role: 'PRIMARY_SUSPECT', threat: 'CRITICAL', status: 'AT_LARGE' },
      { id: '3', name: 'Amit Kumar', role: 'ACCOMPLICE', threat: 'MEDIUM', status: 'IN_REMAND' }
    ],
    firs: [
      { id: 'FIR-1042', date: '2026-08-10', status: 'INVESTIGATING', excerpt: 'Complainant reports armed robbery at jewellery store by 3 unknown males...' },
      { id: 'FIR-1045', date: '2026-08-11', status: 'FILED', excerpt: 'Vehicle owner reports theft of grey SUV from residential parking...' }
    ]
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'ACTIVE': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'UNDER_INVESTIGATION': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'CLOSED': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return <span className={`px-2 py-1 rounded-md text-[10px] font-medium border ${colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{status}</span>;
  };

  const ThreatBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      'CRITICAL': 'bg-red-500/10 text-red-500 border-red-500/20',
      'HIGH': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'MEDIUM': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'LOW': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${colors[level] || colors.LOW}`}>{level}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/cases" className="p-2 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{caseData.title}</h1>
              <StatusBadge status={caseData.status} />
              {caseData.severity === 'HIGH' && (
                <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md text-[10px] font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> HIGH SEVERITY
                </span>
              )}
            </div>
            <p className="text-sm font-mono text-slate-400 mt-1">{caseData.id}</p>
          </div>
        </div>
        <button className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] hover:bg-white/5 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
          <Edit className="w-4 h-4 mr-2" />
          Edit Case
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-[hsl(217,33%,17%)]">
        <nav className="flex gap-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('suspects')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'suspects' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
          >
            Suspects <span className="bg-[hsl(217,33%,17%)] text-slate-300 px-1.5 py-0.5 rounded-full text-xs">{caseData.suspects.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('firs')}
            className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'firs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
          >
            Linked FIRs <span className="bg-[hsl(217,33%,17%)] text-slate-300 px-1.5 py-0.5 rounded-full text-xs">{caseData.firs.length}</span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" /> Case Narrative
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{caseData.description}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-slate-300 mb-4 uppercase tracking-wider">Case Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Crime Type</p>
                    <span className="inline-block px-2 py-1 bg-[hsl(217,33%,17%)] text-slate-300 text-xs rounded border border-[hsl(217,33%,25%)] font-medium">
                      {caseData.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Jurisdiction</p>
                    <p className="text-sm font-medium text-slate-200">{caseData.jurisdiction}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Incident Date</p>
                    <p className="text-sm font-medium text-slate-200">{new Date(caseData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Investigating Officer</p>
                    <p className="text-sm font-medium text-slate-200">{caseData.officer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suspects' && (
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider border-b border-[hsl(217,33%,17%)]">
                  <th className="p-4 font-medium">Suspect</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Threat Level</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(217,33%,17%)]">
                {caseData.suspects.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[hsl(217,33%,17%)] flex items-center justify-center text-xs font-semibold text-slate-300">
                          {getInitials(s.name)}
                        </div>
                        <span className="text-sm font-medium text-slate-200">{s.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-300 bg-[hsl(217,33%,17%)] px-2 py-1 rounded font-mono">{s.role}</span>
                    </td>
                    <td className="p-4"><ThreatBadge level={s.threat} /></td>
                    <td className="p-4 text-xs text-slate-400">{s.status.replace('_', ' ')}</td>
                    <td className="p-4 text-right">
                      <Link href={`/suspects/${s.id}`} className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-end gap-1">
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'firs' && (
          <div className="space-y-4">
            {caseData.firs.map((fir) => (
              <div key={fir.id} className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm hover:border-blue-500/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/firs/${fir.id}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <h3 className="font-mono text-white font-medium">{fir.id}</h3>
                    <span className="text-xs text-slate-400">{fir.date}</span>
                  </div>
                  <span className="px-2 py-1 bg-[hsl(217,33%,17%)] text-slate-300 text-[10px] rounded border border-[hsl(217,33%,25%)]">{fir.status}</span>
                </div>
                <p className="text-sm text-slate-400 ml-8 italic">"{fir.excerpt}"</p>
              </div>
            ))}
            <button className="w-full border border-dashed border-[hsl(217,33%,25%)] rounded-xl p-4 text-sm text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Link another FIR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
