import React from "react";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

const AuthBackground = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-8">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Floating feature pills on large screens */}
      <div className="hidden xl:flex items-center gap-2 absolute top-12 left-12 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium backdrop-blur-md">
        <Sparkles className="w-4 h-4" />
        AI-Powered Budgeting & Forecasts
      </div>

      <div className="hidden xl:flex items-center gap-2 absolute bottom-12 left-12 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium backdrop-blur-md">
        <TrendingUp className="w-4 h-4" />
        Live Cash Flow Tracking
      </div>

      <div className="hidden xl:flex items-center gap-2 absolute top-12 right-12 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-teal-300 text-sm font-medium backdrop-blur-md">
        <ShieldCheck className="w-4 h-4" />
        Bank-Grade Security & Privacy
      </div>

      {/* Main card wrapper */}
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
