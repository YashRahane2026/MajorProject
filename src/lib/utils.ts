import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string to include time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get threat level color classes
 */
export function getThreatLevelColor(level: string): string {
  switch (level) {
    case 'CRITICAL':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'HIGH':
      return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    case 'MEDIUM':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'LOW':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    default:
      return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
  }
}

/**
 * Get lifecycle status color classes
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'ARRESTED':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'REMAND':
      return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    case 'BAIL':
      return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    case 'TRIAL':
      return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    case 'CONVICTED':
      return 'bg-red-700/15 text-red-500 border-red-700/30';
    case 'CUSTODY':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    case 'RELEASED':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'ABSCONDING':
      return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
    case 'DECEASED':
      return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
    default:
      return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
  }
}

/**
 * Get case status color
 */
export function getCaseStatusColor(status: string): string {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'UNDER_INVESTIGATION':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'CHARGE_SHEETED':
      return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    case 'TRIAL':
      return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    case 'CLOSED':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'COLD':
      return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
    default:
      return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
  }
}

/**
 * Format similarity score as percentage
 */
export function formatSimilarity(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
