'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, X, UploadCloud, Camera, User, FileText, AlertTriangle, MapPin, CheckCircle, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewSuspectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Photo Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleFileInputChange} 
        className="hidden" 
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/suspects" className="p-2 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Register New Suspect</h1>
          <p className="text-sm text-slate-400 mt-1">Add a new criminal profile and generate biometric face vector embeddings</p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Suspect registered successfully!</p>
            <p className="text-xs text-emerald-300/80">Assigned Suspect ID: SUS-2026-089 • ArcFace embedding vector indexed.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Top Layout: Photo on Right, Personal Info on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Personal Information */}
            <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  Personal Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">First Name <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="First name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Last Name <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Last name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Alias / Nickname</label>
                  <input type="text" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Known alias" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Date of Birth</label>
                  <input type="date" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Gender</label>
                  <select className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Nationality</label>
                  <input type="text" defaultValue="Indian" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* 2. Identification */}
            <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Identification
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">ID Type</label>
                  <select className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors">
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="DL">Driving License</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">ID Number</label>
                  <input type="text" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-colors" placeholder="XXXX-XXXX-XXXX" />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Photo Upload Card */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Biometric Photo
              </h2>
              {previewUrl && (
                <button 
                  type="button"
                  onClick={removePhoto}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col items-center justify-center">
              {!previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={cn(
                    "w-full h-56 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-4 transition-all cursor-pointer group",
                    dragActive 
                      ? "border-blue-500 bg-blue-500/10" 
                      : "border-[hsl(217,33%,25%)] bg-[hsl(222,47%,6%)] hover:bg-[hsl(217,33%,12%)] hover:border-blue-500/50"
                  )}
                >
                  <div className="w-12 h-12 bg-[hsl(217,33%,17%)] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">Click or drag photo here</p>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              ) : (
                <div className="w-full h-56 relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img src={previewUrl} alt="Uploaded Suspect Photo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <FileCheck className="w-3.5 h-3.5" /> Biometric Mugshot Ready
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-4 text-center">
                High-resolution, front-facing mugshots produce optimal 512-dim ArcFace embeddings.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Physical Description */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              Physical Description
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Height (cm)</label>
              <input type="number" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. 175" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Weight (kg)</label>
              <input type="number" className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. 70" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">General Description</label>
              <textarea rows={3} className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Build, complexion, hair color, eye color, etc." />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Distinguishing Marks</label>
              <textarea rows={2} className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Scars, tattoos, birthmarks, etc." />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[hsl(217,33%,17%)]">
          <Link href="/suspects" className="px-6 py-2.5 rounded-lg border border-[hsl(217,33%,17%)] text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? 'Registering Suspect...' : 'Save Suspect Record'}
          </button>
        </div>
      </form>
    </div>
  );
}
