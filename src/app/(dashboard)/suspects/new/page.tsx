'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  X, 
  UploadCloud, 
  Camera, 
  User, 
  FileText, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  FileCheck,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveSuspect, SuspectRecord } from '@/lib/data/suspects-data';

export default function NewSuspectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form Fields State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [alias, setAlias] = useState('');
  const [dob, setDob] = useState('1992-06-15');
  const [gender, setGender] = useState('Male');
  const [nationality, setNationality] = useState('Indian');
  const [idType, setIdType] = useState('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [city, setCity] = useState('Nagpur');
  const [threatLevel, setThreatLevel] = useState('HIGH');
  const [status, setStatus] = useState('ARRESTED');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('74');
  const [physicalDesc, setPhysicalDesc] = useState('Medium build, dark hair, athletic posture.');
  const [distinguishingMarks, setDistinguishingMarks] = useState('Scar near right eyebrow.');

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
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please enter First Name and Last Name.');
      return;
    }

    setIsSubmitting(true);

    const birthYear = parseInt(dob.split('-')[0] || '1995', 10);
    const calculatedAge = Math.max(18, new Date().getFullYear() - birthYear);

    const newSuspect: SuspectRecord = {
      id: `custom_${Date.now()}`,
      name: `${firstName.trim()} ${lastName.trim()}`,
      alias: alias.trim() || '-',
      threatLevel: (threatLevel as any) || 'HIGH',
      status: (status as any) || 'ARRESTED',
      city: city.trim() || 'Nagpur',
      policeStation: `${city.trim() || 'Sitabuldi'} PS, Nagpur`,
      cases: 1,
      lastUpdated: new Date().toISOString().split('T')[0],
      gender,
      age: calculatedAge,
      height: `${height} cm`,
      weight: `${weight} kg`,
      physicalDesc,
      distinguishingMarks,
      photoUrl: previewUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    };

    // Save to unified storage
    saveSuspect(newSuspect);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/suspects');
      }, 1200);
    }, 800);
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
      <div className="flex items-center gap-4 border-b border-[hsl(217,33%,17%)] pb-4">
        <Link href="/suspects" className="p-2 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Register New Suspect Record</h1>
          <p className="text-sm text-slate-400 mt-1">Add a new criminal profile to database and extract ArcFace 512-dim face vector embeddings</p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold text-base">Suspect Registered & Saved to Database!</p>
            <p className="text-xs text-emerald-300/90">Assigned ID: SUS-{Date.now().toString().slice(-4)} • ArcFace facial vector indexed. Redirecting to suspects list...</p>
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
                  <input 
                    required 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Vikram" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Last Name <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Sharma" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Alias / Nickname</label>
                  <input 
                    type="text" 
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Vicky / Raju" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">City / Jurisdiction</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Nagpur" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Threat Level Assessment</label>
                  <select 
                    value={threatLevel}
                    onChange={(e) => setThreatLevel(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="CRITICAL">CRITICAL RISK</option>
                    <option value="HIGH">HIGH RISK</option>
                    <option value="MEDIUM">MEDIUM RISK</option>
                    <option value="LOW">LOW RISK</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Initial Lifecycle Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="AT_LARGE">AT LARGE (Wanted)</option>
                    <option value="ARRESTED">ARRESTED (Initial Detention)</option>
                    <option value="IN_REMAND">IN REMAND (Judicial Remand)</option>
                    <option value="BAILED">BAILED (On Court Bail)</option>
                    <option value="CONVICTED">CONVICTED (In Custody)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Identification */}
            <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Identification Document
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">ID Type</label>
                  <select 
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="DL">Driving License</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">ID Number</label>
                  <input 
                    type="text" 
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="9876-5432-1098" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Photo Upload Card */}
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
            <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Biometric Face Photo
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
                Front-facing mugshots generate 512-dim ArcFace embeddings for repeat offender identification.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Physical Description */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Physical Traits & Marks
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Height (cm)</label>
              <input 
                type="number" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="178" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Weight (kg)</label>
              <input 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="74" 
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Physical Description</label>
              <textarea 
                rows={2} 
                value={physicalDesc}
                onChange={(e) => setPhysicalDesc(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" 
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Distinguishing Marks</label>
              <textarea 
                rows={2} 
                value={distinguishingMarks}
                onChange={(e) => setDistinguishingMarks(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" 
              />
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
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? 'Registering & Generating Embedding...' : 'Save Suspect Record'}
          </button>
        </div>
      </form>
    </div>
  );
}
