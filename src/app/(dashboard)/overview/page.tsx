'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, FileText, Target, TrendingUp, Clock, AlertTriangle, UserPlus, CheckCircle2 } from 'lucide-react';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Suspects', value: '247', icon: Users, change: '+12', positive: true, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Active Cases', value: '89', icon: Briefcase, change: '+5', positive: true, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { title: 'Filed FIRs', value: '342', icon: FileText, change: '+23', positive: true, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { title: 'Match Accuracy', value: '94.2%', icon: Target, change: '+1.3%', positive: true, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </span>
              <span className="text-slate-500 ml-2">this week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Crime Trends — Last 12 Months</h2>
            <select className="bg-[hsl(222,47%,6%)] border border-[hsl(217,33%,17%)] text-sm rounded-lg px-3 py-1 text-slate-300">
              <option>All Crimes</option>
              <option>Theft</option>
              <option>Assault</option>
              <option>Fraud</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-[hsl(217,33%,17%)] pb-2 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between border-l border-[hsl(217,33%,17%)]">
              {[100, 75, 50, 25, 0].map((val) => (
                <div key={val} className="w-full border-t border-[hsl(217,33%,17%)] opacity-30 h-0 relative">
                  <span className="absolute -left-6 -top-2.5 text-xs text-slate-500">{val}</span>
                </div>
              ))}
            </div>
            {/* Bars */}
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
              const height = Math.floor(Math.random() * 60) + 20;
              return (
                <div key={month} className="flex flex-col items-center flex-1 z-10 group">
                  <div 
                    className="w-full max-w-[2rem] bg-blue-500/80 hover:bg-blue-400 rounded-t-sm transition-all duration-300 relative"
                    style={{ height: `${height}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                      {height}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 mt-2">{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { icon: UserPlus, text: 'New suspect added: Rajat Sharma', time: '10m ago', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { icon: Target, text: 'Face match found (94.2%) in Nagpur Central', time: '1h ago', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { icon: FileText, text: 'FIR #1042 filed for Vehicle Theft', time: '2h ago', color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { icon: Briefcase, text: 'Case #CASE-2026-042 status updated', time: '4h ago', color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { icon: AlertTriangle, text: 'Critical threat level assigned to S. Khan', time: '5h ago', color: 'text-red-500', bg: 'bg-red-500/10' },
              { icon: CheckCircle2, text: 'Alias confirmed for suspect ID #104', time: '1d ago', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { icon: Target, text: 'Face match found (89.1%) in Pune', time: '1d ago', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { icon: FileText, text: 'FIR #1041 filed for Burglary', time: '1d ago', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-full ${activity.bg}`}>
                  <activity.icon className={`w-3.5 h-3.5 ${activity.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-300">{activity.text}</p>
                  <p className="text-xs text-slate-500 flex items-center mt-0.5">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suspects by Status */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Suspect Lifecycle Status</h2>
          <div className="space-y-4">
            {[
              { status: 'At Large', count: 124, color: 'bg-red-500' },
              { status: 'Arrested', count: 45, color: 'bg-blue-500' },
              { status: 'In Remand', count: 18, color: 'bg-purple-500' },
              { status: 'Bailed', count: 32, color: 'bg-amber-500' },
              { status: 'Convicted', count: 28, color: 'bg-emerald-500' },
            ].map((item, i) => {
              const maxCount = 150;
              const percent = (item.count / maxCount) * 100;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{item.status}</span>
                    <span className="text-slate-400 font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 w-full bg-[hsl(222,47%,12%)] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Matches Today */}
        <div className="bg-[hsl(222,47%,8%)] border border-[hsl(217,33%,17%)] rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Top Face Matches</h2>
            <Link href="/matches" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[hsl(217,33%,17%)] text-xs text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-medium">Suspect</th>
                  <th className="pb-3 font-medium">Match Score</th>
                  <th className="pb-3 font-medium">Threat Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(217,33%,17%)]">
                {[
                  { name: 'Vikram Singh', score: 98.2, threat: 'CRITICAL', threatColor: 'bg-red-500/10 text-red-500 border-red-500/20' },
                  { name: 'Rahul Desai', score: 94.5, threat: 'HIGH', threatColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
                  { name: 'Amit Kumar', score: 91.8, threat: 'MEDIUM', threatColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                  { name: 'Sanjay Patel', score: 88.4, threat: 'LOW', threatColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                  { name: 'Priya Sharma', score: 86.9, threat: 'MEDIUM', threatColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-sm text-slate-200 font-medium">{row.name}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[hsl(222,47%,12%)] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${row.score >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                            style={{ width: `${row.score}%` }} 
                          />
                        </div>
                        <span className="text-xs text-slate-400">{row.score}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-medium border ${row.threatColor}`}>
                        {row.threat}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
