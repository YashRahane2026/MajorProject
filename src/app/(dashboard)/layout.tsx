'use client';

import { useState, useEffect } from 'react';
import SyntheticBanner from '@/components/layout/synthetic-banner';
import AppSidebar from '@/components/layout/app-sidebar';
import TopBar from '@/components/layout/top-bar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState('Admin Officer');
  const [userRole, setUserRole] = useState('admin');

  useEffect(() => {
    // Read from localStorage on mount
    const syncRoleFromStorage = () => {
      const role = localStorage.getItem('demo_role');
      const name = localStorage.getItem('demo_user');
      if (role) setUserRole(role);
      if (name) setUserName(name);
    };
    syncRoleFromStorage();

    // Auto-collapse sidebar on smaller screens
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('crimetrack-role-change', syncRoleFromStorage);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('crimetrack-role-change', syncRoleFromStorage);
    };
  }, []);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[hsl(222,47%,6%)] text-[hsl(210,40%,98%)]">
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed}
          userName={userName}
          userRole={userRole}
        />
        
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <TopBar 
            userName={userName}
            userRole={userRole}
            onToggleSidebar={() => setCollapsed(!collapsed)}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
