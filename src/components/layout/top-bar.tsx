'use client';

import { Menu, Search, Bell, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface TopBarProps {
  pageTitle?: string;
  userName?: string;
  userRole?: string;
  onToggleSidebar?: () => void;
}

export default function TopBar({ 
  pageTitle, 
  userName = 'Demo Admin',
  userRole = 'Admin',
  onToggleSidebar
}: TopBarProps) {
  const pathname = usePathname();
  
  // Create breadcrumb from pathname if pageTitle is not provided
  const segments = pathname.split('/').filter(Boolean);
  const currentTitle = pageTitle || 
    (segments.length > 0 
      ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1) 
      : 'Dashboard');

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 bg-[hsl(222,47%,6%)]/80 backdrop-blur-md border-b border-[hsl(217,33%,17%)] z-30 sticky top-0">
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
          <span className="text-slate-500">CrimeTrack</span>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
          <span className="text-slate-200 font-medium">{currentTitle}</span>
        </div>
        <div className="sm:hidden font-medium text-slate-200">
          {currentTitle}
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
          <Search className="w-5 h-5" />
        </button>
        
        <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[hsl(222,47%,6%)]"></span>
        </button>
        
        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block"></div>
        
        <button className="flex items-center gap-2 hover:bg-slate-800/50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm border border-blue-500">
            {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-slate-200 leading-tight">{userName}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{userRole}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
