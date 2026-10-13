'use client';

import { useState } from 'react';
import { Shield, LogIn, Key } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      handleDemoLogin('admin');
    }, 1000);
  };

  const handleDemoLogin = (role: string) => {
    if (typeof window !== 'undefined') {
      document.cookie = `demo_role=${role}; path=/; max-age=86400`;
      localStorage.setItem('demo_role', role);
      localStorage.setItem('demo_user', `${role.charAt(0).toUpperCase() + role.slice(1)} Officer`);
      router.push('/overview');
    }
  };

  return (
    <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">CrimeTrack AI</h1>
          <p className="text-sm text-slate-400 text-center max-w-[250px]">
            Intelligent Biometric-Based Suspect Tracking
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-[hsl(217,33%,17%)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
              placeholder="officer@crimetrack.gov.in"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-[hsl(217,33%,17%)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[hsl(217,33%,17%)]">
          <div className="flex items-center justify-center mb-4">
            <Key className="w-4 h-4 text-slate-400 mr-2" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role-Based Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['Admin', 'Police', 'Court', 'Custodial'].map((role) => (
              <button
                key={role}
                onClick={() => handleDemoLogin(role.toLowerCase())}
                className="py-2 px-3 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-md text-slate-300 transition-colors"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
