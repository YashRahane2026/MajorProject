'use client';

import React from 'react';
import { ScrollText, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockLogs = Array.from({ length: 20 }).map((_, i) => {
  const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'FACE_MATCH', 'FIR_MATCH'];
  const resources = ['User', 'Suspect Profile', 'FIR Record', 'System Config', 'Match Report'];
  const users = ['Admin User', 'Investigator Doe', 'Officer Smith', 'System Auto'];
  
  const action = actions[Math.floor(Math.random() * actions.length)];
  const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
  
  return {
    id: `log-${i}`,
    timestamp: date.toISOString().replace('T', ' ').substring(0, 19),
    user: users[Math.floor(Math.random() * users.length)],
    role: action === 'SYSTEM' ? 'SYSTEM' : ['ADMIN', 'DETECTIVE', 'OFFICER'][Math.floor(Math.random() * 3)],
    action,
    resourceType: resources[Math.floor(Math.random() * resources.length)],
    resourceId: Math.random().toString(36).substring(2, 10).toUpperCase(),
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

const getActionColor = (action: string) => {
  switch (action) {
    case 'CREATE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'READ': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'UPDATE': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'DELETE': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'FACE_MATCH': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'FIR_MATCH': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export default function AuditPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-[hsl(217,33%,17%)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg">
            <ScrollText className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Audit Log</h1>
            <p className="text-sm text-slate-400">Immutable record of system actions and data access.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </header>

      {/* Filters */}
      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter className="w-4 h-4" /> Filters:
        </div>
        <input type="date" className="bg-slate-900 border border-[hsl(217,33%,17%)] rounded-md px-3 py-1.5 text-sm text-slate-300 focus:outline-none" />
        <span className="text-slate-500">to</span>
        <input type="date" className="bg-slate-900 border border-[hsl(217,33%,17%)] rounded-md px-3 py-1.5 text-sm text-slate-300 focus:outline-none" />
        
        <select className="bg-slate-900 border border-[hsl(217,33%,17%)] rounded-md px-3 py-1.5 text-sm text-slate-300 focus:outline-none min-w-[150px]">
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="READ">READ</option>
          <option value="UPDATE">UPDATE</option>
          <option value="FACE_MATCH">FACE_MATCH</option>
        </select>

        <select className="bg-slate-900 border border-[hsl(217,33%,17%)] rounded-md px-3 py-1.5 text-sm text-slate-300 focus:outline-none min-w-[150px]">
          <option value="">All Users</option>
          <option value="admin">Admin User</option>
          <option value="detective">Investigator Doe</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-[hsl(217,33%,17%)]">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Resource ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(217,33%,17%)]">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3.5 text-sm font-mono text-slate-300 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">{log.user}</span>
                      <span className="text-xs text-slate-500">{log.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={cn("px-2.5 py-1 rounded-md text-xs font-medium border", getActionColor(log.action))}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-300">{log.resourceType}</td>
                  <td className="px-6 py-3.5 text-sm font-mono text-slate-400">{log.resourceId}</td>
                  <td className="px-6 py-3.5 text-sm font-mono text-slate-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[hsl(217,33%,17%)] flex items-center justify-between bg-slate-900/20">
          <span className="text-sm text-slate-500">Showing 1 to 20 of 1,248 entries</span>
          <div className="flex gap-2">
            <button className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
