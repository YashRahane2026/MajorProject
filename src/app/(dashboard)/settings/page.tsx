'use client';

import React from 'react';
import { Settings, Users, Server, Shield, HardDrive, RefreshCw } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Admin Superintendent', role: 'SUPER_ADMIN', dept: 'HQ', status: 'Active' },
  { id: 2, name: 'Investigator Doe', role: 'DETECTIVE', dept: 'Cyber Cell', status: 'Active' },
  { id: 3, name: 'Officer Smith', role: 'OFFICER', dept: 'Local Station', status: 'Inactive' },
  { id: 4, name: 'Analyst Sarah', role: 'ANALYST', dept: 'Intelligence', status: 'Active' },
];

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-200">
      <header className="flex items-center gap-3 mb-8 pb-4 border-b border-[hsl(217,33%,17%)]">
        <div className="p-2 bg-slate-800 rounded-lg">
          <Settings className="w-8 h-8 text-slate-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-sm text-slate-400">Manage users, ML configurations, and system health.</p>
        </div>
      </header>

      <div className="space-y-8">
        {/* ML Configuration */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            ML Service Configuration
          </h2>
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Inference API Endpoint</label>
                <input 
                  type="text" 
                  defaultValue="https://api.crimetrack-ml.internal/v1/predict" 
                  disabled
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300 font-mono opacity-70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Connection Status</label>
                <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-emerald-400 font-medium">Connected (Latency: 42ms)</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Face Recognition Model</label>
                <div className="px-3 py-2 bg-slate-800 rounded-md text-sm">ArcFace-ResNet50 (v2.1.4)</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">NLP Embedding Model</label>
                <div className="px-3 py-2 bg-slate-800 rounded-md text-sm">all-mpnet-base-v2 (Sentence-BERT)</div>
              </div>
            </div>
          </div>
        </section>

        {/* User Management */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              User Management
            </h2>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Add User
            </button>
          </div>
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-[hsl(217,33%,17%)]">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(217,33%,17%)]">
                {mockUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-5 py-3 text-sm font-medium text-slate-200">{user.name}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-400">{user.dept}</td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${user.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Info */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            System Information
          </h2>
          <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Version</p>
                <p className="text-lg font-semibold text-slate-200">v2.4.0-stable</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Database Size</p>
                <p className="text-lg font-semibold text-slate-200">142.5 GB</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Uptime</p>
                <p className="text-lg font-semibold text-slate-200">45d 12h</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Last Backup</p>
                <p className="text-md font-semibold text-slate-200 flex items-center gap-2">
                  2 hours ago <RefreshCw className="w-3 h-3 text-slate-500" />
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
