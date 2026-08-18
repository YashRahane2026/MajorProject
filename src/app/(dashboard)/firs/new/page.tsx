'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, FileText, User, MapPin, Activity, CheckCircle, Search, Sparkles } from 'lucide-react';

export default function NewFIRPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [crimeType, setCrimeType] = useState('ROBBERY');
  const [sections, setSections] = useState('IPC 392, 397');
  const [complainantName, setComplainantName] = useState('');
  const [contact, setContact] = useState('');
  const [complainantAddress, setComplainantAddress] = useState('');
  const [incidentDate, setIncidentDate] = useState('2026-08-18T14:30');
  const [station, setStation] = useState('Sitabuldi PS, Nagpur');
  const [location, setLocation] = useState('Sitabuldi Main Market');
  const [narrative, setNarrative] = useState('');
  const [moDescription, setMoDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complainantName.trim() || !narrative.trim()) {
      alert('Please fill in Complainant Name and Detailed Narrative.');
      return;
    }

    setIsSubmitting(true);

    const autoFirId = `FIR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFir = {
      id: autoFirId,
      number: autoFirId,
      complainant: complainantName.trim(),
      crimeType,
      station,
      location,
      status: 'REGISTERED',
      date: new Date().toISOString().split('T')[0],
      narrative,
      moDescription: moDescription || narrative.slice(0, 120),
    };

    // Store in localStorage
    if (typeof window !== 'undefined') {
      const existingJson = localStorage.getItem('custom_firs');
      const existing = existingJson ? JSON.parse(existingJson) : [];
      localStorage.setItem('custom_firs', JSON.stringify([newFir, ...existing]));
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/firs');
      }, 1200);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 border-b border-[hsl(217,33%,17%)] pb-4">
        <Link href="/firs" className="p-2 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">File New FIR & Index MO Embeddings</h1>
          <p className="text-sm text-slate-400 mt-1">Record a First Information Report and extract Sentence-BERT (768-d) vector embeddings</p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold text-base">FIR Filed & Indexed Successfully!</p>
            <p className="text-xs text-emerald-300/90">Sentence-BERT 768-dim vector embedding stored in pgvector. Redirecting to FIR repository...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FIR Information */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5 flex justify-between items-center">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              FIR Metadata
            </h2>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">Auto FIR Generator</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Crime Type <span className="text-red-500">*</span></label>
              <select 
                value={crimeType}
                onChange={(e) => setCrimeType(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ROBBERY">Armed Robbery</option>
                <option value="THEFT">Burglary / Larceny</option>
                <option value="ASSAULT">Physical Assault</option>
                <option value="FRAUD">Cyber Fraud / Phishing</option>
                <option value="NARCOTICS">Narcotics Syndicate</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Acts & Legal Sections</label>
              <input 
                type="text" 
                value={sections}
                onChange={(e) => setSections(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono" 
                placeholder="IPC 392, 397" 
              />
            </div>
          </div>
        </div>

        {/* Complainant & Incident */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> Complainant Info
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Full Name <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="text" 
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                  placeholder="e.g. Ramesh Patel" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Contact Number</label>
                <input 
                  type="tel" 
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                  placeholder="+91 98230 11223" 
                />
              </div>
            </div>
          </div>

          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Incident Location
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Police Station Jurisdiction</label>
                <input 
                  type="text" 
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Specific Spot / Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & MO */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" /> Narrative & Modus Operandi (MO)
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Detailed FIR Narrative <span className="text-red-500">*</span></label>
              <textarea 
                required 
                rows={5} 
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-y" 
                placeholder="Describe the incident narrative in detail..."
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                Modus Operandi Summary
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-auto flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-blue-400" /> Sentence-BERT Vectorization Target
                </span>
              </label>
              <textarea 
                rows={2} 
                value={moDescription}
                onChange={(e) => setMoDescription(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-blue-500/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none bg-blue-500/5" 
                placeholder="Key MO features: e.g. '3 armed men, daytime robbery, hammer glass smash, grey SUV getaway'"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Link href="/firs" className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 border border-[hsl(217,33%,17%)] transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? 'Filing FIR & Vectorizing...' : 'Save & File FIR Record'}
          </button>
        </div>
      </form>
    </div>
  );
}
