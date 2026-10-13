'use client';

import { useState } from 'react';
import { Shield, LogIn, Key, AlertCircle, CheckCircle2, UserPlus, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  authenticateOrRegisterUser,
  activateUserSession,
  SEEDED_ACCOUNTS,
} from '@/lib/auth/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isNewRegistration, setIsNewRegistration] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    // Allow quick UI render
    setTimeout(() => {
      const result = authenticateOrRegisterUser(email, password);

      if (result.success && result.user) {
        if (result.isNew) {
          setIsNewRegistration(true);
          setSuccessMsg(
            `Account Registered Successfully! Welcome Officer ${result.user.name}. Redirecting to operational dashboard...`
          );
        } else {
          setIsNewRegistration(false);
          setSuccessMsg(
            `Credentials Verified! Welcome back, ${result.user.name}. Redirecting to operational dashboard...`
          );
        }

        setTimeout(() => {
          router.push('/overview');
        }, 800);
      } else {
        setIsLoading(false);
        setErrorMsg(result.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 400);
  };

  const handleRoleQuickSelect = (roleKey: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const target = SEEDED_ACCOUNTS.find((s) => s.role === roleKey.toLowerCase()) || SEEDED_ACCOUNTS[0];
    setEmail(target.email);
    setPassword(target.password);
    activateUserSession(target);
    setSuccessMsg(`Signing in as ${target.name} (${target.role.toUpperCase()})...`);
    setTimeout(() => {
      router.push('/overview');
    }, 500);
  };

  return (
    <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm max-w-md w-full mx-auto">
      <div className="p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20 shadow-inner">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">CrimeTrack AI</h1>
          <p className="text-sm text-slate-400 text-center max-w-[280px]">
            Intelligent Biometric-Based Suspect Tracking &amp; Crime Analysis System
          </p>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-start gap-2.5 animate-fade-in">
            {isNewRegistration ? (
              <UserPlus className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed font-medium">{successMsg}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              className="w-full px-4 py-3 bg-slate-900/60 border border-[hsl(217,33%,17%)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600 text-sm"
              placeholder="officer@crimetrack.gov.in or your-email@gmail.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              className="w-full px-4 py-3 bg-slate-900/60 border border-[hsl(217,33%,17%)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600 text-sm"
              placeholder="Enter your account password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In / Auto-Register
              </>
            )}
          </button>
        </form>

        {/* Informative Auto-Registration Notice */}
        <div className="mt-4 p-2.5 bg-blue-500/5 border border-blue-500/10 rounded-lg flex items-start gap-2 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Existing accounts are authenticated against stored credentials. New email addresses (including personal Gmail) are automatically registered as authorized department accounts.
          </p>
        </div>

        {/* Quick Role-Based Selector for Evaluation Panel */}
        <div className="mt-6 pt-5 border-t border-[hsl(217,33%,17%)]">
          <div className="flex items-center justify-center mb-3">
            <Key className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Role-Based Access
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Admin', role: 'admin', desc: 'Full System Access' },
              { label: 'Police', role: 'police', desc: 'Investigative Unit' },
              { label: 'Court', role: 'court', desc: 'Prosecution & Orders' },
              { label: 'Custodial', role: 'custodial', desc: 'Prison Records' },
            ].map(({ label, role }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleQuickSelect(role)}
                className="py-2 px-3 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 hover:border-slate-600 rounded-md text-slate-200 transition-colors text-center"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
