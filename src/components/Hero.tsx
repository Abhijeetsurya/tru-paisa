import { ArrowDown, CheckCircle2, Shield } from 'lucide-react';
import { VERIFIED_ANALYST_INFO } from '../types';

interface HeroProps {
  onOpenPopup: () => void;
}

export default function Hero({ onOpenPopup }: HeroProps) {
  return (
    <section id="hero-section" className="relative pt-8 pb-10 sm:pt-12 sm:pb-14 bg-white border-b border-slate-200/60 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Verified Trust Badge */}
        <div 
          id="hero-trust-badge"
          className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs sm:text-sm font-medium text-slate-800 mb-5 shadow-xs"
        >
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>SEBI Registered Research Analyst</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="font-semibold text-slate-900">Registration No. {VERIFIED_ANALYST_INFO.sebiRegNo}</span>
        </div>

        {/* Primary Headline */}
        <h1 
          id="hero-main-heading"
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-4"
        >
          Research-Driven <br className="hidden sm:inline" />
          <span className="text-emerald-700">Market Insights</span>
        </h1>

        {/* Concise Supporting Sentence */}
        <p 
          id="hero-subheadline"
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6"
        >
          Get structured market research and insights from a SEBI Registered Research Analyst.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          <button
            type="button"
            id="hero-primary-cta-btn"
            onClick={onOpenPopup}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl transition-all shadow-md shadow-emerald-900/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 touch-manipulation cursor-pointer"
          >
            <span>Get Research Details</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Highlights Grid with Registered Research Analyst */}
        <div 
          id="hero-features-list"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left pt-5 border-t border-slate-100"
        >
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/90 border border-slate-200/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 font-medium leading-normal">
              <span className="font-semibold text-slate-900 block mb-0.5">Research Services</span>
              Equity, Intraday, Positional & Derivatives
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/90 border border-slate-200/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 font-medium leading-normal">
              <span className="font-semibold text-slate-900 block mb-0.5">Structured Analysis</span>
              Technical and fundamental evaluation framework
            </div>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/90 border border-slate-200/70">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 font-medium leading-normal">
              <span className="font-semibold text-slate-900 block mb-0.5">Registered Research Analyst</span>
              {VERIFIED_ANALYST_INFO.analystName} • SEBI Reg. {VERIFIED_ANALYST_INFO.sebiRegNo}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
