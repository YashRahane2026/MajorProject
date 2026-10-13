'use client';

import Link from 'next/link';
import { ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';

export default function SyntheticBanner() {
  return (
    <div className="w-full bg-slate-950/95 border-b border-[hsl(217,33%,17%)] px-4 py-1.5 text-[11px] flex flex-wrap items-center justify-between gap-2 z-40 shrink-0">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Official Government Statistics (NCRB &amp; Nagpur Railway Police)
        </span>
        <span className="text-slate-500 hidden md:inline">•</span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Individual Profiles: SYNTHETIC DEMO — NOT A REAL PERSON OR CASE
        </span>
      </div>
      <div className="flex items-center gap-3 text-slate-400">
        <span className="hidden xl:inline text-slate-400">
          Aggregate crime counts and 5,000 synthetic individual profiles are strictly separated.
        </span>
        <Link
          href="/data-sources"
          className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 underline-offset-2 hover:underline"
        >
          Data Sources &amp; Provenance <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
