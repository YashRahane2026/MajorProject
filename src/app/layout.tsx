import type { Metadata } from 'next';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'CrimeTrack AI — Intelligent Biometric-Based Suspect Tracking',
  description: 'Intelligent Biometric-Based Suspect Tracking and Crime Analysis System. B.Tech Final Year Project — RCOEM, Nagpur.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className="antialiased min-h-screen bg-[hsl(222,47%,6%)] text-[hsl(210,40%,98%)]">
        {children}
      </body>
    </html>
  );
}
