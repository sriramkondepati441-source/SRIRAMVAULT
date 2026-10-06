'use client'

import { Briefcase, Lock, Sparkles, ArrowRight, ShieldCheck, FileText, Share2 } from 'lucide-react'
import { useState } from 'react'

export default function OfficeModePage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="w-full max-w-3xl relative z-10">
        
        {/* Main Card */}
        <div 
          className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-2xl transition-all duration-500"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle top gradient border effect */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
          
          <div className="p-10 md:p-14 text-center flex flex-col items-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coming Soon</span>
            </div>
            
            {/* Animated Icon */}
            <div className="relative mb-8">
              <div className={`absolute inset-0 bg-blue-100 rounded-full blur-xl transition-all duration-700 ${isHovered ? 'scale-150 opacity-70' : 'scale-100 opacity-0'}`} />
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center border border-white shadow-inner transform transition-transform duration-500 hover:scale-105 hover:rotate-3">
                <Briefcase className="w-10 h-10 text-indigo-600" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            </div>

            {/* Typography */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Office Mode
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-10">
              A curated, professional view of your vault. Seamlessly isolate and securely share your employment, tax, and onboarding documents without exposing your personal life.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <FeaturePill icon={<ShieldCheck className="w-4 h-4" />} text="Strict Isolation" />
              <FeaturePill icon={<FileText className="w-4 h-4" />} text="Auto-Categorization" />
              <FeaturePill icon={<Share2 className="w-4 h-4" />} text="1-Click HR Sharing" />
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <input 
                  type="email" 
                  placeholder="Enter email for early access..." 
                  className="w-full h-12 pl-4 pr-4 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-400"
                />
              </div>
              <button className="h-12 px-6 rounded-xl bg-slate-900 text-white font-medium text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center group whitespace-nowrap">
                Join Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
          </div>
        </div>
        
        {/* Footer text */}
        <p className="text-center text-slate-400 text-sm mt-8">
          Expected rollout in Q4 2026. Data remains fully encrypted.
        </p>
      </div>
    </div>
  )
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm text-sm font-medium text-slate-600">
      <span className="text-indigo-500">{icon}</span>
      {text}
    </div>
  )
}
