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
  ExternalLink,
  UserCheck,
  FileText,
  AlertTriangle
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
  userName = 'Officer Yash Rahane',
  userRole = 'Admin / Investigator',
  onToggleSidebar
}: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Search & Notification States
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Biometric Face Match Identified',
      desc: 'ArcFace matched suspect Vikram Sharma at Nagpur Central (98.2% confidence)',
      time: '5 mins ago',
      unread: true,
      type: 'face',
      link: '/matching/face'
    },
    {
      id: 2,
      title: 'New FIR Filed (Sitabuldi PS)',
      desc: 'FIR-2026-1042 registered: Armed robbery with hammer glass-smash MO',
      time: '25 mins ago',
      unread: true,
      type: 'fir',
      link: '/firs/1'
    },
    {
      id: 3,
      title: 'Lifecycle Status Updated',
      desc: 'Suspect Rahul Desai moved from ARRESTED -> REMAND by Court Order',
      time: '1 hour ago',
      unread: false,
      type: 'status',
      link: '/suspects/1'
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
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

  // Create breadcrumb from pathname if pageTitle is not provided
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
                placeholder="Search suspect, FIR or case..."
                className="bg-transparent text-white focus:outline-none w-48 text-xs placeholder:text-slate-500"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-white ml-1">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              title="Search System"
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
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[hsl(222,47%,6%)] animate-pulse"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              <div className="p-3 border-b border-[hsl(217,33%,17%)] bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">System Alerts</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-red-500/30">
                      {unreadCount} new
                    </span>
                  )}
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
                      {n.type === 'face' && <UserCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />}
                      {n.type === 'fir' && <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
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

        {/* Interactive User Profile & Logout Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 hover:bg-slate-800/50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-800"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm border border-blue-400">
              YR
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight">{userName}</div>
              <div className="text-[10px] text-blue-400 font-mono leading-tight">{userRole}</div>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="p-2 border-b border-[hsl(217,33%,17%)] mb-1">
                <p className="text-xs font-bold text-white">{userName}</p>
                <p className="text-[10px] text-slate-400 font-mono">ID: OFF-NAG-9941</p>
                <span className="inline-block mt-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                  System Role: Admin
                </span>
              </div>
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
