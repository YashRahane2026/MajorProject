'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X, FileText, User, MapPin, Activity, CheckCircle, Search } from 'lucide-react';

export default function NewFIRPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/firs" className="p-2 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">File New FIR</h1>
          <p className="text-sm text-slate-400 mt-1">Record a new First Information Report</p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">FIR filed successfully. ID: FIR-2026-1043</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FIR Details */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5 flex justify-between items-center">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              FIR Information
            </h2>
            <span className="text-xs font-mono text-slate-400 bg-[hsl(217,33%,17%)] px-2 py-1 rounded">Auto-ID: FIR-2026-1043</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Link to Existing Case (Optional)</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Search case by ID or Title..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Crime Type <span className="text-red-500">*</span></label>
              <select required className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors">
                <option value="">Select Crime Type</option>
                <option value="THEFT">Theft</option>
                <option value="ROBBERY">Robbery</option>
                <option value="ASSAULT">Assault</option>
                <option value="FRAUD">Fraud / Cyber</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Acts & Sections</label>
              <input type="text" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. IPC 392, 397" />
            </div>
          </div>
        </div>

        {/* Complainant & Incident */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> Complainant Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Full Name <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Contact Number <span className="text-red-500">*</span></label>
                <input required type="tel" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Address</label>
                <textarea rows={2} className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Incident Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Date & Time of Incident <span className="text-red-500">*</span></label>
                <input required type="datetime-local" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Police Station Jurisdiction <span className="text-red-500">*</span></label>
                <select required className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
                  <option value="">Select Station</option>
                  <option value="Central">Central PS</option>
                  <option value="North">North PS</option>
                  <option value="South">South PS</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Location</label>
                <textarea rows={2} className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & MO */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" /> Narrative & Modus Operandi
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 flex justify-between">
                <span>Detailed Narrative <span className="text-red-500">*</span></span>
              </label>
              <textarea required rows={8} className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-y" placeholder="Describe the incident in detail exactly as reported..."></textarea>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                Modus Operandi Description
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-auto">Used for AI Matching</span>
              </label>
              <textarea rows={3} className="w-full bg-[hsl(222,47%,6%)] border border-blue-500/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none bg-blue-500/5" placeholder="Extract key MO details here (e.g. 'Daytime robbery, 3 men, used hammers to smash displays, drove grey SUV')"></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 border border-[hsl(217,33%,17%)] transition-colors flex items-center gap-2" onClick={() => window.history.back()}>
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[hsl(210,100%,60%)] hover:bg-blue-500 transition-colors shadow-sm shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70">
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? 'Filing FIR...' : 'File FIR'}
          </button>
        </div>
      </form>
    </div>
  );
}
