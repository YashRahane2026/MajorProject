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
  MapPin, 
  CheckCircle, 
  FileCheck,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { saveSuspect, SuspectRecord, compressMugshotImage } from '@/lib/data/suspects-data';

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
  const [crimeCategory, setCrimeCategory] = useState('Cybercrime / Online Fraud');
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

  const handleFileChange = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      try {
        const compressed = await compressMugshotImage(file, 320, 320, 0.82);
        setPreviewUrl(compressed);
      } catch {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please enter First Name and Last Name.');
      return;
    }

    setIsSubmitting(true);

    const birthYear = parseInt(dob.split('-')[0] || '1995', 10);
    const calculatedAge = Math.max(18, new Date().getFullYear() - birthYear);

    const newId = `SYN-NGP-${Date.now().toString().slice(-5)}`;
    const newSuspect: SuspectRecord = {
      id: newId,
      name: `${firstName.trim()} ${lastName.trim()}`,
      alias: alias.trim() || 'None',
      threatLevel: (threatLevel as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM',
      status: status,
      city: 'Nagpur',
      district: 'Nagpur',
      stateOrUT: 'Maharashtra',
      region: 'Nagpur Metropolitan Region',
      locality: city.trim() || 'Sitabuldi',
      policeStation: `Nagpur Police — ${city.trim() || 'Sitabuldi'} Station`,
      cases: 1,
      lastUpdated: new Date().toISOString().split('T')[0],
      gender,
      age: calculatedAge,
      height: `${height} cm`,
      weight: `${weight} kg`,
      physicalDesc: physicalDesc || 'Medium build, dark hair.',
      distinguishingMarks: distinguishingMarks || 'None recorded',
      photoUrl: previewUrl || '/images/portrait_001.jpg',
      crimeCategory: crimeCategory || 'Cybercrime / Online Fraud',
      caseReferenceDemo: `NGP-2026-${newId}`,
      recordType: 'CUSTOM_RECORD',
      isSynthetic: 'TRUE',
      isRealPerson: 'FALSE',
      isRealCase: 'FALSE',
      recordDisclaimer: 'Nagpur Police Suspect Tracking Record.',
    };

    saveSuspect(newSuspect);

    try {
      await fetch('/api/suspects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSuspect),
      });
    } catch (err) {
      console.warn('Server registration sync warning:', err);
    }

    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/suspects');
    }, 1000);
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
          <h1 className="text-3xl font-bold text-white">Register Suspect Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Enroll suspect record and biometric face portrait into the central repository (Nagpur Police)</p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold text-base">Suspect Profile Created Successfully!</p>
            <p className="text-xs text-emerald-300/90">Biometric template enrolled. Redirecting to suspects directory...</p>
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
                    placeholder="e.g. Rahul" 
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
                  <label className="text-sm font-medium text-slate-300">Alias / Known As</label>
                  <input 
                    type="text" 
                    value={alias} 
                    onChange={(e) => setAlias(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Chhotu" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Date of Birth</label>
                  <input 
                    type="date" 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Gender</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Nationality</label>
                  <input 
                    type="text" 
                    value={nationality} 
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* 2. Official Identification & Jurisdiction */}
            <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Identification &amp; Jurisdiction
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Identity Document Type</label>
                  <select 
                    value={idType} 
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">ID / Reference Number</label>
                  <input 
                    type="text" 
                    value={idNumber} 
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="XXXX-XXXX-XXXX" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Nagpur Locality</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Sitabuldi, Sadar, Dharampeth" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Lifecycle Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="UNDER_INVESTIGATION">Under Investigation</option>
                    <option value="ARRESTED">Arrested</option>
                    <option value="IN_REMAND">In Remand</option>
                    <option value="COURT_PENDING">Court Pending</option>
                    <option value="ON_BAIL">On Bail</option>
                    <option value="CONVICTED">Convicted</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Crime Offence Category</label>
                  <select 
                    value={crimeCategory} 
                    onChange={(e) => setCrimeCategory(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Cybercrime / Online Fraud">Cybercrime / Online Fraud</option>
                    <option value="Theft / Property Offence">Theft / Property Offence</option>
                    <option value="Robbery / Extortion">Robbery / Extortion</option>
                    <option value="Burglary / House Breaking">Burglary / House Breaking</option>
                    <option value="Assault / Grievous Hurt">Assault / Grievous Hurt</option>
                    <option value="Financial Fraud / Cheating">Financial Fraud / Cheating</option>
                    <option value="Narcotic Drugs (NDPS)">Narcotic Drugs (NDPS)</option>
                    <option value="Organized Crime / Arms Act">Organized Crime / Arms Act</option>
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Threat Level</label>
                  <select 
                    value={threatLevel} 
                    onChange={(e) => setThreatLevel(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Photo Upload Column */}
          <div className="space-y-6">
            <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                Biometric Mugshot
              </h2>

              {!previewUrl ? (
                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-slate-700 hover:border-slate-500 bg-[hsl(222,47%,6%)]'
                  }`}
                >
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-200">Click to upload portrait</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-64 object-cover object-top" 
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-xs font-medium"
                    >
                      Change
                    </button>
                    <button 
                      type="button" 
                      onClick={removePhoto}
                      className="p-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                    >
                      Remove
                    </button>
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
              Physical Traits &amp; Marks
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
