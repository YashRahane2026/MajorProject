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
  Activity,
  Phone,
  Home,
  Scale,
  Shield,
  Fingerprint,
  Briefcase
} from 'lucide-react';
import { saveSuspect, SuspectRecord, compressMugshotImage } from '@/lib/data/suspects-data';

export default function NewSuspectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 1. Personal & Family Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fatherOrGuardianName, setFatherOrGuardianName] = useState('');
  const [alias, setAlias] = useState('');
  const [dob, setDob] = useState('1994-06-15');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [nationality, setNationality] = useState('Indian');
  const [phoneNumber, setPhoneNumber] = useState('');

  // 2. Official Documents & Identification
  const [idType, setIdType] = useState('Aadhaar');
  const [idNumber, setIdNumber] = useState('');

  // 3. Residential & Jurisdiction Location
  const [address, setAddress] = useState('');
  const [nativePlace, setNativePlace] = useState('Nagpur, Maharashtra');
  const [locality, setLocality] = useState('Sitabuldi');
  const [policeStation, setPoliceStation] = useState('Nagpur Police — Sitabuldi Station');

  // 4. Criminological Details & Modus Operandi (MO)
  const [crimeCategory, setCrimeCategory] = useState('Theft / Property Offence');
  const [bnsOrIpcSection, setBnsOrIpcSection] = useState('BNS 303(2) / IPC 379 (Theft), BNS 317(2)');
  const [modusOperandi, setModusOperandi] = useState('Operates on two-wheelers targeting solitary pedestrians during evening market hours; uses forged vehicle number plates.');
  const [gangAffiliation, setGangAffiliation] = useState('None / Independent Operator');
  const [priorArrestHistory, setPriorArrestHistory] = useState('Repeat Offender (2 Prior Registered FIRs)');
  const [linkedCases, setLinkedCases] = useState(2);
  const [investigatingOfficer, setInvestigatingOfficer] = useState('Inspector V. K. Deshmukh (Badge #4812)');
  const [threatLevel, setThreatLevel] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [status, setStatus] = useState('ARRESTED');

  // 5. Physical Traits & Biometric Markers
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('72');
  const [complexion, setComplexion] = useState('Wheatish');
  const [eyeColor, setEyeColor] = useState('Dark Brown');
  const [build, setBuild] = useState('Medium Athletic');
  const [physicalDesc, setPhysicalDesc] = useState('Medium athletic build, clean-shaven, straight dark hair, steady gait.');
  const [distinguishingMarks, setDistinguishingMarks] = useState('Prominent linear scar (approx 3 cm) across right forearm; mole near left collarbone.');

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
      fatherOrGuardianName: fatherOrGuardianName.trim() || undefined,
      alias: alias.trim() || 'None',
      threatLevel: (threatLevel as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM',
      status: status,
      city: 'Nagpur',
      district: 'Nagpur',
      stateOrUT: 'Maharashtra',
      region: 'Nagpur Metropolitan Region',
      locality: locality.trim() || 'Sitabuldi',
      policeStation: policeStation.trim() || `Nagpur Police — ${locality.trim() || 'Sitabuldi'} Station`,
      address: address.trim() || undefined,
      nativePlace: nativePlace.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
      aadhaarNumber: idType === 'Aadhaar' && idNumber.trim() ? idNumber.trim() : undefined,
      cases: Number(linkedCases) || 1,
      lastUpdated: new Date().toISOString().split('T')[0],
      gender,
      age: calculatedAge,
      height: `${height} cm`,
      weight: `${weight} kg`,
      complexion: complexion || undefined,
      eyeColor: eyeColor || undefined,
      physicalDesc: physicalDesc || 'Medium build, dark hair.',
      distinguishingMarks: distinguishingMarks || 'None recorded',
      photoUrl: previewUrl || '/images/portrait_001.jpg',
      crimeCategory: crimeCategory || 'Theft / Property Offence',
      bnsOrIpcSection: bnsOrIpcSection.trim() || undefined,
      modusOperandi: modusOperandi.trim() || undefined,
      gangAffiliation: gangAffiliation.trim() || 'None / Independent Operator',
      investigatingOfficer: investigatingOfficer.trim() || undefined,
      priorArrestHistory: priorArrestHistory || undefined,
      bloodGroup: bloodGroup || undefined,
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
          <h1 className="text-3xl font-bold text-white">Enroll Suspect Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Comprehensive Central Police Record, Biometrics &amp; Modus Operandi Intake (Nagpur Police)</p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold text-base">Suspect Dossier Enrolled Successfully!</p>
            <p className="text-xs text-emerald-300/90">Biometric template generated and profile pinned to Page 1 of Suspect Directory. Redirecting...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Top Layout: Personal Info & Mugshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Personal & Family Information */}
            <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  1. Personal &amp; Family Identity
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
                  <label className="text-sm font-medium text-slate-300">Father's / Guardian's Name</label>
                  <input 
                    type="text" 
                    value={fatherOrGuardianName} 
                    onChange={(e) => setFatherOrGuardianName(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Ramesh Kumar Sharma" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Alias / Street Moniker</label>
                  <input 
                    type="text" 
                    value={alias} 
                    onChange={(e) => setAlias(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Vicky, Chhotu, Langda" 
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
                  <label className="text-sm font-medium text-slate-300">Blood Group</label>
                  <select 
                    value={bloodGroup} 
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Contact / Mobile Number</label>
                  <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. +91 98231 44821" 
                  />
                </div>
              </div>
            </div>

            {/* 2. Official Identification & Residential Jurisdiction */}
            <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  2. Identification &amp; Residential Jurisdiction
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
                    <option value="Voter ID">Voter ID (EPIC)</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">ID Document Number</label>
                  <input 
                    type="text" 
                    value={idNumber} 
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="XXXX-XXXX-XXXX" 
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Present Residential Address</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Plot 42, Market Line, Sitabuldi, Nagpur - 440012" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Permanent / Native District</label>
                  <input 
                    type="text" 
                    value={nativePlace} 
                    onChange={(e) => setNativePlace(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Nagpur Rural, Maharashtra" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Nagpur Urban Locality</label>
                  <select 
                    value={locality} 
                    onChange={(e) => {
                      setLocality(e.target.value);
                      setPoliceStation(`Nagpur Police — ${e.target.value} Station`);
                    }}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Sitabuldi">Sitabuldi</option>
                    <option value="Sadar">Sadar</option>
                    <option value="Dharampeth">Dharampeth</option>
                    <option value="Ambazari">Ambazari</option>
                    <option value="Lakadganj">Lakadganj</option>
                    <option value="Dhantoli">Dhantoli</option>
                    <option value="Pachpaoli">Pachpaoli</option>
                    <option value="MIDC Hingna">MIDC Hingna</option>
                    <option value="Nagpur Railway Station (GRP)">Nagpur Railway Station (GRP)</option>
                    <option value="Gittikhadan">Gittikhadan</option>
                    <option value="Jaripatka">Jaripatka</option>
                    <option value="Sonegaon">Sonegaon</option>
                    <option value="Kotwali">Kotwali</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Assigned Police Station Precinct</label>
                  <input 
                    type="text" 
                    value={policeStation} 
                    onChange={(e) => setPoliceStation(e.target.value)}
                    className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. Nagpur Police — Sitabuldi Station" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mugshot Column */}
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
                  <p className="text-sm font-medium text-slate-200">Click or drag photo</p>
                  <p className="text-xs text-slate-500 mt-1">High-res camera JPG/PNG up to 10MB</p>
                  <span className="mt-3 text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
                    Auto-Compressed to 18KB
                  </span>
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

              <p className="text-xs text-slate-500 mt-4 text-center leading-relaxed">
                Generates a 512-dimensional ArcFace normalized vector indexed for sub-25ms facial matching.
              </p>
            </div>

            {/* Quick Threat & Lifecycle Summary Card */}
            <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 space-y-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Custody &amp; Threat Configuration
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Operational Threat Level</label>
                <select 
                  value={threatLevel} 
                  onChange={(e) => setThreatLevel(e.target.value as any)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="LOW">Low (First-time offender, bailable petty crime)</option>
                  <option value="MEDIUM">Medium (Non-violent property/cyber offence)</option>
                  <option value="HIGH">High (Armed robbery, repeat violence, extortion)</option>
                  <option value="CRITICAL">Critical (Organized syndicate, firearms, absconding)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Procedural Legal Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="UNDER_INVESTIGATION">Under Investigation</option>
                  <option value="ARRESTED">Arrested (In Police Custody)</option>
                  <option value="IN_REMAND">In Judicial Remand (Central Jail)</option>
                  <option value="COURT_PENDING">Chargesheet Filed (Court Trial)</option>
                  <option value="ON_BAIL">Released on Judicial Bail</option>
                  <option value="CONVICTED">Convicted by Court</option>
                  <option value="ABSCONDING">Absconding (NBW Warrant Issued)</option>
                  <option value="CLOSED">Case Closed / Acquitted</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Criminological Record, BNS/IPC Sections & Modus Operandi */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              3. Criminological Record, BNS/IPC Sections &amp; Modus Operandi (MO)
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Crime Offence Classification</label>
              <select 
                value={crimeCategory} 
                onChange={(e) => setCrimeCategory(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Theft / Property Offence">Theft / Property Offence</option>
                <option value="Robbery / Extortion">Robbery / Extortion</option>
                <option value="Burglary / House Breaking">Burglary / House Breaking</option>
                <option value="Cybercrime / Online Fraud">Cybercrime / Online Fraud</option>
                <option value="Assault / Grievous Hurt">Assault / Grievous Hurt</option>
                <option value="Homicide / Attempt to Murder">Homicide / Attempt to Murder</option>
                <option value="Financial Fraud / Cheating">Financial Fraud / Cheating</option>
                <option value="Narcotic Drugs (NDPS)">Narcotic Drugs (NDPS Act)</option>
                <option value="Organized Crime / Arms Act">Organized Crime / Arms Act</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Applicable BNS / IPC Legal Sections</label>
              <input 
                type="text" 
                value={bnsOrIpcSection} 
                onChange={(e) => setBnsOrIpcSection(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs" 
                placeholder="e.g. BNS 303(2) / IPC 379 [Theft], BNS 111 [Organized Gang]" 
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-300 flex items-center justify-between">
                <span>Modus Operandi (MO) Narrative Summary</span>
                <span className="text-[11px] text-blue-400 font-normal">Parsed by BERT NLP for Case Linking</span>
              </label>
              <textarea 
                rows={3} 
                value={modusOperandi} 
                onChange={(e) => setModusOperandi(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed" 
                placeholder="Describe how the suspect executes offenses, weapon used, time of day, entry/getaway patterns..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Gang / Syndicate Affiliation</label>
              <input 
                type="text" 
                value={gangAffiliation} 
                onChange={(e) => setGangAffiliation(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="e.g. Kalyani Gang Syndicate or Independent" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Prior Criminal Record / History</label>
              <select 
                value={priorArrestHistory} 
                onChange={(e) => setPriorArrestHistory(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="First-Time Offender (0 Prior Convictions)">First-Time Offender (0 Prior Convictions)</option>
                <option value="Repeat Offender (1-3 Prior Registered FIRs)">Repeat Offender (1-3 Prior Registered FIRs)</option>
                <option value="Habitual Offender / History-Sheeter (4+ Linked FIRs)">Habitual Offender / History-Sheeter (4+ Linked FIRs)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Active Linked Cases Count</label>
              <input 
                type="number" 
                min={1} 
                max={50} 
                value={linkedCases} 
                onChange={(e) => setLinkedCases(Number(e.target.value))}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Assigned Investigating Officer (IO)</label>
              <input 
                type="text" 
                value={investigatingOfficer} 
                onChange={(e) => setInvestigatingOfficer(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="e.g. Inspector S. V. Deshmukh (Badge #4812)" 
              />
            </div>
          </div>
        </div>

        {/* 4. Physical Characteristics & Distinguishing Marks */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[hsl(217,33%,17%)] bg-white/5">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              4. Physical Traits, Complexion &amp; Biometric Marks
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Height (cm)</label>
              <input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="175" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Weight (kg)</label>
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="72" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Complexion</label>
              <select 
                value={complexion} 
                onChange={(e) => setComplexion(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Wheatish">Wheatish</option>
                <option value="Fair">Fair</option>
                <option value="Dusky">Dusky</option>
                <option value="Dark">Dark</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Eye Color</label>
              <select 
                value={eyeColor} 
                onChange={(e) => setEyeColor(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Dark Brown">Dark Brown</option>
                <option value="Black">Black</option>
                <option value="Hazel">Hazel</option>
                <option value="Green">Green</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Physical Build &amp; Posture</label>
              <input 
                type="text" 
                value={build} 
                onChange={(e) => setBuild(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="e.g. Medium Athletic, Broad shoulders, erect gait" 
              />
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="text-sm font-medium text-slate-300">General Physical Description</label>
              <textarea 
                rows={2} 
                value={physicalDesc} 
                onChange={(e) => setPhysicalDesc(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed" 
              />
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="text-sm font-medium text-slate-300">Distinguishing Marks, Scars &amp; Permanent Tattoos</label>
              <textarea 
                rows={2} 
                value={distinguishingMarks} 
                onChange={(e) => setDistinguishingMarks(e.target.value)}
                className="w-full bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed" 
                placeholder="e.g. Trident tattoo on left forearm; burn scar on neck..."
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
            {isSubmitting ? 'Enrolling & Indexing Biometrics...' : 'Enroll Suspect in Central Repository'}
          </button>
        </div>
      </form>
    </div>
  );
}
