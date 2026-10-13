'use client';

import { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronRight, 
  X, 
  Check, 
  LogOut, 
  Shield, 
  UserCheck,
  FileText,
  AlertTriangle,
  Database
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface TopBarProps {
  pageTitle?: string;
  userName?: string;
  userRole?: string;
  onToggleSidebar?: () => void;
}

export default function TopBar({ 
  pageTitle, 
  userName = 'Demo Admin',
  userRole = 'admin',
  onToggleSidebar
}: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '[OFFICIAL STATS] NCRB & Railway Police Data Verified',
      desc: '24 Nagpur City NCRB stat rows & 15 Nagpur Railway Police rows validated',
      time: 'Verified 2026-10-13',
      unread: true,
      type: 'official',
      link: '/data-sources'
    },
    {
      id: 2,
      title: '[SYNTHETIC DEMO] 5,000 Nagpur Demo Profiles Loaded',
      desc: 'SYN-NGP-00001 to SYN-NGP-05000 ready with 32 fictional portrait assets',
      time: 'Sandbox Active',
      unread: true,
      type: 'demo',
      link: '/suspects'
    },
    {
      id: 3,
      title: '[SYNTHETIC DEMO] Workflow Status Demonstration',
      desc: 'Demo record SYN-NGP-00004 status: IN_REMAND (DEMO) — Not a real case',
      time: 'Demo Event',
      unread: false,
      type: 'status',
      link: '/suspects/SYN-NGP-00004'
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleSwitchRole = (role: string) => {
    if (typeof window !== 'undefined') {
      document.cookie = `demo_role=${role}; path=/; max-age=86400`;
      localStorage.setItem('demo_role', role);
      localStorage.setItem('demo_user', `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`);
      window.dispatchEvent(new CustomEvent('crimetrack-role-change', { detail: { role } }));
      setProfileOpen(false);
      if (pathname !== '/overview') {
        router.push('/overview');
      }
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('demo_role');
      localStorage.removeItem('demo_user');
      router.push('/login');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/suspects?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const segments = pathname.split('/').filter(Boolean);
  const currentTitle = pageTitle || 
    (segments.length > 0 
      ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1) 
      : 'Dashboard');

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 bg-[hsl(222,47%,6%)]/90 backdrop-blur-md border-b border-[hsl(217,33%,17%)] z-30 sticky top-0">
      <div className="flex items-center">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 -ml-2 mr-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="hidden sm:flex items-center text-sm">
          <span className="text-slate-500 font-medium">CrimeTrack AI</span>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
          <span className="text-slate-200 font-semibold">{currentTitle}</span>
        </div>
        <div className="sm:hidden font-medium text-slate-200">
          {currentTitle}
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4 relative">
        {/* Quick Search */}
        <div className="relative">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-900 border border-blue-500/50 rounded-full px-3 py-1 text-sm shadow-lg">
              <Search className="w-4 h-4 text-blue-400 mr-2" />
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 5,000 demo profiles (SYN-NGP-...)..."
                className="bg-transparent text-white focus:outline-none w-56 text-xs placeholder:text-slate-500"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-white ml-1">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              title="Search 5,000 Synthetic Demo Profiles"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Interactive Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors relative"
            title="System Provenance & Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[hsl(222,47%,6%)]"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              <div className="p-3 border-b border-[hsl(217,33%,17%)] bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Data &amp; System Notices</span>
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-blue-400 hover:underline flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-[hsl(217,33%,17%)] max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <Link 
                    key={n.id} 
                    href={n.link} 
                    onClick={() => setNotifOpen(false)}
                    className={`p-3 block hover:bg-slate-800/50 transition-colors ${n.unread ? 'bg-blue-500/5' : ''}`}
                  >
                    <div className="flex items-start gap-2.5">
                      {n.type === 'official' && <UserCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />}
                      {n.type === 'demo' && <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
                      {n.type === 'status' && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                        <span className="text-[10px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block"></div>

        {/* Interactive User Profile & Role Switcher Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 hover:bg-slate-800/50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-800"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm border border-blue-400">
              {userRole.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight">{userName}</div>
              <div className="text-[10px] text-blue-400 font-mono uppercase leading-tight">Role: {userRole}</div>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="p-2 border-b border-[hsl(217,33%,17%)] mb-1">
                <p className="text-xs font-bold text-white">{userName}</p>
                <p className="text-[10px] text-slate-400 font-mono">Session Mode: Role-Based Demo</p>
                <span className="inline-block mt-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-semibold">
                  Active Role: {userRole}
                </span>
              </div>

              <div className="p-2 border-b border-[hsl(217,33%,17%)] mb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Switch Role Dashboard</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['admin', 'police', 'court', 'custodial'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleSwitchRole(r)}
                      className={`text-[11px] px-2 py-1.5 rounded font-medium capitalize text-left border transition-colors ${
                        userRole.toLowerCase() === r
                          ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <Link 
                href="/data-sources" 
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4 text-emerald-400" /> Data Sources &amp; Provenance
              </Link>
              <Link 
                href="/settings" 
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4 text-blue-400" /> System Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1 border-t border-[hsl(217,33%,17%)] pt-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out / Exit Session
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
