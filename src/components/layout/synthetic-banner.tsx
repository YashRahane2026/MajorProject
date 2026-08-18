import { AlertTriangle } from 'lucide-react';

export default function SyntheticBanner() {
  return (
    <div className="h-8 w-full bg-amber-500/90 flex items-center justify-center px-4 relative overflow-hidden z-50">
      {/* Striped background overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)'
        }}
      />
      
      <div className="flex items-center text-amber-950 font-bold text-xs tracking-wider z-10">
        <AlertTriangle className="w-4 h-4 mr-2" />
        <span>SYNTHETIC / PROTOTYPE DATA — NOT FOR OPERATIONAL USE</span>
        <AlertTriangle className="w-4 h-4 ml-2" />
      </div>
    </div>
  );
}
