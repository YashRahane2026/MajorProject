'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  ScanFace, 
  Link as LinkIcon, 
  BarChart3, 
  ScrollText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  Microscope
} from 'lucide-react';

interface AppSidebarProps {
  userRole?: string;
  userName?: string;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function AppSidebar({ 
  userRole = 'admin', 
  userName = 'Demo Admin',
  collapsed,
  setCollapsed
}: AppSidebarProps) {
  const pathname = usePathname();

  const navGroups = [
    {
      title: 'MAIN',
      items: [
        { label: 'Overview', href: '/overview', icon: LayoutDashboard },
        { label: 'Suspects (Demo)', href: '/suspects', icon: Users },
        { label: 'Cases (Demo)', href: '/cases', icon: Briefcase },
        { label: 'FIRs (Demo)', href: '/firs', icon: FileText },
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { label: 'Face Matching', href: '/matching/face', icon: ScanFace },
        { label: 'Case Linking', href: '/matching/cases', icon: LinkIcon },
        { label: 'Analytics & Stats', href: '/analytics', icon: BarChart3 },
        { label: 'Evaluation & Limits', href: '/analytics/evaluation', icon: Microscope },
      ]
    },
    {
      title: 'PROVENANCE & SYSTEM',
      items: [
        { label: 'Data Sources', href: '/data-sources', icon: Database },
        { label: 'Audit Log', href: '/audit', icon: ScrollText },
        { label: 'Settings', href: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-[hsl(222,47%,8%)] border-r border-[hsl(217,33%,17%)] transition-all duration-300 z-40 relative",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo Area */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[hsl(217,33%,17%)] shrink-0">
        <div className="flex items-center overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <span 
            className={cn(
              "ml-3 font-bold text-white tracking-tight whitespace-nowrap transition-opacity duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            CrimeTrack AI
          </span>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-md hover:bg-slate-800 text-slate-400 transition-colors shrink-0",
            collapsed && "absolute right-[-12px] top-4 bg-slate-800 border border-[hsl(217,33%,17%)] rounded-full z-50"
          )}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-none">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {group.title}
              </div>
            )}
            <ul className="space-y-1 px-3">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg transition-all group relative",
                        isActive 
                          ? "bg-blue-500/10 text-blue-500" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
                      )}
                      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-300")} />
                      {!collapsed && (
                        <span className="ml-3 text-sm font-medium whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* User Area */}
      <div className="p-4 border-t border-[hsl(217,33%,17%)] shrink-0">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-slate-300">
              {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <div className="text-sm font-medium text-white truncate">{userName}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider truncate mt-0.5">
                {userRole}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
